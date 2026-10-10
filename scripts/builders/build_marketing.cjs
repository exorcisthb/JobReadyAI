const fs = require('node:fs');
const path = require('node:path');

// Role-specific interview banks for entry-level Marketing roles (0–<2 years).
const profiles = [
  {
    role: 'Brand Marketing Assistant (Intern/Fresher)', prefix: 'BRAND_MKT', groupLabel: 'Thương hiệu & Sản phẩm',
    aliases: ['brand marketing intern', 'brand marketing assistant', 'brand assistant', 'brand intern'],
    refs: ['https://www.ama.org/topics/branding/', 'https://vn.linkedin.com/jobs/brand-marketing-intern-jobs'],
    foundation: ['brand positioning giúp thương hiệu được nhận biết khác biệt với đối thủ như thế nào', 'brand guideline thường quy định những yếu tố nào về hình ảnh và giọng điệu', 'campaign brief cần có mục tiêu, đối tượng và thông điệp nào', 'brand awareness khác purchase intent ở cách đo lường nào', 'earned, owned và paid media khác nhau ra sao trong chiến dịch thương hiệu', 'vai trò của insight người tiêu dùng khi xây dựng thông điệp thương hiệu'],
    practical: ['đọc brief và tóm tắt mục tiêu, đối tượng, thông điệp thành một trang', 'kiểm tra nội dung thiết kế với brand guideline trước khi gửi duyệt', 'lập lịch đầu việc và người phụ trách cho một chiến dịch nhỏ', 'thu thập phản hồi khách hàng từ bình luận và khảo sát cơ bản', 'theo dõi tiến độ asset với agency và các nhóm nội bộ', 'tổng hợp chỉ số reach, engagement và lượt nhắc thương hiệu', 'đối chiếu nội dung được xuất bản với phiên bản đã duyệt', 'chuẩn bị báo cáo sau chiến dịch bằng bảng tính và slide'],
    scenario: ['một asset sắp đăng dùng sai logo so với brand guideline', 'brief yêu cầu tăng nhận diện nhưng chỉ cung cấp chỉ số doanh số', 'hai nhóm gửi thông điệp khác nhau cho cùng một chiến dịch', 'agency báo trễ asset ngay trước ngày ra mắt', 'bình luận người dùng cho thấy thông điệp bị hiểu sai', 'một claim về sản phẩm chưa có nguồn xác minh nhưng được đề nghị đưa vào nội dung'],
    cv: ['một bài tập hoặc dự án thương hiệu em đã tham gia và phần việc do em thực hiện', 'cách em biến một brief thành danh sách đầu việc và deadline', 'mẫu nội dung hoặc asset em từng kiểm tra theo hướng dẫn thương hiệu', 'một báo cáo chiến dịch em đã làm và cách em chọn chỉ số', 'ví dụ em nhận góp ý và sửa sản phẩm truyền thông'],
    behavioral: ['em sẽ làm gì khi nhận góp ý chung chung như “chưa đúng tinh thần thương hiệu”', 'một deadline chiến dịch trùng với nhiều đầu việc được giao cùng lúc', 'em phát hiện nội dung đã đăng khác bản được duyệt', 'đồng đội muốn dùng hình ảnh chưa rõ quyền sử dụng', 'em chưa hiểu yêu cầu từ quản lý nhưng hạn chót đang đến gần']
  },
  {
    role: 'Product Marketing Associate (Junior)', prefix: 'PRODUCT_MKT', groupLabel: 'Thương hiệu & Sản phẩm',
    aliases: ['product marketing associate', 'product marketing intern', 'junior product marketing', 'product marketing assistant'],
    refs: ['https://www.productmarketingalliance.com/what-is-product-marketing/', 'https://vn.linkedin.com/jobs/product-marketing-intern-jobs'],
    foundation: ['product marketing kết nối sản phẩm, khách hàng và hoạt động go-to-market thế nào', 'value proposition mô tả giá trị sản phẩm cho một nhóm khách hàng ra sao', 'persona cần dựa trên dữ liệu và hành vi nào thay vì giả định', 'positioning khác tagline quảng cáo ở mục đích nào', 'feature, benefit và use case khác nhau thế nào khi giới thiệu sản phẩm', 'adoption, activation và retention phản ánh các giai đoạn nào của hành trình người dùng'],
    practical: ['tổng hợp phản hồi người dùng thành nhóm vấn đề và câu hỏi cần xác minh', 'so sánh thông điệp và tính năng của một số đối thủ từ nguồn công khai', 'viết bản nháp value proposition cho một nhóm người dùng cụ thể', 'chuyển thông tin tính năng từ nhóm sản phẩm thành nội dung dễ hiểu', 'lập checklist phối hợp nội dung cho một đợt ra mắt nhỏ', 'kiểm tra landing page và FAQ có nhất quán với thông tin sản phẩm không', 'theo dõi phản hồi và chỉ số cơ bản sau khi ra mắt tính năng', 'chuẩn bị tài liệu nội bộ để nhóm bán hàng hiểu điểm khác biệt sản phẩm'],
    scenario: ['người dùng hiểu sai tính năng sau khi đọc nội dung ra mắt', 'đối thủ công bố tính năng tương tự ngay trước ngày chiến dịch', 'nhóm sản phẩm đổi phạm vi tính năng nhưng landing page đã hoàn tất', 'phản hồi người dùng và ý kiến nội bộ về ưu tiên tính năng trái ngược nhau', 'tài liệu bán hàng đưa ra lợi ích chưa được sản phẩm xác nhận', 'lượt đăng ký tăng nhưng người dùng không hoàn tất bước kích hoạt'],
    cv: ['một sản phẩm hoặc dự án em từng nghiên cứu và cách em xác định người dùng', 'ví dụ em giải thích một tính năng phức tạp bằng ngôn ngữ đơn giản', 'cách em tìm hiểu đối thủ và ghi lại nguồn thông tin', 'một nội dung launch hoặc tài liệu sản phẩm em đã đóng góp', 'cách em dùng phản hồi để đề xuất câu hỏi hoặc cải tiến tiếp theo'],
    behavioral: ['em cần giải thích khác biệt giữa hai nhóm sản phẩm có ý kiến không thống nhất', 'quản lý yêu cầu nội dung nhanh nhưng thông tin tính năng chưa được xác nhận', 'em nhận ra giả định về persona của mình chưa có bằng chứng', 'một nhóm liên quan phản hồi muộn khiến lịch ra mắt có nguy cơ trễ', 'em sẽ báo cáo thế nào khi kết quả chiến dịch không đạt mục tiêu ban đầu']
  },
  {
    role: 'Trade Marketing Assistant (Intern/Fresher)', prefix: 'TRADE_MKT', groupLabel: 'Trade & Nghiên cứu thị trường',
    aliases: ['trade marketing intern', 'trade marketing assistant', 'trade marketing fresher'],
    refs: ['https://vn.linkedin.com/jobs/view/internship-2026-trade-marketing-intern-modern-trade-at-heineken-vietnam-4329727837', 'https://www.nielsen.com/insights/'],
    foundation: ['trade marketing hỗ trợ mục tiêu thương hiệu và bán hàng tại điểm bán ra sao', 'sell-in và sell-out khác nhau thế nào', 'POSM là gì và cần phù hợp với những yếu tố nào tại cửa hàng', 'promotion mechanics như giảm giá, quà tặng và combo cần được ghi rõ thế nào', 'khác biệt cơ bản giữa kênh modern trade và general trade', 'chỉ số tham gia chương trình và doanh số tăng thêm cần được hiểu thận trọng ra sao'],
    practical: ['kiểm tra danh sách POSM theo cửa hàng, số lượng và hạn giao', 'lập checklist triển khai một chương trình khuyến mãi tại điểm bán', 'ghi nhận hình ảnh trưng bày theo tiêu chí đã thống nhất', 'đối chiếu dữ liệu sell-out trước và trong thời gian chương trình', 'theo dõi tiến độ giao vật phẩm và xác nhận với cửa hàng', 'tổng hợp chi phí, phạm vi triển khai và kết quả của activation', 'kiểm tra chương trình tại cửa hàng có đúng điều kiện áp dụng không', 'chuẩn bị bảng theo dõi các vấn đề phát sinh và người phụ trách'],
    scenario: ['POSM giao thiếu cho một số cửa hàng trước ngày kích hoạt', 'cửa hàng áp dụng sai mức khuyến mãi trên bảng giá', 'ảnh kiểm tra cho thấy vật phẩm bị che khuất hoặc đặt sai vị trí', 'dữ liệu sell-out từ hai cửa hàng có đơn vị tính khác nhau', 'nhà cung cấp báo trễ trong khi chương trình đã được truyền thông', 'quản lý yêu cầu báo cáo hiệu quả nhưng dữ liệu sau chương trình chưa đầy đủ'],
    cv: ['một dự án sự kiện, bán hàng hoặc activation em từng hỗ trợ', 'cách em lập bảng theo dõi tiến độ và kiểm tra hạng mục tại điểm bán', 'ví dụ em dùng Excel để tổng hợp dữ liệu hoặc kiểm tra sai lệch', 'một lần em phối hợp với nhiều bên để hoàn thành đầu việc đúng hạn', 'cách em đánh giá một hoạt động khuyến mãi từ mục tiêu đến kết quả'],
    behavioral: ['cửa hàng phản ánh chương trình không rõ nhưng người phụ trách chưa trả lời', 'em phát hiện số liệu mình gửi có sai sót sau khi báo cáo', 'đồng nghiệp yêu cầu xác nhận hình ảnh trưng bày chưa đạt chuẩn', 'nhiều điểm bán cần hỗ trợ cùng lúc và em phải ưu tiên', 'em được giao đi khảo sát nhưng chưa rõ tiêu chí ghi nhận']
  },
  {
    role: 'Market Research Assistant (Intern/Fresher)', prefix: 'MKT_RESEARCH', groupLabel: 'Trade & Nghiên cứu thị trường',
    aliases: ['market research intern', 'market research assistant', 'consumer insights assistant', 'consumer research intern'],
    refs: ['https://www.esomar.org/what-we-do/code-guidelines', 'https://www.qualtrics.com/experience-management/research/market-research/'],
    foundation: ['mục tiêu nghiên cứu cần chuyển thành câu hỏi nghiên cứu cụ thể thế nào', 'định tính và định lượng phù hợp với loại câu hỏi nào', 'population, sample và sampling bias khác nhau ra sao', 'câu hỏi khảo sát dẫn dắt có thể làm sai lệch câu trả lời thế nào', 'primary research và desk research có ưu nhược điểm gì', 'ẩn danh và đồng thuận tham gia cần được bảo đảm thế nào khi thu thập dữ liệu'],
    practical: ['tìm nguồn thứ cấp đáng tin và ghi lại ngày truy cập, phạm vi, giới hạn', 'chuyển mục tiêu nghiên cứu thành câu hỏi khảo sát trung lập', 'kiểm tra bảng dữ liệu để phát hiện ô trống, giá trị lặp và sai định dạng', 'lập bảng mã hóa câu trả lời mở theo chủ đề nhất quán', 'tóm tắt kết quả khảo sát bằng tỷ lệ và quy mô mẫu rõ ràng', 'đối chiếu phát hiện với câu hỏi nghiên cứu ban đầu', 'trình bày một insight cùng bằng chứng và giới hạn của dữ liệu', 'lưu tài liệu nghiên cứu và dữ liệu theo quy tắc bảo mật nhóm'],
    scenario: ['mẫu khảo sát chủ yếu đến từ một nhóm bạn bè của thương hiệu', 'hai nguồn báo cáo quy mô thị trường đưa ra con số khác nhau', 'người trả lời bỏ qua nhiều câu hỏi nhạy cảm', 'kết quả định tính không trùng với xu hướng trong khảo sát', 'quản lý muốn kết luận nhân quả từ dữ liệu chỉ cho thấy tương quan', 'bảng dữ liệu chứa thông tin nhận dạng cá nhân không cần cho phân tích'],
    cv: ['một bài nghiên cứu hoặc dự án môn học em đã làm và câu hỏi nghiên cứu', 'cách em tìm, đánh giá và ghi nguồn tài liệu thứ cấp', 'một lần em làm sạch dữ liệu và các quy tắc em áp dụng', 'cách em biến kết quả khảo sát thành insight có dẫn chứng', 'một hạn chế của dữ liệu trong dự án em từng thực hiện'],
    behavioral: ['người yêu cầu nghiên cứu muốn kết quả xác nhận sẵn giả thuyết của họ', 'em phát hiện bảng khảo sát có lỗi sau khi đã thu thập một phần câu trả lời', 'deadline ngắn nhưng mẫu hiện tại chưa đại diện cho đối tượng mục tiêu', 'đồng đội diễn giải quá mức một kết quả có mẫu nhỏ', 'em cần nói rõ với quản lý rằng dữ liệu chưa đủ để kết luận']
  },
  {
    role: 'Media Planning Assistant (Intern/Fresher)', prefix: 'MEDIA_PLAN', groupLabel: 'Media & Affiliate',
    aliases: ['media planning intern', 'media planning assistant', 'media planner assistant', 'junior media planner'],
    refs: ['https://www.iab.com/insights/', 'https://vn.linkedin.com/jobs/marketing-internship-jobs'],
    foundation: ['reach và impressions khác nhau thế nào', 'frequency cho biết điều gì và tần suất quá cao có thể gây vấn đề gì', 'CPM, CPC và CTR được tính và dùng trong trường hợp nào', 'vai trò của media brief trong việc chọn kênh truyền thông', 'paid, owned và earned media khác nhau thế nào khi lập media mix', 'UTM parameters hỗ trợ theo dõi nguồn truy cập ra sao'],
    practical: ['chuyển mục tiêu chiến dịch thành danh sách kênh và chỉ số cần theo dõi', 'tính CPM từ ngân sách và số impressions đã biết', 'cập nhật bảng pacing ngân sách theo ngày và kênh', 'đối chiếu số liệu phân phối giữa ad platform và báo cáo tổng hợp', 'kiểm tra link đích và UTM trước khi chiến dịch chạy', 'tổng hợp reach, frequency, clicks và conversions theo format thống nhất', 'theo dõi booking và xác nhận thời gian chạy với publisher', 'ghi chú giả định và nguồn số liệu trong báo cáo media'],
    scenario: ['một kênh tiêu hết ngân sách nhanh nhưng chưa đạt lượng chuyển đổi dự kiến', 'báo cáo của publisher và nền tảng quảng cáo lệch số impressions', 'chiến dịch chưa phân phối đủ khi chỉ còn ít ngày chạy', 'link quảng cáo thiếu UTM khiến nguồn truy cập khó phân biệt', 'ngân sách bị cắt giữa chiến dịch và cần cập nhật pacing', 'một placement đề xuất có lượng reach cao nhưng không khớp đối tượng mục tiêu'],
    cv: ['một bài tập lập kế hoạch truyền thông em từng thực hiện', 'cách em kiểm tra một bảng số liệu quảng cáo trước khi tổng hợp', 'ví dụ em đã dùng Excel hoặc slide để trình bày kết quả', 'cách em chọn chỉ số phù hợp với mục tiêu nhận diện hoặc chuyển đổi', 'một lần em phải phối hợp deadline với nhóm nội dung hoặc agency'],
    behavioral: ['quản lý yêu cầu báo cáo ngay nhưng số liệu các kênh chưa cập nhật đồng thời', 'em phát hiện mình dùng sai đơn vị khi tính CPM', 'một publisher thúc em xác nhận placement chưa có trong kế hoạch duyệt', 'đội sáng tạo và media bất đồng về thời điểm chạy nội dung', 'em cần giải thích kết quả thấp mà chưa đủ dữ liệu kết luận nguyên nhân']
  },
  {
    role: 'Affiliate Marketing Executive (Junior)', prefix: 'AFFILIATE_MKT', groupLabel: 'Media & Affiliate',
    aliases: ['affiliate marketing junior', 'affiliate marketing executive', 'affiliate marketing intern', 'affiliate coordinator'],
    refs: ['https://impact.com/partnerships/affiliate/', 'https://careerviet.vn/vi/tim-viec-lam/affiliate-marketing-intern.35C88968.html'],
    foundation: ['affiliate publisher, advertiser và network đảm nhiệm các vai trò nào', 'tracking link và cookie hỗ trợ ghi nhận chuyển đổi ra sao', 'CPA và commission rate ảnh hưởng đến chi phí chiến dịch thế nào', 'click, conversion và approved order là các trạng thái khác nhau ra sao', 'attribution window và last-click attribution ảnh hưởng báo cáo thế nào', 'dấu hiệu nào có thể khiến đơn hàng cần được kiểm tra trước khi duyệt hoa hồng'],
    practical: ['tạo và kiểm tra affiliate link có đúng landing page và mã chiến dịch', 'ghi nhận publisher, mức hoa hồng và điều kiện chương trình trong bảng theo dõi', 'đối chiếu click, đơn hàng và trạng thái duyệt từ báo cáo network', 'gửi brief sản phẩm và nội dung được phép sử dụng cho publisher', 'theo dõi lịch đăng và xác nhận link nội dung đã hoạt động', 'tính tỷ lệ chuyển đổi từ click sang đơn hàng được ghi nhận', 'tổng hợp hoa hồng dự kiến theo điều kiện đã thống nhất', 'lưu bằng chứng và ghi chú khi phát hiện dữ liệu tracking bất thường'],
    scenario: ['publisher báo có đơn nhưng dashboard chưa ghi nhận chuyển đổi', 'link affiliate chuyển người dùng đến trang sản phẩm đã hết hàng', 'một publisher dùng claim sản phẩm chưa được thương hiệu phê duyệt', 'số đơn tăng đột biến từ nguồn có hành vi click đáng ngờ', 'hai publisher cùng nhận ghi nhận cho một đơn theo cấu hình attribution', 'mức hoa hồng trong file đối soát khác thỏa thuận đã xác nhận'],
    cv: ['một dự án affiliate, cộng tác viên hoặc creator em từng phối hợp', 'cách em tạo link tracking và tự kiểm tra link trước khi gửi', 'một bảng theo dõi chuyển đổi hoặc hoa hồng em từng lập', 'cách em xử lý tình huống cần đối soát số liệu với đối tác', 'ví dụ em kiểm tra nội dung quảng bá có đúng brief và thông tin sản phẩm'],
    behavioral: ['publisher yêu cầu tăng hoa hồng ngoài phạm vi em được quyền duyệt', 'em phát hiện link của mình gắn sai mã chiến dịch sau khi nội dung đã đăng', 'đối tác phản ứng khi đơn bị từ chối vì không đạt điều kiện chương trình', 'quản lý cần số liệu gấp nhưng network chưa chốt trạng thái đơn', 'em nghi có gian lận nhưng chưa đủ bằng chứng để kết luận']
  }
];

