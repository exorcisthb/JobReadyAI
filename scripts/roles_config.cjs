const fs = require('fs');
const path = require('path');

// Định nghĩa cấu trúc chuẩn cho các vị trí đang được hỗ trợ
const ALL_ROLES_CONFIG = [
  // Nhóm 1: Lập trình Web & Mobile (7)
  {
    role: "Frontend Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    prefix: "FE",
    aliases: ["frontend developer", "frontend engineer", "front-end developer", "lap trinh vien frontend", "fe dev"],
    coreSkills: ["React / Next.js", "TypeScript", "Tailwind CSS", "Web Performance", "State Management", "Accessibility (a11y)"]
  },
  {
    role: "Backend Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    prefix: "BE",
    aliases: ["backend developer", "backend engineer", "back-end developer", "lap trinh vien backend", "be dev", "server developer"],
    coreSkills: ["Node.js / Go / Java", "PostgreSQL / MySQL", "Redis Caching", "API Design (REST/gRPC)", "Microservices", "System Architecture"]
  },
  {
    role: "Fullstack Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    prefix: "FS",
    aliases: ["fullstack developer", "full stack developer", "full-stack developer", "lap trinh vien fullstack"],
    coreSkills: ["Frontend & Backend", "End-to-End Architecture", "Database Design", "API Integration", "CI/CD & Cloud Deployment"]
  },
  {
    role: "Mobile Developer (iOS/Android/Flutter)",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    prefix: "MOB",
    aliases: ["mobile developer", "flutter developer", "ios developer", "android developer", "mobile app developer"],
    coreSkills: ["Flutter / Swift / Kotlin", "Mobile Lifecycle", "Offline Storage & Sync", "App Performance & Memory", "App Store & Play Store Release"]
  },
  {
    role: "React Native Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    prefix: "RN",
    aliases: ["react native developer", "react native engineer", "rn developer"],
    coreSkills: ["React Native", "Native Modules / Bridge", "JSI / Fabric / TurboModules", "Cross-Platform Debugging", "Mobile UI Performance"]
  },
  {
    role: "Vue.js / Angular Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    prefix: "VUE_NG",
    aliases: ["vue developer", "angular developer", "vue.js developer", "angular engineer"],
    coreSkills: ["Vue 3 / Angular", "Reactivity System / Signals", "Pinia / NgRx", "Component Architecture", "RxJS & Dependency Injection"]
  },
  {
    role: "TypeScript / Node.js Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    prefix: "TS_NODE",
    aliases: ["typescript developer", "node.js developer", "nodejs developer", "backend typescript engineer"],
    coreSkills: ["TypeScript Strict Types", "Node.js Event Loop & Streams", "NestJS / Express", "TypeORM / Prisma", "Async Concurrency"]
  },

  // Nhóm 2: Dữ liệu & Trí tuệ nhân tạo (AI) (9)
  {
    role: "Data Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    prefix: "DE",
    aliases: ["data engineer", "ky su du lieu", "data pipeline engineer"],
    coreSkills: ["Apache Spark", "Airflow / Prefect", "Data Warehousing (Snowflake/BigQuery)", "ETL / ELT Pipelines", "Data Modeling"]
  },
  {
    role: "Data Analyst",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    prefix: "DA",
    aliases: ["data analyst", "chuyen vien phan tich du lieu"],
    coreSkills: ["Advanced SQL", "Tableau / Power BI", "Business Metrics", "Exploratory Data Analysis (EDA)", "Data Storytelling"]
  },
  {
    role: "Data Scientist",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    prefix: "DS",
    aliases: ["data scientist", "nha khoa hoc du lieu"],
    coreSkills: ["Statistical Modeling", "Python (Pandas, Scikit-learn)", "Machine Learning Algorithms", "A/B Testing & Hypothesis Testing", "Feature Engineering"]
  },
  {
    role: "Machine Learning Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    prefix: "MLE",
    aliases: ["machine learning engineer", "ml engineer", "ky su hoc may"],
    coreSkills: ["PyTorch / TensorFlow", "Model Serving & Latency Optimization", "Feature Stores", "Hyperparameter Tuning", "Deep Learning Architectures"]
  },
  {
    role: "AI / LLM Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    prefix: "LLM",
    aliases: ["ai engineer", "llm engineer", "generative ai engineer", "genai developer"],
    coreSkills: ["RAG Architecture", "LangChain / LlamaIndex", "Vector Databases", "Prompt Engineering", "Fine-Tuning & Evaluation"]
  },
  {
    role: "NLP Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    prefix: "NLP",
    aliases: ["nlp engineer", "natural language processing engineer", "ky su xu ly ngon ngu tu nhien"],
    coreSkills: ["Transformers & Attention", "Vietnamese Tokenization / NLP", "Text Classification & NER", "Word Embeddings", "Hugging Face Ecosystem"]
  },
  {
    role: "Computer Vision Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    prefix: "CV_ENG",
    aliases: ["computer vision engineer", "cv engineer", "ky su thi giac may tinh"],
    coreSkills: ["OpenCV", "Object Detection (YOLO)", "Image Segmentation", "Edge AI Inference", "Data Augmentation"]
  },
  {
    role: "Business Intelligence (BI)",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    prefix: "BI",
    aliases: ["business intelligence", "bi developer", "bi engineer", "chuyen vien bi"],
    coreSkills: ["Star / Snowflake Schema", "DAX / Power BI / Tableau", "SCD Type 2", "Data Mart Design", "Executive Dashboards"]
  },
  {
    role: "Analytics Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    prefix: "AE",
    aliases: ["analytics engineer", "dbt engineer"],
    coreSkills: ["dbt (Data Build Tool)", "Data Lineage & Testing", "SQL Transformation Layer", "Modular Data Modeling", "Version Control for Data"]
  },


  // Nhóm 3: Kiểm thử & Chất lượng (4)
  {
    role: "QA Engineer",
    group: "testingQA",
    groupLabel: "Kiểm thử & Chất lượng",
    prefix: "QA",
    aliases: ["qa engineer", "quality assurance engineer", "software tester", "kiem thu vien"],
    coreSkills: ["Test Planning & Strategy", "Boundary Value Analysis", "API Testing (Postman)", "Bug Reporting & Jira", "Agile QA Workflow"]
  },
  {
    role: "Automation Tester (Selenium/Playwright)",
    group: "testingQA",
    groupLabel: "Kiểm thử & Chất lượng",
    prefix: "AUTO_TEST",
    aliases: ["automation tester", "automation qa", "selenium tester", "playwright tester"],
    coreSkills: ["Playwright / Selenium", "Page Object Model (POM)", "CI/CD Pipeline Integration", "Flaky Test Handling", "Test Reporting (Allure)"]
  },
  {
    role: "QC Specialist",
    group: "testingQA",
    groupLabel: "Kiểm thử & Chất lượng",
    prefix: "QC",
    aliases: ["qc specialist", "quality control specialist", "chuyen vien qc"],
    coreSkills: ["Quality Gates & Checklists", "UAT Coordination", "Release Verification", "Compliance & Defect Density", "Standard Operating Procedures"]
  },
  {
    role: "SDET (Software Dev Engineer in Test)",
    group: "testingQA",
    groupLabel: "Kiểm thử & Chất lượng",
    prefix: "SDET",
    aliases: ["sdet", "software development engineer in test"],
    coreSkills: ["Custom Test Framework Architecture", "Mocking & Virtualization", "Contract Testing (Pact)", "Code Quality & Coverage Gates", "DevOps Integration"]
  },

  // Nhóm 4: An toàn thông tin (Cybersecurity) (5)
  {
    role: "Security Engineer",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    prefix: "SEC_ENG",
    aliases: ["security engineer", "ky su an toan thong tin", "cybersecurity engineer"],
    coreSkills: ["Network Defense & Firewalls", "Vulnerability Management", "Zero Trust Architecture", "Cryptographic Protocols", "Endpoint Protection"]
  },
  {
    role: "Penetration Tester (PenTest)",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    prefix: "PENTEST",
    aliases: ["penetration tester", "pentester", "ethical hacker", "kiem thu bao mat"],
    coreSkills: ["Authorized Web/Network Pentesting", "OWASP Top 10 Exploitation", "Reconnaissance & Scoping", "Remediation Reporting", "Burp Suite & Nmap"]
  },
  {
    role: "SOC Analyst (L1/L2/L3)",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    prefix: "SOC",
    aliases: ["soc analyst", "security operations center analyst"],
    coreSkills: ["SIEM (Splunk/Wazuh)", "Alert Triage & Investigation", "Log Analysis & Correlation", "Escalation Playbooks", "Threat Hunting Basics"]
  },
  {
    role: "DevSecOps Engineer",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    prefix: "DEVSECOPS",
    aliases: ["devsecops engineer", "devsecops specialist"],
    coreSkills: ["Security in CI/CD Pipelines", "Container Scanning (Trivy)", "IaC Security (Checkov/TFSec)", "Secret Scanning & Vault", "Policy as Code (OPA)"]
  },

  {
    role: "GRC Analyst",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    prefix: "GRC",
    aliases: ["grc analyst", "governance risk compliance", "security compliance"],
    coreSkills: ["ISO 27001 & NIST CSF", "Risk Assessment & Registers", "Decree 13 / GDPR Compliance", "Vendor Risk Management", "Audit & Evidence Gathering"]
  },


  // Nhóm 5: Thiết kế Sản phẩm & UX (4)
  {
    role: "UI Designer",
    group: "productUX",
    groupLabel: "Thiết kế Sản phẩm & UX",
    prefix: "UI_DES",
    aliases: ["ui designer", "visual designer", "thiet ke giao dien"],
    coreSkills: ["Figma & Auto Layout", "Design Tokens & UI Kit", "Typography & Color Theory", "Micro-Interactions", "Responsive Layouts"]
  },
  {
    role: "UX Designer",
    group: "productUX",
    groupLabel: "Thiết kế Sản phẩm & UX",
    prefix: "UX_DES",
    aliases: ["ux designer", "user experience designer", "thiet ke trai nghiem"],
    coreSkills: ["Information Architecture (IA)", "User Flows & Wireframing", "Heuristic Evaluation", "Usability Testing", "Interactive Prototyping"]
  },
  {
    role: "UX Researcher",
    group: "productUX",
    groupLabel: "Thiết kế Sản phẩm & UX",
    prefix: "UX_RES",
    aliases: ["ux researcher", "user researcher", "nghien cuu trai nghiem nguoi dung"],
    coreSkills: ["Qualitative & Quantitative Research", "In-depth Interviews & Observation", "Usability Testing Protocol", "Thematic Synthesis & Insights", "Surveys & SUS Scoring"]
  },
  {
    role: "Product Designer",
    group: "productUX",
    groupLabel: "Thiết kế Sản phẩm & UX",
    prefix: "PROD_DES",
    aliases: ["product designer", "nha thiet ke san pham"],
    coreSkills: ["End-to-End Product Design", "Business Viability & Tech Feasibility", "Product Metrics (Funnel, Retention)", "Design Sprints & Discovery", "Stakeholder Alignment"]
  },

  // Nhóm IT còn thiếu trong giao diện chọn vị trí (Intern/Fresher/Junior)
  {
    role: "DevOps Engineer", group: "webMobile", groupLabel: "Hạ tầng, DevOps & Cloud", prefix: "DEVOPS",
    aliases: ["devops engineer", "devops fresher", "junior devops engineer"],
    coreSkills: ["Docker", "CI/CD", "Linux Logs", "Secrets", "Health Checks"]
  },
  {
    role: "Cloud Engineer (AWS/GCP/Azure)", group: "webMobile", groupLabel: "Hạ tầng, DevOps & Cloud", prefix: "CLOUD",
    aliases: ["cloud engineer", "aws cloud engineer", "gcp cloud engineer", "azure cloud engineer", "junior cloud engineer"],
    coreSkills: ["IAM", "VPC & Subnets", "Compute", "Object Storage", "Monitoring & Cost"]
  },
  {
    role: "System Administrator", group: "webMobile", groupLabel: "Hạ tầng, DevOps & Cloud", prefix: "SYSADMIN",
    aliases: ["system administrator", "sysadmin", "linux system administrator", "junior system administrator"],
    coreSkills: ["Linux Services", "Users & Permissions", "Logs", "DNS & Network Checks", "Backup & Restore"]
  },
  {
    role: "Network Engineer", group: "webMobile", groupLabel: "Hạ tầng, DevOps & Cloud", prefix: "NETWORK",
    aliases: ["network engineer", "junior network engineer", "network administrator", "ky su mang"],
    coreSkills: ["IP & Subnetting", "DNS & DHCP", "Switching & VLAN", "TCP/UDP", "Wireshark"]
  },
  {
    role: "Infrastructure Engineer", group: "webMobile", groupLabel: "Hạ tầng, DevOps & Cloud", prefix: "INFRA",
    aliases: ["infrastructure engineer", "junior infrastructure engineer", "it infrastructure engineer"],
    coreSkills: ["Compute & Storage", "Infrastructure as Code", "Monitoring", "Load Balancing", "Backup & Recovery"]
  },
  {
    role: "Business Analyst (IT)", group: "productUX", groupLabel: "Sản phẩm & Quản trị", prefix: "BA_IT",
    aliases: ["business analyst it", "it business analyst", "business analyst (it)", "ba it", "chuyen vien phan tich nghiep vu it"],
    coreSkills: ["Requirements Elicitation", "User Stories", "Acceptance Criteria", "Process Mapping", "UAT & Basic SQL"]
  },

  // Nhóm Truyền thông (Intern/Fresher/Junior, dưới 2 năm kinh nghiệm)
  {
    role: "Media Relations Assistant", group: "communications", groupLabel: "PR & Quan hệ báo chí", prefix: "MEDIA_REL",
    aliases: ["media relations assistant", "media relations coordinator", "press relations assistant"],
    coreSkills: ["Media List", "Pitch Email", "Press Clipping", "Interview Coordination"]
  },
  {
    role: "PR / Communications Executive", group: "communications", groupLabel: "PR & Quan hệ báo chí", prefix: "PR_COMMS",
    aliases: ["pr specialist", "communications executive", "pr communications executive"],
    coreSkills: ["Press Release", "Media Monitoring", "Fact Checking", "PR Planning"]
  },
  {
    role: "Content Writer / Copywriter", group: "communications", groupLabel: "Nội dung & Biên tập", prefix: "COMMS_WRITER",
    aliases: ["content writer", "copywriter", "content writer copywriter"],
    coreSkills: ["Content Brief", "Brand Voice", "Research & Fact Checking", "Editing"]
  },
  {
    role: "Journalist / Reporter", group: "communications", groupLabel: "PR & Quan hệ báo chí", prefix: "JOURNALIST",
    aliases: ["journalist", "reporter", "journalist reporter", "phong vien"],
    coreSkills: ["Interviewing", "Source Verification", "News Writing", "Editorial Ethics"]
  },
  {
    role: "Editorial Assistant", group: "communications", groupLabel: "Nội dung & Biên tập", prefix: "EDITORIAL",
    aliases: ["editorial assistant", "publishing assistant", "tro ly bien tap"],
    coreSkills: ["Proofreading", "Source Checks", "CMS Publishing", "Editorial Calendar"]
  },
  {
    role: "Communications Assistant (Internal/External)", group: "communications", groupLabel: "Nội dung & Biên tập", prefix: "COMMS_ASSIST",
    aliases: ["communications assistant", "internal communications assistant", "external communications assistant", "communications assistant internal external"],
    coreSkills: ["Internal Updates", "Message Clarity", "Stakeholder Coordination", "Content Calendar"]
  },
  {
    role: "Social Media Executive", group: "communications", groupLabel: "Mạng xã hội & Cộng đồng", prefix: "SOCIAL_MEDIA",
    aliases: ["social media executive", "social media marketing", "social media specialist"],
    coreSkills: ["Platform Publishing", "Caption Writing", "Content Calendar", "Engagement Metrics"]
  },
  {
    role: "Community Executive", group: "communications", groupLabel: "Mạng xã hội & Cộng đồng", prefix: "COMMUNITY",
    aliases: ["community executive", "community assistant", "community manager junior"],
    coreSkills: ["Community Guidelines", "Moderation", "Response Tone", "Issue Escalation"]
  },
  {
    role: "Influencer/KOL Coordinator", group: "communications", groupLabel: "Mạng xã hội & Cộng đồng", prefix: "KOL_COORD",
    aliases: ["influencer marketing", "influencer coordinator", "kol coordinator", "creator partnership coordinator"],
    coreSkills: ["Creator Research", "Brief & Deliverables", "Disclosure Checks", "Campaign Tracking"]
  },
  {
    role: "Event Communications Coordinator", group: "communications", groupLabel: "Sự kiện & Truyền thông thương hiệu", prefix: "EVENT_COMMS",
    aliases: ["event communications coordinator", "event communication coordinator", "event coordinator communications"],
    coreSkills: ["Event Brief", "Run of Show", "Audience Updates", "Post-event Recap"]
  },

  // Nhóm Kinh doanh & Marketing (Intern/Fresher/Junior, dưới 2 năm)
  {
    role: "Brand Marketing Assistant (Intern/Fresher)", group: "marketing", groupLabel: "Thương hiệu & Sản phẩm", prefix: "BRAND_MKT",
    aliases: ["brand marketing intern", "brand marketing assistant", "brand assistant", "brand intern"],
    coreSkills: ["Brand Guideline", "Campaign Brief", "Content Coordination", "Basic Reporting"]
  },
  {
    role: "Product Marketing Associate (Junior)", group: "marketing", groupLabel: "Thương hiệu & Sản phẩm", prefix: "PRODUCT_MKT",
    aliases: ["product marketing associate", "product marketing intern", "junior product marketing", "product marketing assistant"],
    coreSkills: ["Customer Persona", "Value Proposition", "Competitive Research", "Go-to-Market Support"]
  },
  {
    role: "Trade Marketing Assistant (Intern/Fresher)", group: "marketing", groupLabel: "Trade & Nghiên cứu thị trường", prefix: "TRADE_MKT",
    aliases: ["trade marketing intern", "trade marketing assistant", "trade marketing fresher"],
    coreSkills: ["POSM", "Retail Activation", "Promotion Tracking", "Excel Reporting"]
  },
  {
    role: "Market Research Assistant (Intern/Fresher)", group: "marketing", groupLabel: "Trade & Nghiên cứu thị trường", prefix: "MKT_RESEARCH",
    aliases: ["market research intern", "market research assistant", "consumer insights assistant", "consumer research intern"],
    coreSkills: ["Desk Research", "Survey Support", "Data Checking", "Insight Presentation"]
  },
  {
    role: "Media Planning Assistant (Intern/Fresher)", group: "marketing", groupLabel: "Media & Affiliate", prefix: "MEDIA_PLAN",
    aliases: ["media planning intern", "media planning assistant", "media planner assistant", "junior media planner"],
    coreSkills: ["Media Mix", "Reach & Frequency", "CPM / CPC", "Campaign Reporting"]
  },
  {
    role: "Affiliate Marketing Executive (Junior)", group: "marketing", groupLabel: "Media & Affiliate", prefix: "AFFILIATE_MKT",
    aliases: ["affiliate marketing junior", "affiliate marketing executive", "affiliate marketing intern", "affiliate coordinator"],
    coreSkills: ["Affiliate Tracking", "UTM Links", "CPA / Conversion", "Publisher Coordination"]
  },


];

console.log(`Remaining roles defined: ${ALL_ROLES_CONFIG.length}`);
module.exports = { ALL_ROLES_CONFIG };
