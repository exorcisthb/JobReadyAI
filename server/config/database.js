import "./env.js";

import pg from "pg";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "DATABASE_URL is not set. Auth API requests will fail until PostgreSQL is configured.",
  );
}

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    })
  : null;

function assertPool() {
  if (!pool) {
    throw new ApiError(503, "Database is not configured.");
  }
}

export async function query(sql, params = []) {
  assertPool();
  return pool.query(sql, params);
}

export async function withTransaction(callback) {
  assertPool();

  const client = await pool.connect();

  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function ensureSchema() {
  if (!pool) return;

  await query("create extension if not exists pgcrypto;");

  // Tạo bảng users nếu chưa tồn tại
  await query(`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      email varchar(255),
      phone varchar(20),
      google_id varchar(255),
      password_hash varchar(255),
      otp varchar(6),
      otp_expiry timestamp,
      otp_verified boolean default false,
      auth_provider varchar(50) default 'email',
      status varchar(50) default 'active',
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  await query("alter table users add column if not exists email varchar(255)");
  await query("alter table users add column if not exists phone varchar(20)");
  await query("alter table users add column if not exists google_id varchar(255)");
  await query("alter table users add column if not exists password_hash varchar(255)");
  await query("alter table users add column if not exists otp varchar(6)");
  await query("alter table users add column if not exists otp_expiry timestamp");
  await query("alter table users add column if not exists otp_verified boolean default false");
  await query("alter table users add column if not exists auth_provider varchar(50) default 'email'");
  await query("alter table users alter column email drop not null");

  await query("alter table users add column if not exists role varchar(50) default 'user'");

  // Tạo bảng user_profiles nếu chưa tồn tại
  await query(`
    create table if not exists user_profiles (
      id uuid primary key default gen_random_uuid(),
      user_id uuid unique not null references users(id) on delete cascade,
      full_name varchar(255),
      avatar_url text,
      phone varchar(20),
      job_title varchar(255),
      industry varchar(255),
      experience_level varchar(50),
      location varchar(255),
      skills text,
      career_goal text,
      profile_completed boolean default false,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  // Bảng lưu OTP tạm thời - chưa tạo tài khoản chính thức
  await query(`
    create table if not exists otp_requests (
      email varchar(255) primary key,
      otp varchar(6) not null,
      otp_expiry timestamp not null,
      verified boolean default false,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  // Bảng blog_posts cho các bài viết career
  await query(`
    create table if not exists blog_posts (
      id uuid primary key default gen_random_uuid(),
      title varchar(500) not null,
      content text not null,
      excerpt text,
      category varchar(100) not null,
      author varchar(255) not null default 'JobReady AI',
      image_url text,
      created_at timestamp default now(),
      updated_at timestamp default now()
    )
  `);

  // Tạo indexes
  // Xóa unique constraint và unique index cũ trên email đơn lẻ (không còn phù hợp vì cho phép cùng email với provider khác nhau)
  await query("alter table users drop constraint if exists users_email_key");
  await query("drop index if exists idx_users_email");
  await query("drop index if exists idx_users_email_unique");
  // Unique composite: cùng email + cùng provider thì mới coi là trùng
  await query(
    "create unique index if not exists idx_users_email_provider on users(email, auth_provider) where email is not null"
  );
  await query("create unique index if not exists idx_users_google_id on users(google_id) where google_id is not null");
  await query("create unique index if not exists idx_users_phone on users(phone) where phone is not null");
  await query("create index if not exists idx_users_otp_verified on users(otp_verified)");
  await query("create index if not exists idx_user_profiles_user_id on user_profiles(user_id)");

  // Seed/Migrate default admin account if configured in env
  const adminEmail = process.env.ADMIN_EMAIL || "admin@jobreadyai.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    // 1. Tự động chuyển đổi tài khoản admin cũ từ phone sang email (nếu có)
    const oldAdminCheck = await query("select id, phone from users where role = 'admin' and phone is not null and email is null");
    if (oldAdminCheck.rows.length > 0) {
      console.log(`Migrating old admin account with phone ${oldAdminCheck.rows[0].phone} to email: ${adminEmail}`);
      await query(
        `update users set email = $1, phone = null, auth_provider = 'email', otp_verified = true, status = 'active' where role = 'admin'`,
        [adminEmail]
      );
    }

    // 2. Kiểm tra tài khoản admin theo email hiện tại
    const adminCheck = await query("select id, password_hash from users where email = $1 and auth_provider = 'email'", [adminEmail]);
    
    if (adminCheck.rows.length === 0) {
      console.log(`Seeding default admin account with email: ${adminEmail}`);
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await withTransaction(async (client) => {
        const userResult = await client.query(
          `
            insert into users (email, password_hash, auth_provider, otp_verified, status, role)
            values ($1, $2, 'email', true, 'active', 'admin')
            returning id
          `,
          [adminEmail, hashedPassword]
        );
        const adminUser = userResult.rows[0];
        
        await client.query(
          `
            insert into user_profiles (user_id, full_name, profile_completed)
            values ($1, 'System Administrator', true)
            on conflict (user_id) do update set profile_completed = true
          `,
          [adminUser.id]
        );
      });
      console.log("Admin account seeded successfully.");
    } else {
      // Admin exists, check if password in .env changed and update it in DB
      const adminUser = adminCheck.rows[0];
      const isPasswordSame = await bcrypt.compare(adminPassword, adminUser.password_hash);
      
      if (!isPasswordSame) {
        console.log(`Updating password for admin account with email: ${adminEmail}...`);
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await query("update users set password_hash = $1 where id = $2", [hashedPassword, adminUser.id]);
        console.log("Admin password updated successfully in database.");
      }
    }
  }

  // Seed sample blog posts if table is empty
  const blogCheck = await query("SELECT COUNT(*) as count FROM blog_posts");
  if (parseInt(blogCheck.rows[0].count) === 0) {
    console.log("Seeding sample blog posts...");
    const samplePosts = [
      {
        title: "10 Tiêu Chí Quan Trọng Khi Chọn CV Cho Nhà Tuyển Dụng",
        content: `Khi nhận được hàng trăm hồ sơ ứng tuyển, nhà tuyển dụng thường chỉ dành 6-10 giây để lướt qua mỗi CV. Dưới đây là 10 tiêu chí quan trọng giúp bạn hiểu điều gì khiến CV của bạn nổi bật:

1. Thông Tin Cá Nhân Rõ Ràng
Đảm bảo tên đầy đủ, số điện thoại, email liên lạc được đặt ở vị trí dễ thấy. Tránh thông tin thừa như số CMND, tình trạng hôn nhân (trừ khi công việc yêu cầu).

2. Tóm Tắt Chuyên Môn (Profile Summary)
Một đoạn tóm tắt 2-3 câu về bản thân,highlight kỹ năng chính và mục tiêu nghề nghiệp. Điều này giúp nhà tuyển dụng nắm bắt nhanh ai bạn và what you bring to the table.

3. Kinh Nghiệm Làm Việc Được Trình Bày Tốt
Sử dụng cấu trúc: Chức danh - Tên công ty - Thời gian - Mô tả công việc (với bullet points). Nhấn mạnh thành tích cụ thể bằng số liệu.

4. Kỹ Năng Phù Hợp Với Vị Trí
Liệt kê kỹ năng hard skills (kỹ thuật) và soft skills (mềm) phù hợp với job description. Scan từ khóa từ JD và đưa vào CV của bạn.

5. Học Vấn và Chứng Chỉ
Không cần chi tiết quá nhiều về thành tích học tập (trừ khi bạn mới tốt nghiệp). Tập trung vào chứng chỉ chuyên môn, khóa học liên quan.

6. Định Dạng Chuyên Nghiệp
Font dễ đọc (Arial, Calibri), cỡ chữ 10-12pt, lề đều, khoảng cách hợp lý. PDF là định dạng an toàn nhất để giữ format.

7. Không Có Lỗi Chính Tả
Đọc đi đọc lại nhiều lần. Sử dụng công cụ kiểm tra chính tả. Nhờ người khác đọc lại giúp bạn.

8. Độ Dài Phù Hợp
1-2 trang cho ứng viên có dưới 10 năm kinh nghiệm. Không cần 5 trang CV nếu bạn chỉ mới đi làm 3 năm.

9. Từ Khóa Theo JD
Nhiều công ty sử dụng ATS (Applicant Tracking System) để lọc CV. Đảm bảo CV của bạn chứa các từ khóa quan trọng từ job description.

10. Liên Kết Portfolio/Dự Án
Nếu bạn có portfolio online, đưa link vào CV. Đặc biệt quan trọng với các ngành IT, Design, Marketing.

Để tạo CV chuyên nghiệp với các tiêu chí trên, hãy sử dụng công cụ CV Builder của JobReady AI để tạo CV ấn tượng trong vài phút!`,
        excerpt: "Khám phá 10 tiêu chí quan trọng giúp CV của bạn gây ấn tượng với nhà tuyển dụng trong vòng vài giây đầu tiên.",
        category: "Tiêu chí chọn CV",
      },
      {
        title: "Cách Viết Mục Tiêu Nghề Nghiệp Thu Hút Nhà Tuyển Dụng",
        content: `Mục tiêu nghề nghiệp là phần ngắn gọn nhưng cực kỳ quan trọng trên CV. Nó định vị bạn là ai và what you want. Dưới đây là cách viết hiệu quả:

Tại Sao Mục Tiêu Nghề Nghiệp Quan Trọng?
- Giúp nhà tuyển dụng hiểu nhanh định hướng của bạn
- Thể hiện sự nghiêm túc và chuyên nghiệp
- Tạo ấn tượng đầu tiên tích cực

Cấu Trúc Một Mục Tiêu Hiệu Quả:
1. Vị trí mong muốn + Lĩnh vực
2. Kỹ năng chính mang lại
3. Giá trị bạn có thể đóng góp
4. Mục tiêu ngắn hạn (1-2 năm)

Ví Dụ Tốt:
"Kế toán tổng hợp với 3 năm kinh nghiệm trong lĩnh vực sản xuất. Thành thạo Excel nâng cao, phần mềm kế toán SAP. Tìm kiếm vị trí Kế toán trưởng để áp dụng kỹ năng quản lý tài chính và tối ưu quy trình."

Ví Dụ Xấu:
"Mong muốn làm việc trong môi trường chuyên nghiệp để phát triển bản thân và học hỏi kinh nghiệm."

Lưu Ý Quan Trọng:
- Điều chỉnh theo từng đơn ứng tuyển
- Không quá 3-4 dòng
- Sử dụng từ khóa từ job description
- Đặt ở vị trí đầu CV, sau thông tin cá nhân

Với JobReady AI, bạn có thể tạo mục tiêu nghề nghiệp chuẩn chỉnh dựa trên ngành nghề và vị trí mong muốn của mình!`,
        excerpt: "Hướng dẫn chi tiết cách viết mục tiêu nghề nghiệp ấn tượng, phù hợp với từng vị trí ứng tuyển.",
        category: "Tiêu chí xin việc",
      },
      {
        title: "7 Câu Hỏi Phỏng Vấn Thường Gặp Và Cách Trả Lời Hay",
        content: `Phỏng vấn là cơ hội để bạn thể hiện không chỉ năng lực mà còn cá tính và văn hóa phù hợp. Dưới đây là 7 câu hỏi phổ biến nhất và cách trả lời ấn tượng:

1. "Hãy giới thiệu về bản thân"
Không lặp lại toàn bộ CV. Tập trung vào 2-3 điểm mạnh liên quan trực tiếp đến vị trí ứng tuyển. Kết thúc bằng lý do bạn phù hợp với công việc này.

2. "Điểm mạnh và điểm yếu của bạn là gì?"
Điểm mạnh: Chọn 2-3 điểm phù hợp với job description, kèm ví dụ cụ thể.
Điểm yếu: Chọn điểm yếu thật nhưng không quá nghiêm trọng, và quan trọng là bạn đang cải thiện nó.

3. "Tại sao bạn muốn làm việc tại công ty chúng tôi?"
Nghiên cứu kỹ về công ty trước. Kết nối giá trị của bạn với mission/culture của công ty. Tránh nói về lương hay phúc lợi.

4. "Bạn thấy mình 5 năm tới ở đâu?"
Thể hiện ambtion phù hợp. Kết hợp giữa mục tiêu cá nhân và đóng góp cho công ty. Tránh quá khiêm tốn hoặc quá bay bổng.

5. "Mô tả một thử thách và cách bạn vượt qua nó"
Chọn một ví dụ liên quan đến công việc. Sử dụng STAR method: Situation, Task, Action, Result. Nhấn mạnh kết quả tích cực và bài học rút ra.

6. "Bạn có câu hỏi gì cho chúng tôi?"
LUÔN LUÔN có câu hỏi! Hỏi về đội nhóm, văn hóa công ty, cơ hội phát triển. Không hỏi về lương ở vòng đầu.

7. "Kể về một dự án thành công của bạn"
Chọn dự án thể hiện kỹ năng cần thiết cho vị trí. Mô tả rõ vai trò của bạn, không chỉ thành tích chung của team.

Mẹo Quan Trọng:
- Nghiên cứu kỹ job description và công ty
- Thực hành trước gương hoặc với người thân
- Chuẩn bị câu hỏi cho người phỏng vấn
- Ứng tuyển thử với tính năng Mock Interview của JobReady AI!`,
        excerpt: "Tổng hợp 7 câu hỏi phỏng vấn phổ biến nhất kèm theo cách trả lời chuyên nghiệp và ấn tượng.",
        category: "Mẹo phỏng vấn",
      },
      {
        title: "Xu Hướng Tuyển Dụng 2024-2025 Tại Việt Nam",
        content: `Thị trường lao động Việt Nam đang thay đổi nhanh chóng. Nắm bắt xu hướng giúp bạn chuẩn bị tốt hơn cho cơ hội nghề nghiệp:

1. Hybrid Work - Làm Việc Kết Hợp
Sau COVID, nhiều công ty áp dụng mô hình hybrid. 60% doanh nghiệp CNTT và 40% doanh nghiệp khác cho phép làm việc từ xa 2-3 ngày/tuần.

2. Kỹ Năng Số Hóa Là Bắt Buộc
Dù bạn làm ngành gì, kỹ năng số cơ bản như Excel nâng cao, công cụ collaboration (Slack, Notion), và hiểu biết về AI đang trở thành yêu cầu tối thiểu.

3. AI Skills - Kỹ Năng AI
Hiểu cách sử dụng AI tools (ChatGPT, Copilot) để tăng năng suất là lợi thế lớn. Nhiều JD mới bắt đầu yêu cầu "AI literacy".

4. Soft Skills Được Đề Cao
Kỹ năng mềm như giao tiếp, giải quyết vấn đề, tư duy phản biện khó đào tạo hơn hard skills. 92% HR cho biết soft skills quan trọng ngang hoặc hơn technical skills.

5. Upskilling và Reskilling
Học tập liên tục không còn là lựa chọn. Các khóa học online, certification từ Coursera, Udemy, LinkedIn Learning đang rất phổ biến.

6. Employer Branding Quan Trọng Hơn
Ứng viên ngày càng quan tâm đến văn hóa công ty, chế độ đãi ngộ, và cơ hội phát triển trước khi quyết định gia nhập.

7. Tech Roles Vẫn Dẫn Đầu
Software Engineer, Data Analyst, Cloud Engineer, Cybersecurity là những vị trí có nhu cầu cao nhất với mức lương top.

8. Green Jobs - Việc Xanh
Nhiều doanh nghiệp Việt Nam bắt đầu tuyển vị trí liên quan đến sustainability và ESG.

JobReady AI giúp bạn theo dõi các xu hướng này và chuẩn bị kỹ năng phù hợp với thị trường!`,
        excerpt: "Phân tích chi tiết các xu hướng tuyển dụng nổi bật tại Việt Nam 2024-2025 và cách ứng viên chuẩn bị.",
        category: "Xu hướng tuyển dụng",
      },
      {
        title: "Cách Trả Lời Câu Hỏi: 'Bạn Mong Muốn Mức Lương Bao Nhiêu?'",
        content: `Câu hỏi về mức lương thường khiến ứng viên lúng túng. Dưới đây là chiến lược trả lời thông minh:

Nguyên Tắc Vàng:
1. KHÔNG đưa ra con số đầu tiên nếu có thể
2. Nghiên cứu mức lương thị trường trước
3. Thể hiện sự linh hoạt nhưng biết giá trị của mình

Chiến Lược 1: Phản lại câu hỏi
"Hem Quân có thể cho biết mức lương cho vị trí này là bao nhiêu ạ?"
Điều này giúp bạn biết budget của công ty trước.

Chiến Lược 2: Đưa ra range (có cơ sở)
"Dựa trên research, mức lương phù hợp cho vị trí này với kinh nghiệm của tôi là 20-25 triệu. Tuy nhiên, Hem Quân có thể cho biết budget của công ty ạ?"

Chiến Lược 3: Nói về giá trị
"Tôi tin rằng mức lương sẽ phản ánh giá trị tôi mang lại. Với kỹ năng [liệt kê], tôi kỳ vọng mức [X] triệu và sẵn sàng thảo luận."

Chiến Lược 4: Đề cập total compensation
"Ngoài lương cơ bản, Hem Quân có thể cho biết các benefits khác như thế nào ạ? Điều đó sẽ giúp tôi đánh giá tổng package."

Khi Đã Phải Nói Số:
- Research trên các trang: Glassdoor, Vietnamwork, CareerViet
- Biết minimum acceptable salary (MAP) của bạn
- Luôn để buffer 10-15% để thương lượng
- Quan trọng: Biết bạn đáng giá bao nhiêu!

Sau Khi Nhận Offer:
- Đừng vội từ chối nếu chưa thương lượng
- Thể hiện sự hào hứng với công việc
- Đưa ra lý do hợp lý cho mức mong muốn cao hơn
- Sẵn sàng thương lượng về benefits nếu lương không linh hoạt

JobReady AI có công cụ research lương theo ngành và vị trí để bạn có basis vững khi thương lượng!`,
        excerpt: "Hướng dẫn chi tiết cách trả lời về mức lương mong muốn một cách chuyên nghiệp và có lợi nhất cho ứng viên.",
        category: "Tiêu chí xin việc",
      },
    ];

    for (const post of samplePosts) {
      await query(
        `INSERT INTO blog_posts (title, content, excerpt, category, author) VALUES ($1, $2, $3, $4, $5)`,
        [post.title, post.content, post.excerpt, post.category, "JobReady AI"]
      );
    }
    console.log("Sample blog posts seeded successfully!");
  }
}
