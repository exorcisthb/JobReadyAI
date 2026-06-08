import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

// Auth middleware
function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

// GET /api/cv/latest - Get user's latest CV
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
        created_at,
        updated_at
      FROM cvs 
      WHERE user_id = $1 
      ORDER BY updated_at DESC 
      LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy CV" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// GET /api/cv/:id - Get specific CV by ID
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
        created_at,
        updated_at
      FROM cvs 
      WHERE id = $1 AND user_id = $2`,
      [cvId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy CV" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// GET /api/cv/text/:id - Get CV as formatted text for AI
router.get("/text/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cvId = req.params.id;
    
    const result = await query(
      `SELECT * FROM cvs WHERE id = $1 AND user_id = $2`,
      [cvId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy CV" });
    }

    const cv = result.rows[0];
    
    // Check if CV is created type with JSON content
    if (cv.type === "created" && cv.content) {
      const cvData = typeof cv.content === "string" ? JSON.parse(cv.content) : cv.content;
      
      // Format CV as text from JSON content
      let cvText = `=== THÔNG TIN ỨNG VIÊN ===\n\n`;
      cvText += `Họ và tên: ${cvData.fullName || "Chưa cập nhật"}\n`;
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
        cvData.skills.forEach(skill => {
          if (typeof skill === 'string') {
            cvText += `- ${skill}\n`;
          } else if (skill.name) {
            cvText += `- ${skill.name}${skill.level ? ` (${skill.level}/100)` : ''}\n`;
          }
        });
        cvText += `\n`;
      }
      
      if (cvData.certifications && Array.isArray(cvData.certifications) && cvData.certifications.length > 0) {
        cvText += `=== CHỨNG CHỈ ===\n`;
        cvData.certifications.forEach((cert, idx) => {
          if (cert) {
            cvText += `${idx + 1}. ${cert}\n`;
          }
        });
        cvText += `\n`;
      }
      
      if (cvData.languages && Array.isArray(cvData.languages) && cvData.languages.length > 0) {
        cvText += `=== NGOẠI NGỮ ===\n`;
        cvData.languages.forEach((lang) => {
          if (lang) {
            cvText += `- ${lang}\n`;
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

      return res.json({ text: cvText });
    }
    
    // Fallback for old format or uploaded CV
    let cvText = `=== THÔNG TIN ỨNG VIÊN ===\n\n`;
    cvText += `Họ và tên: ${cv.full_name || "Chưa cập nhật"}\n`;
    cvText += `Email: ${cv.email || "Chưa cập nhật"}\n`;
    cvText += `Số điện thoại: ${cv.phone || "Chưa cập nhật"}\n`;
    cvText += `Địa chỉ: ${cv.address || "Chưa cập nhật"}\n\n`;
    
    if (cv.objective) {
      cvText += `=== MỤC TIÊU NGHỀ NGHIỆP ===\n${cv.objective}\n\n`;
    }
    
    if (cv.experience && Array.isArray(cv.experience) && cv.experience.length > 0) {
      cvText += `=== KINH NGHIỆM LÀM VIỆC ===\n`;
      cv.experience.forEach((exp, idx) => {
        cvText += `\n${idx + 1}. ${exp.position || "Vị trí"} tại ${exp.company || "Công ty"}\n`;
        cvText += `   Thời gian: ${exp.start_date || ""} - ${exp.end_date || "Hiện tại"}\n`;
        if (exp.description) {
          cvText += `   Mô tả: ${exp.description}\n`;
        }
      });
      cvText += `\n`;
    }
    
    if (cv.education && Array.isArray(cv.education) && cv.education.length > 0) {
      cvText += `=== HỌC VẤN ===\n`;
      cv.education.forEach((edu, idx) => {
        cvText += `\n${idx + 1}. ${edu.degree || "Bằng cấp"} - ${edu.school || "Trường"}\n`;
        cvText += `   Thời gian: ${edu.start_date || ""} - ${edu.end_date || ""}\n`;
        if (edu.major) {
          cvText += `   Chuyên ngành: ${edu.major}\n`;
        }
      });
      cvText += `\n`;
    }
    
    if (cv.skills && Array.isArray(cv.skills) && cv.skills.length > 0) {
      cvText += `=== KỸ NĂNG ===\n`;
      cvText += cv.skills.join(", ") + `\n\n`;
    }
    
    if (cv.certifications && Array.isArray(cv.certifications) && cv.certifications.length > 0) {
      cvText += `=== CHỨNG CHỈ ===\n`;
      cv.certifications.forEach((cert, idx) => {
        cvText += `${idx + 1}. ${cert.name || "Chứng chỉ"}\n`;
        if (cert.issuer) {
          cvText += `   Tổ chức cấp: ${cert.issuer}\n`;
        }
        if (cert.date) {
          cvText += `   Ngày cấp: ${cert.date}\n`;
        }
      });
      cvText += `\n`;
    }
    
    if (cv.languages && Array.isArray(cv.languages) && cv.languages.length > 0) {
      cvText += `=== NGOẠI NGỮ ===\n`;
      cv.languages.forEach((lang) => {
        cvText += `- ${lang.name || "Ngôn ngữ"}: ${lang.level || "Chưa xác định"}\n`;
      });
    }

    res.json({ text: cvText });
  } catch (error) {
    next(error);
  }
});

export default router;
