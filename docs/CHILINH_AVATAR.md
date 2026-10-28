# ChiLinh 3D trong phòng phỏng vấn

## Model và runtime

- `src/components/ChiLinhAvatar.tsx` thay placeholder robot trong `InterviewSessionPage.tsx`.
- Runtime nằm trong `public/chilinh/`, Three.js r180 + Meshopt decoder được lưu kèm; không phụ thuộc CDN khi chạy.
- GLB tải trực tiếp từ R2, không nằm trong repository. URL mặc định: `https://pub-f6001b97e5cc46cdaf48b42c033220e9.r2.dev/Model%20Linh/ChiLinh_Gesture_ArmFix_Final.glb`.
- Có thể ghi đè URL công khai bằng biến build `VITE_CHILINH_MODEL_URL`. Không đặt R2 access key/secret vào biến VITE.
- Giữ model, morph, material và clip nguyên bản; runtime áp ngân sách răng/lưỡi, corrective và Cheek_* từ schema đã duyệt. Giữ đủ 71 bone, gồm bone xoắn cẳng tay.
- Mắt tự chớp chu kỳ 5 giây; miệng dùng transcript tiếng Việt và đồng hồ PCM phát thực tế, má đi theo viseme, tay dùng các clip gesture hiện có. Không phát đồng thời clip `blink` và `talk` vào cùng morph binding.
- Transcript Gemini không có timestamp âm vị: đồng bộ khẩu hình theo âm tiết là xấp xỉ, không phải forced alignment. Khi chưa có transcript, dùng độ mở hàm nhỏ theo mức âm thanh; khi ngừng/hủy phát, miệng nghỉ và tay hạ về bàn.
- Tái dùng hình học tay đã duyệt. Các gesture `hand_chest`/`point_soft` chưa có trong model sẽ không được chạy.
- Driver được dịch thành hàm JS tĩnh trong `driver_expressions.js`; không cần `eval`, `new Function` hay nới CSP.
- CSP `connectSrc` của Express thêm `blob:` để GLTFLoader đọc texture nhúng được tạo từ chính GLB; không thêm `unsafe-eval` hoặc origin bên ngoài mới.

## CORS R2

Trong bucket Settings → CORS Policy → Add CORS policy → JSON:

```json
[
  {
    "AllowedOrigins": ["https://jobreadyai.vn", "https://www.jobreadyai.vn", "http://localhost:3000", "http://127.0.0.1:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["Content-Length", "ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Nếu dùng preview domain khác, thêm origin preview đó vào policy. Public URL không đồng nghĩa đã có CORS. Trình duyệt tải model lần đầu khoảng 23 MB.

## Chạy và triển khai

1. `npm run dev` rồi mở phòng phỏng vấn tại `http://localhost:3000/interview/session` bằng tài khoản hợp lệ.
2. `npm run build` để kiểm tra TypeScript/Vite.
3. Xem diff và commit các file tích hợp. Chưa cần đưa GLB vào Git.
4. Push lên nhánh triển khai sau khi duyệt. Vercel chỉ tự deploy khi project đã liên kết repo/nhánh tương ứng.

## Bảo toàn và xử lý lỗi

- Không thay đổi auth, nội dung AI, API, quota hay cơ chế ghi phiên phỏng vấn.
- Audio telemetry chỉ đọc clock/RMS của PCM đã xếp lịch; không thay đổi lịch phát hay mute.
- postMessage kiểm tra cả origin và đúng iframe; không có demo route bỏ qua đăng nhập.
- Khi lỗi mạng/CORS/WebGL, hiển thị thông báo và nút tải lại, không chặn nút gọi.
- Runtime dừng animation khi tab bị ẩn và giải phóng WebGL khi rời trang.
- Các giấy phép Three.js/Meshopt được giữ trong `public/chilinh/vendor/three180/LICENSE` và `public/chilinh/licenses/Meshopt_LICENSE.md`.

## Bố cục văn phòng và tiếp xúc bàn

- `office-interview-v1.webp`: hậu cảnh văn phòng được tạo riêng, lưu cùng source; không có CDN ảnh bên ngoài.
- Camera nghiêng xuống 8° để thấy mặt bàn; mép dưới crop tại mặt trước bàn, hai đầu bàn phủ kín khung. Chỉ scale bàn ở runtime nếu khung quá rộng.
- Đọc skinning hai bàn tay tại tư thế nghỉ để nâng bàn hiển thị tới cách tay thấp nhất 0,3 mm (giới hạn nâng 12 mm); thêm bóng tiếp xúc nhẹ, mờ dần khi tay giơ lên.
- Không sửa GLB R2, bone, key, clip hoặc trọng số da. Các vị trí bàn/camera là chỉnh riêng ở runtime web.

## Vị trí lưng ghế

- `ChairBack` lùi 60 mm khỏi phía bàn trong runtime; hạ vừa đủ (giới hạn 25–60 mm) để mép cắt dưới khuất sau mặt bàn theo góc camera hiện tại.
- Giữ nguyên camera, nhân vật, tiếp xúc tay–bàn, GLB và các clip. Offset ghế được áp lại sau facial controller để không bị reset mỗi frame.
- File nguồn chỉ có phần lưng ghế đã cắt; thay đổi này xử lý vị trí hiển thị, không dựng thêm chân ghế hay sửa model.

## Chân dung góc trái

- `public/chilinh/chilinh-avatar-v1.webp`: ảnh 512 × 512 nền trong suốt, render cận mặt trực tiếp từ model đã duyệt, không tạo lại khuôn mặt bằng AI.
- Ảnh hiển thị trong khung tròn 40 × 40 ở header phòng phỏng vấn, thay riêng biểu tượng robot tại đây; không thêm renderer 3D thứ hai.
