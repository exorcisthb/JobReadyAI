import express from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pdf from "pdf-parse";
import { createWorker } from "tesseract.js";
import { query } from "../config/database.js";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "./uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
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

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

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
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSkillsFromText(text) {
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

function guessCandidateName(text) {
  const lines = splitLines(text).slice(0, 12);
  for (const line of lines) {
    const match = line.match(/^(họ tên|họ và tên|full name|name)\s*:?\s*(.+)$/i);
    if (match?.[2]) return match[2].trim();
  }

  const firstMeaningfulLine = lines.find(
    (line) =>
      !/@/.test(line) &&
      !/\d{2,}/.test(line) &&
      line.split(" ").length >= 2 &&
      line.length <= 60,
  );
  return firstMeaningfulLine || null;
}

function guessEmail(text) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
}

function guessPhone(text) {
  return text.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() ?? null;
}

function guessObjective(text) {
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

async function extractTextFromPdf(filePath) {
  const buffer = await fs.promises.readFile(filePath);
  const parsed = await pdf(buffer);
  return parsed.text?.trim() || "";
}

async function extractTextFromImage(filePath) {
  const worker = await createWorker("eng+vie");
  try {
    const { data } = await worker.recognize(filePath);
    return data.text?.trim() || "";
  } finally {
    await worker.terminate();
  }
}

async function extractTextFromUploadedFile(filePath, mimeType) {
  if (mimeType === "application/pdf") {
    return extractTextFromPdf(filePath);
  }

  if (mimeType?.startsWith("image/")) {
    return extractTextFromImage(filePath);
  }

  return "";
}

async function buildCvDataFromUpload(file) {
  const extractedText = await extractTextFromUploadedFile(file.path, file.mimetype);
  const normalizedText = extractedText.replace(/\r/g, "").trim();

  return {
    file_name: file.originalname,
    file_size: file.size,
    file_url: `/uploads/${file.filename}`,
    file_type: file.mimetype,
    content: normalizedText || null,
    full_name: guessCandidateName(normalizedText),
    email: guessEmail(normalizedText),
    phone: guessPhone(normalizedText),
    address: null,
    objective: guessObjective(normalizedText),
    experience: JSON.stringify(parseExperienceFromText(normalizedText)),
    education: JSON.stringify([]),
    skills: JSON.stringify(parseSkillsFromText(normalizedText)),
    certifications: JSON.stringify([]),
    languages: JSON.stringify(parseLanguagesFromText(normalizedText)),
  };
}

router.get("/cv", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, title, file_name, file_size, file_url, uploaded_at, type, file_type FROM cvs WHERE user_id = $1 ORDER BY uploaded_at DESC`,
      [req.user.id],
    );
    res.json({ cvs: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get("/cv/latest", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, user_id, title, file_name, file_size, file_url, uploaded_at, type, file_type, content, template_id, full_name, email, phone, address, objective, experience, education, skills, certifications, languages, created_at, updated_at
       FROM cvs WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`,
      [req.user.id],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Không tìm thấy CV" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get("/cv/:id", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, user_id, title, file_name, file_size, file_url, uploaded_at, type, file_type, content, template_id, full_name, email, phone, address, objective, experience, education, skills, certifications, languages, created_at, updated_at
       FROM cvs WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "CV not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post("/cv", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    const { title, content, template_id, type } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    let cvData = {
      title,
      type: type || (req.file ? "uploaded" : "created"),
      template_id: template_id || null,
    };

    if (req.file) {
      const extractedCvData = await buildCvDataFromUpload(req.file);
      cvData = {
        ...cvData,
        ...extractedCvData,
      };
    } else if (content) {
      const contentObj = typeof content === "string" ? JSON.parse(content) : content;
      cvData = {
        ...cvData,
        full_name: contentObj.fullName || null,
        email: contentObj.email || null,
        phone: contentObj.phone || null,
        address: contentObj.address || null,
        objective: contentObj.objective || null,
        experience: JSON.stringify(contentObj.experience || []),
        education: JSON.stringify(contentObj.education || []),
        skills: JSON.stringify(contentObj.skills || []),
        certifications: JSON.stringify(contentObj.certifications || []),
        languages: JSON.stringify(contentObj.languages || []),
        content: JSON.stringify(contentObj),
      };
    } else {
      return res.status(400).json({ error: "File or CV content is required" });
    }

    const result = await query(
      `INSERT INTO cvs (user_id, title, file_name, file_size, file_url, uploaded_at, type, file_type, template_id, content, full_name, email, phone, address, objective, experience, education, skills, certifications, languages)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       RETURNING id, title, file_name, file_size, file_url, uploaded_at, type, file_type, template_id, full_name, email, phone, address, objective, experience, education, skills, certifications, languages`,
      [
        req.user.id,
        cvData.title,
        cvData.file_name || null,
        cvData.file_size || null,
        cvData.file_url || null,
        cvData.type,
        cvData.file_type || null,
        cvData.template_id,
        cvData.content || null,
        cvData.full_name || null,
        cvData.email || null,
        cvData.phone || null,
        cvData.address || null,
        cvData.objective || null,
        cvData.experience || null,
        cvData.education || null,
        cvData.skills || null,
        cvData.certifications || null,
        cvData.languages || null,
      ],
    );

    res.status(201).json({ success: true, cv: result.rows[0], message: "CV saved successfully" });
  } catch (error) {
    next(error);
  }
});

