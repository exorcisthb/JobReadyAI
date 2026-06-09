import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

function parseJsonField(value) {
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

function buildCvTextFromContent(cv) {
  if (cv.type === "created" && cv.content) {
    const cvData = typeof cv.content === "string" ? JSON.parse(cv.content) : cv.content;

    let cvText = `=== THÔNG TIN ỨNG VIÊN ===\n\n`;
    cvText += `Họ và tên: ${cvData.fullName || "Chưa cập nhật"}\n`;
    // ✅ Thêm jobTitle để AI biết vị trí ứng tuyển
    if (cvData.jobTitle) cvText += `Vị trí: ${cvData.jobTitle}\n`;
    cvText += `Email: ${cvData.email || "Chưa cập nhật"}\n`;
    cvText += `Số điện thoại: ${cvData.phone || "Chưa cập nhật"}\n`;
    cvText += `Địa chỉ: ${cvData.address || "Chưa cập nhật"}\n`;
    if (cvData.dateOfBirth) cvText += `Ngày sinh: ${cvData.dateOfBirth}\n`;
    cvText += `\n`;

    if (cvData.objective) {
      cvText += `=== MỤC TIÊU NGHỀ NGHIỆP ===\n${cvData.objective}\n\n`;
    }

    if (cvData.experience && Array.isArray(cvData.experience) && cvData.experience.length > 0) {
      cvText += `=== KINH NGHIỆM LÀM VIỆC ===\n`;
      cvData.experience.forEach((exp, idx) => {
        if (exp.position || exp.company) {
          cvText += `\n${idx + 1}. ${exp.position || "Vị trí"} tại ${exp.company || "Công ty"}\n`;
          cvText += `   Thời gian: ${exp.startDate || ""} - ${exp.endDate || "Hiện tại"}\n`;
          if (exp.description) {
            cvText += `   Mô tả: ${exp.description}\n`;
          }
        }
      });
      cvText += `\n`;
    }

    if (cvData.education && Array.isArray(cvData.education) && cvData.education.length > 0) {
      cvText += `=== HỌC VẤN ===\n`;
      cvData.education.forEach((edu, idx) => {
        if (edu.degree || edu.school) {
          cvText += `\n${idx + 1}. ${edu.degree || "Bằng cấp"} - ${edu.school || "Trường"}\n`;
          cvText += `   Thời gian: ${edu.startDate || ""} - ${edu.endDate || ""}\n`;
          if (edu.field) {
            cvText += `   Chuyên ngành: ${edu.field}\n`;
          }
        }
      });
      cvText += `\n`;
    }

    if (cvData.skills && Array.isArray(cvData.skills) && cvData.skills.length > 0) {
      cvText += `=== KỸ NĂNG ===\n`;
      cvData.skills.forEach((skill) => {
        if (typeof skill === "string") {
          cvText += `- ${skill}\n`;
        } else if (skill && skill.name) {
          // ✅ FIX: AI advisor dùng level 1-5, không phải 1-100
          cvText += `- ${skill.name}${skill.level ? ` (${skill.level}/5)` : ""}\n`;
        }
      });
      cvText += `\n`;
    }

    if (cvData.certifications && Array.isArray(cvData.certifications) && cvData.certifications.length > 0) {
      cvText += `=== CHỨNG CHỈ ===\n`;
      cvData.certifications.forEach((cert, idx) => {
        if (cert) {
          cvText += `${idx + 1}. ${typeof cert === "string" ? cert : cert.name || cert}\n`;
        }
      });
      cvText += `\n`;
    }

    if (cvData.languages && Array.isArray(cvData.languages) && cvData.languages.length > 0) {
      cvText += `=== NGOẠI NGỮ ===\n`;
      cvData.languages.forEach((lang) => {
        if (lang) {
          cvText += `- ${typeof lang === "string" ? lang : lang.name || lang}\n`;
        }
      });
      cvText += `\n`;
    }

    if (cvData.hobbies && Array.isArray(cvData.hobbies) && cvData.hobbies.length > 0) {
      cvText += `=== SỞ THÍCH ===\n`;
      cvData.hobbies.forEach((hobby) => {
        if (hobby) {
          cvText += `- ${hobby}\n`;
        }
      });
    }

    return cvText;
  }

  if (cv.type === "uploaded" && cv.content) {
    let rawText = null;
    if (typeof cv.content === "string") {
      try {
        const parsed = JSON.parse(cv.content);
        rawText = parsed.rawText || cv.content;
      } catch (e) {
        rawText = cv.content;
      }
    } else if (cv.content && typeof cv.content === "object") {
      rawText = cv.content.rawText || JSON.stringify(cv.content);
    }

    if (rawText && rawText.trim().length > 50) {
      return rawText.trim();
    }
  }

  const experience = parseJsonField(cv.experience);
  const education = parseJsonField(cv.education);
  const skills = parseJsonField(cv.skills);
  const certifications = parseJsonField(cv.certifications);
  const languages = parseJsonField(cv.languages);

  let cvText = `=== THÔNG TIN ỨNG VIÊN ===\n\n`;
  cvText += `Họ và tên: ${cv.full_name || "Chưa cập nhật"}\n`;
  cvText += `Email: ${cv.email || "Chưa cập nhật"}\n`;
  cvText += `Số điện thoại: ${cv.phone || "Chưa cập nhật"}\n`;
  cvText += `Địa chỉ: ${cv.address || "Chưa cập nhật"}\n\n`;

  if (cv.objective) {
    cvText += `=== MỤC TIÊU NGHỀ NGHIỆP ===\n${cv.objective}\n\n`;
  }

  if (experience.length > 0) {
    cvText += `=== KINH NGHIỆM LÀM VIỆC ===\n`;
    experience.forEach((exp, idx) => {
      cvText += `\n${idx + 1}. ${exp.position || "Vị trí"} tại ${exp.company || "Công ty"}\n`;
      const start = exp.startDate || exp.start_date || "";
      const end = exp.endDate || exp.end_date || "Hiện tại";
      cvText += `   Thời gian: ${start} - ${end}\n`;
      if (exp.description) {
        cvText += `   Mô tả: ${exp.description}\n`;
      }
    });
    cvText += `\n`;
  }

  if (education.length > 0) {
    cvText += `=== HỌC VẤN ===\n`;
    education.forEach((edu, idx) => {
      cvText += `\n${idx + 1}. ${edu.degree || "Bằng cấp"} - ${edu.school || "Trường"}\n`;
      const start = edu.startDate || edu.start_date || "";
      const end = edu.endDate || edu.end_date || "";
      cvText += `   Thời gian: ${start} - ${end}\n`;
      const field = edu.field || edu.major || null;
      if (field) {
        cvText += `   Chuyên ngành: ${field}\n`;
      }
    });
    cvText += `\n`;
  }

  if (skills.length > 0) {
    cvText += `=== KỸ NĂNG ===\n`;
    skills.forEach((skill) => {
      if (typeof skill === "string") {
        cvText += `- ${skill}\n`;
      } else if (skill && skill.name) {
        cvText += `- ${skill.name}${skill.level ? ` (${skill.level}/5)` : ""}\n`;
      }
    });
    cvText += `\n`;
  }

  if (certifications.length > 0) {
    cvText += `=== CHỨNG CHỈ ===\n`;
    certifications.forEach((cert, idx) => {
      if (typeof cert === "string") {
        cvText += `${idx + 1}. ${cert}\n`;
      } else if (cert) {
        cvText += `${idx + 1}. ${cert.name || "Chứng chỉ"}\n`;
        if (cert.issuer) cvText += `   Tổ chức cấp: ${cert.issuer}\n`;
        if (cert.date) cvText += `   Ngày cấp: ${cert.date}\n`;
      }
    });
    cvText += `\n`;
  }

  if (languages.length > 0) {
    cvText += `=== NGOẠI NGỮ ===\n`;
    languages.forEach((lang) => {
      if (typeof lang === "string") {
        cvText += `- ${lang}\n`;
      } else if (lang) {
        cvText += `- ${lang.name || "Ngôn ngữ"}${lang.level ? `: ${lang.level}` : ""}\n`;
      }
    });
    cvText += `\n`;
  }

  return cvText;
}

router.get("/latest", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT 
        id,
        user_id,
        title,
        file_name,
        file_size,
        file_url,
        uploaded_at,
        type,
        file_type,
        content,
        template_id,
        full_name,
        email,
        phone,
        address,
        objective,
        experience,
        education,
        skills,
        certifications,
        languages,
        cv_text_cache,
        created_at,
        updated_at
      FROM cvs 
      WHERE user_id = $1 
      ORDER BY updated_at DESC 
      LIMIT 1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy CV" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get("/text/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cvId = req.params.id;

    const result = await query(`SELECT * FROM cvs WHERE id = $1 AND user_id = $2`, [cvId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy CV" });
    }

    const cv = result.rows[0];

    if (cv.cv_text_cache && cv.cv_text_cache.trim().length > 50) {
      return res.json({ text: cv.cv_text_cache.trim() });
    }

    const cvTextCache = buildCvTextFromContent(cv);

    await query(`UPDATE cvs SET cv_text_cache = $1 WHERE id = $2`, [cvTextCache, cv.id]).catch(() => {});

    return res.json({ text: cvTextCache });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cvId = req.params.id;

    const result = await query(
      `SELECT 
        id,
        user_id,
        title,
        file_name,
        file_size,
        file_url,
        uploaded_at,
        type,
        file_type,
        content,
        template_id,
        full_name,
        email,
        phone,
        address,
        objective,
        experience,
        education,
        skills,
        certifications,
        languages,
        cv_text_cache,
        created_at,
        updated_at
      FROM cvs 
      WHERE id = $1 AND user_id = $2`,
      [cvId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy CV" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export { buildCvTextFromContent };
export default router;
