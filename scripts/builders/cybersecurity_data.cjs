const { q, SRC } = require('./fe_data.cjs');

const SEC_SRC = {
  owasp: "https://owasp.org/www-project-top-ten/",
  nist_csf: "https://www.nist.gov/cyberframework",
  nist_zero_trust: "https://csrc.nist.gov/pubs/sp/800/207/final",
  mitre_attack: "https://attack.mitre.org/",
  sans_ir: "https://www.sans.org/white-papers/33342/",
  aws_sec: "https://docs.aws.amazon.com/security/",
  k8s_sec: "https://kubernetes.io/docs/concepts/security/",
  iso27001: "https://www.iso.org/standard/27001",
  internal: "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
};

// 1. SECURITY ENGINEER
const secEngineerQuestions = [
  // Foundation (6)
  q("SEC_ENG-FOUND-01", "Security Engineer", "foundation", "intermediate", "junior",
    "Mô hình Phòng thủ chiều sâu (Defense in Depth) và Nguyên tắc Đặc quyền tối thiểu (Least Privilege): Cách phân tầng bảo vệ từ vòng ngoài (Perimeter), Mạng (Network), Máy chủ (Host), Ứng dụng (Application) đến Dữ liệu (Data)?",
    ["Hiểu rõ không có một giải pháp đơn lẻ nào an toàn tuyệt đối; cần xếp lớp nhiều hàng rào phòng thủ độc lập", "Least Privilege: Chỉ cấp đúng và đủ quyền hạn cần thiết để thực hiện công việc, thu hồi quyền ngay khi hết nhiệm vụ", "Áp dụng phân đoạn mạng (VLANs, DMZ) để ngăn chặn kẻ tấn công di chuyển ngang (Lateral Movement) nếu một tầng bị chọc thủng"],
    ["Tại sao việc tin tưởng tuyệt đối vào mạng nội bộ (Internal Corporate Network) là sai lầm chết người trong kỷ nguyên hiện đại?", "Sự khác biệt giữa Tường lửa thế hệ mới (NGFW) và Tường lửa ứng dụng web (WAF)?"],
    ["Defense in Depth", "Least Privilege", "Network Segmentation", "DMZ", "Lateral Movement"],
    [SEC_SRC.nist_csf, SEC_SRC.internal],
    ["Cho rằng chỉ cần cài một con tường lửa xịn ở cổng mạng là toàn bộ hệ thống bên trong đã an toàn"]
  ),
  q("SEC_ENG-FOUND-02", "Security Engineer", "foundation", "intermediate", "junior",
    "Nguyên lý vận hành của Tường lửa ứng dụng web (WAF) và Tường lửa thế hệ mới (NGFW): Phân biệt tầng hoạt động (Layer 7 vs Layer 3/4), cơ chế phát hiện dựa trên chữ ký (Signature-based) và dựa trên hành vi bất thường (Anomaly-based). Cách WAF ngăn chặn các cuộc tấn công SQL Injection và Cross-Site Scripting (XSS)?",
    ["NGFW hoạt động ở tầng 3/4/7 nhưng tập trung vào kiểm soát luồng mạng IP/Port/App-ID; WAF chuyên sâu ở tầng 7 phân tích sâu payload HTTP/HTTPS", "WAF giải mã SSL/TLS, phân tích cú pháp request URL, headers, body và đối chiếu với bộ luật (như OWASP Core Rule Set - CRS)", "Phát hiện SQLi qua các mẫu ký tự đặc biệt (' OR 1=1) và XSS qua các thẻ script độc hại"],
    ["Làm thế nào để giảm thiểu tỷ lệ báo động giả (False Positive) của WAF mà không làm suy yếu khả năng chặn đứng tấn công?", "WAF xử lý thế nào trước các cuộc tấn công từ chối dịch vụ HTTP Flood tầng 7 (Layer 7 DDoS)?"],
    ["WAF", "NGFW", "Layer 7 Security", "OWASP CRS", "SQLi Prevention"],
    [SEC_SRC.owasp, "https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/"],
    ["Nhầm lẫn WAF với Tường lửa mạng thông thường và nghĩ rằng bật WAF là không cần vá lỗ hổng trong code"]
  ),
  q("SEC_ENG-FOUND-03", "Security Engineer", "foundation", "advanced", "middle",
    "Cơ chế Quản lý khóa mật mã và Hạ tầng khóa công khai (PKI & TLS 1.3): Quá trình bắt tay (TLS Handshake) diễn ra như thế nào? Sự khác biệt giữa Mã hóa đối xứng (AES-GCM) và Bất đối xứng (RSA/ECC)? Tại sao thuộc tính Bí mật chuyển tiếp hoàn hảo (Perfect Forward Secrecy - PFS) lại quan trọng?",
    ["Nắm chắc luồng bắt tay TLS 1.3 tinh gọn (1-RTT hoặc 0-RTT); dùng mã hóa bất đối xứng để xác thực danh tính chứng chỉ và trao đổi khóa", "Dùng mã hóa đối xứng (AES-GCM / ChaCha20) để mã hóa luồng dữ liệu thực tế vì tốc độ xử lý nhanh", "PFS đảm bảo rằng nếu Private Key của server bị lộ trong tương lai thì các phiên trao đổi dữ liệu đã ghi lại trong quá khứ vẫn không thể bị giải mã"],
    ["Khi nào nên sử dụng xác thực hai chiều mTLS (Mutual TLS) thay vì TLS một chiều truyền thống?", "Quy trình kiểm tra tính hợp lệ của chứng chỉ số qua CRL và OCSP Stapling?"] ,
    ["TLS 1.3", "PKI", "Perfect Forward Secrecy", "mTLS", "Cryptography"],
    ["https://www.rfc-editor.org/rfc/rfc8446", SEC_SRC.internal],
    ["Nghĩ rằng mã hóa bất đối xứng được dùng để mã hóa toàn bộ dữ liệu truyền tải trên đường truyền"]
  ),
  q("SEC_ENG-FOUND-04", "Security Engineer", "foundation", "intermediate", "middle",
    "Quản lý vòng đời lỗ hổng bảo mật (Vulnerability Management Lifecycle): Các bước từ Khám phá tài sản (Asset Discovery), Quét lỗ hổng (Vulnerability Scanning), Đánh giá mức độ nghiêm trọng (CVSS v3.1 Scoring: Base, Temporal, Environmental), đến Khắc phục (Remediation) và Xác minh lại?",
    ["Asset Discovery: Không thể bảo vệ những gì mình không biết; kiểm kê đầy đủ IP, domain, máy chủ và dịch vụ đang mở", "Quét định kỳ bằng các công cụ chuyên nghiệp (Nessus, Qualys, OpenVAS)", "CVSS v3.1: Không chỉ nhìn vào Base Score (từ 0-10); phải xem xét Temporal (đã có mã khai thác công khai chưa) và Environmental (hệ thống có nằm trực diện Internet không) để ưu tiên vá lỗi"],
    ["Làm thế nào để thiết lập Thỏa thuận mức dịch vụ khắc phục lỗi (SLA Remediation: Critical trong 24h, High trong 7 ngày)?", "Sự khác biệt giữa Quét lỗ hổng tự động (Vulnerability Assessment) và Tấn công khai thác thực tế (Penetration Testing)?"] ,
    ["Vulnerability Management", "CVSS v3.1", "Nessus", "Asset Discovery", "Remediation SLA"],
    ["https://www.first.org/cvss/", SEC_SRC.nist_csf],
    ["Chỉ biết bấm nút chạy máy quét và gửi file xuất PDF dày 200 trang cho dev mà không có phân loại ưu tiên"]
  ),
  q("SEC_ENG-FOUND-05", "Security Engineer", "foundation", "advanced", "senior_lead",
    "Kiến trúc Không tin cậy (Zero Trust Architecture - ZTA theo NIST SP 800-207): Ba nguyên tắc cốt lõi: Xác thực liên tục (Verify explicitly), Sử dụng quyền hạn tối thiểu (Use least privileged access), và Luôn giả định có vi phạm (Assume breach). Thành phần Policy Engine (PE), Policy Administrator (PA) và Policy Enforcement Point (PEP) phối hợp ra sao?",
    ["Loại bỏ khái niệm mạng tin cậy: Mọi kết nối từ bên trong hay bên ngoài văn phòng đều bị đối xử bình đẳng như nhau và phải được xác thực danh tính", "PEP chặn luồng kết nối; PA/PE đánh giá ngữ cảnh động (Thiết bị có an toàn không, vị trí địa lý, hành vi bất thường) trước khi cấp phiên truy cập ngắn hạn", "Assume breach: Mã hóa toàn bộ dữ liệu lưu trữ và truyền tải, phân đoạn siêu nhỏ (Micro-segmentation) để cô lập thảm họa"],
    ["Làm thế nào để chuyển đổi từ mạng VPN truyền thống sang giải pháp ZTNA (Zero Trust Network Access)?", "Tại sao việc áp dụng Zero Trust bắt buộc phải lấy Định danh (Identity) làm chu vi bảo mật mới (New Perimeter)?"] ,
    ["Zero Trust", "NIST SP 800-207", "ZTNA", "Micro-segmentation", "Assume Breach"],
    [SEC_SRC.nist_zero_trust, SEC_SRC.internal],
    ["Nghĩ rằng mua một thiết bị dán nhãn 'Zero Trust' cắm vào mạng là xong mà không hiểu đây là một triết lý kiến trúc"]
  ),
  q("SEC_ENG-FOUND-06", "Security Engineer", "foundation", "intermediate", "junior",
    "Bảo mật Hệ điều hành và Thiết lập cấu hình chuẩn (System Hardening & CIS Benchmarks): Những biện pháp tăng cường an ninh cơ bản cho máy chủ Linux (Ubuntu/RHEL) trong môi trường sản xuất (Tắt dịch vụ thừa, Cấu hình SSH an toàn, Quản lý Sudoers, Cấu hình UFW/iptables, SELinux/AppArmor)?",
    ["Tuân thủ chuẩn CIS Benchmarks: Tắt toàn bộ cổng mạng và dịch vụ không sử dụng (rsh, telnet, ftp)", "Bảo mật SSH: Đổi cổng mặc định, cấm đăng nhập bằng mật khẩu (chỉ dùng SSH Key), cấm root login trực tiếp (PermitRootLogin no), giới hạn dải IP truy cập", "Bật chế độ bắt buộc (Enforcing Mode) của SELinux hoặc AppArmor để giới hạn quyền hạn của các tiến trình dịch vụ dù bị chiếm quyền"],
    ["Làm thế nào để tự động hóa việc rà soát tuân thủ CIS Benchmarks trên hàng trăm máy chủ bằng Ansible hoặc Lynis?", "Cách cấu hình công cụ auditd để ghi vết các hành vi thay đổi file hệ thống quan trọng (/etc/passwd, /etc/shadow)?"] ,
    ["System Hardening", "CIS Benchmarks", "Linux Security", "SELinux", "SSH Hardening"],
    ["https://www.cisecurity.org/cis-benchmarks", SEC_SRC.internal],
    ["Để máy chủ Linux chạy cấu hình mặc định, cho phép đăng nhập root qua mật khẩu đơn giản"]
  ),

  // Practical Skills (8)
  q("SEC_ENG-SKILL-01", "Security Engineer", "practical_skills", "advanced", "middle",
    "Khi cấu hình Tường lửa ứng dụng web Cloudflare WAF hoặc AWS WAF, em xây dựng bộ quy tắc tùy biến (Custom Rules) và tỷ lệ giới hạn (Rate Limiting Rules) như thế nào để chặn đứng một đợt tấn công dò mật khẩu (Brute-force) vào endpoint `/api/login` mà không làm ảnh hưởng đến người dùng hợp lệ?",
    ["Tạo Rate Limiting rule nhắm vào URI Path `/api/login` với phương thức POST: giới hạn tối đa 5 requests trong 1 phút trên mỗi IP nguồn", "Hành động (Action): Áp dụng Managed Challenge (CAPTCHA thông minh) hoặc Block tạm thời trong 15 phút nếu vượt ngưỡng", "Kết hợp lọc theo vị trí địa lý (Geo-blocking) hoặc kiểm tra chỉ số tín nhiệm IP (IP Threat Intelligence / ASN) để chặn các mạng botnet"],
    ["Làm thế nào để xử lý tình huống các công ty lớn có hàng nghìn nhân viên cùng chia sẻ một địa chỉ IP NAT công khai?", "Cách cấu hình AWS WAF WebACL kết hợp AWS Shield Advanced để chống DDoS đa tầng?"] ,
    ["AWS WAF", "Cloudflare WAF", "Rate Limiting", "Brute-force Defense", "Managed Challenge"],
    [SEC_SRC.owasp, SEC_SRC.aws_sec],
    ["Chặn thẳng tay toàn bộ IP khi thấy traffic cao làm người dùng văn phòng lớn bị vạ lây không đăng nhập được"]
  ),
  q("SEC_ENG-SKILL-02", "Security Engineer", "practical_skills", "advanced", "middle",
    "Triển khai Giải pháp Phân đoạn mạng nội bộ (Micro-segmentation) và Quản lý Tường lửa phân tán: Em sử dụng VLANs, ACLs trên Switch và Tường lửa Palo Alto / Fortinet như thế nào để cách ly hoàn toàn vùng Cơ sở dữ liệu (Database Zone) khỏi mạng văn phòng và vùng Internet công cộng?",
    ["Thiết kế mô hình 3 vùng: Vùng DMZ (chứa Web server), Vùng Ứng dụng (App server), và Vùng Dữ liệu nhạy cảm (DB Zone)", "Quy tắc tường lửa nghiêm ngặt: Chỉ cho phép App server kết nối tới DB qua đúng cổng chuyên dụng (vd: 5432/3306), cấm toàn bộ kết nối trực tiếp từ DMZ hoặc mạng người dùng nội bộ", "Mọi luồng quản trị DB từ máy kỹ sư phải đi qua máy chủ nhảy có xác thực đa yếu tố (Jump Host / Bastion Host) có ghi hình phiên làm việc"],
    ["Làm thế nào để thiết lập chính sách Zero Trust Network Access (ZTNA) thay thế cho Bastion Host truyền thống?", "Cách cấu hình tính năng kiểm tra sâu gói tin SSL Inbound/Outbound Inspection trên tường lửa thế hệ mới?"] ,
    ["Micro-segmentation", "Palo Alto", "Fortinet", "DMZ Architecture", "Bastion Host"],
    [SEC_SRC.nist_csf, SEC_SRC.internal],
    ["Đặt cơ sở dữ liệu chung mạng subnet với máy chủ web công khai hoặc cho phép bất kỳ ai trong mạng LAN kết nối thẳng tới DB"]
  ),
  q("SEC_ENG-SKILL-03", "Security Engineer", "practical_skills", "intermediate", "middle",
    "Quy trình Quét lỗ hổng hạ tầng định kỳ bằng Nessus hoặc Qualys: Em cấu hình chính sách quét có xác thực (Credentialed / Authenticated Scan) và không xác thực (Non-credentialed Scan) ra sao? Cách tối ưu hóa băng thông để quá trình quét không làm nghẽn mạng hoặc sập dịch vụ đang chạy?",
    ["Quét Non-credentialed: Đóng vai trò kẻ tấn công bên ngoài, chỉ quét các cổng mở và banner dịch vụ", "Quét Credentialed: Cung cấp tài khoản SSH/Windows an toàn để máy quét kiểm tra sâu vào phiên bản phần mềm, bản vá OS và cấu hình registry bên trong", "Tối ưu hóa: Lên lịch quét vào ban đêm/cuối tuần, giới hạn số lượng hosts quét đồng thời (Max Concurrent Hosts = 10) và tắt các plugin kiểm tra từ chối dịch vụ nguy hiểm (DoNS plugins)"],
    ["Tại sao kết quả quét Authenticated lại phát hiện được nhiều lỗ hổng hơn gấp 5 lần so với Unauthenticated?", "Cách tự động xuất kết quả quét và đồng bộ hóa ticket xử lý lỗ hổng vào hệ thống Jira của team IT Ops?"] ,
    ["Nessus Scan", "Qualys", "Credentialed Scanning", "Safe Scanning Policy", "Vulnerability Assessment"],
    ["https://docs.tenable.com/nessus/", SEC_SRC.internal],
    ["Chạy quét lỗ hổng với tốc độ tối đa vào giờ cao điểm làm sập toàn bộ dịch vụ web của công ty"]
  ),
  q("SEC_ENG-SKILL-04", "Security Engineer", "practical_skills", "advanced", "senior_lead",
    "Thiết kế và Triển khai Hệ thống Xác thực Đa yếu tố (Multi-Factor Authentication - MFA) cấp doanh nghiệp: Em tích hợp Identity Provider (Okta, Microsoft Entra ID) với các giao thức SAML 2.0 / OIDC như thế nào? Tại sao việc chuyển dịch sang FIDO2 / WebAuthn (Passkeys / Khóa bảo mật phần cứng YubiKey) là giải pháp duy nhất chống được tấn công Phishing-resistant?",
    ["MFA qua SMS OTP hoặc email dễ bị vượt qua bằng kỹ thuật SIM Swap hoặc các trang web lừa đảo trung gian (Adversary-in-the-Middle - AitM Phishing)", "FIDO2 / WebAuthn gắn liền việc xác thực với tên miền gốc của trang web thông qua mật mã khóa công khai; hacker dù dựng trang lừa đảo y hệt cũng không thể lấy được chữ ký hợp lệ", "Cấu hình chính sách truy cập có điều kiện (Conditional Access Policies): bắt buộc dùng FIDO2 đối với các tài khoản quản trị hệ thống quan trọng"],
    ["Quá trình trao đổi assertion trong SAML 2.0 diễn ra như thế nào giữa Service Provider (SP) và Identity Provider (IdP)?", "Làm thế nào để thiết lập quy trình cấp lại khóa bảo mật khẩn cấp khi nhân viên làm mất YubiKey?"] ,
    ["MFA", "FIDO2", "WebAuthn", "Phishing-resistant", "YubiKey", "Okta / Entra ID"],
    ["https://fidoalliance.org/fido2/", "https://www.okta.com/products/single-sign-on/"],
    ["Chỉ dùng SMS OTP làm lớp xác thực thứ hai cho các tài khoản quản trị nhạy cảm"]
  ),
  q("SEC_ENG-SKILL-05", "Security Engineer", "practical_skills", "intermediate", "middle",
    "Cấu hình Hệ thống Phát hiện và Ngăn chặn Xâm nhập (IDS/IPS với Snort / Suricata / Zeek): Em viết các bộ luật (Rules syntax) để phát hiện hành vi quét cổng (Port Scan) hoặc phát hiện mã độc liên lạc với máy chủ điều khiển (C2 Beaconing) qua DNS Tunneling như thế nào?",
    ["Viết rule Suricata/Snort chuẩn xác: alert dns $HOME_NET any -> any 53 (msg:'DNS Tunneling Query Detected'; content:'|00 01|'; pcre:'/.../'; threshold:...)", "Phát hiện DNS Tunneling: giám sát độ dài bất thường của chuỗi truy vấn tên miền con (High Entropy Subdomain) và khối lượng truy vấn TXT record tăng đột biến", "Triển khai ở chế độ Inline (IPS) để tự động thả gói tin (Drop packet) hoặc chế độ SPAN/TAP (IDS) để cảnh báo mà không làm gián đoạn đường truyền"],
    ["Sự khác biệt giữa Zeek (phân tích giao thức mạng chuyên sâu) và Suricata (đối chiếu chữ ký gói tin)?", "Làm thế nào để điều chỉnh ngưỡng threshold nhằm loại bỏ cảnh báo giả khi có công cụ nội bộ quét mạng định kỳ?"] ,
    ["Suricata", "Snort", "IDS/IPS", "DNS Tunneling", "Network Signatures"],
    ["https://suricata.io/", SEC_SRC.internal],
    ["Bật toàn bộ 50,000 rules có sẵn trong IDS mà không tinh chỉnh khiến máy chủ quá tải CPU và tràn ngập cảnh báo giả"]
  ),
  q("SEC_ENG-SKILL-06", "Security Engineer", "practical_skills", "advanced", "middle",
    "Quản lý Khóa mã hóa và Bí mật doanh nghiệp (Enterprise Secrets Management): Em triển khai HashiCorp Vault hoặc AWS KMS như thế nào để loại bỏ hoàn toàn mật khẩu và API Keys viết cứng trong mã nguồn? Cơ chế tạo Secret động (Dynamic Secrets) và tự động xoay vòng khóa (Key Rotation) hoạt động ra sao?",
    ["Tích hợp HashiCorp Vault với Kubernetes qua Vault Agent Sidecar để tự động tiêm secrets vào biến môi trường của container", "Dynamic Secrets: Vault tự động tạo tài khoản cơ sở dữ liệu tạm thời có thời hạn sống (TTL) 1 giờ cho ứng dụng; hết giờ tự động thu hồi", "Cấu hình tự động xoay vòng khóa mã hóa (Key Rotation 90 ngày) trong AWS KMS mà không làm gián đoạn khả năng giải mã dữ liệu cũ"],
    ["Thuật toán Shamir's Secret Sharing được sử dụng như thế nào trong cơ chế Unseal của Vault?", "Làm thế nào để thiết lập quy trình kiểm toán (Audit Log) theo dõi xem ai đã đọc secret nào trong Vault?"] ,
    ["HashiCorp Vault", "AWS KMS", "Dynamic Secrets", "Secrets Management", "Key Rotation"],
    ["https://developer.hashicorp.com/vault/docs", SEC_SRC.aws_sec],
    ["Lưu trữ mật khẩu cơ sở dữ liệu trong file cấu hình .env đưa lên GitHub công khai"]
  ),
  q("SEC_ENG-SKILL-07", "Security Engineer", "practical_skills", "intermediate", "junior",
    "Bảo mật Hệ thống Thư điện tử doanh nghiệp (Email Security): Em cấu hình bộ ba bản ghi SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail) và DMARC (Domain-based Message Authentication, Reporting, and Conformance) trên DNS như thế nào để ngăn chặn kẻ xấu giả mạo tên miền công ty gửi email lừa đảo (Email Spoofing)?",
    ["SPF: Khai báo danh sách các địa chỉ IP máy chủ được phép gửi email thay mặt cho tên miền (v=spf1 ip4:... -all)", "DKIM: Ký số mã hóa vào header của email bằng Private Key; máy chủ nhận đối chiếu chữ ký bằng Public Key trên DNS record", "DMARC: Định nghĩa chính sách xử lý khi SPF/DKIM thất bại (p=none để theo dõi, p=quarantine đưa vào spam, p=reject từ chối thẳng) và nhận báo cáo định kỳ"],
    ["Tại sao việc đặt chính sách DMARC là p=none trong nhiều năm không có tác dụng bảo vệ tên miền?", "Cách xử lý xung đột SPF khi công ty sử dụng nhiều dịch vụ gửi mail bên thứ ba (SendGrid, Mailchimp, Google Workspace)?"] ,
    ["Email Security", "DMARC", "SPF", "DKIM", "Anti-spoofing"],
    ["https://dmarc.org/", SEC_SRC.internal],
    ["Cấu hình SPF dạng `+all` cho phép bất kỳ ai trên thế giới cũng có thể mạo danh tên miền của công ty gửi email"]
  ),
  q("SEC_ENG-SKILL-08", "Security Engineer", "practical_skills", "advanced", "senior_lead",
    "Thiết kế Giải pháp Bảo mật Truy cập Từ xa an toàn (Secure Remote Access): So sánh giữa mô hình VPN truyền thống (IPsec / OpenVPN) và Giải pháp Mạng riêng ảo Zero Trust (ZTNA / BeyondCorp). Em kiến trúc giải pháp ZTNA với Cloudflare Access hoặc Zscaler để bảo vệ ứng dụng nội bộ công ty như thế nào?",
    ["VPN truyền thống cấp quyền truy cập toàn bộ mạng LAN sau khi kết nối, tạo nguy cơ lây lan diện rộng nếu máy nhân viên nhiễm mã độc", "ZTNA cấp quyền truy cập theo từng ứng dụng cụ thể (Application-specific), không cấp quyền vào tầng mạng LAN; kết nối qua Reverse Proxy an toàn", "Kiểm tra tình trạng thiết bị (Device Posture Check: máy phải cài phần mềm EDR, bật mã hóa ổ đĩa BitLocker, cập nhật OS mới nhất) trước khi cho phép truy cập"],
    ["Làm thế nào để triển khai ZTNA cho các giao thức không phải nền web (SSH, RDP, Database) một cách mượt mà?", "Cách xử lý khi nhân viên làm việc tại các quốc gia có kiểm duyệt mạng internet gắt gao?"] ,
    ["ZTNA", "Cloudflare Access", "Zscaler", "BeyondCorp", "Secure Remote Access"],
    [SEC_SRC.nist_zero_trust, "https://www.cloudflare.com/learning/access-management/what-is-ztna/"],
    ["Cấp quyền VPN toàn mạng không kèm kiểm tra bảo mật máy trạm cho tất cả nhân viên làm việc từ xa"]
  ),

  // Scenario (6)
  q("SEC_ENG-SCEN-01", "Security Engineer", "scenario", "advanced", "middle",
    "Tình huống: Hệ thống phát hiện một máy chủ Web công khai trong vùng DMZ có dấu hiệu bị chiếm quyền điều khiển và đang cố gắng quét cổng (Port Scanning) để kết nối tới các máy chủ trong vùng mạng nội bộ (LAN). Nếu là Security Engineer phụ trách hạ tầng, các bước cô lập và ngăn chặn tức thời của em diễn ra thế nào?",
    ["Bước 1: Cô lập mạng khẩn cấp: cập nhật ngay quy tắc tường lửa (Firewall rule) chặn toàn bộ lưu lượng Outbound từ máy chủ bị nhiễm sang mạng LAN và Internet, nhưng giữ nguyên kết nối quản trị cô lập để phục vụ điều tra", "Bước 2: Không vội tắt nguồn máy chủ; tiến hành trích xuất ảnh bộ nhớ RAM (Memory Dump) để bảo toàn chứng cứ số", "Bước 3: Rà soát toàn bộ các máy chủ khác trong cùng subnet xem có dấu hiệu bị xâm nhập tương tự hay không; thu hồi ngay lập tức các tài khoản hoặc chứng chỉ dịch vụ lưu trên máy chủ DMZ đó"],
    ["Làm thế nào để tự động hóa việc cô lập máy chủ này thông qua tích hợp API giữa EDR và Tường lửa?", "Sau khi cô lập, quy trình dựng lại máy chủ mới sạch từ bản sao lưu an toàn diễn ra ra sao?"] ,
    ["Containment", "DMZ Breach", "Lateral Movement Blocking", "Memory Forensics", "Incident Isolation"],
    [SEC_SRC.internal, SEC_SRC.sans_ir],
    ["Tắt phụt nguồn máy chủ hoặc cài lại hệ điều hành ngay lập tức làm xóa sạch toàn bộ chứng cứ số trong RAM"]
  ),
  q("SEC_ENG-SCEN-02", "Security Engineer", "scenario", "advanced", "senior_lead",
    "Tình huống: Công ty chuẩn bị chuyển dịch toàn bộ hệ thống lõi từ On-Premises lên hạ tầng đám mây AWS. Ban giám đốc yêu cầu phải thiết kế kiến trúc bảo mật đạt chuẩn ngay từ đầu. Em thiết kế mô hình tài khoản AWS (AWS Multi-Account với AWS Organizations, Landing Zone), mạng kết nối an toàn (Transit Gateway, VPC Peering) và phân quyền IAM như thế nào?",
    ["Tách biệt môi trường thành nhiều tài khoản AWS độc lập (Security Account, Log Archive, Shared Services, Dev, Staging, Prod)", "Kết nối mạng tập trung bằng AWS Transit Gateway kết hợp Centralized Egress/Ingress VPC có cài đặt tường lửa kiểm soát lưu lượng", "Quản lý định danh tập trung qua AWS IAM Identity Center tích hợp IdP doanh nghiệp; cấm tuyệt đối việc tạo IAM User cố định có Access Key dài hạn trong các tài khoản môi trường"],
    ["Làm thế nào để kích hoạt AWS GuardDuty, Security Hub và AWS Config trên toàn bộ các tài khoản tự động?", "Cách bảo vệ tài khoản gốc Root Account (khóa trong két sắt, thiết lập MFA vật lý, cảnh báo khi có đăng nhập)?"] ,
    ["AWS Landing Zone", "Multi-Account Security", "Transit Gateway", "IAM Identity Center", "Cloud Architecture"],
    [SEC_SRC.aws_sec, SEC_SRC.internal],
    ["Nhồi nhét toàn bộ môi trường Dev, Test, Prod vào một tài khoản AWS duy nhất và dùng chung một mạng VPC"]
  ),
  q("SEC_ENG-SCEN-03", "Security Engineer", "scenario", "intermediate", "middle",
    "Tình huống: Một đợt quét lỗ hổng phát hiện ra lỗ hổng thực thi mã từ xa cực kỳ nghiêm trọng (Critical RCE - ví dụ Log4Shell) tồn tại trên một dịch vụ thanh toán quan trọng. Tuy nhiên, đội ngũ phát triển thông báo rằng họ cần ít nhất 3 ngày để kiểm thử bản vá code trước khi deploy. Em triển khai các biện pháp phòng vệ tạm thời (Virtual Patching) trên tầng mạng ra sao trong lúc chờ bản vá?",
    ["Triển khai Virtual Patching ngay lập tức trên WAF: tạo custom rule chặn tất cả các request chứa chuỗi payload khai thác đặc trưng (vd: `${jndi:ldap:...}`)", "Cấu hình hạn chế lưu lượng mạng ở tầng hệ điều hành/mạng: chặn kết nối Outbound từ máy chủ ứng dụng ra Internet (chặn cổng 389, 636, 1099, 1389) để kẻ tấn công không thể tải mã độc từ máy chủ C2 về", "Bật tính năng giám sát tăng cường (Enhanced Monitoring) và đặt cảnh báo khẩn cấp cho bất kỳ tiến trình con bất thường nào được sinh ra từ dịch vụ"],
    ["Tại sao Virtual Patching chỉ là giải pháp tình thế và không thể thay thế cho việc vá code gốc?", "Làm thế nào để kiểm chứng rule WAF mới tạo không gây lỗi chặn nhầm các giao dịch thanh toán hợp lệ?"] ,
    ["Virtual Patching", "WAF Rule", "Log4Shell Mitigation", "Zero-day Defense", "Compensating Controls"],
    [SEC_SRC.owasp, SEC_SRC.internal],
    ["Ngồi chờ đội ngũ dev làm xong bản vá trong 3 ngày mà không có bất kỳ biện pháp giảm thiểu rủi ro nào ở tầng mạng"]
  ),
  q("SEC_ENG-SCEN-04", "Security Engineer", "scenario", "intermediate", "middle",
    "Tình huống: Nhân viên phòng Kế toán báo cáo rằng họ vừa nhận được một email từ Giám đốc điều hành yêu cầu chuyển tiền khẩn cấp 500 triệu đồng cho đối tác qua một số tài khoản lạ. Khi kiểm tra, em phát hiện email được gửi từ một tên miền gần giống (Typosquatting: thay chữ `o` bằng số `0`). Em tiến hành xử lý sự cố lừa đảo mạo danh (CEO Fraud / BEC) này như thế nào?",
    ["Can thiệp ngăn chặn chuyển tiền ngay lập tức: liên hệ trực tiếp với kế toán trưởng và ngân hàng để dừng lệnh chuyển tiền nếu giao dịch chưa hoàn tất", "Cập nhật khẩn cấp trên Email Gateway: chặn tên miền typosquatting đó trên toàn công ty và tìm kiếm xem có nhân viên nào khác nhận được email tương tự không", "Thực hiện mua lại hoặc gửi yêu cầu gỡ bỏ tên miền lừa đảo (Takedown request) tới nhà đăng ký tên miền (Registrar) và nâng cấp nhận thức an ninh cho khối tài chính"],
    ["Làm thế nào để cấu hình email gateway tự động gắn cờ cảnh báo [EXTERNAL EMAIL] cho các thư gửi từ bên ngoài công ty?", "Quy trình xác thực ngoại tuyến (Out-of-band verification) bằng cuộc gọi điện thoại đối với các lệnh chuyển tiền lớn?"] ,
    ["Business Email Compromise (BEC)", "Typosquatting", "Email Takedown", "Security Awareness", "Fraud Prevention"],
    [SEC_SRC.internal],
    ["Chỉ xóa email đó mà không rà soát các nạn nhân khác và không chặn tên miền độc hại trên toàn hệ thống"]
  ),
  q("SEC_ENG-SCEN-05", "Security Engineer", "scenario", "advanced", "senior_lead",
    "Tình huống: Doanh nghiệp bị tấn công từ chối dịch vụ phân tán (DDoS) kết hợp cả 3 tầng: Tấn công băng thông (NTP/DNS Amplification tầng 3/4 lên tới 100Gbps) và Tấn công cạn kiệt tài nguyên máy chủ (HTTPS Flood tầng 7 nhắm vào trang tìm kiếm). Toàn bộ website bị tê liệt. Em điều phối quy trình ứng phó và kích hoạt dịch vụ chống DDoS khẩn cấp ra sao?",
    ["Kích hoạt ngay dịch vụ làm sạch lưu lượng đám mây (Cloud Scrubbing Center như Cloudflare Magic Transit hoặc AWS Shield): chuyển hướng phân giải DNS sang hạ tầng Anycast để hấp thụ băng thông tấn công", "Tại tầng 7: Bật chế độ 'Under Attack Mode' của WAF, yêu cầu xác thực JavaScript Challenge đối với các kết nối nghi vấn nhắm vào endpoint tìm kiếm", "Phối hợp với nhà cung cấp dịch vụ mạng (ISP) thiết lập Blackholing (BGP Remotely Triggered Black Hole) ở biên mạng nếu lưu lượng vượt quá dung lượng kênh truyền"],
    ["Làm thế nào để phân biệt giữa đợt tăng traffic đột biến do người dùng thật vào giờ khuyến mãi và một đợt tấn công DDoS?", "Cách bảo vệ địa chỉ IP gốc của máy chủ (Origin IP) không bị lộ để kẻ tấn công không thể bypass qua WAF?"] ,
    ["DDoS Mitigation", "Anycast Scrubbing", "Under Attack Mode", "Origin Protection", "Layer 7 Flood"],
    ["https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/", SEC_SRC.internal],
    ["Cố gắng nâng cấp cấu hình phần cứng server và tăng băng thông mạng một cách vô vọng trước cuộc tấn công 100Gbps"]
  ),
  q("SEC_ENG-SCEN-06", "Security Engineer", "scenario", "intermediate", "junior",
    "Tình huống: Một kỹ sư phần mềm vô tình đẩy tệp cấu hình chứa AWS Root Access Key lên một kho lưu trữ GitHub công khai. Chỉ sau 10 phút, bot quét mã độc trên mạng đã phát hiện và bắt đầu tự động tạo hàng loạt máy chủ EC2 cấu hình cao để đào tiền ảo (Crypto-mining). Em thực hiện quy trình ứng cứu sự cố rò rỉ khóa này thế nào?",
    ["Bước 1: Vô hiệu hóa (Deactivate) và Xóa ngay lập tức cặp Access Key bị lộ trên AWS IAM Console trong vòng 1 phút đầu tiên", "Bước 2: Rà soát và tiêu diệt (Terminate) toàn bộ các máy chủ EC2 lạ, vùng địa lý lạ do kẻ tấn công vừa khởi tạo; kiểm tra xem chúng có kịp tạo thêm IAM User phụ nào để duy trì quyền kiểm soát (Persistence) hay không", "Bước 3: Tích hợp công cụ quét bí mật tự động (GitGuardian, Trufflehog) vào Pre-commit hooks của team dev để chặn việc commit secrets trong tương lai"],
    ["Làm thế nào để liên hệ với AWS Support giải trình sự cố và xin miễn giảm chi phí phát sinh hàng chục nghìn USD do kẻ tấn công đào tiền ảo?", "Quy trình xoay vòng toàn bộ các thông tin xác thực khác có nguy cơ bị lộ liên đới?"] ,
    ["Secret Leakage", "Compromised Credentials", "GitGuardian", "Crypto-mining Remediation", "AWS Incident"],
    [SEC_SRC.aws_sec, SEC_SRC.internal],
    ["Chỉ xóa file trên GitHub mà không vô hiệu hóa Access Key trên AWS console"]
  ),

  // CV Validation (5)
  q("SEC_ENG-CV-01", "Security Engineer", "cv_validation", "advanced", "senior_lead",
    "Trong dự án triển khai hệ thống kiến trúc an ninh tổng thể mà em ghi trên CV: Em đã trực tiếp thiết kế những phân vùng mạng nào, cấu hình những giải pháp bảo mật nào (Firewall, WAF, VPN, SIEM) và con số định lượng về việc giảm thiểu số lượng sự cố an ninh sau dự án là gì?",
    ["Trình bày chi tiết kiến trúc: phân tách DMZ, App, DB, OAM bằng tường lửa thế hệ mới Palo Alto; triển khai AWS WAF và giải pháp ZTNA", "Cấu hình chính sách Least Privilege và tự động hóa rà soát lỗ hổng định kỳ", "Dẫn chứng kết quả định lượng: giảm 90% số lượng sự cố tấn công thành công, không để xảy ra bất kỳ đợt rò rỉ dữ liệu nào trong 2 năm vận hành và đạt 100% tiêu chuẩn kiểm toán PCI-DSS"],
    ["Thách thức kỹ thuật lớn nhất khi triển khai kiến trúc an ninh mới vào hệ thống đang chạy của công ty là gì?", "Em đã giải quyết bài toán suy giảm hiệu năng mạng (Network Latency) do các thiết bị kiểm tra an ninh gây ra như thế nào?"] ,
    ["CV Validation", "Security Architecture", "Network Security", "PCI-DSS Compliance", "Incident Reduction"],
    [SEC_SRC.internal],
    ["Nói chung chung là làm bảo mật nhưng không nhớ rõ mô hình mạng, thông số tường lửa hay kết quả cụ thể"]
  ),
  q("SEC_ENG-CV-02", "Security Engineer", "cv_validation", "advanced", "middle",
    "CV của em có đề cập đến việc quản lý và vận hành giải pháp WAF bảo vệ cho hệ thống có hàng triệu lượt truy cập mỗi ngày. Hãy chia sẻ quy trình tinh chỉnh bộ luật (Rule Tuning) của em để đưa tỷ lệ chặn nhầm (False Positive Rate) xuống dưới 0.1% mà vẫn đảm bảo an toàn?",
    ["Áp dụng quy trình chạy thử nghiệm (Count/Log Mode) trong 14 ngày trước khi chính thức chuyển sang chế độ Chặn (Block Mode)", "Phân tích nhật ký WAF logs chi tiết để xác định các luồng nghiệp vụ hợp lệ vô tình kích hoạt rule (như khách hàng nhập mã code trong ô phản hồi)", "Tạo các ngoại lệ chính xác (Exceptions / Exclusions) có điều kiện giới hạn thay vì tắt bỏ toàn bộ rule"],
    ["Khi hệ thống phát hành một tính năng thanh toán mới, em phối hợp với team Dev để cập nhật WAF rules ra sao?", "Cách xử lý khi một nhà mạng viễn thông lớn bị WAF chặn nhầm hàng loạt do trùng dải IP?"] ,
    ["WAF Tuning", "False Positive Reduction", "Count Mode", "WAF Exceptions", "High Traffic Defense"],
    [SEC_SRC.owasp, SEC_SRC.internal],
    ["Bật chế độ Block ngay lập tức khiến hàng nghìn khách hàng thực tế bị chặn không thể thanh toán"]
  ),
  q("SEC_ENG-CV-03", "Security Engineer", "cv_validation", "intermediate", "middle",
    "Em ghi trên CV kinh nghiệm quản lý vòng đời lỗ hổng bảo mật (Vulnerability Management). Hãy mô tả cách em đã xây dựng quy trình phối hợp với các đội ngũ phát triển phần mềm để vá các lỗ hổng đạt SLA, và công cụ em đã dùng để theo dõi tiến độ?",
    ["Tích hợp máy quét tự động (Tenable/Qualys) với Jira Service Management: tự động tạo ticket và gán cho đúng team sở hữu dịch vụ", "Thiết lập SLA rõ ràng có sự phê duyệt của CTO: Critical vá trong 24h, High trong 7 ngày, Medium trong 30 ngày", "Tổ chức họp rà soát hàng tuần (Weekly Vulnerability Triage) và xây dựng dashboard theo dõi tỷ lệ tuân thủ SLA của từng nhóm"],
    ["Khi đội ngũ phát triển từ chối vá một lỗ hổng nghiêm trọng vì sợ ảnh hưởng tính năng kinh doanh, em xử lý thế nào?", "Quy trình cấp ngoại lệ rủi ro (Risk Acceptance Exception) có thời hạn diễn ra ra sao?"] ,
    ["Vulnerability SLA", "Jira Integration", "Vulnerability Triage", "Risk Acceptance", "Dev Alignment"],
    [SEC_SRC.internal],
    ["Chỉ biết gửi email nhắc nhở chung chung mà không có quy trình phân loại trách nhiệm hay SLA đo lường"]
  ),
  q("SEC_ENG-CV-04", "Security Engineer", "cv_validation", "advanced", "senior_lead",
    "Trong một dự án thiết kế và triển khai giải pháp Zero Trust hoặc ZTNA mà em từng thực hiện trên CV: Hãy trình bày chi tiết về cách thức kiểm tra tư thế thiết bị (Device Posture Assessment), chính sách truy cập có điều kiện và trải nghiệm của nhân viên thay đổi ra sao khi chuyển đổi từ VPN truyền thống sang ZTNA?",
    ["Tích hợp Identity Provider (Okta) với EDR (CrowdStrike) để đánh giá trạng thái an toàn của máy tính theo thời gian thực", "Thiết lập chính sách: Chỉ cho phép truy cập hệ thống kế toán nếu máy tính thuộc sở hữu công ty, đã bật mã hóa BitLocker và điểm an ninh ZTA Score > 80", "Trải nghiệm nhân viên: Không cần bật tắt VPN thủ công, kết nối mượt mà và an toàn theo từng ứng dụng"],
    ["Khó khăn lớn nhất khi triển khai ZTNA cho các nhân sự làm việc tự do hoặc đối tác bên thứ ba (Third-party vendors) là gì?", "Cách đo lường mức độ giảm thiểu bề mặt tấn công (Attack Surface Reduction) sau khi tắt VPN?"] ,
    ["ZTNA Deployment", "Device Posture", "Conditional Access", "VPN Replacement", "Attack Surface"],
    [SEC_SRC.nist_zero_trust, SEC_SRC.internal],
    ["Không giải thích được cơ chế hoạt động của ZTNA hoặc nhầm lẫn ZTNA với việc chỉ cài thêm MFA cho VPN"]
  ),
  q("SEC_ENG-CV-05", "Security Engineer", "cv_validation", "intermediate", "middle",
    "CV của em có nhắc đến việc tham gia ứng phó và xử lý sự cố an ninh thực tế (Security Incident Response). Hãy chia sẻ chi tiết về sự cố nghiêm trọng nhất mà em từng tham gia giải quyết (tính chất sự cố, thời gian cô lập, nguyên nhân gốc rễ và bài học rút ra)?",
    ["Mô tả bối cảnh sự cố cụ thể (vd: máy chủ nội bộ bị nhiễm mã độc đào tiền ảo qua lỗ hổng RCE chưa vá)", "Trình bày hành động dứt khoát: cô lập mạng trong 20 phút, phân tích tiến trình độc hại và truy vết địa chỉ IP nguồn tấn công", "Nguyên nhân gốc rễ: do một cổng dịch vụ thử nghiệm bị dev mở ra ngoài Internet mà không qua tường lửa; bài học: tự động hóa việc quét bề mặt tấn công bên ngoài (ASM) liên tục"],
    ["Em đã viết báo cáo Post-Incident Review cho ban giám đốc như thế nào?", "Những biện pháp kỹ thuật nào đã được triển khai ngay sau đó để đảm bảo sự cố không bao giờ lặp lại?"] ,
    ["Incident Response Experience", "Root Cause Analysis", "Attack Surface Management", "Post-Incident Review"],
    [SEC_SRC.sans_ir, SEC_SRC.internal],
    ["Kể câu chuyện mơ hồ, không nhớ được nguyên nhân gốc rễ hoặc không nêu được biện pháp khắc phục lâu dài"]
  ),

  // Behavioral (5)
  q("SEC_ENG-BEHAV-01", "Security Engineer", "behavioral", "intermediate", "middle",
    "Khi các kỹ sư phần mềm phàn nàn rằng các chính sách bảo mật của em quá khắt khe (chặn quyền truy cập, bắt đổi mật khẩu phức tạp, kiểm duyệt tải phần mềm) làm giảm năng suất làm việc của họ, em xử lý sự phản kháng này và xây dựng tinh thần hợp tác ra sao?",
    ["Lắng nghe cởi mở nỗi đau của lập trình viên; hiểu rằng bảo mật không được phép trở thành 'Phòng ban nói Không' (Department of No)", "Giải thích bối cảnh rủi ro thực tế: giúp họ hiểu hậu quả pháp lý và tài chính nếu công ty bị lộ dữ liệu", "Chủ động đơn giản hóa trải nghiệm (Security UX): triển khai đăng nhập một lần (SSO), quản lý mật khẩu tự động (1Password) và cấp quyền tự động hóa có kiểm soát để kỹ sư làm việc thuận tiện"],
    ["Làm thế nào để biến các kỹ sư trở thành đồng minh bảo mật thay vì tìm cách đi đường vòng (Shadow IT) để lách luật?", "Một lần em đã nhượng bộ và điều chỉnh chính sách bảo mật linh hoạt hơn để phục vụ tiến độ dự án là gì?"] ,
    ["Overcoming Security Resistance", "Security UX", "Shadow IT Prevention", "Collaborative Mindset"],
    [SEC_SRC.internal],
    ["Dùng quyền lực áp đặt quy chế cứng nhắc và đe dọa xử phạt những ai thắc mắc"]
  ),
  q("SEC_ENG-BEHAV-02", "Security Engineer", "behavioral", "advanced", "senior_lead",
    "Khi xảy ra một sự cố an ninh nghiêm trọng làm rò rỉ dữ liệu, các phòng ban bắt đầu hoảng loạn và có xu hướng đổ lỗi cho nhau (Kỹ sư đổ lỗi cho Vận hành, Vận hành đổ lỗi cho Bảo mật). Em thể hiện vai trò lãnh đạo bình tĩnh và điều phối giải quyết khủng hoảng ra sao?",
    ["Lập tức thiết lập trật tự: tuyên bố nguyên tắc Văn hóa không đổ lỗi (Blameless Culture) trong suốt quá trình xử lý sự cố", "Tập trung 100% năng lượng vào mục tiêu dập tắt thảm họa: cô lập hệ thống, vá lỗ hổng và khôi phục dịch vụ an toàn", "Duy trì kênh thông tin minh bạch, cập nhật tình hình định kỳ mỗi 30 phút cho Ban Giám đốc và các phòng ban liên quan để dẹp tan tin đồn thất thiệt"],
    ["Làm thế nào để duy trì sự tỉnh táo và tinh thần thép khi phải làm việc liên tục 24 giờ trong phòng tác chiến (War Room)?", "Sau sự cố, em dẫn dắt buổi họp kiểm điểm trách nhiệm một cách xây dựng, công bằng ra sao?"] ,
    ["Crisis Leadership", "Blameless Culture", "War Room Management", "Executive Communication"],
    [SEC_SRC.internal],
    ["Cũng bị cuốn vào vòng xoáy đổ lỗi, công kích đồng nghiệp để tự bảo vệ vị trí của mình"]
  ),
  q("SEC_ENG-BEHAV-03", "Security Engineer", "behavioral", "intermediate", "junior",
    "Khi em phát hiện một Giám đốc cấp cao (VIP) trong công ty cố tình vi phạm chính sách an ninh (sử dụng mật khẩu cực kỳ yếu, tắt phần mềm diệt virus trên máy cá nhân để chơi game), em xử lý tình huống tế nhị này như thế nào để vừa đảm bảo an toàn vừa giữ được sự tôn trọng?",
    ["Không bỏ qua vì vị trí của họ, nhưng cũng không công khai chỉ trích làm mất mặt lãnh đạo", "Hẹn gặp riêng 1-1 với thái độ lịch sự, tôn trọng: giải thích rằng các vị trí lãnh đạo chính là mục tiêu số 1 bị tin tặc săn đón (Whaling Attack)", "Đích thân hỗ trợ cấu hình máy tính cho sếp một cách thuận tiện nhất (cài đặt phần mềm quản lý mật khẩu, bật xác thực sinh trắc học vân tay) để sếp vừa an toàn vừa không bị phiền phức"],
    ["Nếu vị giám đốc đó kiên quyết từ chối hợp tác, em sẽ leo thang vấn đề lên cấp CISO/CEO ra sao?", "Cách thiết lập các biện pháp kiểm soát bù trừ (Compensating Controls) để bảo vệ tài khoản của các nhân sự VIP?"] ,
    ["VIP Security Exceptions", "Whaling Defense", "Diplomatic Communication", "Compensating Controls"],
    [SEC_SRC.internal],
    ["Sợ sếp nên nhắm mắt làm ngơ để lỗ hổng tồn tại, hoặc mách lẻo gây căng thẳng cá nhân"]
  ),
  q("SEC_ENG-BEHAV-04", "Security Engineer", "behavioral", "advanced", "middle",
    "Trong quá trình đánh giá rủi ro an ninh cho một tính năng kinh doanh mới chuẩn bị ra mắt, em phát hiện ra một rủi ro bảo mật ở mức độ Trung bình (Medium). PM năn nỉ em ký duyệt bỏ qua để kịp ngày khai trương vì hợp đồng quảng cáo đã ký hàng tỷ đồng. Em ra quyết định và thương lượng như thế nào?",
    ["Đánh giá thực tế khả năng bị khai thác (Exploitability) và tác động kinh doanh thực sự trong điều kiện vận hành cụ thể", "Nếu rủi ro không làm lộ dữ liệu nhạy cảm: đồng ý cho release tạm thời kèm theo Biên bản chấp nhận rủi ro có điều kiện (Conditional Sign-off)", "Yêu cầu cam kết văn bản: đội ngũ phát triển phải triển khai biện pháp kiểm soát tạm thời (WAF rule) và hoàn thành bản vá triệt để trong vòng 14 ngày sau khi ra mắt"],
    ["Làm thế nào để rèn luyện tư duy 'Đánh giá rủi ro kinh doanh' thay vì tư duy 'Kỹ thuật tuyệt đối hóa'?", "Khi nào thì em bắt buộc phải nói 'KHÔNG' kiên quyết dù đối diện với áp lực doanh số khủng khiếp?"] ,
    ["Risk Acceptance Sign-off", "Business Alignment", "Compensating Controls", "Principled Negotiation"],
    [SEC_SRC.internal],
    ["Cứng nhắc từ chối máy móc làm đổ bể hợp đồng kinh doanh lớn của công ty dù rủi ro có thể kiểm soát tạm thời"]
  ),
  q("SEC_ENG-BEHAV-05", "Security Engineer", "behavioral", "intermediate", "junior",
    "Lĩnh vực an toàn thông tin thay đổi với tốc độ chóng mặt mỗi ngày (các kỹ thuật tấn công mới, lỗ hổng Zero-day, chiến thuật của các nhóm APT mới). Em duy trì thói quen tự học tập, cập nhật kiến thức chuyên môn và chia sẻ lại cho đồng nghiệp như thế nào?",
    ["Theo dõi hàng ngày các nguồn tin tức an ninh mạng uy tín (The Hacker News, BleepingComputer, CISA Alerts, Twitter InfoSec community)", "Tham gia các phòng thực hành thực chiến (TryHackMe, Hack The Box) và phân tích các báo cáo phân tích mã độc chi tiết", "Định kỳ tổ chức các buổi chia sẻ kiến thức nội bộ (Security Briefing) để cảnh báo sớm cho toàn công ty về các nguy cơ tấn công mới xuất hiện"],
    ["Một công nghệ hoặc phương thức tấn công mới nhất trong 6 tháng qua mà em cảm thấy ấn tượng nhất là gì?", "Em đã từng tham gia đóng góp cho các dự án an ninh mã nguồn mở hoặc cộng đồng bảo mật nào chưa?"] ,
    ["Continuous Learning", "Threat Landscape Tracking", "Knowledge Sharing", "InfoSec Community"],
    [SEC_SRC.internal],
    ["Thụ động không tự giác cập nhật kiến thức mới, chỉ chờ công ty đào tạo, giấu kiến thức không chia sẻ với đồng nghiệp"]
  )
];

console.log("Security Engineer questions defined:", secEngineerQuestions.length);

module.exports = {
  secEngineerQuestions
};
