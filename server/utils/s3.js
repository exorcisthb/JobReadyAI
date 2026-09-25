import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import path from "node:path";

// Lazily-constructed S3 client. Only built when S3 env vars are present.
let client = null;

function isS3Enabled() {
  return Boolean(
    process.env.AWS_REGION &&
    process.env.AWS_BUCKET_NAME &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    // Cloudflare R2 requires a custom endpoint; treat as disabled if missing
    process.env.AWS_S3_ENDPOINT
  );
}

function getClient() {
  if (!isS3Enabled()) return null;
  if (!client) {
    const options = {
      region: process.env.AWS_REGION || "auto",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };
    // Cloudflare R2 is S3-compatible but needs its custom endpoint.
    if (process.env.AWS_S3_ENDPOINT) {
      options.endpoint = process.env.AWS_S3_ENDPOINT;
    }
    client = new S3Client(options);
  }
  return client;
}

// Object key prefix — everything lives under a folder to keep the bucket tidy.
function getPrefix() {
  return process.env.S3_KEY_PREFIX || "user-content";
}

// Encode each path segment separately so "/" separators stay readable in the URL.
function encodeKey(key) {
  return key.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}

/**
 * Build a public HTTPS URL for a key.
 * - If AWS_S3_PUBLIC_URL is set (recommended for R2's public bucket URL), it is
 *   used as the prefix: `${AWS_S3_PUBLIC_URL}/${key}`.
 * - Otherwise assumes a classic public-read AWS S3 bucket URL.
 */
export function buildPublicUrl(key) {
  if (!key) return null;
  if (/^https?:\/\//.test(key)) return key;

  const encoded = encodeKey(key);

  if (process.env.AWS_S3_PUBLIC_URL) {
    return `${process.env.AWS_S3_PUBLIC_URL.replace(/\/+$/, "")}/${encoded}`;
  }

  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_BUCKET_NAME;
  return `https://${bucket}.s3.${region}.amazonaws.com/${encoded}`;
}

/**
 * Upload a buffer to S3. Returns a public URL suitable for storing in the DB.
 * Returns `null` when S3 is not configured (callers should fall back to local).
 */
export async function uploadToS3({ buffer, contentType, ext = "" }) {
  const s3 = getClient();
  if (!s3) return null;

  const extName = ext ? path.extname(ext) : "";
  const key = `${getPrefix()}/${randomUUID()}${extName}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType || "application/octet-stream",
        // Long-lived public cache since keys are immutable (UUID).
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    const publicUrl = buildPublicUrl(key);
    console.log("[S3] Upload success. Key:", key, "| URL:", publicUrl);
    return publicUrl;
  } catch (err) {
    console.error("[S3] Upload to R2 FAILED — falling back to local storage. Error:", err.message);
    return null;
  }
}

export async function deleteFromS3(url) {
  const s3Client = getClient();
  if (!s3Client) return;
  const key = urlToKey(url);
  if (!key) return;
  try {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key })
    );
  } catch (err) {
    console.warn("[S3] Delete failed:", err.message);
  }
}

// Turn an object's public URL back into a bucket key (for deletion).
// Works for both classic S3 URLs (bucket in hostname) and R2 public URLs
// (AWS_S3_PUBLIC_URL prefix or bucket name in hostname).
function urlToKey(url) {
  try {
    const u = new URL(url);
    const bucket = process.env.AWS_BUCKET_NAME;

    if (process.env.AWS_S3_PUBLIC_URL) {
      const prefix = process.env.AWS_S3_PUBLIC_URL.replace(/\/+$/, "");
      if (url.startsWith(prefix + "/")) {
        return decodeURIComponent(url.slice(prefix.length + 1));
      }
    }

    if (!bucket || !u.hostname.includes(bucket)) return null;
    return decodeURIComponent(u.pathname.replace(/^\//, ""));
  } catch {
    return null;
  }
}

export { isS3Enabled };