const fs = require('node:fs');
const path = require('node:path');

// All profiles are scoped to entry-level communication work (under 2 years).
const profiles = [
  {
    role: 'Media Relations Assistant', prefix: 'MEDIA_REL', groupLabel: 'PR & Quan hệ báo chí',
    aliases: ['media relations assistant', 'media relations coordinator', 'press relations assistant'],
    refs: ['https://www.cision.com/resources/', 'https://www.prsa.org/about/all-about-pr'],
    foundation: ['media contact list cần được phân loại theo beat và khu vực như thế nào', 'pitch email khác thông cáo báo chí về mục đích và độ dài ra sao', 'embargo date và deadline phản hồi cần được xác nhận với phóng viên thế nào', 'media monitoring giúp biết một phóng viên đã đăng bài nào liên quan đến chủ đề nào', 'press clipping cần ghi nguồn, thời gian và liên kết để có thể kiểm chứng ra sao', 'người phát ngôn và đầu mối nhận câu hỏi báo chí có trách nhiệm khác nhau thế nào'],
    practical: ['cập nhật contact của phóng viên sau khi xác minh tòa soạn và chuyên mục', 'cá nhân hóa pitch email theo bài viết gần đây của phóng viên', 'theo dõi lịch gửi thông cáo, thời hạn embargo và phản hồi báo chí', 'sắp xếp lịch phỏng vấn giữa phóng viên và người phát ngôn', 'chuẩn bị media kit có bio, ảnh và thông tin đã được duyệt', 'ghi lại yêu cầu báo chí và chuyển câu hỏi chuyên môn đến đúng đầu mối', 'tổng hợp bài báo cùng sắc thái và nội dung nhắc đến thương hiệu', 'gửi follow-up lịch sự khi phóng viên chưa phản hồi pitch'],
    scenario: ['email pitch bị trả lại vì địa chỉ phóng viên đã thay đổi', 'phóng viên hỏi chi tiết sản phẩm nằm ngoài tài liệu đã duyệt', 'hai cuộc phỏng vấn bị đặt trùng lịch với cùng người phát ngôn', 'một bài đăng đã lên nhưng link trong press clipping không còn truy cập được', 'phóng viên yêu cầu phản hồi trong thời gian ngắn hơn quy trình duyệt nội bộ', 'media list có thông tin cá nhân chưa rõ nguồn thu thập'],
    cv: ['media list em từng xây dựng và tiêu chí xác minh từng liên hệ', 'email pitch em từng viết và cách em chọn phóng viên phù hợp', 'cách em phối hợp lịch phỏng vấn giữa nhiều người tham gia', 'báo cáo press clipping em từng tổng hợp và thông tin em đưa vào', 'một lần em chuyển câu hỏi báo chí đến đúng người phụ trách'],
    behavioral: ['phóng viên liên hệ em trực tiếp nhưng nội dung cần người phát ngôn trả lời', 'em phát hiện thông cáo gửi đi có sai địa chỉ liên hệ báo chí', 'một đầu mối nội bộ chưa phản hồi câu hỏi trước deadline của phóng viên', 'phóng viên không muốn nhận follow-up nhưng chiến dịch cần cập nhật tiến độ', 'em cần từ chối cung cấp thông tin chưa được công bố mà vẫn giữ quan hệ chuyên nghiệp']
  },
  {
    role: 'PR / Communications Executive', prefix: 'PR_COMMS', groupLabel: 'PR & Quan hệ báo chí',
    aliases: ['pr specialist', 'communications executive', 'pr communications executive'],
    refs: ['https://www.prsa.org/about/all-about-pr', 'https://www.cision.com/resources/'],
    foundation: ['mục tiêu và cấu trúc cơ bản của một thông cáo báo chí', 'media list cần những trường thông tin nào để gửi đúng phóng viên', 'key message khác slogan quảng cáo ở cách sử dụng nào', 'media monitoring giúp đội PR nhận biết chủ đề đang được nhắc đến ra sao', 'embargo và thông tin off the record cần được xác nhận như thế nào', 'earned media khác paid media ở quyền kiểm soát nội dung nào'],
    practical: ['soạn tiêu đề và sapo cho thông cáo ra mắt một tính năng mới', 'viết email pitch ngắn phù hợp với beat của một phóng viên', 'lập bảng theo dõi coverage gồm nguồn đăng, đường dẫn và sắc thái bài viết', 'kiểm tra tên riêng, số liệu và trích dẫn trước khi gửi nội dung cho báo chí', 'chuẩn bị bộ Q&A cơ bản cho buổi họp báo về một sản phẩm', 'cập nhật media list theo chuyên mục và thông tin liên hệ đã xác minh', 'phân nhóm bài coverage theo thông điệp, loại nguồn và sắc thái để nhận biết báo chí đang nhắc đến thương hiệu ra sao', 'điều chỉnh một key message cho thông cáo, website và lời phát biểu'],
    scenario: ['một bài báo đăng sai số liệu về sản phẩm trước giờ họp báo', 'phóng viên hỏi thông tin nhạy cảm chưa được người phát ngôn xác nhận', 'thông cáo đã gửi nhưng phát hiện tên đối tác bị viết sai', 'một bài đăng tiêu cực tăng nhanh lượt chia sẻ trong buổi tối', 'nhiều phóng viên cùng hỏi về một sự cố mà nội bộ chưa thống nhất thông tin', 'bài viết nhắc đến thương hiệu nhưng diễn giải sai phát ngôn trong thông cáo'],
    cv: ['thông cáo báo chí trong đồ án hoặc bài tập em đã tham gia soạn', 'cách em kiểm chứng thông tin trước khi đưa vào một nội dung PR', 'bảng theo dõi tin bài hoặc clipping report em từng thực hiện', 'một lần em điều chỉnh cách diễn đạt theo đối tượng truyền thông khác nhau', 'phần việc cụ thể em phụ trách trong một hoạt động PR của câu lạc bộ hoặc dự án'],
    behavioral: ['quản lý đề nghị đưa một tuyên bố chưa có nguồn xác nhận vào thông cáo', 'phóng viên gửi câu hỏi sát giờ nhưng người phát ngôn chưa phản hồi', 'em phát hiện nội dung đã gửi có lỗi và cần thông báo cho nhóm', 'hai thành viên đưa ra cách diễn đạt khác nhau cho cùng một thông điệp', 'em cần báo cáo tin bài không thuận lợi nhưng vẫn phải giữ tính khách quan']
  },
  {
    role: 'Content Writer / Copywriter', prefix: 'COMMS_WRITER', groupLabel: 'Nội dung & Biên tập',
    aliases: ['content writer', 'copywriter', 'content writer copywriter'],
    refs: ['https://developers.google.com/search/docs/fundamentals/creating-helpful-content', 'https://www.apstylebook.com/'],
    foundation: ['content writing khác copywriting ở mục tiêu và hành động người đọc mong đợi', 'một content brief cần xác định audience, mục tiêu, thông điệp và định dạng nào', 'brand voice được duy trì nhất quán giữa các kênh như thế nào', 'search intent ảnh hưởng đến cấu trúc bài viết website ra sao', 'nguồn sơ cấp và nguồn thứ cấp khác nhau khi kiểm chứng thông tin thế nào', 'CTA hiệu quả cần rõ hành động mà không hứa hẹn sai sự thật ra sao'],
    practical: ['lập dàn ý bài blog từ brief có keyword và nhóm độc giả cụ thể', 'viết ba phương án headline cho cùng một thông báo ra mắt sản phẩm', 'biên tập một đoạn dài thành caption ngắn mà không mất ý chính', 'kiểm tra độ chính xác của số liệu và trích dẫn trong bản thảo', 'chuyển brand voice từ trang giới thiệu sang bài đăng mạng xã hội', 'viết CTA phù hợp cho trang đăng ký sự kiện miễn phí', 'đọc lại bản thảo để phát hiện lỗi chính tả, liên kết hỏng và câu khó hiểu', 'cập nhật nội dung cũ khi nguồn tham khảo và thông tin sản phẩm đã thay đổi'],
    scenario: ['brief yêu cầu viết nhanh nhưng thiếu đối tượng và mục tiêu nội dung', 'bản thảo có số liệu hấp dẫn nhưng không tìm thấy nguồn đáng tin cậy', 'bài viết bị yêu cầu nhồi nhiều keyword khiến câu văn thiếu tự nhiên', 'người duyệt muốn thêm tuyên bố vượt quá bằng chứng đang có', 'nội dung đã lên lịch nhưng tính năng được nhắc đến vừa đổi tên', 'hai bên phản hồi trái ngược về giọng điệu của cùng một bài viết'],
    cv: ['bài viết hoặc nội dung em tự hào nhất và mục tiêu của nội dung đó', 'cách em nghiên cứu chủ đề trước khi viết một bài chưa quen thuộc', 'một bản nháp em đã sửa sau khi nhận góp ý cụ thể', 'cách em dùng nguồn và ghi chú để bảo đảm thông tin chính xác', 'phần em trực tiếp làm trong một chiến dịch nội dung học tập'],
    behavioral: ['người duyệt yêu cầu sửa nội dung nhưng phản hồi chỉ nói “chưa cuốn hút”', 'deadline gần đến nhưng em phát hiện brief có mâu thuẫn', 'nội dung của em được đăng với lỗi mà em có thể chủ động sửa', 'em cần từ chối một tuyên bố quảng bá không có căn cứ', 'một đồng đội không đồng ý với cách em ưu tiên thông tin trong bài']
  },
  {
    role: 'Journalist / Reporter', prefix: 'JOURNALIST', groupLabel: 'PR & Quan hệ báo chí',
    aliases: ['journalist', 'reporter', 'journalist reporter', 'phong vien'],
    refs: ['https://www.spj.org/ethicscode.asp', 'https://www.apstylebook.com/'],
    foundation: ['tin thời sự khác bài phân tích ở cách triển khai và mục tiêu thông tin nào', 'nguồn on the record, background và off the record khác nhau thế nào', 'quy tắc 5W1H giúp kiểm tra độ đầy đủ của một bản tin ra sao', 'xác minh chéo một thông tin từ nhiều nguồn có tác dụng gì', 'quyền riêng tư và lợi ích công chúng cần được cân nhắc khi đưa tin thế nào', 'tiêu đề chính xác khác tiêu đề giật gân ở điểm nào'],
    practical: ['chuẩn bị câu hỏi phỏng vấn nhân vật cho một đề tài cộng đồng', 'đối chiếu một tuyên bố với văn bản hoặc dữ liệu nguồn', 'viết bản tin ngắn theo cấu trúc kim tự tháp ngược', 'ghi chú thời gian và ngữ cảnh cho trích dẫn từ cuộc phỏng vấn', 'liên hệ nguồn thứ hai để xác nhận một cáo buộc chưa kiểm chứng', 'đặt tiêu đề phản ánh đúng nội dung và mức độ chắc chắn của bài', 'chỉnh sửa bản tin để tách dữ kiện, phát ngôn và nhận định', 'lưu tài liệu nguồn để biên tập viên có thể kiểm tra lại'],
    scenario: ['một nguồn chỉ cung cấp ảnh chụp màn hình chưa rõ xuất xứ', 'nhân vật yêu cầu gỡ trích dẫn sau khi bài đã được duyệt', 'hai nguồn đáng tin cậy đưa ra số liệu khác nhau về cùng sự kiện', 'bản tin cần đăng gấp nhưng một chi tiết quan trọng chưa xác minh', 'người được nhắc tên trong cáo buộc chưa phản hồi trước hạn xuất bản', 'em nhận được tài liệu có dữ liệu cá nhân không liên quan đến lợi ích công chúng'],
    cv: ['đề tài em từng tìm hiểu và cách em xác minh các nguồn liên quan', 'cuộc phỏng vấn em đã chuẩn bị và bài học sau khi thực hiện', 'bản tin về một sự kiện có các nguồn đưa ra dữ kiện không giống nhau mà em từng viết', 'một lần em phát hiện dữ kiện chưa chính xác trước khi xuất bản', 'vai trò của em trong sản phẩm báo chí hoặc dự án truyền thông của trường'],
    behavioral: ['biên tập viên muốn dùng một tiêu đề mạnh hơn nhưng có thể gây hiểu nhầm', 'nguồn tin yêu cầu giữ kín danh tính nhưng chưa thống nhất điều kiện', 'em mắc lỗi trong bài đã xuất bản và cần xử lý minh bạch', 'đề tài có sức ép dư luận nhưng em cần giữ thái độ trung lập', 'em được giao lĩnh vực mới và cần xây dựng mạng lưới nguồn tin ban đầu']
  },
  {
    role: 'Editorial Assistant', prefix: 'EDITORIAL', groupLabel: 'Nội dung & Biên tập',
    aliases: ['editorial assistant', 'publishing assistant', 'tro ly bien tap'],
    refs: ['https://www.apstylebook.com/', 'https://www.w3.org/WAI/tips/writing/'],
    foundation: ['proofreading khác copyediting ở phạm vi sửa bản thảo nào', 'style guide giúp nhiều tác giả giữ nhất quán ra sao', 'metadata và taxonomy hỗ trợ tìm kiếm nội dung thế nào', 'bản quyền hình ảnh và ghi nguồn cần được kiểm tra trước khi xuất bản ra sao', 'CMS draft, scheduled và published biểu thị những trạng thái nào', 'alt text giúp nội dung hình ảnh tiếp cận được với ai'],
    practical: ['soát lỗi chính tả và dấu câu theo một style guide được giao', 'đối chiếu chú thích ảnh với nguồn và quyền sử dụng', 'đăng bản thảo vào CMS và kiểm tra preview trên thiết bị di động', 'gắn category, tag và metadata cho bài viết theo quy ước', 'đối chiếu link trong bài để phát hiện liên kết hỏng', 'chuẩn hóa tên tác giả, ngày xuất bản và chú thích', 'lập checklist bàn giao bản thảo cho biên tập viên', 'cập nhật lịch xuất bản khi có thay đổi thứ tự bài'],
    scenario: ['bản preview CMS làm vỡ định dạng dù file tài liệu hiển thị đúng', 'ảnh minh họa không tìm thấy giấy phép hoặc nguồn được phép dùng', 'hai bản thảo cùng chủ đề có chi tiết thời gian không khớp', 'bài đã lên lịch nhưng thiếu alt text và link nguồn', 'tác giả gửi bản sửa cuối sau khi nội dung đã qua bước duyệt', 'nhiều bài cần xuất bản cùng ngày nhưng thiếu người kiểm tra cuối'],
    cv: ['bản thảo em từng hiệu đính và cách em sửa lỗi ngữ pháp nhưng vẫn giữ ý tác giả', 'CMS hoặc công cụ quản lý nội dung em từng sử dụng', 'cách em kiểm tra nguồn ảnh, chú thích và liên kết trong bài', 'một lỗi trình bày em phát hiện trước khi nội dung được đăng', 'cách em rà soát metadata, link nguồn và trạng thái xuất bản trên CMS'],
    behavioral: ['tác giả không đồng ý với chỉnh sửa ngữ pháp của em', 'em nhận thấy bài đã xuất bản có một lỗi nhỏ nhưng dễ gây hiểu nhầm', 'hướng dẫn style chưa nói rõ một trường hợp em đang gặp', 'đồng nghiệp nhờ em xác nhận nguồn ngay trước giờ xuất bản', 'em cần ưu tiên giữa kiểm tra kỹ một bài và xử lý hàng đợi xuất bản']
  },
  {
    role: 'Communications Assistant (Internal/External)', prefix: 'COMMS_ASSIST', groupLabel: 'Nội dung & Biên tập',
    aliases: ['communications assistant', 'internal communications assistant', 'external communications assistant', 'communications assistant internal external'],
    refs: ['https://www.prsa.org/about/all-about-pr', 'https://www.cipd.org/en/knowledge/factsheets/employee-communication-factsheet/'],
    foundation: ['truyền thông nội bộ khác truyền thông đối ngoại ở đối tượng và cách chọn kênh nào', 'key message cần đáp ứng tiêu chí dễ hiểu và nhất quán nào', 'approval workflow giảm rủi ro khi đăng thông tin tổ chức ra sao', 'FAQ giúp nhân viên tiếp nhận một thay đổi chính sách như thế nào', 'lịch nội dung hỗ trợ phối hợp nhiều đầu mối ra sao', 'thông tin nào cần xác nhận trước khi gửi một thông báo diện rộng'],
    practical: ['soạn thông báo nội bộ về thay đổi lịch làm việc bằng ngôn ngữ rõ ràng', 'chuyển thông tin chính thức thành FAQ cho nhân viên', 'lập lịch nội dung cho bản tin nội bộ trong một tháng', 'kiểm tra số liệu và người phê duyệt trước khi gửi thông báo', 'điều chỉnh cùng một thông điệp cho email và intranet', 'tổng hợp câu hỏi thường gặp sau một buổi town hall', 'theo dõi phiên bản nội dung khi nhiều phòng ban cùng góp ý', 'lập danh sách người nhận theo nhóm đối tượng phù hợp'],
    scenario: ['thông báo nội bộ bị chuyển tiếp ra ngoài trước ngày công bố', 'hai phòng ban cung cấp hướng dẫn khác nhau về một chính sách mới', 'nhân viên hiểu sai thời hạn trong email đã gửi', 'một thông tin đối ngoại được yêu cầu phát hành trước khi có duyệt cuối', 'town hall phát sinh câu hỏi mà người trình bày chưa thể trả lời', 'bản tin nội bộ có đường dẫn cũ tới biểu mẫu đã thay đổi'],
    cv: ['thông báo town hall em từng chuẩn bị và cách em kiểm tra lịch, địa điểm, đối tượng nhận', 'cách em phối hợp xin xác nhận từ nhiều đầu mối cho một nội dung', 'FAQ hoặc nội dung hướng dẫn em đã chuẩn bị cho một nhóm người dùng', 'một thông điệp em điều chỉnh cho hai nhóm độc giả khác nhau', 'cách em theo dõi lịch nội dung và trạng thái phê duyệt trong dự án'],
    behavioral: ['người quản lý muốn gửi thông báo trước khi thông tin được xác thực', 'nhân viên phản hồi rằng một email của em khó hiểu', 'một phòng ban liên tục gửi góp ý sau thời hạn chốt nội dung', 'em cần nhắc người duyệt phản hồi nhưng lịch của họ đang bận', 'một thông tin nhạy cảm cần chuyển đúng người mà không phát tán rộng']
  },
  {
    role: 'Social Media Executive', prefix: 'SOCIAL_MEDIA', groupLabel: 'Mạng xã hội & Cộng đồng',
    aliases: ['social media executive', 'social media marketing', 'social media specialist'],
    refs: ['https://www.facebook.com/business/help', 'https://support.google.com/youtube/answer/141805', 'https://www.tiktok.com/community-guidelines'],
    foundation: ['content pillar giúp duy trì chủ đề nhất quán trên kênh xã hội ra sao', 'reach, impressions và engagement rate khác nhau thế nào', 'lịch đăng cần cân nhắc mục tiêu và hành vi từng nền tảng ra sao', 'social listening khác việc chỉ đếm lượt thích ở thông tin nào', 'caption và visual cần hỗ trợ cùng một thông điệp như thế nào', 'quyền sử dụng nhạc và hình ảnh ảnh hưởng bài đăng thương hiệu ra sao'],
    practical: ['lập lịch bài đăng một tuần cho ba content pillar được giao', 'viết caption phù hợp giới hạn ký tự và giọng thương hiệu', 'đọc số liệu reach, saves, shares để đề xuất một điều chỉnh nhỏ', 'kiểm tra preview, link và tag trước khi đặt lịch đăng', 'chuyển một thông báo dài thành carousel ngắn dễ theo dõi', 'phân loại bình luận thành câu hỏi, góp ý và nội dung cần chuyển tiếp', 'tạo báo cáo tuần so sánh kết quả với tuần trước', 'điều chỉnh phiên bản nội dung cho Facebook, TikTok và LinkedIn'],
    scenario: ['bài đăng sai đường dẫn đã được chia sẻ nhiều lần', 'lượt bình luận tiêu cực tăng nhanh sau một nội dung gây hiểu nhầm', 'nội dung video chưa có phụ đề nhưng lịch đăng sắp đến', 'một bài đăng có nhạc nền chưa rõ quyền sử dụng thương mại', 'chỉ số reach giảm nhưng saves và thời gian xem lại tăng', 'người duyệt yêu cầu đăng một claim sản phẩm chưa có tài liệu chứng minh'],
    cv: ['kênh xã hội em từng quản lý trong dự án học tập hoặc câu lạc bộ', 'cách em chọn định dạng nội dung và đánh giá kết quả bài đăng', 'một caption hoặc kịch bản ngắn em đã tự viết', 'kết quả so sánh hai định dạng bài đăng em từng theo dõi, nhất là lượt lưu hoặc lượt chia sẻ', 'lần em điều chỉnh lịch đăng sau khi quan sát phản hồi người xem'],
    behavioral: ['người duyệt không phản hồi nhưng bài đăng đã đến hạn', 'một bình luận công kích cá nhân xuất hiện dưới bài của thương hiệu', 'đồng đội muốn chạy theo trend không phù hợp với định vị kênh', 'em đăng nhầm phiên bản nội dung và cần khắc phục ngay', 'một chỉ số xấu khiến nhóm muốn xóa bài trước khi tìm hiểu nguyên nhân']
  },
  {
    role: 'Community Executive', prefix: 'COMMUNITY', groupLabel: 'Mạng xã hội & Cộng đồng',
    aliases: ['community executive', 'community assistant', 'community manager junior'],
    refs: ['https://www.tiktok.com/community-guidelines', 'https://transparency.meta.com/policies/community-standards/'],
    foundation: ['community guideline cần mô tả hành vi được phép và không được phép thế nào', 'moderation khác customer support trong cách xử lý bài đăng nào', 'escalation matrix giúp chuyển phản ánh đúng đội ngũ ra sao', 'response tone cần thay đổi thế nào giữa câu hỏi và khiếu nại', 'spam, misinformation và criticism hợp lệ cần được phân biệt thế nào', 'các chỉ số response time và resolution rate nói lên điều gì'],
    practical: ['phân loại bình luận theo chủ đề và mức độ ưu tiên xử lý', 'viết phản hồi mẫu cho câu hỏi lặp lại mà vẫn giữ giọng thương hiệu', 'ẩn hoặc báo cáo nội dung vi phạm theo guideline của nền tảng', 'ghi nhận một khiếu nại gồm bối cảnh, ảnh chụp và bước đã thử', 'chuyển một vấn đề tài khoản sang nhóm hỗ trợ đúng quy trình', 'tổng hợp chủ đề cộng đồng quan tâm thành báo cáo tuần', 'cập nhật FAQ khi nhiều thành viên hỏi cùng một vấn đề', 'kiểm tra phản hồi đã giải quyết có được báo lại cho người đăng chưa'],
    scenario: ['thành viên đăng phản ánh gay gắt nhưng nội dung không vi phạm quy định', 'một tài khoản spam gửi cùng đường link vào nhiều chủ đề', 'người dùng đăng thông tin cá nhân của nhân viên trong bình luận', 'cộng đồng lan truyền thông tin chưa được đội sản phẩm xác nhận', 'nhiều thành viên cùng báo lỗi khiến kênh hỗ trợ quá tải', 'một thành viên thường xuyên vi phạm guideline nhưng phản đối quyết định moderation'],
    cv: ['cách em chào đón thành viên mới và hướng dẫn họ tìm đúng chủ đề trong cộng đồng em hỗ trợ', 'cách em xử lý một phản hồi khó trong vai trò moderator', 'quy tắc cộng đồng hoặc FAQ em từng soạn trong bài tập', 'cách em ghi nhận và chuyển tiếp phản ánh cho nhóm chuyên môn', 'các câu hỏi lặp lại em từng phân loại để đề xuất cập nhật FAQ cho cộng đồng'],
    behavioral: ['thành viên có ảnh hưởng yêu cầu em bỏ qua quy tắc áp dụng cho mọi người', 'em lỡ xóa một nội dung hợp lệ và cần phục hồi, giải thích', 'người dùng tiếp tục nhắn riêng sau khi ticket đã chuyển cho support', 'nhóm chưa thống nhất câu trả lời cho câu hỏi đang lan rộng', 'em nhận được nội dung tiêu cực ảnh hưởng cảm xúc trong ca moderation']
  },
  {
    role: 'Influencer/KOL Coordinator', prefix: 'KOL_COORD', groupLabel: 'Mạng xã hội & Cộng đồng',
    aliases: ['influencer marketing', 'influencer coordinator', 'kol coordinator', 'creator partnership coordinator'],
    refs: ['https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers', 'https://www.tiktok.com/business/en/inspiration'],
    foundation: ['creator fit khác follower count ở mức độ phù hợp khán giả nào', 'campaign brief cần nêu deliverable và deadline ra sao', 'reach, views, engagement và click là các chỉ số khác nhau thế nào', 'disclosure tài trợ giúp khán giả nhận biết quan hệ thương mại ra sao', 'usage rights và whitelisting cần được làm rõ trước khi dùng nội dung thế nào', 'brand safety cần xem xét nội dung công khai nào của creator'],
    practical: ['lọc danh sách creator theo đối tượng khán giả và chủ đề nội dung', 'viết email liên hệ creator nêu rõ mục tiêu và bước tiếp theo', 'lập bảng theo dõi deliverable, deadline và trạng thái duyệt', 'kiểm tra nội dung creator đã thêm disclosure tài trợ phù hợp chưa', 'đối chiếu link tracking và mã chiến dịch trước ngày đăng', 'so sánh engagement rate của một nhóm creator theo cùng cách tính', 'gửi feedback có timestamp cho một video cần chỉnh sửa', 'đối chiếu views, clicks và deliverables đã hoàn tất để đánh giá từng creator theo mục tiêu campaign'],
    scenario: ['creator đăng bài trễ và sự kiện chiến dịch đã bắt đầu', 'nội dung được gửi duyệt nhưng thiếu disclosure quan hệ tài trợ', 'số lượt xem cao nhưng link campaign không ghi nhận click', 'creator sử dụng claim sản phẩm chưa nằm trong brief đã duyệt', 'một creator bị phát hiện đăng nội dung không phù hợp với brand safety', 'nhóm yêu cầu sử dụng lại video ngoài phạm vi quyền đã thỏa thuận'],
    cv: ['danh sách creator em từng nghiên cứu và tiêu chí sàng lọc', 'brief hoặc checklist deliverable em từng chuẩn bị cho chiến dịch', 'cách em kiểm tra chỉ số hiệu quả của nội dung creator', 'một trường hợp em theo dõi tiến độ và nhắc creator đúng hạn', 'cách em xử lý khi creator từ chối đề xuất hoặc cần thay đổi phạm vi hợp tác'],
    behavioral: ['creator phản ứng không đồng tình với feedback sửa nội dung', 'nhóm muốn chọn creator nhiều follower dù audience không phù hợp', 'em phát hiện thiếu điều khoản quyền sử dụng trước khi nội dung lên sóng', 'deadline sát nhưng người duyệt nội dung chưa phản hồi', 'một kết quả campaign thấp hơn kỳ vọng và em cần báo cáo trung thực']
  },
  {
    role: 'Event Communications Coordinator', prefix: 'EVENT_COMMS', groupLabel: 'Sự kiện & Truyền thông thương hiệu',
    aliases: ['event communications coordinator', 'event communication coordinator', 'event coordinator communications'],
    refs: ['https://www.cvent.com/en/blog/events/event-planning', 'https://www.prsa.org/about/all-about-pr'],
    foundation: ['run of show mô tả trình tự và người phụ trách chương trình ra sao', 'audience journey trước, trong và sau sự kiện gồm những điểm chạm nào', 'event brief cần xác nhận mục tiêu, đối tượng và thông tin vận hành nào', 'RSVP khác check-in ở mục đích theo dõi nào', 'phương án truyền thông dự phòng giúp giảm ảnh hưởng thay đổi chương trình ra sao', 'post-event recap cần phân biệt kết quả với số liệu mục tiêu thế nào'],
    practical: ['soạn email xác nhận đăng ký gồm thời gian, địa điểm và hướng dẫn tham dự', 'lập checklist nội dung cần công bố trước ngày diễn ra sự kiện', 'cập nhật run of show cùng người phụ trách từng hạng mục', 'chuẩn bị biển chỉ dẫn và thông tin check-in cho khách tham dự', 'tạo mẫu thông báo thay đổi phòng tổ chức trên email và mạng xã hội', 'theo dõi RSVP, check-in và câu hỏi của khách trong bảng tổng hợp', 'soạn lời nhắc cho diễn giả về thời lượng và thứ tự lên sân khấu', 'tổng hợp phản hồi sau sự kiện thành các nhóm chủ đề'],
    scenario: ['địa điểm tổ chức thay đổi sát giờ mở cửa', 'diễn giả chính báo đến trễ khi khán giả đã có mặt', 'email reminder ghi nhầm khung giờ của một múi giờ', 'hệ thống check-in mất kết nối ngay trước giờ bắt đầu', 'một bài đăng thông báo lịch trình cũ vẫn đang được chia sẻ', 'người tham dự cần hỗ trợ tiếp cận nhưng sơ đồ điều phối chưa ghi chú'],
    cv: ['sự kiện em từng hỗ trợ và đầu việc em trực tiếp theo dõi', 'run of show em từng cập nhật theo mốc giờ, người phụ trách và trạng thái từng hạng mục', 'một thay đổi sự kiện em đã truyền đạt tới người tham dự', 'cách em phối hợp với diễn giả, địa điểm hoặc tình nguyện viên', 'phản hồi sau sự kiện em từng thu thập và cách em tổng hợp'],
    behavioral: ['một đầu mối chưa hoàn thành hạng mục khi thời hạn đã tới', 'khách tham dự phản ánh thông tin trên email và tại địa điểm không khớp', 'em cần báo tin thay đổi nhưng chưa được người phụ trách phê duyệt', 'nhiều việc phát sinh đồng thời trong lúc chương trình đang diễn ra', 'em nhận góp ý rằng hướng dẫn sự kiện chưa đủ rõ cho người lần đầu tham dự']
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
          `Nêu đúng nguyên tắc hoặc nghiệp vụ liên quan đến ${profile.role}.`,
          'Trình bày được cách kiểm chứng thông tin và các bước làm phù hợp với phạm vi được giao.',
          'Có ý thức kiểm tra độ chính xác, xin duyệt khi cần và báo cáo rõ ràng.'
        ],
        followUps: [
          `Em sẽ kiểm tra nguồn, brief hoặc hướng dẫn nào trước khi thực hiện nội dung này?`,
          'Nếu chưa đủ dữ kiện để kết luận, em sẽ hỏi ai và ghi nhận phần còn chưa xác minh ra sao?'
        ],
        tags: [profile.role, category, profile.prefix],
        sourceRefs: [profile.refs[index % profile.refs.length], 'Tình huống phỏng vấn tự biên soạn - JobReady AI'],
        redFlags: [
          'Phát hành thông tin, trích dẫn hoặc claim chưa được xác minh hay phê duyệt.',
          'Không phân biệt rõ phần việc mình trực tiếp làm với phần do nhóm thực hiện.'
        ]
      });
    });
  }
  return { role: profile.role, group: 'communications', groupLabel: profile.groupLabel, aliases: profile.aliases, questions };
}

const banks = profiles.map(makeBank);
const output = `import { RoleQuestionBank } from './types';\n\n// Interview bank for entry-level Communications roles (Intern/Fresher/Junior).\nexport const communicationsQuestionBanks: RoleQuestionBank[] = ${JSON.stringify(banks, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '..', '..', 'src', 'data', 'interview-questions', 'communications.ts'), output, 'utf8');
console.log(`Generated ${banks.length} communication role banks, ${banks.reduce((sum, bank) => sum + bank.questions.length, 0)} questions.`);
