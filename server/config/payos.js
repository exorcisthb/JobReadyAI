import "./env.js";
import PayOS from "@payos/node";

const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY } = process.env;

if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
  console.warn(
    "⚠️  PayOS credentials not configured. Payment features will be disabled."
  );
}

// Khởi tạo PayOS client
const payos = PAYOS_CLIENT_ID && PAYOS_API_KEY && PAYOS_CHECKSUM_KEY
  ? new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY)
  : null;

export default payos;
