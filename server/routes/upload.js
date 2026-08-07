import express from "express";
import multer from "multer";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { createWorker } from "tesseract.js";
import { query } from "../config/database.js";
import { getUserPlanCached } from "../utils/userPlan.js";
import { buildCvTextFromContent } from "./cv.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function tryParseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function splitLines(text) {
  return text
    ? text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : [];
}

function parseSkillsFromText(text) {
  if (!text) return [];
  const lines = splitLines(text);
  const skills = [];
  let inSkills = false;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/^(kỹ năng|ky nang|skills?)\b/.test(lower)) {
      inSkills = true;
      const rest = line.replace(/^(kỹ năng|ky nang|skills?)\s*:?\s*/i, "").trim();
      if (rest) {
        rest
          .split(/[;,•·|]/)
          .map((part) => part.trim())
          .filter(Boolean)
          .forEach((part) => skills.push(part));
      }
      continue;
    }

    if (inSkills && /^(kinh nghiệm|experience|học vấn|education|chứng chỉ|certifications|ngoại ngữ|languages?)\b/i.test(lower)) {
      break;
    }

    if (inSkills) {
      line
        .replace(/^[-•*]\s*/, "")
        .split(/[;,•·|]/)
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => skills.push(part));
    }
  }

  return [...new Set(skills)];
}

function parseExperienceFromText(text) {
  if (!text) return [];
  const lines = splitLines(text);
  const experience = [];
  let inExperience = false;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/^(kinh nghiệm|experience|project experience|dự án|du an)\b/.test(lower)) {
      inExperience = true;
      continue;
    }

    if (inExperience && /^(học vấn|education|kỹ năng|ky nang|skills?|chứng chỉ|certifications|ngoại ngữ|languages?)\b/i.test(lower)) {
      break;
    }

    if (inExperience) {
      const cleaned = line.replace(/^[-•*]\s*/, "").trim();
      if (cleaned) experience.push(cleaned);
    }
  }

  return experience;
}

function parseLanguagesFromText(text) {
  if (!text) return [];
  const lines = splitLines(text);
  const languages = [];
  let inLanguages = false;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/^(ngoại ngữ|languages?)\b/.test(lower)) {
      inLanguages = true;
      const rest = line.replace(/^(ngoại ngữ|languages?)\s*:?\s*/i, "").trim();
      if (rest) languages.push(rest);
      continue;
    }

    if (inLanguages && /^(kỹ năng|ky nang|skills?|kinh nghiệm|experience|học vấn|education|chứng chỉ|certifications)\b/i.test(lower)) {
      break;
    }

    if (inLanguages) {
      const cleaned = line.replace(/^[-•*]\s*/, "").trim();
      if (cleaned) languages.push(cleaned);
    }
  }

  return languages;
}

function guessObjective(text) {
  if (!text) return null;
  const lines = splitLines(text);
  let inObjective = false;
  const objectiveLines = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/^(mục tiêu|mục tiêu nghề nghiệp|objective|career objective|summary|profile)\b/.test(lower)) {
      inObjective = true;
      const rest = line.replace(/^(mục tiêu|mục tiêu nghề nghiệp|objective|career objective|summary|profile)\s*:?\s*/i, "").trim();
      if (rest) objectiveLines.push(rest);
      continue;
    }

    if (inObjective && /^(kinh nghiệm|experience|học vấn|education|kỹ năng|ky nang|skills?|chứng chỉ|certifications|ngoại ngữ|languages?)\b/i.test(lower)) {
      break;
    }

    if (inObjective) {
      objectiveLines.push(line);
    }
  }

  return objectiveLines.join(" ").trim() || null;
}

async function extractTextFromImage(filePath) {
  console.log("[OCR] Starting image extraction for:", filePath);
  try {
    const worker = await createWorker("eng+vie");
    const { data } = await worker.recognize(filePath);
    await worker.terminate();
    const result = data.text?.trim() || "";
    console.log("[OCR] Extracted text length:", result.length);
    console.log("[OCR] Preview:", result.slice(0, 200));
    return result;
  } catch (err) {
    console.warn("[OCR] Image extraction failed:", err.message);
    return "";
  }
}

