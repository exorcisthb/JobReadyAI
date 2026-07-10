import puppeteer from "puppeteer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Shared browser instance for better performance
let browserInstance = null;

function isBrowserAlive(browser) {
  if (!browser) return false;
  try {
    if (typeof browser.connected === "boolean") return browser.connected;
    if (typeof browser.isConnected === "function") return browser.isConnected();
    return false;
  } catch {
    return false;
  }
}

async function getBrowser() {
  if (isBrowserAlive(browserInstance)) {
    return browserInstance;
  }

  console.log("[PDFExport] Launching new browser instance...");
  browserInstance = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  browserInstance.on("disconnected", () => {
    console.log("[PDFExport] Browser disconnected, will relaunch on next job");
    browserInstance = null;
  });

  return browserInstance;
}

// Simple in-memory job queue
const jobs = new Map();

// Job status: 'pending' | 'processing' | 'completed' | 'failed'
function createJob(cvId, userId, cvData, templateData, format = "pdf") {
  const jobId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  jobs.set(jobId, {
    jobId,
    cvId,
    userId,
    cvData,
    templateData,
    format,
    status: "pending",
    createdAt: Date.now(),
    filePath: null,
    fileName: null,
    error: null,
  });
  return jobId;
}

function getJob(jobId) {
  return jobs.get(jobId);
}

function updateJob(jobId, updates) {
  const job = jobs.get(jobId);
  if (job) {
    Object.assign(job, updates);
  }
}

// Clean up old jobs (>1 hour old)
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [jobId, job] of jobs.entries()) {
    if (job.createdAt < oneHourAgo) {
      // Delete file if exists
      if (job.filePath) {
        fs.unlink(job.filePath).catch(() => {});
      }
      jobs.delete(jobId);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Process PDF export
async function processPDFExport(jobId, baseUrl) {
  const job = getJob(jobId);
  const format = job?.format || "pdf";
  updateJob(jobId, { status: "processing" });

  let page;
  try {
    console.log(`[PDFExport] Starting job ${jobId} (format: ${format})`);

    const browser = await getBrowser();
    page = await browser.newPage();

    // Log all network requests for diagnostics
    page.on("requestfailed", (request) => {
      console.error(`[PDFExport] Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });
    page.on("response", (response) => {
      if (response.url().includes("/api/cv-export/render-data/")) {
        console.log(`[PDFExport] render-data response status: ${response.status()} for ${response.url()}`);
      }
    });
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        console.log(`[PDFExport] Browser ${msg.type()}:`, msg.text());
      }
    });

    // Set viewport for A4 size (210mm x 297mm at 96 DPI)
    await page.setViewport({
      width: 794, // 210mm at 96 DPI
      height: 1123, // 297mm at 96 DPI
      deviceScaleFactor: 2, // For high quality
    });

    // Navigate to the CV print page
    const printUrl = `${baseUrl}/cv-print?job_id=${jobId}`;
    console.log(`[PDFExport] baseUrl received: ${baseUrl}`);
    console.log(`[PDFExport] Full printUrl: ${printUrl}`);

    await page.goto(printUrl, {
      waitUntil: ["networkidle0", "load"],
      timeout: 30000,
    });

    // Wait for CV container to be rendered
    try {
      await page.waitForSelector("#cv-preview-container", { timeout: 10000 });
    } catch (waitErr) {
      const html = await page.content();
      console.error("[PDFExport] TIMEOUT - Page HTML snippet:", html.slice(0, 1500));
      console.error("[PDFExport] Current page URL when failed:", page.url());
      throw waitErr;
    }

    // Wait a bit for fonts and images to load
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const uploadsDir = path.join(__dirname, "../../uploads/temp");
    await fs.mkdir(uploadsDir, { recursive: true });

    let fileName, filePath;

    if (format === "png") {
      fileName = `cv-${jobId}.png`;
      filePath = path.join(uploadsDir, fileName);

      await page.screenshot({
        path: filePath,
        fullPage: true,
        type: "png",
      });
    } else {
      fileName = `cv-${jobId}.pdf`;
      filePath = path.join(uploadsDir, fileName);

      await page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "0mm",
          right: "0mm",
          bottom: "0mm",
          left: "0mm",
        },
      });
    }

    console.log(`[PDFExport] Job ${jobId} completed successfully (${format})`);

    updateJob(jobId, {
      status: "completed",
      filePath: filePath,
      fileName: fileName,
    });
  } catch (error) {
    console.error(`[PDFExport] Job ${jobId} failed:`, error);
    updateJob(jobId, {
      status: "failed",
      error: error.message,
    });
  } finally {
    if (page) {
      await page.close();
    }
  }
}

export { createJob, getJob, processPDFExport };
