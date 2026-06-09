import express from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { createWorker } from "tesseract.js";
import { query } from "../config/database.js";
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
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(fileBuffer);
      const pdfText = pdfData.text?.trim() || "";

      if (pdfText.length >= 50) {
        console.log("[PDF] Text layer found, length:", pdfText.length);
        console.log("[Extract] Done. Result length:", pdfText.length, "| preview:", pdfText.slice(0, 150));
        return pdfText;
      }

      console.log("[PDF] Text layer empty, attempting OCR fallback...");
      try {
        const { fromPath } = await import("pdf2pic");
        const convert = fromPath(filePath, {
          density: 150,
          saveFilename: "page",
          savePath: path.dirname(filePath),
          format: "png",
          width: 1240,
          height: 1754,
        });

        const pages = await convert.bulk(3, { responseType: "image" });
        const texts = await Promise.all(
          pages.map((page) => extractTextFromImage(page.path).catch(() => "")),
        );
        const ocrText = texts.join("\n").trim();
        console.log("[PDF OCR] Result length:", ocrText.length);
        console.log("[Extract] Done. Result length:", ocrText.length, "| preview:", ocrText.slice(0, 150));
        return ocrText;
      } catch (err) {
        if (err?.code === "ERR_MODULE_NOT_FOUND" || /Cannot find package 'pdf2pic'/.test(err?.message || "")) {
          console.warn("[PDF OCR] pdf-parse returned empty text. pdf2pic not installed. Cannot OCR scanned PDF. Install pdf2pic for full support.");
        } else {
          console.warn("[PDF OCR] Fallback failed:", err.message);
        }
        console.log("[Extract] Done. Result length:", 0, "| preview:", "");
        return "";
      }
    } catch (err) {
      console.warn("[PDF Extract] parse failed:", err);
      console.log("[Extract] Done. Result length:", 0, "| preview:", "");
      return "";
    }
  }

  if (mimeType?.startsWith("image/")) {
    try {
      const result = await extractTextFromImage(filePath);
      console.log("[Extract] Done. Result length:", result.length, "| preview:", result.slice(0, 150));
      return result;
    } catch (err) {
      console.warn("[Image Extract] OCR failed:", err);
      console.log("[Extract] Done. Result length:", 0, "| preview:", "");
      return "";
    }
  }

  console.log("[Extract] Done. Result length:", 0, "| preview:", "");
  return "";
}

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../uploads");

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

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

// ✅ FIX: Parse tên ứng viên từ text CV upload để lưu vào cột full_name
function guessCandidateName(text) {
  if (!text) return null;
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines.slice(0, 15)) {
    const match = line.match(/^(họ tên|họ và tên|full name|name)\s*:?\s*(.+)$/i);
    if (match?.[2]) return match[2].trim();
  }

  const vietnameseNamePattern = /^[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+(?:\s[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+){1,3}$/;

  for (const line of lines.slice(0, 20)) {
    if (
      vietnameseNamePattern.test(line)
      && !/@/.test(line)
      && !/\d/.test(line)
      && line.length >= 5
      && line.length <= 60
      && line.split(" ").length >= 2
    ) {
      return line;
    }
  }

  const englishNamePattern = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+){1,3}$/;
  for (const line of lines.slice(0, 20)) {
    if (
      englishNamePattern.test(line)
      && !/@/.test(line)
      && !/\d/.test(line)
      && line.length >= 5
      && line.length <= 60
    ) {
      return line;
    }
  }

  return null;
}

function guessEmail(text) {
  return text?.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
}

function guessPhone(text) {
  return text?.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() ?? null;
}

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
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

router.post("/", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
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

      const fileUrl = `/uploads/${req.file.filename}`;
      let extractedText = "";

      try {
        extractedText = await extractTextFromUploadedFile(req.file.path, req.file.mimetype);
        console.log('[CV Upload] mimetype:', req.file.mimetype);
        console.log('[CV Upload] extractedText length:', extractedText?.length);
        console.log('[CV Upload] extractedText preview:', extractedText?.slice(0, 200));
      } catch (err) {
        console.warn('[CV Upload] Extraction failed:', err);
      }

      // ✅ Parse thông tin cơ bản từ text để lưu vào các cột riêng
      // Giúp AI đọc được tên, email, phone của ứng viên upload CV
      const parsedFullName = guessCandidateName(extractedText);
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
          req.file.originalname,
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
    const result = await query(`DELETE FROM cvs WHERE id = $1 AND user_id = $2 RETURNING id`, [id, req.user.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: "CV not found" });
    }
    res.json({ success: true, message: "CV deleted successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/image", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không tìm thấy file ảnh" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, url: fileUrl, message: "Upload ảnh thành công" });
  } catch (error) {
    next(error);
  }
});

export default router;
