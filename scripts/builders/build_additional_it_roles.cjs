const fs = require('node:fs');
const path = require('node:path');

// Complete the IT roles shown in InterviewSetupPage that were not covered by
// the original five question-bank builders. Topics target entry-level work.
const profiles = [
  {
    role: 'DevOps Engineer', group: 'webMobile', groupLabel: 'Hạ tầng, DevOps & Cloud', prefix: 'DEVOPS',
    aliases: ['devops engineer', 'devops fresher', 'junior devops engineer'],
    sources: ['https://docs.docker.com/get-started/', 'https://docs.github.com/en/actions', 'https://kubernetes.io/docs/concepts/'],
    foundation: [
      'phân biệt container Docker với máy ảo và trường hợp phù hợp cho từng loại',
      'vai trò của CI và CD trong quy trình phát hành phần mềm',
      'các bước một Docker image đi từ Dockerfile đến container đang chạy',
      'biến môi trường và secret khác nhau thế nào khi cấu hình ứng dụng',
      'log, metric và trace giúp tìm lỗi trong một dịch vụ ra sao',
      'mục đích của health check và readiness check trong triển khai dịch vụ'
    ],
    practical: [
      'viết Dockerfile đơn giản cho ứng dụng web và giảm kích thước image',
      'tạo workflow GitHub Actions để chạy kiểm tra khi có pull request',
      'đưa cấu hình development và production ra khỏi source code',
      'đọc log container và xác định vì sao ứng dụng thoát ngay sau khi khởi động',
      'triển khai một bản cập nhật có health check và khả năng rollback',
      'lưu và khôi phục dữ liệu khi container được tạo lại',
      'dùng Docker Compose để chạy ứng dụng cùng database cục bộ',
      'theo dõi trạng thái pipeline và thông báo lỗi triển khai cho nhóm'
    ],
    scenario: [
      'pipeline CI đột nhiên thất bại dù lần commit trước chạy thành công',
      'container báo running nhưng người dùng không truy cập được ứng dụng',
      'bản phát hành mới gây lỗi và cần quay lại phiên bản ổn định',
      'ứng dụng hết dung lượng đĩa sau nhiều ngày ghi log',
      'secret vô tình xuất hiện trong log pipeline',
      'hai môi trường staging và production có kết quả chạy khác nhau'
    ],
    cv: [
      'Dockerfile hoặc Docker Compose em từng dùng trong bài tập hay dự án',
      'workflow tự động build hoặc test mà em đã cấu hình',
      'lỗi triển khai cụ thể em từng điều tra từ log',
      'cách em quản lý cấu hình và secret trong một project học tập',
      'lần em phối hợp với developer để sửa pipeline hoặc quy trình release'
    ],
    behavioral: [
      'developer muốn deploy gấp nhưng các bước kiểm tra CI chưa hoàn tất',
      'em chưa từng thao tác với một công cụ hạ tầng đang được nhóm sử dụng',
      'một thay đổi cấu hình của em làm môi trường test bị gián đoạn',
      'em cần bàn giao ca trực và các cảnh báo chưa xử lý xong',
      'nhóm bất đồng về mức tự động hóa nên bổ sung cho một project nhỏ'
    ]
  },
  {
    role: 'Cloud Engineer (AWS/GCP/Azure)', group: 'webMobile', groupLabel: 'Hạ tầng, DevOps & Cloud', prefix: 'CLOUD',
    aliases: ['cloud engineer', 'aws cloud engineer', 'gcp cloud engineer', 'azure cloud engineer', 'junior cloud engineer'],
    sources: ['https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html', 'https://cloud.google.com/docs/overview', 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/'],
    foundation: [
      'khác nhau giữa region, availability zone và edge location',
      'IAM user, role và policy kiểm soát quyền truy cập cloud ra sao',
      'VPC và subnet giúp cô lập tài nguyên mạng như thế nào',
      'object storage như S3 khác block storage gắn với máy ảo ra sao',
      'autoscaling giải quyết vấn đề tải biến động nhưng có giới hạn gì',
      'shared responsibility model phân chia trách nhiệm giữa nhà cung cấp và khách hàng thế nào'
    ],
    practical: [
      'tạo một máy ảo có quyền truy cập tối thiểu và chỉ mở cổng cần thiết',
      'đưa file tĩnh lên object storage và giới hạn quyền truy cập phù hợp',
      'tạo cảnh báo khi CPU hoặc dung lượng đĩa vượt ngưỡng',
      'ước tính chi phí cơ bản trước khi tạo tài nguyên cho môi trường thử nghiệm',
      'kiểm tra route table và security group khi máy ảo không kết nối được',
      'gắn IAM role cho ứng dụng thay vì lưu access key trong mã nguồn',
      'lập lịch backup và xác minh có thể khôi phục dữ liệu',
      'dùng tag để nhận biết chủ sở hữu và môi trường của tài nguyên'
    ],
    scenario: [
      'hóa đơn cloud tăng bất thường sau khi bật một dịch vụ mới',
      'máy ảo không truy cập được internet dù trạng thái đang running',
      'ứng dụng trả lỗi quyền khi đọc một object trong storage',
      'một public bucket chứa dữ liệu mà nhóm dự kiến để riêng tư',
      'dịch vụ ở một zone gặp sự cố và ứng dụng mất kết nối',
      'snapshot backup tồn tại nhưng lần thử khôi phục không thành công'
    ],
    cv: [
      'kiến trúc cloud em đã dựng trong lab hoặc đồ án và lý do chọn dịch vụ',
      'policy IAM em từng viết và cách kiểm tra quyền tối thiểu',
      'cảnh báo chi phí hoặc hiệu năng em từng cấu hình',
      'cách em kiểm tra backup bằng một lần khôi phục thử',
      'một lỗi mạng cloud em gặp và các bước khoanh vùng nguyên nhân'
    ],
    behavioral: [
      'nhóm yêu cầu cấp quyền administrator cho tiện thử nghiệm',
      'em được giao một dịch vụ cloud mới nhưng tài liệu nội bộ chưa đầy đủ',
      'em phát hiện tài nguyên thử nghiệm bị bỏ quên gây phát sinh chi phí',
      'một thay đổi quyền truy cập có thể ảnh hưởng đến người dùng khác',
      'em cần giải thích cho developer vì sao phải kiểm tra bảo mật trước khi mở dịch vụ'
    ]
  },
  {
    role: 'System Administrator', group: 'webMobile', groupLabel: 'Hạ tầng, DevOps & Cloud', prefix: 'SYSADMIN',
    aliases: ['system administrator', 'sysadmin', 'linux system administrator', 'junior system administrator'],
    sources: ['https://www.kernel.org/doc/html/latest/', 'https://ubuntu.com/server/docs', 'https://learn.microsoft.com/en-us/windows-server/'],
    foundation: [
      'process và service khác nhau thế nào trên Linux',
      'quyền read, write, execute và permission dạng octal được áp dụng ra sao',
      'systemd quản lý service và startup dependency như thế nào',
      'DNS resolver được máy khách dùng trong quá trình mở một domain ra sao',
      'log hệ thống thường nằm ở đâu và journald hỗ trợ tra cứu thế nào',
      'backup đầy đủ và incremental khác nhau về thời gian phục hồi ra sao'
    ],
    practical: [
      'kiểm tra process nào đang chiếm CPU hoặc bộ nhớ trên máy Linux',
      'tạo user, group và quyền thư mục theo nguyên tắc cần đủ dùng',
      'khởi động lại service và kiểm tra lý do service không lên',
      'tìm các file log lớn và xử lý an toàn khi ổ đĩa gần đầy',
      'kiểm tra DNS, route và kết nối cổng từ một máy chủ',
      'lên lịch một tác vụ định kỳ và xác nhận log thực thi',
      'cập nhật package trên máy thử nghiệm và chuẩn bị cách quay lại',
      'thực hiện backup thư mục cấu hình và kiểm tra bản backup'
    ],
    scenario: [
      'máy chủ báo hết dung lượng và một ứng dụng bắt đầu ghi lỗi',
      'service không tự khởi động lại sau khi máy chủ reboot',
      'một user báo không đọc được thư mục dù đã được thêm vào group',
      'CPU tăng cao sau khi triển khai một phiên bản mới',
      'backup chạy thành công nhưng file phục hồi không mở được',
      'nhiều lần đăng nhập thất bại xuất hiện trên một tài khoản hệ thống'
    ],
    cv: [
      'máy ảo Linux hoặc Windows Server em từng cài đặt và cấu hình',
      'script hoặc cron task em đã viết để tự động hóa công việc lặp lại',
      'sự cố service hoặc tài nguyên hệ thống em đã điều tra trong lab',
      'quy trình backup và restore em đã thử nghiệm',
      'cách em ghi lại thay đổi cấu hình để người khác có thể kiểm tra'
    ],
    behavioral: [
      'người dùng báo lỗi hệ thống nhưng chưa mô tả rõ các bước tái hiện',
      'em cần thực hiện thay đổi máy chủ trong khung giờ có người sử dụng',
      'em nhận cảnh báo ngoài giờ nhưng chưa biết mức độ ảnh hưởng',
      'một thao tác của em gây gián đoạn ngắn và cần thông báo cho nhóm',
      'em cần bàn giao thông tin tài khoản hoặc cấu hình một cách an toàn'
    ]
  },
  {
    role: 'Network Engineer', group: 'webMobile', groupLabel: 'Hạ tầng, DevOps & Cloud', prefix: 'NETWORK',
    aliases: ['network engineer', 'junior network engineer', 'network administrator', 'ky su mang'],
    sources: ['https://www.rfc-editor.org/rfc/rfc1918', 'https://www.rfc-editor.org/rfc/rfc1034', 'https://www.wireshark.org/docs/'],
    foundation: [
      'địa chỉ IP private và public khác nhau ở phạm vi định tuyến nào',
      'subnet mask và CIDR xác định số địa chỉ usable ra sao',
      'DNS phân giải tên miền thành địa chỉ IP qua những bước nào',
      'DHCP cấp địa chỉ IP động cho thiết bị theo quy trình nào',
      'switch layer 2 và router layer 3 chuyển tiếp lưu lượng khác nhau ra sao',
      'TCP handshake khác UDP ở độ tin cậy và thiết lập kết nối thế nào'
    ],
    practical: [
      'chia một dải mạng nhỏ thành subnet cho các nhóm thiết bị',
      'dùng ping, traceroute và nslookup để kiểm tra một lỗi kết nối',
      'đọc bảng ARP và xác định địa chỉ MAC của thiết bị cùng mạng',
      'cấu hình VLAN cơ bản và mô tả cách kiểm tra thiết bị được gán đúng VLAN',
      'lọc một capture Wireshark để tìm DNS query bị timeout',
      'kiểm tra DHCP lease khi máy khách nhận địa chỉ APIPA',
      'xác minh firewall rule chỉ mở đúng cổng dịch vụ cần dùng',
      'ghi lại sơ đồ cổng switch và địa chỉ IP để hỗ trợ bàn giao'
    ],
    scenario: [
      'laptop vừa chuyển VLAN, nhận IP mới nhưng không học được địa chỉ MAC của gateway',
      'nhiều thiết bị cùng lúc nhận IP trùng nhau',
      'DNS cache vẫn trả về địa chỉ máy chủ cũ sau khi dịch vụ vừa được chuyển sang IP mới',
      'mạng chậm chỉ xảy ra ở một VLAN trong khi các VLAN khác bình thường',
      'gói tin đến server nhưng phản hồi không quay lại máy khách',
      'một port switch không hoạt động sau khi thay thiết bị đầu cuối'
    ],
    cv: [
      'sơ đồ subnet hoặc VLAN em đã thiết kế trong lab hay đồ án',
      'lệnh mạng em đã dùng để tìm nguyên nhân của một lỗi kết nối',
      'capture Wireshark em đã phân tích và dấu hiệu em tìm thấy',
      'cách em ghi lại địa chỉ, port và kết quả kiểm tra mạng',
      'lỗi DNS hoặc DHCP em từng mô phỏng và cách em xác nhận đã sửa'
    ],
    behavioral: [
      'người dùng báo mất mạng nhưng chỉ có thể mô tả bằng ngôn ngữ thông thường',
      'em cần thay đổi cấu hình switch và muốn hạn chế ảnh hưởng người dùng',
      'log hoặc sơ đồ bàn giao không đầy đủ khi em nhận ca xử lý',
      'developer và network team đưa ra hai giả thuyết khác nhau về lỗi',
      'em phát hiện một cổng mạng đang mở rộng hơn yêu cầu công việc'
    ]
  },
  {
    role: 'Infrastructure Engineer', group: 'webMobile', groupLabel: 'Hạ tầng, DevOps & Cloud', prefix: 'INFRA',
    aliases: ['infrastructure engineer', 'junior infrastructure engineer', 'it infrastructure engineer'],
    sources: ['https://developer.hashicorp.com/terraform/docs', 'https://docs.docker.com/get-started/', 'https://prometheus.io/docs/introduction/overview/'],
    foundation: [
      'server, storage và network phối hợp để cung cấp một ứng dụng nội bộ ra sao',
      'virtual machine và container phù hợp với hai kiểu workload nào',
      'Infrastructure as Code giúp theo dõi thay đổi hạ tầng thế nào',
      'monitoring metric khác alert ở mục đích sử dụng nào',
      'load balancer phân phối request và kiểm tra health backend ra sao',
      'RTO và RPO giúp xác định yêu cầu backup, disaster recovery thế nào'
    ],
    practical: [
      'dựng một môi trường thử nghiệm gồm máy chủ, mạng và lưu trữ cơ bản',
      'đọc Terraform plan để phát hiện tài nguyên sắp bị thay đổi hoặc xóa',
      'thêm dashboard theo dõi CPU, bộ nhớ, ổ đĩa và trạng thái service',
      'cấu hình health check cho một backend sau load balancer',
      'kiểm tra dung lượng storage và xác định tốc độ tăng theo thời gian',
      'tạo bản kê tài nguyên với owner, môi trường và mục đích sử dụng',
      'thực hiện cập nhật hạ tầng trên môi trường staging trước production',
      'ghi lại sơ đồ kết nối và các bước khôi phục dịch vụ cơ bản'
    ],
    scenario: [
      'dashboard báo dung lượng volume gần đầy nhưng ứng dụng vẫn chạy',
      'một backend bị health check đánh dấu unhealthy sau khi deploy',
      'Terraform plan đề xuất thay thế một tài nguyên đang được sử dụng',
      'mất kết nối giữa ứng dụng và database sau thay đổi network rule',
      'nhiều server gặp cảnh báo cùng lúc sau một thay đổi dùng chung',
      'nhóm phát hiện một máy ảo thử nghiệm không rõ chủ sở hữu'
    ],
    cv: [
      'sơ đồ hạ tầng em đã dựng trong lab và luồng request đi qua các thành phần',
      'module hoặc cấu hình IaC em đã viết và cách em kiểm tra plan',
      'dashboard hoặc alert em từng tạo cho một môi trường thử nghiệm',
      'bảng kiểm kê server với owner, môi trường và ngày cập nhật gần nhất',
      'một sự cố kết nối hạ tầng em đã khoanh vùng bằng log hoặc metric'
    ],
    behavioral: [
      'một nhóm yêu cầu thay đổi production nhưng chưa có kế hoạch rollback',
      'em phát hiện tài liệu sơ đồ hạ tầng không còn khớp với thực tế',
      'một cảnh báo ảnh hưởng nhiều nhóm và cần xác định người phụ trách',
      'em chưa hiểu rõ tác động của một thay đổi IaC được đề xuất',
      'em cần ưu tiên giữa ticket người dùng và công việc bảo trì định kỳ'
    ]
  },
  {
    role: 'Business Analyst (IT)', group: 'productUX', groupLabel: 'Sản phẩm & Quản trị', prefix: 'BA_IT',
    aliases: ['business analyst it', 'it business analyst', 'business analyst (it)', 'ba it', 'chuyen vien phan tich nghiep vu it'],
    sources: ['https://www.iiba.org/knowledgehub/business-analysis-standard/', 'https://www.agilealliance.org/glossary/user-stories/', 'https://www.atlassian.com/agile/project-management/acceptance-criteria'],
    foundation: [
      'phân biệt yêu cầu business, yêu cầu user và yêu cầu chức năng',
      'user story thường có cấu trúc nào và giúp mô tả giá trị người dùng ra sao',
      'acceptance criteria khác tài liệu đặc tả chi tiết ở mục đích nào',
      'luồng as-is và to-be giúp làm rõ thay đổi nghiệp vụ như thế nào',
      'stakeholder, end user và system owner có thể có nhu cầu khác nhau ra sao',
      'UAT xác nhận điều gì trước khi một tính năng được nghiệm thu'
    ],
    practical: [
      'chuyển một yêu cầu “báo cáo nhanh hơn” thành câu hỏi và tiêu chí đo được',
      'viết user story kèm acceptance criteria cho chức năng quên mật khẩu',
      'vẽ luồng xử lý khi người dùng tạo và xác nhận một đơn hàng',
      'lập danh sách trường hợp kiểm thử UAT cho màn hình đăng ký tài khoản',
      'dùng SQL cơ bản để kiểm tra số lượng bản ghi theo trạng thái đơn hàng',
      'ghi lại quyết định, giả định và câu hỏi còn mở trong buổi trao đổi',
      'phân tích tác động khi một trường dữ liệu đổi từ tùy chọn thành bắt buộc',
      'ưu tiên backlog khi nhiều bên liên quan đề nghị tính năng cùng lúc'
    ],
    scenario: [
      'hai stakeholder mô tả quy tắc tính phí khác nhau',
      'developer hiểu acceptance criteria theo cách khác với người dùng',
      'người dùng đổi yêu cầu sau khi nhóm đã bắt đầu phát triển',
      'UAT phát hiện dữ liệu hiển thị sai nhưng chưa rõ lỗi ở rule hay dữ liệu nguồn',
      'một báo cáo không khớp số liệu giữa màn hình và file xuất',
      'yêu cầu ban đầu quá rộng và thời gian trao đổi với stakeholder có hạn'
    ],
    cv: [
      'đồ án hoặc case study em từng chuyển yêu cầu người dùng thành user story',
      'sơ đồ quy trình nghiệp vụ em đã vẽ và cách kiểm tra với stakeholder',
      'test case UAT em từng chuẩn bị và cách ghi nhận kết quả',
      'truy vấn SQL hoặc bảng dữ liệu em từng dùng để xác minh báo cáo',
      'một yêu cầu mơ hồ em đã làm rõ bằng câu hỏi hoặc ví dụ cụ thể'
    ],
    behavioral: [
      'stakeholder bận và liên tục hoãn buổi xác nhận yêu cầu',
      'developer đề nghị bỏ một acceptance criterion vì thời gian gấp',
      'em phát hiện tài liệu mình viết thiếu một trường hợp ngoại lệ',
      'người dùng phản hồi tính năng khó hiểu dù đã đáp ứng yêu cầu ghi nhận',
      'em cần trình bày một rủi ro nghiệp vụ cho người không chuyên kỹ thuật'
    ]
  }
];

const categorySpecs = [
  ['foundation', 'foundation', 'FOUND', 'basic', 'fresher_intern'],
  ['practical_skills', 'practical', 'SKILL', 'basic', 'fresher_intern'],
  ['scenario', 'scenario', 'SCENARIO', 'intermediate', 'junior'],
  ['cv_validation', 'cv', 'CV', 'basic', 'fresher_intern'],
  ['behavioral', 'behavioral', 'BEHAVIOR', 'basic', 'fresher_intern']
];

function createBank(profile) {
  const questions = [];
  for (const [category, profileKey, idPart, difficulty, seniority] of categorySpecs) {
    const topics = profile[profileKey];
    topics.forEach((topic, index) => {
      let question;
      if (category === 'foundation') {
        question = `Ở mức Intern/Fresher ${profile.role}, em hãy giải thích ${topic} và nêu một ví dụ dễ hiểu.`;
      } else if (category === 'practical_skills') {
        question = `Khi được giao ${topic}, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?`;
      } else if (category === 'scenario') {
        question = profile.role === 'Network Engineer'
          ? `Một ticket mạng mô tả tình huống: ${topic}. Em sẽ kiểm tra theo từng lớp mạng bằng lệnh hoặc bằng chứng nào để khoanh vùng?`
          : `Trong ca hỗ trợ của ${profile.role}, ${topic}. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?`;
      } else if (category === 'cv_validation') {
        question = profile.role === 'Cloud Engineer (AWS/GCP/Azure)' && index === 1
          ? `Hãy trình bày policy IAM em từng viết trong lab: principal được phép làm gì, scope được giới hạn ra sao và em xác minh quyền thế nào?`
          : `Trong bài tập, lab hoặc dự án học tập, em đã thực hiện ${topic} ra sao? Hãy nói rõ phần em trực tiếp làm.`;
      } else {
        question = `Khi làm việc ở vị trí ${profile.role}, nếu ${topic}, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?`;
      }

      questions.push({
        id: `${profile.prefix}-${idPart}-${String(index + 1).padStart(2, '0')}`,
        role: profile.role,
        category,
        difficulty,
        seniority,
        question,
        evaluationCriteria: [
          `Giải thích đúng trọng tâm ${category === 'foundation' ? 'khái niệm' : 'quy trình'} gắn với ${profile.role}.`,
          'Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.',
          'Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật.'
        ],
        followUps: [
          `Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?`,
          `Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?`
        ],
        tags: [profile.role, category, profile.prefix],
        sourceRefs: [profile.sources[index % profile.sources.length], 'Tình huống phỏng vấn tự biên soạn - JobReady AI'],
        redFlags: [
          'Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.',
          'Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn.'
        ]
      });
    });
  }

  return {
    role: profile.role,
    group: profile.group,
    groupLabel: profile.groupLabel,
    aliases: profile.aliases,
    questions
  };
}

const banks = profiles.map(createBank);
const output = `import { RoleQuestionBank } from './types';\n\n// Ngân hàng chuyên môn cho các vị trí IT còn thiếu (Intern/Fresher/Junior).\nexport const additionalITQuestionBanks: RoleQuestionBank[] = ${JSON.stringify(banks, null, 2)};\n`;
const target = path.join(__dirname, '..', '..', 'src', 'data', 'interview-questions', 'additional-it-roles.ts');
fs.writeFileSync(target, output, 'utf8');
console.log(`Generated ${banks.length} IT role banks, ${banks.reduce((sum, bank) => sum + bank.questions.length, 0)} questions.`);