const categorySpecs = [
  ['foundation', 'foundation', 'FOUND', 'basic', 'fresher_intern'],
  ['practical_skills', 'practical', 'SKILL', 'basic', 'fresher_intern'],
  ['scenario', 'scenario', 'SCENARIO', 'intermediate', 'junior'],
  ['cv_validation', 'cv', 'CV', 'basic', 'fresher_intern'],
  ['behavioral', 'behavioral', 'BEHAVIOR', 'basic', 'fresher_intern']
];

function makeBank(profile) {
  const questions = [];
  for (const [category, key, idPart, difficulty, seniority] of categorySpecs) {
    profile[key].forEach((topic, index) => {
      const question = category === 'foundation'
        ? `Ở mức Intern/Fresher ${profile.role}, em hãy giải thích ${topic} và nêu một ví dụ.`
        : category === 'practical_skills'
          ? `Nếu được giao ${topic}, em sẽ thực hiện theo trình tự nào và kiểm tra kết quả ra sao?`
          : category === 'scenario'
            ? `Tình huống trong công việc ${profile.role}: ${topic}. Em sẽ xác minh thông tin, xử lý và cập nhật cho ai?`
            : category === 'cv_validation'
              ? `Hãy kể về trải nghiệm của em với ${topic}. Em trực tiếp phụ trách phần nào, đã làm theo bước gì và kết quả ra sao?`
              : `Khi làm vị trí ${profile.role}, nếu ${topic}, em sẽ trao đổi và phối hợp để hoàn tất công việc ra sao?`;
      questions.push({
        id: `${profile.prefix}-${idPart}-${String(index + 1).padStart(2, '0')}`,
        role: profile.role, category, difficulty, seniority, question,
        evaluationCriteria: [
          `Nêu đúng nghiệp vụ nền tảng của ${profile.role}.`,
          'Trình bày được các bước làm phù hợp với phạm vi Intern/Fresher/Junior và cách kiểm tra kết quả.',
          'Biết kiểm tra nguồn dữ liệu, xin duyệt khi cần và báo cáo giới hạn hoặc rủi ro rõ ràng.'
        ],
        followUps: [
          'Em sẽ kiểm tra brief, nguồn dữ liệu hoặc hướng dẫn nào trước khi thực hiện?',
          'Nếu dữ liệu hoặc yêu cầu chưa đủ để kết luận, em sẽ xác minh và báo cho ai?'
        ],
        tags: [profile.role, category, profile.prefix, 'entry-level'],
        sourceRefs: [profile.refs[index % profile.refs.length], 'Tình huống phỏng vấn tự biên soạn - JobReady AI'],
        redFlags: [
          'Đưa ra kết luận hoặc số liệu nhưng không giải thích nguồn và cách kiểm tra.',
          'Không phân biệt rõ phần việc mình trực tiếp làm với phần do nhóm thực hiện.'
        ]
      });
    });
  }
  return { role: profile.role, group: 'marketing', groupLabel: profile.groupLabel, aliases: profile.aliases, questions };
}

const banks = profiles.map(makeBank);
const output = `import { RoleQuestionBank } from './types';\n\n// Entry-level Marketing interview banks for Intern/Fresher/Junior roles under 2 years.\nexport const marketingQuestionBanks: RoleQuestionBank[] = ${JSON.stringify(banks, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '..', '..', 'src', 'data', 'interview-questions', 'marketing.ts'), output, 'utf8');
console.log(`Generated ${banks.length} marketing role banks, ${banks.reduce((sum, bank) => sum + bank.questions.length, 0)} questions.`);