async function extractTextFromUploadedFile(filePath, mimeType) {
  console.log("[Extract] Starting extraction. mimeType:", mimeType, "| file:", filePath);

  if (mimeType === "application/pdf") {
    // Method 1: unpdf — best for modern PDFs with embedded fonts
    try {
      const { extractText } = await import("unpdf");
      const fileBuffer = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(fileBuffer);
      const { text } = await extractText(uint8Array, { mergePages: true });
      const cleaned = (text || "").trim();
      console.log("[PDF] unpdf result length:", cleaned.length);
      if (cleaned.length >= 50) {
        console.log("[Extract] Done. Result length:", cleaned.length, "| preview:", cleaned.slice(0, 150));
        return cleaned;
      }
    } catch (err) {
      console.warn("[PDF] unpdf failed:", err.message);
    }

    // Method 2: pdf2json fallback
    try {
      const PDFParser = (await import("pdf2json")).default;
      const pdfParser = new PDFParser(null, 1);
      const pdfText = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve(""), 15000);
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          clearTimeout(timer);
          try {
            const pages = pdfData?.Pages || [];
            const text = pages
              .map((page) =>
                (page.Texts || [])
                  .map((t) => decodeURIComponent(t.R?.[0]?.T || ""))
                  .join(" ")
              )
              .join("\n")
              .trim();
            resolve(text);
          } catch (e) {
            resolve("");
          }
        });
        pdfParser.on("pdfParser_dataError", (err) => {
          clearTimeout(timer);
          reject(err);
        });
        pdfParser.loadPDF(filePath);
      });
      console.log("[PDF] pdf2json result length:", pdfText.length);
      if (pdfText.length >= 50) {
        console.log("[Extract] Done. Result length:", pdfText.length, "| preview:", pdfText.slice(0, 150));
        return pdfText;
      }
    } catch (err) {
      console.warn("[PDF] pdf2json failed:", err.message);
    }

    // NOTE: Tesseract NOT used for PDFs — crashes on PDF input.
    console.warn("[PDF] All extraction methods failed. PDF may be scanned/image-based.");
    console.log("[Extract] Done. Result length: 0 | preview: ");
    return "";
  }

  if (mimeType?.startsWith("image/")) {
    try {
      const result = await extractTextFromImage(filePath);
      console.log("[Extract] Done. Result length:", result.length, "| preview:", result.slice(0, 150));
      return result;
    } catch (err) {
      console.warn("[Image Extract] OCR failed:", err);
      return "";
    }
  }

  console.log("[Extract] Done. Result length: 0 | preview: ");
  return "";
}

const router = express.Router();

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip || "unknown"),
  message: { error: "RATE_LIMITED", message: "Quá nhiều yêu cầu tải lên, vui lòng thử lại sau." },
});

import { randomUUID } from "node:crypto";
import { uploadToS3, deleteFromS3 } from "../utils/s3.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../uploads");

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Files are buffered in memory, then uploaded to S3 (when configured) or
// written to disk as a fallback. memoryStorage avoids leaving temp files
// behind when S3 is the destination.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Tăng lên 10MB khớp với FE
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file PDF hoặc hình ảnh (JPG, PNG, GIF, WEBP)"));
    }
  },
});

// Write an in-memory buffer to a temp file (used for text extraction, since
// the OCR/PDF parsers work with file paths). Returns the temp path.
async function bufferToTempFile(buffer, ext) {
  const os = await import("node:os");
  const tmpDir = os.tmpdir();
  const tmpPath = path.join(tmpDir, `jobready-${randomUUID()}${ext || ""}`);
  await fs.promises.writeFile(tmpPath, buffer);
  return tmpPath;
}

// Store an uploaded buffer. Returns { url, localPath } — url is either an S3
// public URL or a local /uploads path; localPath is the on-disk source for
// callers that still need extraction/cleanup after the fact.
async function persistUploadedFile(file, baseName) {
  const ext = path.extname(file.originalname);
  const localPath = path.join(uploadDir, `${baseName}-${randomUUID()}${ext}`);

  const s3Url = await uploadToS3({
    buffer: file.buffer,
    contentType: file.mimetype,
    ext: file.originalname,
  });

  if (s3Url) {
    // nothing was written to disk — buffer went straight to S3
    return { url: s3Url, localPath: null };
  }

  await fs.promises.writeFile(localPath, file.buffer);
  return { url: `/uploads/${path.basename(localPath)}`, localPath };
}

