import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

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
  // Priority 1: uploaded CV with raw extracted text
  if (cv.type === "uploaded" && cv.content) {
    let rawText = null;

    try {
      const parsed = typeof cv.content === "string" ? JSON.parse(cv.content) : cv.content;
      rawText = parsed?.rawText;
    } catch {
      rawText = typeof cv.content === "string" ? cv.content : null;
    }

    if (rawText && rawText.trim().length > 50) {
      return rawText.trim();
    }

    console.warn("[buildCvTextFromContent] rawText empty for uploaded CV id:", cv.id);
  }

  if (cv.type === "created" && cv.content) {
    const cvData = typeof cv.content === "string" ? JSON.parse(cv.content) : cv.content;

    const experience = cvData.experience
      || cvData.workExperience
      || cvData.work_experience
      || cvData.experiences
      || [];

    const skills = cvData.skills
      || cvData.technicalSkills
      || cvData.technical_skills
      || cvData.skillsList
      || [];

    const education = cvData.education
      || cvData.educationHistory
      || cvData.education_history
      || [];

    const certifications = cvData.certifications || cvData.certificates || [];
    const languages = cvData.languages || cvData.languageSkills || [];

    let cvText = `=== THÔNG TIN ỨNG VIÊN ===\n\n`;
    cvText += `Họ và tên: ${cvData.fullName || cvData.full_name || "Chưa cập nhật"}\n`;
    if (cvData.jobTitle || cvData.position) {
      cvText += `Vị trí: ${cvData.jobTitle || cvData.position}\n`;
    }
    cvText += `Email: ${cvData.email || "Chưa cập nhật"}\n`;
    cvText += `Số điện thoại: ${cvData.phone || "Chưa cập nhật"}\n`;
    cvText += `Địa chỉ: ${cvData.address || "Chưa cập nhật"}\n`;
    if (cvData.dateOfBirth) cvText += `Ngày sinh: ${cvData.dateOfBirth}\n`;
    cvText += `\n`;

    if (cvData.objective || cvData.summary || cvData.careerObjective) {
      const objective = cvData.objective || cvData.summary || cvData.careerObjective;
      cvText += `=== MỤC TIÊU NGHỀ NGHIỆP ===\n${objective}\n\n`;
    }

    if (Array.isArray(experience) && experience.length > 0) {
      cvText += `=== KINH NGHIỆM LÀM VIỆC ===\n`;
      experience.forEach((exp, idx) => {
        if (exp?.position || exp?.title || exp?.company) {
          const position = exp.position || exp.title || "Vị trí";
          const company = exp.company || exp.organization || "Công ty";
          cvText += `\n${idx + 1}. ${position} tại ${company}\n`;
          cvText += `   Thời gian: ${exp.startDate || exp.start_date || ""} - ${exp.endDate || exp.end_date || "Hiện tại"}\n`;
          if (exp.description || exp.responsibilities || exp.details) {
            const description = exp.description || exp.responsibilities || exp.details;
            cvText += `   Mô tả: ${Array.isArray(description) ? description.join('; ') : description}\n`;
          }
        }
      });
      cvText += `\n`;
    } else {
      cvText += `=== KINH NGHIỆM LÀM VIỆC ===\nChưa cập nhật\n\n`;
    }

    if (Array.isArray(skills) && skills.length > 0) {
      cvText += `=== KỸ NĂNG ===\n`;
      skills.forEach((skill) => {
        if (typeof skill === "string") {
          cvText += `- ${skill}\n`;
        } else if (skill && (skill.name || skill.skill)) {
          const skillName = skill.name || skill.skill;
          const level = skill.level || skill.proficiency || null;
          cvText += `- ${skillName}${level ? ` (${level}/5)` : ""}\n`;
        }
      });
      cvText += `\n`;
    } else {
      cvText += `=== KỸ NĂNG ===\nChưa cập nhật\n\n`;
    }

    if (Array.isArray(education) && education.length > 0) {
      cvText += `=== HỌC VẤN ===\n`;
      education.forEach((edu, idx) => {
        if (edu?.degree || edu?.school || edu?.institution) {
          const degree = edu.degree || edu.qualification || "Bằng cấp";
          const school = edu.school || edu.institution || edu.university || "Trường";
          cvText += `\n${idx + 1}. ${degree} - ${school}\n`;
          cvText += `   Thời gian: ${edu.startDate || edu.start_date || ""} - ${edu.endDate || edu.end_date || ""}\n`;
          const field = edu.field || edu.major || edu.specialization || null;
          if (field) {
            cvText += `   Chuyên ngành: ${field}\n`;
          }
        }
      });
      cvText += `\n`;
    }

    if (Array.isArray(certifications) && certifications.length > 0) {
      cvText += `=== CHỨNG CHỈ ===\n`;
      certifications.forEach((cert, idx) => {
        if (typeof cert === "string") {
          cvText += `${idx + 1}. ${cert}\n`;
        } else if (cert) {
          cvText += `${idx + 1}. ${cert.name || cert.title || "Chứng chỉ"}\n`;
          if (cert.issuer || cert.organization) {
            cvText += `   Tổ chức cấp: ${cert.issuer || cert.organization}\n`;
          }
          if (cert.date || cert.year) {
            cvText += `   Ngày cấp: ${cert.date || cert.year}\n`;
          }
        }
      });
      cvText += `\n`;
    }

    if (Array.isArray(languages) && languages.length > 0) {
      cvText += `=== NGOẠI NGỮ ===\n`;
      languages.forEach((lang) => {
        if (typeof lang === "string") {
          cvText += `- ${lang}\n`;
        } else if (lang) {
          cvText += `- ${lang.name || lang.language || "Ngôn ngữ"}${lang.level ? `: ${lang.level}` : ""}\n`;
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

// GET /quota — Trả về hạn mức tạo CV của user (chỉ tính CV tạo bằng Builder, không tính upload)
router.get("/quota", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userPlanResult = await query(
      `SELECT sub_plan_cv, sub_expires_cv, subscription_plan, subscription_expires_at FROM users WHERE id = $1`,
      [userId]
    );
    let plan = "free";
    if (userPlanResult.rows.length > 0) {
      const user = userPlanResult.rows[0];
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

    // Chỉ đếm CV tạo bằng Builder (type = 'created')
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

    // Đếm riêng CV upload để hiển thị thông tin
    const uploadedCountResult = await query(
      `SELECT COUNT(*) as count FROM cvs WHERE user_id = $1 AND type = 'uploaded'`,
      [userId]
    );

    const usedUploaded = parseInt(uploadedCountResult.rows[0].count, 10) || 0;

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
      limit = 999;
    }

    res.json({
      used: usedCreated,          // Số CV đã tạo bằng Builder
      usedCreated,                // Alias rõ ràng
      usedUploaded,               // Số CV đã upload (không tính vào quota tạo)
      limit,
      remaining: Math.max(0, limit - usedCreated),
      plan,
    });
  } catch (error) {
    next(error);
  }
});


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
    let cvText = cv.cv_text_cache?.trim();

    if (!cvText || cvText.length < 2000) {
      cvText = buildCvTextFromContent(cv);

      if (cvText && cvText.length > 500) {
        await query(`UPDATE cvs SET cv_text_cache = $1 WHERE id = $2`, [cvText, cv.id]).catch((error) => {
          console.warn("[CV Text] Failed to update cv_text_cache:", error);
        });
      }
    }

    if (!cvText || cvText.length < 10) {
      return res.status(422).json({
        error: "CV không có đủ dữ liệu để tạo text. Vui lòng kiểm tra lại nội dung CV.",
      });
    }

    return res.json({ text: cvText });
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
