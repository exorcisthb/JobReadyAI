import express from "express";
import { query } from "../config/database.js";
import { createJob, getJob, processPDFExport } from "../service/PDFExportService.js";
import fs from "node:fs/promises";

const router = express.Router();

// POST /api/cv-export/:id - Create PDF export job
router.post("/:id", async (req, res, next) => {
  try {
    const cvId = req.params.id;
    const userId = req.headers["x-user-id"];
    const userRole = req.headers["x-user-role"];

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let cvData = null;
    let templateData = {
      primaryColor: "#1e293b",
      secondaryColor: "#334155",
      accentColor: "#0ea5e9",
    };

    // Check if this is a draft (passed in request body) or saved CV (from database)
    const isDraft = req.body && req.body.cvData;
    
    if (isDraft) {
      // Draft CV passed from frontend
      cvData = req.body.cvData;
      if (req.body.templateData) {
        templateData = { ...templateData, ...req.body.templateData };
      }
    } else {
      // Try to fetch CV from database (only if cvId looks like a UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!uuidRegex.test(cvId)) {
        return res.status(400).json({ 
          error: "Invalid CV ID. For draft CVs, please send cvData in request body." 
        });
      }

      const cvResult = await query(
        `SELECT id, user_id, title, content, template_id, type 
         FROM cvs 
         WHERE id = $1`,
        [cvId]
      );

      if (cvResult.rows.length === 0) {
        return res.status(404).json({ error: "CV not found" });
      }

      const cv = cvResult.rows[0];

      // Check ownership (unless admin)
      if (userRole !== "admin" && cv.user_id !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Only support created CVs for now
      if (cv.type !== "created") {
        return res.status(400).json({
          error: "Only created CVs can be exported. Uploaded CVs already have PDF files.",
        });
      }

      // Parse CV content
      cvData = typeof cv.content === "string" ? JSON.parse(cv.content) : cv.content;

      // Store template_id so CVPrintPage can resolve full template metadata (layout, colors)
      if (cv.template_id) {
        templateData.templateId = cv.template_id;
      }
    }

    if (!cvData) {
      return res.status(400).json({ error: "No CV data provided" });
    }

    // Create job with CV data and template data stored
    const format = req.query.format || "pdf";
    const jobId = createJob(cvId, userId, cvData, templateData, format);

    // Get base URL for Puppeteer to navigate to
    // In dev mode, the React app runs on Vite dev server (port 3000) while Express runs on port 3001.
    // Puppeteer needs the React origin, not the API origin. Use PDF_RENDER_BASE_URL to override.
    // In production, both serve from the same origin so req.get("host") works fine.
    const internalRenderUrl =
      process.env.PDF_RENDER_BASE_URL ||
      process.env.FRONTEND_URL ||
      `${req.protocol}://${req.get("host")}`;

    // Process in background
    processPDFExport(jobId, internalRenderUrl).catch((error) => {
      console.error("Background PDF processing error:", error);
    });

    res.json({
      jobId,
      status: "pending",
      message: "PDF export job created",
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cv-export/render-data/:jobId - Get CV data for rendering
router.get("/render-data/:jobId", async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = getJob(jobId);
    console.log(`[CVExport] render-data requested for jobId=${jobId}, found=${!!job}`);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    // Return CV data and template for rendering
    res.json({
      cvData: job.cvData,
      templateData: job.templateData,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cv-export/export-pdf/:jobId/status - Check job status
router.get("/export-pdf/:jobId/status", async (req, res, next) => {
  try {
    const { jobId} = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const job = getJob(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check ownership
    if (job.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      jobId: job.jobId,
      status: job.status,
      error: job.error,
      downloadUrl: job.status === "completed" ? `/api/cv-export/export-pdf/${jobId}/download` : null,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cv-export/export-pdf/:jobId/download - Download PDF file
router.get("/export-pdf/:jobId/download", async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const job = getJob(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check ownership
    if (job.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (job.status !== "completed") {
      return res.status(400).json({ error: "PDF not ready yet" });
    }

    if (!job.filePath) {
      return res.status(500).json({ error: `${job.format === "png" ? "PNG" : "PDF"} file not found` });
    }

    // Check file exists
    try {
      await fs.access(job.filePath);
    } catch {
      return res.status(404).json({ error: `${job.format === "png" ? "PNG" : "PDF"} file has expired or been deleted` });
    }

    // Send file
    const contentType = job.format === "png" ? "image/png" : "application/pdf";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${job.fileName}"`);
    res.sendFile(job.filePath);
  } catch (error) {
    next(error);
  }
});

export default router;