// ✅ FIX: Parse tên ứng viên từ text CV upload để lưu vào cột full_name
function guessCandidateName(text) {
  if (!text) return null;
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const nameBlacklist = new Set([
    "about me", "work experience", "education", "skills", "references",
    "summary", "profile", "objective", "contact", "language", "certification",
    "business analysis tools", "business analysis skills", "soft skill",
    "soft skills", "work experience", "thông tin cá nhân", "chứng chỉ",
    "kỹ năng", "kinh nghiệm", "học vấn", "ngoại ngữ"
  ]);

  // Match label rõ ràng trước
  for (const line of lines.slice(0, 20)) {
    const match = line.match(/^(họ tên|họ và tên|full name|name)\s*:?\s*(.+)$/i);
    if (match?.[2]) return match[2].trim();
  }

  const vietnameseNamePattern = /^[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+(?:\s[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+){1,4}$/;

  for (const line of lines.slice(0, 30)) {
    // Làm sạch ký tự nhiễu ở đầu dòng do OCR layout 2 cột
    const cleaned = line.replace(/^[^A-ZÀ-Ỵa-zà-ỵ]+/, "").trim();
    if (
      vietnameseNamePattern.test(cleaned) &&
      !/@/.test(cleaned) &&
      !/\d/.test(cleaned) &&
      !/[|\\/<>{}()\[\]#$%^&*]/.test(cleaned) &&
      cleaned.length >= 5 &&
      cleaned.length <= 60 &&
      cleaned.split(" ").length >= 2 &&
      cleaned.split(" ").every(w => w.length >= 2) &&
      !nameBlacklist.has(cleaned.toLowerCase())
    ) {
      return cleaned;
    }
  }

  return null;
}

function guessEmail(text) {
  if (!text) return null;
  
  // Match email bình thường trước
  const normal = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (normal) return normal[0];
  
  // Email bị cắt đôi do layout 2 cột: "abc@g\nmail.com"
  const broken = text.match(/([A-Z0-9._%+-]+@[A-Z0-9.-]*)\n([A-Z0-9.-]+\.[A-Z]{2,})/i);
  if (broken) return broken[1] + broken[2];
  
  return null;
}

function guessPhone(text) {
  return text?.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() ?? null;
}

function extractNameFromFilename(filename) {
  if (!filename) return null;
  const base = filename.replace(/\.[^/.]+$/, "");
  const parts = base.split(/[-_\s]/);
  
  // Các từ cần loại bỏ
  const stopWords = new Set([
    "cv", "resume", "curriculum", "vitae", "topcv", "vn",
    "profile", "portfolio", "application", "job", "work"
  ]);
  
  const nameParts = [];
  for (const part of parts) {
    if (!part || part.length < 2) continue;
    if (/^\d/.test(part)) break;
    if (part.includes(".")) break;
    if (stopWords.has(part.toLowerCase())) continue; // bỏ qua từ thừa
    nameParts.push(part);
  }
  return nameParts.length >= 2 ? nameParts.join(" ") : null;
}

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

function getWeekStart() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 1=Mon ...
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now);
  monday.setUTCDate(diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, title, file_name, file_size, file_url, uploaded_at, type, file_type, content, template_id FROM cvs WHERE user_id = $1 ORDER BY uploaded_at DESC`,
      [req.user.id]
    );
    res.json({ cvs: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, uploadLimiter, upload.single("file"), async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Get user plan
    const user = await getUserPlanCached(userId);
    let plan = "free";
    if (user) {
      plan = user.sub_plan_cv || "free";
      let expires = user.sub_expires_cv;
      if (plan === "free" && user.subscription_plan && user.subscription_plan !== "free") {
        plan = user.subscription_plan === "pro" ? "pro_cv" : "ultra_cv";
        expires = user.subscription_expires_at;
      }
      if (plan !== "free" && expires && new Date(expires) < new Date()) {
        plan = "free";
      }
    }

    // Xác định đây có phải là CV Builder (JSON) hay upload file
    const incomingContentType = req.header("Content-Type") || "";
    const isBuilderRequest = !req.file && incomingContentType.includes("application/json");

    // Chỉ enforce quota cho CV Builder (type='created'), không chặn upload file
    if (isBuilderRequest) {
      let usedCreated = 0;
      if (plan === "free") {
        const weekStart = getWeekStart();
        const countResult = await query(
          `SELECT COUNT(*) as count FROM cvs WHERE user_id = $1 AND type = 'created' AND uploaded_at >= $2`,
          [userId, weekStart]
        );
        usedCreated = parseInt(countResult.rows[0].count, 10) || 0;
      } else {
        const countResult = await query(
          `SELECT COUNT(*) as count FROM cvs WHERE user_id = $1 AND type = 'created'`,
          [userId]
        );
        usedCreated = parseInt(countResult.rows[0].count, 10) || 0;
      }

      let limit = 2;
      if (plan === "pro_cv" || plan === "pro") {
        const activeSubResult = await query(
          `SELECT started_at, expires_at FROM user_subscriptions WHERE user_id = $1 AND plan IN ('pro_cv', 'pro') AND status = 'active' ORDER BY created_at DESC LIMIT 1`,
          [userId]
        );
        if (activeSubResult.rows.length > 0) {
          const sub = activeSubResult.rows[0];
          const durationDays = sub.expires_at && sub.started_at
            ? Math.round((new Date(sub.expires_at) - new Date(sub.started_at)) / (1000 * 60 * 60 * 24))
            : 30;
          limit = durationDays <= 8 ? 10 : 50;
        } else {
          limit = 50;
        }
      } else if (plan === "ultra_cv" || plan === "ultra") {
        limit = Infinity;
      }

      if (usedCreated >= limit) {
        return res.status(429).json({
          error: "cv_limit_reached",
          message: `Bạn đã đạt giới hạn tối đa ${limit} CV tạo bằng Builder cho gói này. Vui lòng nâng cấp gói để tiếp tục.`,
        });
      }
    }

    // Check if this is JSON (CV Builder) - no file uploaded
    const contentType = req.header("Content-Type") || "";
    
    if (!req.file && contentType.includes("application/json")) {
      // CV Builder - JSON payload
      const { title, template_id, content, type } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const contentObj = typeof content === "string" ? JSON.parse(content) : content;

      const result = await query(
        `INSERT INTO cvs (
          user_id, title, file_name, file_size, file_url, uploaded_at, type, content, template_id,
          full_name, email, phone, address, objective, experience, education, skills, certifications, languages
         ) 
         VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
         RETURNING *`,
        [
          req.user.id,
          title,
          contentObj?.fullName ? `${contentObj.fullName}-CV.json` : "CV.json",
          0,
          null,
          type || "created",
          contentObj ? JSON.stringify(contentObj) : null,
          template_id,
          contentObj?.fullName || null,
          contentObj?.email || null,
          contentObj?.phone || null,
          contentObj?.address || null,
          contentObj?.objective || null,
          contentObj?.experience ? JSON.stringify(contentObj.experience) : null,
          contentObj?.education ? JSON.stringify(contentObj.education) : null,
          contentObj?.skills ? JSON.stringify(contentObj.skills) : null,
          contentObj?.certifications ? JSON.stringify(contentObj.certifications) : null,
          contentObj?.languages ? JSON.stringify(contentObj.languages) : null,
        ]
      );
      const cvRow = result.rows[0];
      const cvTextCache = buildCvTextFromContent(cvRow);
      if (!cvTextCache || cvTextCache.trim().length < 10) {
        console.warn("[CV Upload] cv_text_cache is empty for cv id:", cvRow.id);
      }
      await query(`UPDATE cvs SET cv_text_cache = $1 WHERE id = $2`, [cvTextCache, cvRow.id]);
      res.status(201).json({
        success: true,
        cv: { ...cvRow, cv_text_cache: cvTextCache },
        cv_text: cvTextCache,
        message: "CV saved successfully"
      });
    } else if (!req.file) {
      // File upload without file
      return res.status(400).json({ error: "No file uploaded" });
    } else {
      // File upload with multer
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const originalName = req.file.originalname;
      const ext = path.extname(originalName);
      const tmpPath = await bufferToTempFile(req.file.buffer, ext);
      let extractedText = "";

      try {
        extractedText = await extractTextFromUploadedFile(tmpPath, req.file.mimetype);
        console.log('[CV Upload] mimetype:', req.file.mimetype);
        console.log('[CV Upload] extractedText length:', extractedText?.length);
        console.log('[CV Upload] extractedText preview:', extractedText?.slice(0, 200));
      } catch (err) {
        console.warn('[CV Upload] Extraction failed:', err);
      }

      // Remove null bytes and other problematic characters for PostgreSQL
      extractedText = extractedText
        .replace(/\u0000/g, "")
        .replace(/\\u0000/g, "")
        .trim();

      // Block saving if PDF has no extractable text
      // This catches Canva/Figma/vector PDFs with no text layer
      if (req.file.mimetype === "application/pdf") {
        const rawExtractionEmpty = !extractedText || extractedText.trim().length < 50;
        if (rawExtractionEmpty) {
          fs.unlink(tmpPath, () => {});
          return res.status(422).json({
            success: false,
            error: "PDF_NO_TEXT_LAYER",
            extraction_warning:
              "PDF của bạn không có text layer — JobReady AI không đọc được nội dung CV.\n\nĐây thường xảy ra với CV được tạo từ Canva, Adobe Express, Figma hoặc các tool thiết kế tương tự.\n\nCách khắc phục nhanh nhất:\n1. Mở CV trong Canva → Share → Download → chọn PNG thay vì PDF → Upload file PNG lên JobReady AI\n2. Hoặc tạo CV trên TopCV, Google Docs, Microsoft Word rồi tải xuống PDF",
          });
        }
      }

      // Persist the original file (S3 when configured, else local /uploads)
      let fileUrl;
      const s3Url = await uploadToS3({
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
        ext: originalName,
      });
      if (s3Url) {
        fileUrl = s3Url;
      } else {
        const localPath = path.join(uploadDir, `file-${randomUUID()}${ext}`);
        await fs.promises.copyFile(tmpPath, localPath);
        fileUrl = `/uploads/${path.basename(localPath)}`;
      }
      // Temp copy is no longer needed (persisted copy exists in S3 or uploads/).
      fs.unlink(tmpPath, () => {});

      // ✅ Parse thông tin cơ bản từ text để lưu vào các cột riêng
      // Giúp AI đọc được tên, email, phone của ứng viên upload CV
      const nameFromOCR = guessCandidateName(extractedText);
      const nameFromFile = extractNameFromFilename(originalName);
      const parsedFullName = nameFromOCR || nameFromFile;
      console.log('[CV Parse] nameFromOCR:', nameFromOCR);
      console.log('[CV Parse] nameFromFile:', nameFromFile);
      console.log('[CV Parse] parsedFullName:', parsedFullName);
      const parsedEmail = guessEmail(extractedText);
      const parsedPhone = guessPhone(extractedText);
      const parsedObjective = guessObjective(extractedText);
      const parsedExperience = parseExperienceFromText(extractedText);
      const parsedSkills = parseSkillsFromText(extractedText);
      const parsedLanguages = parseLanguagesFromText(extractedText);

      const result = await query(
        `INSERT INTO cvs (
          user_id, title, file_name, file_size, file_url, uploaded_at, type, file_type, content, 
          full_name, email, phone, objective, experience, skills, languages, cv_text_cache
         ) 
         VALUES ($1, $2, $3, $4, $5, NOW(), 'uploaded', $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
         RETURNING *`,
        [
          req.user.id,
          title,
          originalName,
          req.file.size,
          fileUrl,
          req.file.mimetype,
          extractedText ? JSON.stringify({ rawText: extractedText }) : null,
          parsedFullName,
          parsedEmail,
          parsedPhone,
          parsedObjective,
          JSON.stringify(parsedExperience),
          JSON.stringify(parsedSkills),
          JSON.stringify(parsedLanguages),
          extractedText || null,
        ]
      );
      const cvRow = result.rows[0];

      let finalCvText = extractedText?.trim() || "";

      if (!finalCvText || finalCvText.length < 50) {
        finalCvText = buildCvTextFromContent(cvRow);
        console.log("[CV Upload] Using buildCvTextFromContent fallback, length:", finalCvText?.length);
      }

      if (finalCvText && finalCvText.trim().length >= 10) {
        await query(`UPDATE cvs SET cv_text_cache = $1 WHERE id = $2`, [finalCvText, cvRow.id]).catch((err) => {
          console.warn("[CV Upload] Failed to update cv_text_cache:", err);
        });
      }

      const cvTextCache = finalCvText?.trim() || cvRow.cv_text_cache || null;

      if (!cvTextCache || cvTextCache.trim().length < 10) {
        console.warn("[CV Upload] cv_text_cache is empty for cv id:", cvRow.id);
      }

      res.status(201).json({
        success: true,
        cv: { ...cvRow, cv_text_cache: cvTextCache },
        cv_text: cvTextCache,
        message: "CV uploaded successfully"
      });
    }
  } catch (error) {
    next(error);
  }
});

// ✅ PUT /cv/:id — Cập nhật CV đã tồn tại
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({ error: "Title or content is required" });
    }

    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (title) {
      updateFields.push(`title = $${paramIndex++}`);
      updateValues.push(title);
    }

    if (content) {
      const contentObj = typeof content === "string" ? JSON.parse(content) : content;
      updateFields.push(`full_name = $${paramIndex++}`);
      updateValues.push(contentObj.fullName || null);
      updateFields.push(`email = $${paramIndex++}`);
      updateValues.push(contentObj.email || null);
      updateFields.push(`phone = $${paramIndex++}`);
      updateValues.push(contentObj.phone || null);
      updateFields.push(`address = $${paramIndex++}`);
      updateValues.push(contentObj.address || null);
      updateFields.push(`objective = $${paramIndex++}`);
      updateValues.push(contentObj.objective || null);
      updateFields.push(`experience = $${paramIndex++}`);
      updateValues.push(JSON.stringify(contentObj.experience || []));
      updateFields.push(`education = $${paramIndex++}`);
      updateValues.push(JSON.stringify(contentObj.education || []));
      updateFields.push(`skills = $${paramIndex++}`);
      updateValues.push(JSON.stringify(contentObj.skills || []));
      updateFields.push(`certifications = $${paramIndex++}`);
      updateValues.push(JSON.stringify(contentObj.certifications || []));
      updateFields.push(`languages = $${paramIndex++}`);
      updateValues.push(JSON.stringify(contentObj.languages || []));
      updateFields.push(`content = $${paramIndex++}`);
      updateValues.push(JSON.stringify(contentObj));
    }

    updateFields.push(`updated_at = NOW()`);
    
    // Add WHERE conditions
    const cvIdParam = `$${paramIndex++}`;
    updateValues.push(id);
    const userIdParam = `$${paramIndex++}`;
    updateValues.push(req.user.id);

    const result = await query(
      `UPDATE cvs SET ${updateFields.join(", ")} WHERE id = ${cvIdParam} AND user_id = ${userIdParam} RETURNING *`,
      updateValues,
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "CV not found" });
    }

    const cvRow = result.rows[0];
    const cvTextCache = buildCvTextFromContent(cvRow);
    if (!cvTextCache || cvTextCache.trim().length < 10) {
      console.warn("[CV Upload] cv_text_cache is empty for cv id:", cvRow.id);
    }
    await query(`UPDATE cvs SET cv_text_cache = $1 WHERE id = $2`, [cvTextCache, cvRow.id]).catch(() => {});

    res.json({
      success: true,
      cv: { ...cvRow, cv_text_cache: cvTextCache },
      cv_text: cvTextCache,
      message: "CV updated successfully"
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`SELECT file_url FROM cvs WHERE id = $1 AND user_id = $2`, [id, req.user.id]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: "CV not found" });
    }
    // Remove the stored object (S3 or local) before deleting the DB row.
    if (row.file_url) {
      if (/^https?:\/\//.test(row.file_url)) {
        await deleteFromS3(row.file_url);
      } else if (row.file_url.startsWith("/uploads/")) {
        fs.unlink(path.join(uploadDir, path.basename(row.file_url)), () => {});
      }
    }
    await query(`DELETE FROM cvs WHERE id = $1 AND user_id = $2 RETURNING id`, [id, req.user.id]);
    res.json({ success: true, message: "CV deleted successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/image", requireAuth, uploadLimiter, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không tìm thấy file ảnh" });
    }
    const { url } = await persistUploadedFile(req.file, "img");
    res.status(201).json({ success: true, url, message: "Upload ảnh thành công" });
  } catch (error) {
    next(error);
  }
});

router.post("/evidence", requireAuth, uploadLimiter, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Khong tim thay file bang chung." });
    }
    const { url } = await persistUploadedFile(req.file, "evid");
    res.status(201).json({
      success: true,
      url,
      filename: req.file.originalname,
      mime_type: req.file.mimetype,
      message: "Upload file bang chung thanh cong",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
