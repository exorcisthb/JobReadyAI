const { q, SRC } = require('./fe_data.cjs');

const DEF_SRC = {
  mitre_attack: "https://attack.mitre.org/",
  nist_ir: "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final",
  sans_ir: "https://www.sans.org/white-papers/33342/",
  cis_benchmarks: "https://www.cisecurity.org/cis-benchmarks",
  cisa_alerts: "https://www.cisa.gov/news-events/cybersecurity-advisories",
  misp_project: "https://www.misp-project.org/",
  internal: "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
};

// ==========================================
// 1. SOC ANALYST (L1/L2/L3)
// ==========================================
const socAnalystQuestions = [
  // Foundation (6)
  q("SOC-FOUND-01", "SOC Analyst (L1/L2/L3)", "foundation", "intermediate", "junior",
    "Phân cấp nhiệm vụ và quy trình xử lý giữa SOC L1 (Triage/Monitoring), L2 (Incident Investigation) và L3 (Threat Hunting/Detection Engineering): SLA phản hồi trung bình (MTTD/MTTR) và ranh giới bàn giao cảnh báo (Alert Hand-off) được vận hành ra sao?",
    ["L1: Giám sát console SIEM 24/7, phân loại cảnh báo ban đầu, lọc bỏ báo động giả (False Positives), đóng cảnh báo cơ bản hoặc leo thang sang L2 trong SLA (vd: 15-30 phút)", "L2: Đi sâu điều tra chi tiết (Deep Dive), phân tích tương quan log từ nhiều nguồn (EDR, Firewall, Proxy, Active Directory), xác định phạm vi ảnh hưởng (Scope of Breach)", "L3: Chủ động săn lùng mối đe dọa (Threat Hunting), mô phỏng kịch bản tấn công, viết rule phát hiện mới (Sigma/YARA rules) và tối ưu hóa hệ thống SOAR"],
    ["Chỉ số MTTD (Mean Time to Detect) và MTTR (Mean Time to Respond) đo lường hiệu quả của đội SOC như thế nào?", "Quy trình bàn giao ca trực (Shift Handover) giữa các ca trực 24/7 để không bị rơi mất sự cố đang theo dõi?"],
    ["SOC Tiers", "Alert Triage", "MTTD", "MTTR", "Shift Handover", "SLA"],
    [DEF_SRC.nist_ir, DEF_SRC.internal],
    ["Không phân biệt được trách nhiệm giữa các cấp L1, L2, L3, cho rằng L1 có quyền tự ý cô lập toàn bộ server quan trọng của khách hàng"]
  ),
  q("SOC-FOUND-02", "SOC Analyst (L1/L2/L3)", "foundation", "intermediate", "junior",
    "Nguyên lý vận hành của hệ thống SIEM (Splunk / Microsoft Sentinel / IBM QRadar): Quá trình thu thập log (Log Ingestion), chuẩn hóa (Normalization - CEF/Syslog), đánh chỉ mục (Indexing) và luật tương quan (Correlation Rules) giúp phát hiện hành vi bất thường như thế nào?",
    ["Log Ingestion qua Syslog, API, Agent (Splunk Universal Forwarder, Logstash, Winlogbeat)", "Normalization đưa các định dạng log khác nhau về schema thống nhất (như CIM trong Splunk, ASIM trong Sentinel)", "Correlation Rules: Kết hợp nhiều sự kiện riêng lẻ (vd: 5 lần đăng nhập SSH thất bại sau đó 1 lần thành công, theo sau là lệnh `sudo su` trong vòng 2 phút) để kích hoạt cảnh báo duy nhất có độ tin cậy cao"],
    ["Sự khác biệt giữa truy vấn SPL (Splunk) và KQL (Kusto Query Language trong Sentinel)?", "Tại sao việc thiếu đồng bộ thời gian (NTP out of sync) giữa các nguồn log có thể phá hỏng hoàn toàn correlation rules?"],
    ["SIEM", "Log Correlation", "CEF", "Splunk", "Microsoft Sentinel", "Log Ingestion"],
    ["https://docs.splunk.com/Documentation", DEF_SRC.internal],
    ["Xem SIEM đơn thuần là kho lưu trữ log mà không hiểu bản chất của luật tương quan phân tích sự kiện"]
  ),
  q("SOC-FOUND-03", "SOC Analyst (L1/L2/L3)", "foundation", "advanced", "middle",
    "Phân tích cơ chế giám sát EDR (Endpoint Detection and Response - CrowdStrike Falcon / Microsoft Defender for Endpoint): EDR thu thập những dữ liệu telemetry nào (Process tree, Parent-Child Process, DLL injection, Registry run keys) và phát hiện hành vi tấn công không dùng file (Fileless Malware) ra sao?",
    ["EDR cài sensor ở kernel/user space ghi nhận liên tục: tạo process, load thư viện, kết nối mạng, sửa registry, can thiệp memory", "Phát hiện quan hệ bất thường: Microsoft Word hoặc Excel kích hoạt `powershell.exe` hoặc `cmd.exe` với cờ ẩn (`-EncodedCommand`, `-WindowStyle Hidden`)", "Phát hiện Fileless: Quét PowerShell script block logging (Event ID 4104), phân tích hành vi nạp shellcode trực tiếp vào RAM bằng API hook (`VirtualAllocEx`, `WriteProcessMemory`, `CreateRemoteThread`)"],
    ["Parent PID (PPID) Spoofing là kỹ thuật gì và EDR làm sao phát hiện được kỹ thuật này?", "Khác biệt bản chất giữa Antivirus truyền thống (AV) và EDR hiện đại?"],
    ["EDR", "Telemetry", "Parent-Child Process", "Fileless Malware", "Memory Injection", "CrowdStrike"],
    [DEF_SRC.mitre_attack, DEF_SRC.internal],
    ["Nghĩ rằng mã độc không tạo file trên đĩa cứng thì EDR hoàn toàn bất lực"]
  ),
  q("SOC-FOUND-04", "SOC Analyst (L1/L2/L3)", "foundation", "intermediate", "junior",
    "Các nguồn Windows Event Log cốt lõi mà một SOC Analyst bắt buộc phải nắm vững: Ý nghĩa phân tích của Event ID 4624 (Logon thành công & các Logon Type 2, 3, 10), 4625 (Logon thất bại), 4672 (Đặc quyền gán), 4720 (Tạo tài khoản mới) và Sysmon Event ID 1, 3, 7, 8?",
    ["Logon Type 2: Đăng nhập trực tiếp tại bàn phím/console; Logon Type 3: Đăng nhập qua mạng (Network share, SMB); Logon Type 10: Remote Desktop (RDP)", "4625 hàng loạt từ một IP nội bộ chỉ dấu tấn công Brute-force hoặc Password Spraying; 4672 báo hiệu tài khoản vừa nhận quyền quản trị cao cấp (Administrator privilege assign)", "Sysmon: ID 1 (Process creation kèm command-line, hash, parent process), ID 3 (Network connection từ process cụ thể), ID 7 (Image loaded / DLL hijack), ID 8 (CreateRemoteThread)"],
    ["Làm thế nào để nhận diện một phiên đăng nhập RDP thành công bất thường ngoài giờ làm việc bằng Event ID 4624 type 10?", "Tại sao Sysmon lại cung cấp độ phủ giám sát sâu hơn nhiều so với Windows Security log mặc định?"],
    ["Windows Event Log", "Sysmon", "Logon Types", "Event ID 4624", "Event ID 4625", "Event ID 1"],
    ["https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon", DEF_SRC.internal],
    ["Không nắm được các Logon Type cơ bản (nhầm lẫn giữa Interactive Logon và Network Logon)"]
  ),
  q("SOC-FOUND-05", "SOC Analyst (L1/L2/L3)", "foundation", "advanced", "middle",
    "Kim tự tháp Nỗi đau (Pyramid of Pain) của David Bianco và Mô hình MITRE ATT&CK: Cách SOC Analyst phân loại và áp dụng các Chỉ số xâm phạm (IoC) từ tầng Hash, IP, Domain đến TTPs (Tactics, Techniques, and Procedures)?",
    ["Kim tự tháp từ đáy lên đỉnh: Hash (Trivial - dễ thay đổi chỉ bằng 1 byte) -> IP Addresses (Easy) -> Domain Names (Simple) -> Network/Host Artifacts (Annoying) -> Tools (Challenging) -> TTPs (Tough - khiến kẻ tấn công đau đớn nhất)", "Đối phó ở tầng IP/Hash chỉ giải quyết bề nổi vì tin tặc đổi IP/C2 chỉ mất vài giây", "Mapping alert theo MITRE ATT&CK Tactic (Initial Access, Execution, Persistence, Privilege Escalation...) giúp nhìn thấy bức tranh toàn cảnh của chiến dịch tấn công"],
    ["Tại sao việc xây dựng rule phát hiện dựa trên TTPs lại bền vững hơn nhiều so với việc chỉ blacklist danh sách IP/Hash?", "Cho ví dụ về một luật phát hiện ở tầng Host Artifacts hoặc Tools?"],
    ["Pyramid of Pain", "MITRE ATT&CK", "IoC", "TTPs", "David Bianco", "Threat Detection"],
    [DEF_SRC.mitre_attack, "https://detect-respond.blogspot.com/2013/03/the-pyramid-of-pain.html"],
    ["Cho rằng chặn một danh sách địa chỉ IP tĩnh là đã giải quyết triệt để mối đe dọa dai dẳng"]
  ),
  q("SOC-FOUND-06", "SOC Analyst (L1/L2/L3)", "foundation", "intermediate", "middle",
    "Khái niệm Cảnh báo mỏi mệt (Alert Fatigue) và Tỷ lệ báo động giả (False Positive Rate): Tác động tiêu cực của Alert Fatigue đến tâm lý SOC Analyst và phương pháp khoa học để tinh chỉnh (Tuning) quy tắc giám sát trong SIEM/SOAR?",
    ["Alert Fatigue xảy ra khi SOC nhận hàng ngàn cảnh báo nhiễu mỗi ngày, dẫn đến kiệt sức, mất tập trung và dễ bỏ lọt cảnh báo thực sự nguy hiểm (True Positive)", "Tuning: Phân tích tần suất cảnh báo định kỳ, loại trừ các luồng công việc hợp lệ đã biết (Whitelisting backup job, vulnerability scanner IP)", "Sử dụng SOAR (Security Orchestration, Automation and Response) để tự động hóa kiểm tra sơ bộ (enrichment: check VirusTotal, IP reputation, query AD) trước khi đẩy sang con người duyệt"],
    ["Quy trình đo lường tỷ lệ False Positive / True Positive hàng tháng trong SOC?", "Khi nào nên tạm vô hiệu hóa một correlation rule gây bão cảnh báo (Alert Storm)?"],
    ["Alert Fatigue", "False Positive Tuning", "SOAR Automation", "Alert Storm", "SOC Efficiency"],
    [DEF_SRC.internal],
    ["Xem việc nhận 5000 cảnh báo mỗi ngày là điều hiển nhiên và giải quyết bằng cách bấm 'Close' hàng loạt không điều tra"]
  ),

  // Practical Skills (8)
  q("SOC-PRAC-01", "SOC Analyst (L1/L2/L3)", "practical_skills", "intermediate", "junior",
    "Quy trình phân tích một cảnh báo Email Phishing đáng ngờ (Suspicious Phishing Email Triage): Các bước kiểm tra Email Header (SPF, DKIM, DMARC, Received chain), bóc tách URL độc hại và phân tích tập tin đính kèm an toàn?",
    ["Kiểm tra Authentication-Results: SPF pass/fail, DKIM signature verification, DMARC policy (none/quarantine/reject)", "Lần theo các bước nhảy (Hops) trong header `Received: from ... by ...` để tìm địa chỉ IP máy chủ gửi thư gốc", "Phân tích URL bằng URLscan.io / VirusTotal / Any.Run mà không bấm trực tiếp; bóc tách file đính kèm (Office macro, PDF, ISO/ZIP), hash file và ném vào môi trường Sandbox cô lập"],
    ["Tại sao một email có SPF và DKIM đều 'PASS' vẫn có thể là email lừa đảo mạo danh (Display Name Spoofing)?", "Phân biệt kỹ thuật trỏ link độc qua dịch vụ chuyển hướng rút gọn (URL Shorteners) và Open Redirect?"],
    ["Phishing Triage", "Email Headers", "SPF DKIM DMARC", "Sandbox Analysis", "Any.Run", "VirusTotal"],
    ["https://www.cisa.gov/resources-tools/resources/preventing-phishing-attacks", DEF_SRC.internal],
    ["Mở trực tiếp link hoặc click file đính kèm độc hại ngay trên máy tính làm việc cá nhân của mình"]
  ),
  q("SOC-PRAC-02", "SOC Analyst (L1/L2/L3)", "practical_skills", "advanced", "middle",
    "Điều tra tấn công chiếm đoạt tài khoản qua kỹ thuật Password Spraying và Brute-force trên Active Directory / Azure AD (Entra ID): Cách phân tích log Sign-in, phát hiện tín hiệu bất thường qua User-Agent, Geolocation và tính năng Azure AD Identity Protection?",
    ["Password Spraying: Kẻ tấn công thử một mật khẩu thông dụng (vd: `Spring2026!`) trên hàng ngàn tài khoản khác nhau để tránh bị khóa tài khoản do policy (Account Lockout Threshold)", "Phân tích sign-in logs: Lọc các lần đăng nhập thất bại (Error code 50126) trải rộng trên nhiều username từ cùng một IP/dải IP hoặc subnet Tor/VPN trong khung thời gian ngắn", "Đăng nhập bất thường: Impossible Travel (đăng nhập từ Hà Nội rồi 10 phút sau đăng nhập từ London), User-Agent bất thường hoặc vắng bóng Device Compliance"],
    ["Sự khác biệt trong log event giữa Brute-force truyền thống (1 user - n passwords) và Password Spraying (n users - 1 password)?", "Cách cấu hình Smart Lockout trong Azure AD để ngăn chặn tin tặc cố tình làm khóa tài khoản người dùng?"],
    ["Password Spraying", "Azure AD Sign-in Logs", "Active Directory", "Impossible Travel", "Identity Protection"],
    ["https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-ins", DEF_SRC.internal],
    ["Chỉ tìm kiếm theo từng username đơn lẻ dẫn tới không nhận diện được cuộc tấn công Password Spraying diện rộng"]
  ),
  q("SOC-PRAC-03", "SOC Analyst (L1/L2/L3)", "practical_skills", "advanced", "middle",
    "Phân tích lưu lượng mạng bằng Wireshark và Network Security Monitoring (Zeek/Suricata): Làm thế nào để phát hiện dấu hiệu C2 Beaconing (kết nối ngầm theo chu kỳ), DNS Tunneling hoặc truyền tải dữ liệu dung lượng lớn bất thường (Data Exfiltration)?",
    ["C2 Beaconing: Phân tích khoảng thời gian giữa các gói tin (Delta time / Jitter); Zeek connection log (`conn.log`) cho thấy các kết nối ra ngoài định kỳ cố định (vd: đúng mỗi 60 giây) tới IP không tên tuổi", "DNS Tunneling: Kiểm tra lưu lượng DNS query bất thường, số lượng truy vấn subdomain độ dài cao, mã hóa base32/base64 (vd: `a8f3b...company.xyz`), tỷ lệ query TXT record cao bất thường", "Data Exfiltration: Thống kê Bytes Out vượt trội so với Bytes In trên các cổng không phổ biến hoặc giao thức HTTPS kéo dài liên tục"],
    ["Làm thế nào để viết luật Suricata (Suricata Rule) cơ bản phát hiện một User-Agent độc hại đã biết?", "Cách sử dụng công cụ RITA (Real Intelligence Threat Analytics) để phát hiện beaconing từ log Zeek?"],
    ["Wireshark", "Zeek", "Suricata", "C2 Beaconing", "DNS Tunneling", "Data Exfiltration"],
    ["https://zeek.org/documentation/", DEF_SRC.mitre_attack],
    ["Không phân tích cấu trúc gói tin DNS, bỏ qua các truy vấn có subdomain dài bất thường"]
  ),
  q("SOC-PRAC-04", "SOC Analyst (L1/L2/L3)", "practical_skills", "advanced", "middle",
    "Sử dụng công cụ EDR để điều tra và cô lập máy trạm bị nhiễm Ransomware (Endpoint Isolation & Live Response): Các lệnh truy vấn PowerShell/CLI khẩn cấp để truy vết Process ID, Network Socket đang mở, và Kill tiến trình độc hại?",
    ["Thực hiện chức năng Host Isolation trên console EDR ngay lập tức (vẫn giữ kênh liên lạc EDR quản trị nhưng cắt toàn bộ kết nối mạng khác của máy trạm)", "Mở Live Response: Dùng lệnh `tasklist /v`, `Get-Process`, kiểm tra CommandLine của process đáng ngờ đang mã hóa file hoặc chạy `vssadmin delete shadows`", "Dùng `netstat -ano` hoặc `Get-NetTCPConnection` để định danh remote IP/Port đang kết nối; Kill tiến trình (`Stop-Process -Force`) và thu thập file mẫu (Dump process memory / Quarantine executable)"],
    ["Tại sao việc 'Tắt phụt nguồn máy' (Pull the plug / Hard shutdown) là sai lầm nghiêm trọng khi máy đang bị nhiễm Ransomware có EDR?", "Cách kiểm tra các khóa Persistence trong Registry (`HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`) bằng CLI?"] ,
    ["Host Isolation", "EDR Live Response", "Process Investigation", "PowerShell Forensics", "Ransomware Triage"],
    [DEF_SRC.cisa_alerts, DEF_SRC.internal],
    ["Vội vàng tắt nguồn máy tính làm mất sạch dữ liệu trong bộ nhớ RAM và khóa giải mã tiềm năng"]
  ),
  q("SOC-PRAC-05", "SOC Analyst (L1/L2/L3)", "practical_skills", "advanced", "senior_lead",
    "Detection Engineering: Xây dựng và kiểm thử luật phát hiện đe dọa (Threat Detection Rules) bằng chuẩn định dạng Sigma Rule hoặc YARA-L trong Google Chronicle/SIEM hiện đại?",
    ["Sigma Rule: Định dạng YAML trung lập giúp viết luật một lần và chuyển đổi (sigmac/pySigma) sang Splunk SPL, Sentinel KQL, QRadar AQL, Elastic Lucene", "Cấu trúc Sigma: `title`, `status`, `logsource` (category, product), `detection` (selection, filter, condition: `selection and not filter`)", "Quy trình kiểm thử: Giả lập kỹ thuật tấn công bằng Atomic Red Team trong môi trường lab, kiểm tra log sinh ra, đối chiếu rule có trigger đúng không và đo lường tỷ lệ false positive"],
    ["Làm thế nào để quản lý vòng đời và phiên bản của tập luật Sigma bằng Git (Detection-as-Code)?", "Sự khác biệt giữa YARA (quét file/memory) và YARA-L (ngôn ngữ truy vấn tương quan sự kiện log)?"] ,
    ["Sigma Rules", "Detection Engineering", "Atomic Red Team", "Detection-as-Code", "YARA-L"],
    ["https://github.com/SigmaHQ/sigma", DEF_SRC.mitre_attack],
    ["Viết rule quá rộng (vd: báo động mỗi khi ai đó chạy powershell.exe) khiến hệ thống ngập lụt hàng chục nghìn false alerts"]
  ),
  q("SOC-PRAC-06", "SOC Analyst (L1/L2/L3)", "practical_skills", "intermediate", "middle",
    "Tự động hóa vận hành SOC bằng SOAR Playbook (Security Orchestration, Automation, and Response): Cách thiết kế một kịch bản phản ứng tự động (Automated Playbook) cho cảnh báo 'Nhiều lần đăng nhập thất bại sau đó thành công ngoài giờ làm việc'?",
    ["Trigger: Cảnh báo từ SIEM được đẩy sang SOAR platform qua webhook/API", "Enrichment step: Tự động truy vấn IP reputation (AbuseIPDB, VirusTotal), truy vấn thông tin nhân sự từ Okta/HR system (vị trí, phòng ban, quản lý trực tiếp)", "Decision branch: Nếu IP thuộc VPN công ty hoặc IP nhà riêng đã khai báo -> hạ mức độ nghiêm trọng; Nếu IP từ quốc gia lạ có rủi ro cao -> Tự động gửi tin nhắn Slack/Teams xác nhận với nhân viên (2FA challenge) hoặc tạm khóa phiên (Revoke session token) và báo SOC L2"],
    ["Lợi ích và rủi ro lớn nhất khi cho phép SOAR tự động khóa tài khoản (Automated Remediation) mà không cần con người duyệt?", "Các chỉ số hiệu quả (Metrics) chính để chứng minh ROI khi triển khai giải pháp SOAR?"] ,
    ["SOAR Playbooks", "Automated Remediation", "Enrichment", "Workflow Automation", "AbuseIPDB"],
    [DEF_SRC.nist_ir, DEF_SRC.internal],
    ["Thiết kế playbook tự động thực hiện các hành động phá hủy dữ liệu hoặc gián đoạn dịch vụ sản xuất mà không có cơ chế Human-in-the-loop"]
  ),
  q("SOC-PRAC-07", "SOC Analyst (L1/L2/L3)", "practical_skills", "advanced", "middle",
    "Phân tích hành vi di chuyển ngang (Lateral Movement Detection) trong mạng nội bộ Windows Domain: Cách nhận diện tấn công Pass-the-Hash, PsExec và WMI/WinRM remote execution qua log?",
    ["Pass-the-Hash: Kẻ tấn công dùng NTLM hash thay vì plaintext password; Log Event ID 4624 với Logon Process `NtLmSsp`, Package Name NTLM V1/V2, Key Length 0", "PsExec: Tạo dịch vụ từ xa (Event ID 7045 - Service Creation, thường có tên ngẫu nhiên hoặc `PSEXESVC`), truy cập share admin ẩn `ADMIN$` hoặc `IPC$` (Event ID 5140, 5145)", "WMI/WinRM: Khởi chạy tiến trình `wsmprovhost.exe` hoặc `wmiprvse.exe` làm parent process sinh ra `cmd.exe` hoặc `powershell.exe`"],
    ["Tại sao việc tắt giao thức NTLM và chuyển dịch hoàn toàn sang Kerberos lại là giải pháp ngăn chặn Pass-the-Hash hiệu quả nhất?", "Cách phát hiện hành vi lạm dụng BloodHound thu thập thông tin AD qua lưu lượng LDAP query bất thường?"] ,
    ["Lateral Movement", "Pass-the-Hash", "PsExec", "WMI Execution", "NTLM vs Kerberos", "Sysmon Event ID 7045"],
    [DEF_SRC.mitre_attack, DEF_SRC.internal],
    ["Không biết PsExec tạo service và share ẩn `ADMIN$`, bỏ qua các sự kiện Service Creation 7045"]
  ),
  q("SOC-PRAC-08", "SOC Analyst (L1/L2/L3)", "practical_skills", "advanced", "senior_lead",
    "Hoạt động Săn lùng Mối đe dọa Chủ động (Proactive Threat Hunting): Xây dựng Giả thuyết săn lùng (Hunting Hypothesis) dựa trên thông tin tình báo mới (vd: Kỹ thuật DLL Search Order Hijacking) và các bước truy vấn log thực nghiệm?",
    ["Giả thuyết săn lùng: 'Các phần mềm hợp lệ trong mạng đang bị kẻ tấn công lợi dụng để nạp các tệp DLL độc hại từ thư mục ghi được (Writable directory)'", "Thu thập dữ liệu: Truy vấn Sysmon Event ID 7 (Image loaded) hoặc log EDR; lọc các file thực thi chuẩn (như `explorer.exe`, `teams.exe`) nạp DLL từ thư mục tạm `C:\\Users\\*\\AppData\\Local\\Temp` hoặc thư mục public", "Phân tích kết quả: Kiểm tra chữ ký số (Digital Signature) của DLL, nếu DLL không có chữ ký hoặc chữ ký không khớp nhà phát hành phần mềm chính -> nghi ngờ và cô lập điều tra"],
    ["Khác biệt cơ bản giữa Giám sát thụ động (Passive Alerting) và Săn lùng chủ động (Proactive Hunting)?", "Các bước đóng vòng lặp săn lùng (Closing the Hunt Loop): Làm thế nào để biến kết quả của một đợt hunt thành rule SIEM tự động trong tương lai?"] ,
    ["Threat Hunting", "Hunting Hypothesis", "DLL Hijacking", "Sysmon Event ID 7", "Signature Verification"],
    [DEF_SRC.mitre_attack, DEF_SRC.sans_ir],
    ["Đi săn mà không có giả thuyết rõ ràng, chỉ gõ các truy vấn tìm kiếm ngẫu nhiên không mục đích"]
  ),

  // Scenario (6)
  q("SOC-SCEN-01", "SOC Analyst (L1/L2/L3)", "scenario", "advanced", "junior",
    "Tình huống: Vào lúc 02:00 sáng ca trực đêm, hệ thống SIEM bất ngờ kích hoạt 15 cảnh báo liên tiếp 'C2 Callback Detected' từ máy tính của Trợ lý Tổng giám đốc tới một IP máy chủ tại Nga. Khi em kiểm tra EDR, sensor của máy tính này đang báo trạng thái Offline. Em xử lý khủng hoảng này theo từng bước ra sao?",
    ["Bước 1: Giữ bình tĩnh, xác định đây là sự cố mức độ nghiêm trọng cao (P1/Critical) liên quan đến tài khoản VIP", "Bước 2: Máy trạm EDR Offline -> lập tức can thiệp ở tầng mạng: truy cập Firewall/Switch quản trị tìm địa chỉ MAC và IP của máy trạm đó, ngắt cổng switch (Shut port) hoặc chặn ngay lập tức IP nguồn/đích trên Firewall biên", "Bước 3: Ghi chép nhật ký hành động chi tiết (Timestamps, IP, alert logs) và kích hoạt quy trình Escalation gọi khẩn cấp cho Trưởng ca / Incident Response Lead theo đúng Ma trận liên lạc khẩn cấp (Emergency Contact Matrix)"],
    ["Nếu máy trạm này đang kết nối từ xa qua VPN công ty, em sẽ dùng quyền gì để ngắt kết nối phiên VPN đó ngay lập tức?", "Khi viết báo cáo bàn giao sự cố cho L2/IR vào sáng hôm sau, những bằng chứng số nào bắt buộc phải bảo lưu nguyên vẹn?"] ,
    ["SOC Night Shift Triage", "VIP Account Compromise", "Network Disconnection", "Incident Escalation", "Evidence Preservation"],
    [DEF_SRC.nist_ir, DEF_SRC.internal],
    ["Chờ đến 8h sáng hôm sau mới báo cáo cho sếp vì sợ làm phiền giấc ngủ của đồng nghiệp"]
  ),
  q("SOC-SCEN-02", "SOC Analyst (L1/L2/L3)", "scenario", "advanced", "middle",
    "Tình huống: Đội phát triển phần mềm vừa triển khai một bản cập nhật CI/CD mới. Ngay lập tức SIEM bùng nổ hơn 20,000 cảnh báo 'Brute Force Database Attack' và 'Port Scan' chỉ trong 10 phút, khiến hàng đợi cảnh báo (Queue) của SOC bị nghẽn hoàn toàn. Làm thế nào em nhanh chóng phân biệt giữa sự cố tấn công thật và lỗi cấu hình phần mềm nội bộ?",
    ["Bước 1: Nhanh chóng phân tích nguồn gốc IP phát sinh cảnh báo (Source IP); phát hiện lưu lượng bắt nguồn từ IP cụ thể của cụm Kubernetes/Jenkins vừa deploy", "Bước 2: Kiểm tra nội dung log chi tiết: thấy service mới liên tục kết nối lại database với lỗi xác thực sai mật khẩu trong chu kỳ vòng lặp reconnect 5ms", "Bước 3: Liên hệ kênh Slack On-call của DevOps để xác nhận cấu hình database credential vừa deploy; đồng thời tạm thời áp dụng bộ lọc Rule Suppression có giới hạn thời gian (Timed Filter) cho IP máy chủ CI/CD đó để giải phóng hàng đợi cảnh báo cho SOC"],
    ["Làm thế nào để đảm bảo việc lọc cảnh báo tạm thời không vô tình che giấu một cuộc tấn công thật sự đang diễn ra song song?", "Biện pháp lâu dài để DevOps thông báo trước các đợt load test / migration cho đội SOC?"] ,
    ["Alert Storm", "False Positive Management", "DevOps Misconfiguration", "Rule Suppression", "Root Cause Analysis"],
    [DEF_SRC.internal],
    ["Vội vàng tắt vĩnh viễn rule phát hiện Brute Force của SIEM khiến toàn bộ công ty mất khả năng phòng vệ"]
  ),
  q("SOC-SCEN-03", "SOC Analyst (L1/L2/L3)", "scenario", "advanced", "middle",
    "Tình huống: Một nhân viên phòng Kế toán báo cáo rằng họ vừa bấm vào đường link trong email thông báo 'Hóa đơn tiền điện' và đã nhập tên đăng nhập cùng mật khẩu Office 365 trên trang web giả mạo. Tuy nhiên tài khoản có bật 2FA SMS. Là SOC Analyst, em thực hiện các bước ngăn chặn và điều tra chiếm quyền phiên (Session Hijacking / Evilginx) ra sao?",
    ["Bước 1: Giả định kẻ tấn công sử dụng kỹ thuật Adversary-in-the-Middle (AiTM / Evilginx) cho phép tin tặc cướp luôn Session Cookie và mã 2FA SMS vừa nhập", "Bước 2: Lập tức vào Azure AD Admin Center: Đổi mật khẩu tài khoản và bắt buộc chọn 'Revoke all active sessions' (Hủy toàn bộ refresh token và phiên đăng nhập hiện tại)", "Bước 3: Kiểm tra Azure AD Audit Log của tài khoản đó trong 30 phút qua: tìm kiếm các hành vi tạo Inbox Forwarding Rule (chuyển tiếp email kế toán ra ngoài), đăng ký thiết bị 2FA mới (MFA device registration), hoặc tạo App Password"],
    ["Tại sao việc chỉ đổi mật khẩu mà không bấm 'Revoke Active Sessions' vẫn để kẻ tấn công duy trì quyền truy cập vào hộp thư qua cookie cũ?", "Biện pháp phòng ngừa triệt để nhất chống lại các cuộc tấn công lừa đảo AiTM là gì (FIDO2 / Passkeys)?"] ,
    ["Phishing AiTM", "Evilginx Phishing", "Session Revocation", "Inbox Forwarding Rule", "Azure AD Audit"],
    ["https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bce-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/", DEF_SRC.internal],
    ["Nghĩ rằng có 2FA SMS là an toàn tuyệt đối và chỉ dặn nhân viên đổi lại mật khẩu rồi đóng ticket"]
  ),
  q("SOC-SCEN-04", "SOC Analyst (L1/L2/L3)", "scenario", "advanced", "senior_lead",
    "Tình huống: Trong quá trình rà soát log EDR định kỳ, em phát hiện tiến trình `svchost.exe` đang chạy từ đường dẫn `C:\\Windows\\Temp\\svchost.exe` thay vì `C:\\Windows\\System32\\svchost.exe`, và tiến trình này đang tạo kết nối mạng ra cổng 443 của một IP lạ tại nước ngoài. Em tiến hành bóc tách phân tích hành vi và xử lý như thế nào?",
    ["Bước 1: Định danh ngay đây là kỹ thuật Giả mạo tên tiến trình hợp lệ (Masquerading - MITRE ATT&CK T1036) nhằm đánh lừa người quản trị", "Bước 2: Thu thập thông tin tiến trình qua EDR Live Response: lấy hash SHA-256 của file, dump memory của tiến trình đó để trích xuất cấu hình C2 server và các chuỗi string bên trong", "Bước 3: Kiểm tra Parent Process: Tiến trình nào đã sinh ra file `svchost.exe` giả mạo này trong thư mục Temp? Kiểm tra các khóa Run, Task Scheduler hoặc Service Creation để triệt phá cơ chế lưu trú (Persistence)"],
    ["Kẻ tấn công thường tận dụng cơ chế quyền hạn nào để ghi được file vào `C:\\Windows\\Temp`?", "Các lệnh EDR/PowerShell nào giúp trích xuất danh sách tất cả các máy tính khác trong mạng nội bộ đang có cùng hash file này?"] ,
    ["Process Masquerading", "svchost Spoofing", "Malware Persistence", "SHA-256 Telemetry", "Threat Containment"],
    [DEF_SRC.mitre_attack, DEF_SRC.internal],
    ["Bỏ qua cảnh báo vì nhìn thấy tên file là `svchost.exe` và tưởng rằng đó là tiến trình hệ thống Windows bình thường"]
  ),
  q("SOC-SCEN-05", "SOC Analyst (L1/L2/L3)", "scenario", "advanced", "middle",
    "Tình huống: Hệ thống IDS/WAF phát hiện một địa chỉ IP nội bộ của máy chủ Web Frontend đang liên tục gửi các lệnh quét SQL Injection và Directory Traversal vào máy chủ Database nội bộ. Đây là dấu hiệu của việc máy chủ Web đã bị chiếm quyền điều khiển và đang bị lợi dụng làm bàn đạp (Pivoting). Các bước phản ứng của em là gì?",
    ["Bước 1: Xác nhận máy chủ Web đã bị xâm nhập (Compromised Web Server) và đang bị dùng làm bàn đạp di chuyển ngang", "Bước 2: Cô lập lưu lượng: Cấu hình tường lửa nội bộ chặn ngay các kết nối bất thường từ Web server sang DB server ngoại trừ cổng ứng dụng hợp lệ", "Bước 3: Kiểm tra Web Server Access Log: Truy tìm request ban đầu khai thác thành công (vd: Webshell upload, RCE exploit) dẫn đến việc kẻ tấn công thả script quét mạng vào máy chủ", "Bước 4: Kiểm tra các file mới được tạo hoặc sửa đổi trong thư mục web root (`/var/www` hoặc `C:\\inetpub\\wwwroot`)"],
    ["Làm thế nào để tìm ra Webshell đang ẩn giấu trong mã nguồn ứng dụng web bằng các công cụ quét mã độc hoặc so sánh git hash?", "Tại sao việc chỉ chặn IP máy chủ web nội bộ trên DB lại có thể làm sập toàn bộ dịch vụ của khách hàng và cách cân bằng tính liên tục dịch vụ?"] ,
    ["Internal Pivoting", "Webshell Detection", "Compromised Asset", "Lateral Scan", "Web Server Forensics"],
    [DEF_SRC.mitre_attack, DEF_SRC.internal],
    ["Cho rằng IP nội bộ là IP tin cậy và không kiểm tra, xem đó là lỗi quét nhầm của hệ thống kiểm thử"]
  ),
  q("SOC-SCEN-06", "SOC Analyst (L1/L2/L3)", "scenario", "advanced", "senior_lead",
    "Tình huống: Em nhận được thông báo từ Đội ngũ Quản trị Hạ tầng rằng họ cần thực hiện kiểm tra an ninh khẩn cấp cho một máy chủ ứng dụng tài chính nhạy cảm đang chạy. Tuy nhiên máy chủ này chứa cơ sở dữ liệu giao dịch trực tiếp không được phép khởi động lại. Làm thế nào em thu thập chứng cứ số (Live Forensics Data Collection) mà không làm ảnh hưởng đến hiệu năng và tính ổn định của ứng dụng?",
    ["Bước 1: Lập kế hoạch thu thập chứng cứ giảm thiểu tối đa tải CPU/RAM; ưu tiên thu thập telemetry thụ động qua sensor EDR đã cài sẵn", "Bước 2: Sử dụng các công cụ live forensics nhẹ (như KAPE hoặc CyLR) có giới hạn luồng CPU (Thread throttling) để chỉ thu thập các tạo tác hệ thống cốt lõi (Event logs, MFT, Shimcache, Amcache, Prefetch)", "Bước 3: Không thực hiện quét toàn bộ ổ đĩa (Full disk scan) trong giờ cao điểm giao dịch; lưu trữ dữ liệu trích xuất vào phân vùng riêng biệt hoặc truyền trực tiếp ra máy chủ thu thập an toàn qua mạng có mã hóa"],
    ["Thứ tự ưu tiên biến động dữ liệu (Order of Volatility) theo chuẩn RFC 3227 quy định ra sao?", "Làm thế nào để tính toán và lưu trữ checksum SHA-256 của các tệp chứng cứ thu thập được nhằm đảm bảo tính toàn vẹn pháp lý (Chain of Custody)?"] ,
    ["Live Forensics", "Order of Volatility", "KAPE", "Production Impact Mitigation", "Chain of Custody"],
    ["https://www.rfc-editor.org/rfc/rfc3227", DEF_SRC.nist_ir],
    ["Chạy các công cụ quét nặng nề làm sập máy chủ giao dịch tài chính cốt lõi của doanh nghiệp"]
  ),

  // CV Validation (5)
  q("SOC-CV-01", "SOC Analyst (L1/L2/L3)", "cv_validation", "intermediate", "junior",
    "Trong CV em ghi có kinh nghiệm vận hành SIEM (Splunk/Sentinel/QRadar): Hãy mô tả một Correlation Rule hoặc truy vấn phức tạp nhất mà em từng tự tay tinh chỉnh hoặc xây dựng để giảm thiểu False Positives trong dự án thực tế?",
    ["Mô tả rõ ràng bối cảnh: Rule ban đầu gặp vấn đề gì (vd: quá nhiều báo động giả từ các tác vụ bảo trì tự động)", "Chi tiết kỹ thuật của truy vấn: Các hàm thống kê, điều kiện lọc (aggregation, thresholding, time-window evaluation)", "Kết quả đo lường định lượng: Giảm được bao nhiêu % cảnh báo nhiễu, thời gian phản hồi của đội SOC được cải thiện như thế nào mà không bỏ sót sự cố"],
    ["Những cạm bẫy thường gặp khi whitelist theo địa chỉ IP hoặc tên tiến trình trong rule SIEM?", "Cách em kiểm thử độ tin cậy của rule trước khi đưa vào môi trường Production?"] ,
    ["SIEM Tuning", "Splunk SPL", "Correlation Rule Optimization", "False Positive Reduction", "CV Deep Dive"],
    [DEF_SRC.internal],
    ["Khai man kinh nghiệm cấu hình SIEM, không giải thích được cú pháp truy vấn hoặc nguyên lý tính toán thời gian correlational logic"]
  ),
  q("SOC-CV-02", "SOC Analyst (L1/L2/L3)", "cv_validation", "advanced", "middle",
    "CV của em đề cập việc phân tích và điều tra các sự cố an ninh nghiêm trọng (Security Incidents): Hãy chia sẻ chi tiết về sự cố khó khăn nhất mà em từng trực tiếp xử lý từ lúc nhận cảnh báo đầu tiên cho đến khi đóng case?",
    ["Trình bày theo cấu trúc chuẩn: Tín hiệu phát hiện ban đầu (Detection) -> Quá trình điều tra truy vết (Investigation) -> Biện pháp ngăn chặn cô lập (Containment) -> Khắc phục và đúc kết kinh nghiệm (Lessons Learned)", "Nêu bật các kỹ năng chuyên môn đã vận dụng: Đọc log nào, dùng công cụ gì, gặp bế tắc kỹ thuật nào và đã vượt qua ra sao", "Tác động kinh doanh: Bảo vệ được dữ liệu gì cho công ty hoặc khách hàng"],
    ["Trong sự cố đó, em đã phối hợp với các phòng ban khác (IT, Network, Lãnh đạo) như thế nào?", "Nếu được quay lại xử lý sự cố đó, em sẽ thay đổi hoặc làm tốt hơn điều gì?"] ,
    ["Incident Case Study", "Root Cause Analysis", "SOC Investigation", "Containment Strategy", "Lessons Learned"],
    [DEF_SRC.internal],
    ["Kể câu chuyện chung chung không có chi tiết kỹ thuật thực tế, không chứng minh được vai trò cá nhân trực tiếp trong sự cố"]
  ),
  q("SOC-CV-03", "SOC Analyst (L1/L2/L3)", "cv_validation", "intermediate", "junior",
    "Em ghi nhận có kiến thức vững chắc về các khung chuẩn an ninh mạng (MITRE ATT&CK, Cyber Kill Chain, NIST): Trong công việc giám sát hàng ngày tại SOC, em áp dụng các khung chuẩn này vào việc phân loại và đánh giá mức độ nghiêm trọng của cảnh báo như thế nào?",
    ["Áp dụng thực tế: Không chỉ học thuộc lý thuyết mà dùng ATT&CK để gán tag cho cảnh báo, giúp nhanh chóng nhận biết kẻ tấn công đang ở giai đoạn nào (Initial Access hay đã đến Exfiltration)", "Sử dụng Matrix để đánh giá khoảng trống giám sát (Detection Gap Analysis): Hệ thống đang thiếu log ở kỹ thuật nào", "Tạo sự đồng nhất về ngôn ngữ báo cáo giữa SOC L1, L2, L3 và Ban Lãnh đạo"],
    ["Tại sao việc phát hiện tấn công ở giai đoạn Initial Access lại có giá trị cao hơn nhiều so với giai đoạn Exfiltration?", "Khác biệt giữa Cyber Kill Chain (Lockheed Martin) và MITRE ATT&CK Framework?"] ,
    ["MITRE ATT&CK Mapping", "Cyber Kill Chain", "Detection Gap Analysis", "SOC Operational Framework"],
    [DEF_SRC.mitre_attack, DEF_SRC.internal],
    ["Học vẹt tên các framework mà không hiểu cách ánh xạ log thực tế vào các kỹ thuật ATT&CK cụ thể"]
  ),
  q("SOC-CV-04", "SOC Analyst (L1/L2/L3)", "cv_validation", "advanced", "middle",
    "Trong hồ sơ em có nêu việc sử dụng các công cụ phân tích mã độc và Sandbox (Any.Run, VirusTotal, Hybrid Analysis, Ghidra cơ bản): Hãy trình bày một trường hợp em bóc tách một tệp tin đáng ngờ để trích xuất IoC phục vụ việc chặn lọc khẩn cấp?",
    ["Mô tả mẫu file phân tích (vd: file Excel chứa macro độc hại, file shortcut LNK giả mạo hoặc file ISO)", "Quy trình phân tích động (Dynamic Analysis): Chạy trong sandbox, quan sát network traffic, URL tải payload tiếp theo, process con được sinh ra", "Quy trình phân tích tĩnh (Static Analysis): Trích xuất chuỗi string, kiểm tra entropy, phân tích macro VBA / PowerShell script ẩn giấu", "Các IoC thu được (IP C2, domain độc, SHA-256) và cách phân phối chúng cho tường lửa và EDR"],
    ["Kỹ thuật phòng vệ chống sandbox (Anti-Sandbox / Evasion techniques) mà mã độc hay sử dụng?", "Tại sao không nên tải trực tiếp các tệp tin chứa dữ liệu nội bộ nhạy cảm lên VirusTotal bản công khai?"] ,
    ["Malware Triage", "Sandbox Analysis", "IoC Extraction", "Static vs Dynamic Analysis", "Any.Run"],
    [DEF_SRC.internal],
    ["Tải dữ liệu khách hàng bảo mật lên sandbox công khai vi phạm nghiêm trọng chính sách bảo mật"]
  ),
  q("SOC-CV-05", "SOC Analyst (L1/L2/L3)", "cv_validation", "intermediate", "middle",
    "CV có ghi em tham gia trực ca 24/7 (Shift Work) và xử lý khối lượng cảnh báo lớn: Em tổ chức và quản lý thời gian, ghi chép nhật ký bàn giao (Shift Log) như thế nào để đảm bảo không xảy ra sai sót hoặc sót lọt cảnh báo giữa các ca trực?",
    ["Phương pháp ghi chép nhật ký ca trực chuẩn mực: Ghi nhận rõ số lượng cảnh báo đã xử lý, các case đang mở (Open tickets) cần ca sau theo dõi sát, các thay đổi bất thường về cấu hình mạng của đội IT", "Thực hiện cuộc họp bàn giao trực tiếp (Handover meeting 15 phút) giữa ca trước và ca sau để giải thích trực tiếp ngữ cảnh", "Quản lý sức khỏe và duy trì sự tỉnh táo trong ca đêm (ngủ đủ giấc ban ngày, hạn chế caffein quá liều, tổ chức giải lao luân phiên)"],
    ["Em xử lý thế nào khi ca sau đến muộn hoặc vắng mặt đột xuất mà sự cố nghiêm trọng đang diễn ra?", "Cách em ưu tiên xử lý ticket khi đồng thời có 3 cảnh báo mức độ High cùng xuất hiện?"] ,
    ["Shift Handover Management", "SOC Operational Discipline", "Ticket Prioritization", "Handover Log"],
    [DEF_SRC.internal],
    ["Bàn giao qua loa miệng, không có nhật ký ghi chép dẫn đến thất lạc sự cố đang tiếp diễn"]
  ),

  // Behavioral (5)
  q("SOC-BEHAV-01", "SOC Analyst (L1/L2/L3)", "behavioral", "intermediate", "junior",
    "Công việc SOC Analyst L1 thường xuyên phải đối mặt với áp lực thời gian (SLA chặt chẽ) và sự lặp lại đơn điệu của việc đọc log hàng ngày. Em làm thế nào để duy trì sự tập trung cao độ, tránh tâm lý chán nản và không bỏ sót các chi tiết bất thường nhỏ nhất?",
    ["Hiểu rõ ý nghĩa công việc: Một chi tiết log nhỏ bị bỏ sót có thể là khởi đầu của một cuộc tấn công Ransomware hủy hoại cả công ty", "Rèn luyện tư duy thám tử: Luôn tò mò và đặt câu hỏi 'Tại sao sự kiện này lại xảy ra?', biến việc đọc log thành việc giải các câu đố logic", "Tự động hóa các tác vụ thủ công: Học viết script Python/PowerShell hoặc regex để tự động hóa các bước kiểm tra lặp đi lặp lại nhằm giải phóng thời gian học hỏi kiến thức mới"],
    ["Khi cảm thấy quá mệt mỏi trong ca trực, em có biện pháp gì để lấy lại sự tỉnh táo mà không vi phạm quy định làm việc?", "Em đã bao giờ từng tự tay viết một script nhỏ để hỗ trợ công việc của đội chưa?"] ,
    ["Vigilance and Focus", "Mindset of Defender", "Monotony Overcoming", "Continuous Improvement"],
    [DEF_SRC.internal],
    ["Thừa nhận thường xuyên làm việc qua loa cho xong lượt cảnh báo vì thấy công việc nhàm chán"]
  ),
  q("SOC-BEHAV-02", "SOC Analyst (L1/L2/L3)", "behavioral", "intermediate", "junior",
    "Khi em phát hiện một cảnh báo an ninh đáng ngờ liên quan đến tài khoản của một Quản lý cấp cao hoặc đồng nghiệp thân thiết, nhưng họ yêu cầu em 'bỏ qua giúp, đừng ghi vào hệ thống vì đó chỉ là việc cá nhân', em ứng xử như thế nào?",
    ["Giữ vững tính chính trực và đạo đức nghề nghiệp an toàn thông tin: Tuyệt đối không xóa, bỏ qua hoặc che giấu cảnh báo an ninh vì lý do quen biết cá nhân", "Giải thích nhã nhặn nhưng kiên quyết: Quy trình của SOC là bắt buộc và việc điều tra là để bảo vệ chính tài khoản của anh/chị khỏi nguy cơ bị tin tặc lợi dụng mạo danh", "Tiếp tục xử lý ticket theo đúng quy trình chuẩn (SOP), ghi nhận đầy đủ sự thật khách quan và thông báo cho người phụ trách ca trực"],
    ["Nếu người quản lý đó dùng quyền lực để đe dọa hoặc ép buộc em đóng ticket, em sẽ báo cáo lên ai?", "Tại sao tính khách quan và độc lập là phẩm chất sống còn của một nhân sự an ninh thông tin?"] ,
    ["Professional Ethics", "Integrity", "Conflict of Interest Handling", "Standard Operating Procedure"],
    [DEF_SRC.internal],
    ["Nhượng bộ, đóng ticket theo yêu cầu của người quen vì sợ mất lòng hoặc sợ bị trù dập"]
  ),
  q("SOC-BEHAV-03", "SOC Analyst (L1/L2/L3)", "behavioral", "advanced", "middle",
    "Trong một sự cố khẩn cấp, em nghi ngờ một máy chủ quan trọng của bộ phận Kinh doanh đã bị xâm phạm và cần phải cô lập mạng ngay lập tức để ngăn chặn mã độc lây lan. Tuy nhiên, Giám đốc Kinh doanh phản đối kịch liệt vì việc ngắt mạng sẽ làm gián đoạn hợp đồng bán hàng hàng triệu USD. Em thương lượng và phối hợp giải quyết xung đột này ra sao?",
    ["Thấu hiểu nỗi lo kinh doanh: Không tranh cãi gay gắt, trình bày rõ ràng bằng ngôn ngữ rủi ro kinh doanh: 'Nếu không cô lập tạm thời, nguy cơ toàn bộ hệ thống bị mã hóa tống tiền sẽ gây thiệt hại toàn diện và phá hủy uy tín công ty'", "Đề xuất giải pháp kiểm soát bù trừ: Áp dụng cô lập có chọn lọc (chỉ chặn cổng ra Internet và cổng di chuyển ngang, vẫn cho phép kết nối nội bộ phục vụ giao dịch nếu đánh giá rủi ro cho phép)", "Nhanh chóng báo cáo CISO / Trưởng ban Chỉ đạo Ứng cứu khẩn cấp để đưa ra quyết định ở cấp quản trị cao nhất theo đúng thẩm quyền"],
    ["Làm thế nào để chuẩn bị trước các kịch bản ủy quyền ngắt mạng (Isolation Authority Matrix) trước khi sự cố xảy ra?", "Khi ban giám đốc chấp nhận rủi ro không ngắt mạng, em bảo vệ trách nhiệm pháp lý của đội SOC như thế nào?"] ,
    ["Business Alignment", "Crisis Communication", "Risk Negotiation", "Authorization Matrix"],
    [DEF_SRC.internal],
    ["Tự ý ngắt mạng trong im lặng mà không thông báo, hoặc ngược lại, bỏ mặc hệ thống bị lây nhiễm vì sợ trách nhiệm"]
  ),
  q("SOC-BEHAV-04", "SOC Analyst (L1/L2/L3)", "behavioral", "intermediate", "junior",
    "Nếu em vô tình đóng nhầm một cảnh báo an ninh (đánh dấu nhầm là False Positive) và vài giờ sau sự cố đó bùng phát thành một đợt tấn công thực sự, em đối diện với sai lầm của mình như thế nào trước cấp trên và đội ngũ?",
    ["Dũng cảm nhận trách nhiệm ngay lập tức: Tuyệt đối không giấu giếm, không sửa log hoặc đổ lỗi cho người khác", "Chủ động báo cáo ngay cho Trưởng ca kèm theo toàn bộ thông tin chi tiết về cảnh báo đã bị đóng nhầm và các bước em đang thực hiện để khắc phục hậu quả", "Rút kinh nghiệm sâu sắc: Phân tích nguyên nhân gốc rễ (do thiếu thông tin, hiểu sai logic hay do mệt mỏi) và đề xuất cải tiến checklist phân loại để không ai trong đội lặp lại sai lầm tương tự"],
    ["Tại sao văn hóa 'Không đổ lỗi' (Blameless Culture) trong SOC lại giúp ngăn chặn các thảm họa lớn hơn?", "Em làm gì để lấy lại sự tự tin trong công việc sau một sai lầm đáng tiếc?"] ,
    ["Accountability", "Blameless Post-Mortem", "Mistake Ownership", "Professional Resilience"],
    [DEF_SRC.internal],
    ["Tìm cách xóa dấu vết, chối bỏ trách nhiệm hoặc đổ lỗi cho hệ thống SIEM đưa cảnh báo không rõ ràng"]
  ),
  q("SOC-BEHAV-05", "SOC Analyst (L1/L2/L3)", "behavioral", "intermediate", "middle",
    "Lĩnh vực an ninh mạng và kỹ thuật tấn công thay đổi từng ngày. Là một SOC Analyst, em xây dựng lộ trình nâng cao năng lực bản thân (từ L1 lên L2/L3, Threat Hunter, Incident Responder) và văn hóa chia sẻ kiến thức trong nhóm như thế nào?",
    ["Chủ động học tập liên tục: Đặt mục tiêu đạt các chứng chỉ chuyên nghiệp thực chiến (BTL1, CDSA, GCIA, SC-200), luyện tập trên các nền tảng thực hành (LetsDefend, CyberDefenders, Blue Team Labs Online)", "Đóng góp cho tri thức nội bộ: Viết tài liệu hướng dẫn điều tra (Runbooks/Playbooks) cho các loại cảnh báo mới xuất hiện", "Tổ chức các buổi Threat Briefing ngắn hàng tuần để cập nhật các chiến dịch tấn công mới nhất trong khu vực cho toàn đội"],
    ["Chủ đề chuyên môn an ninh mạng nào mà em đang tập trung nghiên cứu sâu nhất trong 3 tháng gần đây?", "Làm thế nào để cân bằng giữa thời gian làm việc ca trực và thời gian học tập nghiên cứu cá nhân?"] ,
    ["Continuous Learning", "Career Progression", "Knowledge Sharing", "Blue Team Development"],
    [DEF_SRC.internal],
    ["Hài lòng với kiến thức L1 cơ bản, ngại học các kỹ năng mới và không đóng góp cho tri thức của nhóm"]
  )
];

console.log("SOC Analyst questions defined:", socAnalystQuestions.length);

module.exports = {
  socAnalystQuestions
};