router.delete("/cv/:id", requireAuth, async (req, res, next) => {
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

router.put("/cv/:id", requireAuth, async (req, res, next) => {
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
    updateValues.push(id);
    updateValues.push(req.user.id);

    const result = await query(
      `UPDATE cvs SET ${updateFields.join(", ")} WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} RETURNING *`,
      updateValues,
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "CV not found" });
    }

    res.json({ success: true, cv: result.rows[0], message: "CV updated successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/cv/text/:id", requireAuth, async (req, res, next) => {
  try {
    const result = await query(`SELECT * FROM cvs WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.id]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Không tìm thấy CV" });
    }

    const cv = result.rows[0];

    if (cv.type === "created" && cv.content) {
      const cvData = typeof cv.content === "string" ? JSON.parse(cv.content) : cv.content;
      let cvText = `=== THÔNG TIN ỨNG VIÊN ===\n\n`;
      cvText += `Họ và tên: ${cvData.fullName || "Chưa cập nhật"}\n`;
      cvText += `Email: ${cvData.email || "Chưa cập nhật"}\n`;
      cvText += `Số điện thoại: ${cvData.phone || "Chưa cập nhật"}\n`;
      cvText += `Địa chỉ: ${cvData.address || "Chưa cập nhật"}\n\n`;

      if (cvData.experience?.length) {
        cvText += `=== KINH NGHIỆM LÀM VIỆC ===\n`;
        cvData.experience.forEach((exp, idx) => {
          if (exp.position || exp.company) {
            cvText += `\n${idx + 1}. ${exp.position || "Vị trí"} tại ${exp.company || "Công ty"}\n`;
            cvText += `   Thời gian: ${exp.startDate || ""} - ${exp.endDate || "Hiện tại"}\n`;
            if (exp.description) cvText += `   Mô tả: ${exp.description}\n`;
          }
        });
        cvText += `\n`;
      }

      if (cvData.skills?.length) {
        cvText += `=== KỸ NĂNG ===\n`;
        cvData.skills.forEach((skill) => {
          if (typeof skill === "string") cvText += `- ${skill}\n`;
          else if (skill?.name) cvText += `- ${skill.name}${skill.level ? ` (${skill.level}/100)` : ""}\n`;
        });
        cvText += `\n`;
      }

      return res.json({ text: cvText });
    }

    const experience = tryParseJsonArray(cv.experience);
    const skills = tryParseJsonArray(cv.skills);
    const languages = tryParseJsonArray(cv.languages);
    let cvText = cv.content?.trim() ? `${cv.content.trim()}\n\n` : "";
    cvText += `=== THÔNG TIN ỨNG VIÊN ===\n\n`;
    cvText += `Họ và tên: ${cv.full_name || "Chưa cập nhật"}\n`;
    cvText += `Email: ${cv.email || "Chưa cập nhật"}\n`;
    cvText += `Số điện thoại: ${cv.phone || "Chưa cập nhật"}\n`;
    cvText += `Địa chỉ: ${cv.address || "Chưa cập nhật"}\n\n`;

    if (experience.length) {
      cvText += `=== KINH NGHIỆM LÀM VIỆC ===\n`;
      experience.forEach((item, idx) => {
        cvText += `${idx + 1}. ${typeof item === "string" ? item : JSON.stringify(item)}\n`;
      });
      cvText += `\n`;
    }

    if (skills.length) {
      cvText += `=== KỸ NĂNG ===\n${skills.join(", ")}\n\n`;
    }

    if (languages.length) {
      cvText += `=== NGOẠI NGỮ ===\n${languages.join(", ")}\n\n`;
    }

    return res.json({ text: cvText.trim() });
  } catch (error) {
    next(error);
  }
});

export default router;
