import { RoleQuestionBank } from './types';

// Ngân hàng chuyên môn cho các vị trí IT còn thiếu (Intern/Fresher/Junior).
export const additionalITQuestionBanks: RoleQuestionBank[] = [
  {
    "role": "DevOps Engineer",
    "group": "webMobile",
    "groupLabel": "Hạ tầng, DevOps & Cloud",
    "aliases": [
      "devops engineer",
      "devops fresher",
      "junior devops engineer"
    ],
    "questions": [
      {
        "id": "DEVOPS-FOUND-01",
        "role": "DevOps Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher DevOps Engineer, em hãy giải thích phân biệt container Docker với máy ảo và trường hợp phù hợp cho từng loại và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "foundation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-FOUND-02",
        "role": "DevOps Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher DevOps Engineer, em hãy giải thích vai trò của CI và CD trong quy trình phát hành phần mềm và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "foundation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-FOUND-03",
        "role": "DevOps Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher DevOps Engineer, em hãy giải thích các bước một Docker image đi từ Dockerfile đến container đang chạy và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "foundation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-FOUND-04",
        "role": "DevOps Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher DevOps Engineer, em hãy giải thích biến môi trường và secret khác nhau thế nào khi cấu hình ứng dụng và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "foundation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-FOUND-05",
        "role": "DevOps Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher DevOps Engineer, em hãy giải thích log, metric và trace giúp tìm lỗi trong một dịch vụ ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "foundation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-FOUND-06",
        "role": "DevOps Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher DevOps Engineer, em hãy giải thích mục đích của health check và readiness check trong triển khai dịch vụ và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "foundation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SKILL-01",
        "role": "DevOps Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao viết Dockerfile đơn giản cho ứng dụng web và giảm kích thước image, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "practical_skills",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SKILL-02",
        "role": "DevOps Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao tạo workflow GitHub Actions để chạy kiểm tra khi có pull request, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "practical_skills",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SKILL-03",
        "role": "DevOps Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao đưa cấu hình development và production ra khỏi source code, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "practical_skills",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SKILL-04",
        "role": "DevOps Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao đọc log container và xác định vì sao ứng dụng thoát ngay sau khi khởi động, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "practical_skills",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SKILL-05",
        "role": "DevOps Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao triển khai một bản cập nhật có health check và khả năng rollback, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "practical_skills",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SKILL-06",
        "role": "DevOps Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao lưu và khôi phục dữ liệu khi container được tạo lại, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "practical_skills",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SKILL-07",
        "role": "DevOps Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao dùng Docker Compose để chạy ứng dụng cùng database cục bộ, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "practical_skills",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SKILL-08",
        "role": "DevOps Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao theo dõi trạng thái pipeline và thông báo lỗi triển khai cho nhóm, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "practical_skills",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SCENARIO-01",
        "role": "DevOps Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của DevOps Engineer, pipeline CI đột nhiên thất bại dù lần commit trước chạy thành công. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "scenario",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SCENARIO-02",
        "role": "DevOps Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của DevOps Engineer, container báo running nhưng người dùng không truy cập được ứng dụng. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "scenario",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SCENARIO-03",
        "role": "DevOps Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của DevOps Engineer, bản phát hành mới gây lỗi và cần quay lại phiên bản ổn định. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "scenario",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SCENARIO-04",
        "role": "DevOps Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của DevOps Engineer, ứng dụng hết dung lượng đĩa sau nhiều ngày ghi log. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "scenario",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SCENARIO-05",
        "role": "DevOps Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của DevOps Engineer, secret vô tình xuất hiện trong log pipeline. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "scenario",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-SCENARIO-06",
        "role": "DevOps Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của DevOps Engineer, hai môi trường staging và production có kết quả chạy khác nhau. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "scenario",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-CV-01",
        "role": "DevOps Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện Dockerfile hoặc Docker Compose em từng dùng trong bài tập hay dự án ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "cv_validation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-CV-02",
        "role": "DevOps Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện workflow tự động build hoặc test mà em đã cấu hình ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "cv_validation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-CV-03",
        "role": "DevOps Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện lỗi triển khai cụ thể em từng điều tra từ log ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "cv_validation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-CV-04",
        "role": "DevOps Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện cách em quản lý cấu hình và secret trong một project học tập ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "cv_validation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-CV-05",
        "role": "DevOps Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện lần em phối hợp với developer để sửa pipeline hoặc quy trình release ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "cv_validation",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-BEHAVIOR-01",
        "role": "DevOps Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí DevOps Engineer, nếu developer muốn deploy gấp nhưng các bước kiểm tra CI chưa hoàn tất, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "behavioral",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-BEHAVIOR-02",
        "role": "DevOps Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí DevOps Engineer, nếu em chưa từng thao tác với một công cụ hạ tầng đang được nhóm sử dụng, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "behavioral",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-BEHAVIOR-03",
        "role": "DevOps Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí DevOps Engineer, nếu một thay đổi cấu hình của em làm môi trường test bị gián đoạn, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "behavioral",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://kubernetes.io/docs/concepts/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-BEHAVIOR-04",
        "role": "DevOps Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí DevOps Engineer, nếu em cần bàn giao ca trực và các cảnh báo chưa xử lý xong, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "behavioral",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "DEVOPS-BEHAVIOR-05",
        "role": "DevOps Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí DevOps Engineer, nếu nhóm bất đồng về mức tự động hóa nên bổ sung cho một project nhỏ, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với DevOps Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "DevOps Engineer",
          "behavioral",
          "DEVOPS"
        ],
        "sourceRefs": [
          "https://docs.github.com/en/actions",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      }
    ]
  },
  {
    "role": "Cloud Engineer (AWS/GCP/Azure)",
    "group": "webMobile",
    "groupLabel": "Hạ tầng, DevOps & Cloud",
    "aliases": [
      "cloud engineer",
      "aws cloud engineer",
      "gcp cloud engineer",
      "azure cloud engineer",
      "junior cloud engineer"
    ],
    "questions": [
      {
        "id": "CLOUD-FOUND-01",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Cloud Engineer (AWS/GCP/Azure), em hãy giải thích khác nhau giữa region, availability zone và edge location và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "foundation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-FOUND-02",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Cloud Engineer (AWS/GCP/Azure), em hãy giải thích IAM user, role và policy kiểm soát quyền truy cập cloud ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "foundation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-FOUND-03",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Cloud Engineer (AWS/GCP/Azure), em hãy giải thích VPC và subnet giúp cô lập tài nguyên mạng như thế nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "foundation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-FOUND-04",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Cloud Engineer (AWS/GCP/Azure), em hãy giải thích object storage như S3 khác block storage gắn với máy ảo ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "foundation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-FOUND-05",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Cloud Engineer (AWS/GCP/Azure), em hãy giải thích autoscaling giải quyết vấn đề tải biến động nhưng có giới hạn gì và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "foundation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-FOUND-06",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Cloud Engineer (AWS/GCP/Azure), em hãy giải thích shared responsibility model phân chia trách nhiệm giữa nhà cung cấp và khách hàng thế nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "foundation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SKILL-01",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao tạo một máy ảo có quyền truy cập tối thiểu và chỉ mở cổng cần thiết, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "practical_skills",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SKILL-02",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao đưa file tĩnh lên object storage và giới hạn quyền truy cập phù hợp, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "practical_skills",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SKILL-03",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao tạo cảnh báo khi CPU hoặc dung lượng đĩa vượt ngưỡng, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "practical_skills",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SKILL-04",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao ước tính chi phí cơ bản trước khi tạo tài nguyên cho môi trường thử nghiệm, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "practical_skills",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SKILL-05",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao kiểm tra route table và security group khi máy ảo không kết nối được, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "practical_skills",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SKILL-06",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao gắn IAM role cho ứng dụng thay vì lưu access key trong mã nguồn, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "practical_skills",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SKILL-07",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao lập lịch backup và xác minh có thể khôi phục dữ liệu, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "practical_skills",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SKILL-08",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao dùng tag để nhận biết chủ sở hữu và môi trường của tài nguyên, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "practical_skills",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SCENARIO-01",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Cloud Engineer (AWS/GCP/Azure), hóa đơn cloud tăng bất thường sau khi bật một dịch vụ mới. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "scenario",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SCENARIO-02",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Cloud Engineer (AWS/GCP/Azure), máy ảo không truy cập được internet dù trạng thái đang running. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "scenario",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SCENARIO-03",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Cloud Engineer (AWS/GCP/Azure), ứng dụng trả lỗi quyền khi đọc một object trong storage. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "scenario",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SCENARIO-04",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Cloud Engineer (AWS/GCP/Azure), một public bucket chứa dữ liệu mà nhóm dự kiến để riêng tư. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "scenario",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SCENARIO-05",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Cloud Engineer (AWS/GCP/Azure), dịch vụ ở một zone gặp sự cố và ứng dụng mất kết nối. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "scenario",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-SCENARIO-06",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Cloud Engineer (AWS/GCP/Azure), snapshot backup tồn tại nhưng lần thử khôi phục không thành công. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "scenario",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-CV-01",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện kiến trúc cloud em đã dựng trong lab hoặc đồ án và lý do chọn dịch vụ ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "cv_validation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-CV-02",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Hãy trình bày policy IAM em từng viết trong lab: principal được phép làm gì, scope được giới hạn ra sao và em xác minh quyền thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "cv_validation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-CV-03",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện cảnh báo chi phí hoặc hiệu năng em từng cấu hình ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "cv_validation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-CV-04",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện cách em kiểm tra backup bằng một lần khôi phục thử ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "cv_validation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-CV-05",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện một lỗi mạng cloud em gặp và các bước khoanh vùng nguyên nhân ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "cv_validation",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-BEHAVIOR-01",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Cloud Engineer (AWS/GCP/Azure), nếu nhóm yêu cầu cấp quyền administrator cho tiện thử nghiệm, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "behavioral",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-BEHAVIOR-02",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Cloud Engineer (AWS/GCP/Azure), nếu em được giao một dịch vụ cloud mới nhưng tài liệu nội bộ chưa đầy đủ, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "behavioral",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-BEHAVIOR-03",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Cloud Engineer (AWS/GCP/Azure), nếu em phát hiện tài nguyên thử nghiệm bị bỏ quên gây phát sinh chi phí, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "behavioral",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-BEHAVIOR-04",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Cloud Engineer (AWS/GCP/Azure), nếu một thay đổi quyền truy cập có thể ảnh hưởng đến người dùng khác, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "behavioral",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "CLOUD-BEHAVIOR-05",
        "role": "Cloud Engineer (AWS/GCP/Azure)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Cloud Engineer (AWS/GCP/Azure), nếu em cần giải thích cho developer vì sao phải kiểm tra bảo mật trước khi mở dịch vụ, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Cloud Engineer (AWS/GCP/Azure).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Cloud Engineer (AWS/GCP/Azure)",
          "behavioral",
          "CLOUD"
        ],
        "sourceRefs": [
          "https://cloud.google.com/docs/overview",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      }
    ]
  },
  {
    "role": "System Administrator",
    "group": "webMobile",
    "groupLabel": "Hạ tầng, DevOps & Cloud",
    "aliases": [
      "system administrator",
      "sysadmin",
      "linux system administrator",
      "junior system administrator"
    ],
    "questions": [
      {
        "id": "SYSADMIN-FOUND-01",
        "role": "System Administrator",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher System Administrator, em hãy giải thích process và service khác nhau thế nào trên Linux và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "foundation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-FOUND-02",
        "role": "System Administrator",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher System Administrator, em hãy giải thích quyền read, write, execute và permission dạng octal được áp dụng ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "foundation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-FOUND-03",
        "role": "System Administrator",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher System Administrator, em hãy giải thích systemd quản lý service và startup dependency như thế nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "foundation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/windows-server/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-FOUND-04",
        "role": "System Administrator",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher System Administrator, em hãy giải thích DNS resolver được máy khách dùng trong quá trình mở một domain ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "foundation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-FOUND-05",
        "role": "System Administrator",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher System Administrator, em hãy giải thích log hệ thống thường nằm ở đâu và journald hỗ trợ tra cứu thế nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "foundation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-FOUND-06",
        "role": "System Administrator",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher System Administrator, em hãy giải thích backup đầy đủ và incremental khác nhau về thời gian phục hồi ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "foundation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/windows-server/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SKILL-01",
        "role": "System Administrator",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao kiểm tra process nào đang chiếm CPU hoặc bộ nhớ trên máy Linux, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "practical_skills",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SKILL-02",
        "role": "System Administrator",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao tạo user, group và quyền thư mục theo nguyên tắc cần đủ dùng, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "practical_skills",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SKILL-03",
        "role": "System Administrator",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao khởi động lại service và kiểm tra lý do service không lên, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "practical_skills",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/windows-server/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SKILL-04",
        "role": "System Administrator",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao tìm các file log lớn và xử lý an toàn khi ổ đĩa gần đầy, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "practical_skills",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SKILL-05",
        "role": "System Administrator",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao kiểm tra DNS, route và kết nối cổng từ một máy chủ, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "practical_skills",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SKILL-06",
        "role": "System Administrator",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao lên lịch một tác vụ định kỳ và xác nhận log thực thi, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "practical_skills",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/windows-server/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SKILL-07",
        "role": "System Administrator",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao cập nhật package trên máy thử nghiệm và chuẩn bị cách quay lại, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "practical_skills",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SKILL-08",
        "role": "System Administrator",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao thực hiện backup thư mục cấu hình và kiểm tra bản backup, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "practical_skills",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SCENARIO-01",
        "role": "System Administrator",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của System Administrator, máy chủ báo hết dung lượng và một ứng dụng bắt đầu ghi lỗi. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "scenario",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SCENARIO-02",
        "role": "System Administrator",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của System Administrator, service không tự khởi động lại sau khi máy chủ reboot. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "scenario",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SCENARIO-03",
        "role": "System Administrator",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của System Administrator, một user báo không đọc được thư mục dù đã được thêm vào group. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "scenario",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/windows-server/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SCENARIO-04",
        "role": "System Administrator",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của System Administrator, CPU tăng cao sau khi triển khai một phiên bản mới. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "scenario",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SCENARIO-05",
        "role": "System Administrator",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của System Administrator, backup chạy thành công nhưng file phục hồi không mở được. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "scenario",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-SCENARIO-06",
        "role": "System Administrator",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của System Administrator, nhiều lần đăng nhập thất bại xuất hiện trên một tài khoản hệ thống. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "scenario",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/windows-server/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-CV-01",
        "role": "System Administrator",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện máy ảo Linux hoặc Windows Server em từng cài đặt và cấu hình ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "cv_validation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-CV-02",
        "role": "System Administrator",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện script hoặc cron task em đã viết để tự động hóa công việc lặp lại ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "cv_validation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-CV-03",
        "role": "System Administrator",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện sự cố service hoặc tài nguyên hệ thống em đã điều tra trong lab ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "cv_validation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/windows-server/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-CV-04",
        "role": "System Administrator",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện quy trình backup và restore em đã thử nghiệm ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "cv_validation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-CV-05",
        "role": "System Administrator",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện cách em ghi lại thay đổi cấu hình để người khác có thể kiểm tra ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "cv_validation",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-BEHAVIOR-01",
        "role": "System Administrator",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí System Administrator, nếu người dùng báo lỗi hệ thống nhưng chưa mô tả rõ các bước tái hiện, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "behavioral",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-BEHAVIOR-02",
        "role": "System Administrator",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí System Administrator, nếu em cần thực hiện thay đổi máy chủ trong khung giờ có người sử dụng, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "behavioral",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-BEHAVIOR-03",
        "role": "System Administrator",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí System Administrator, nếu em nhận cảnh báo ngoài giờ nhưng chưa biết mức độ ảnh hưởng, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "behavioral",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://learn.microsoft.com/en-us/windows-server/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-BEHAVIOR-04",
        "role": "System Administrator",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí System Administrator, nếu một thao tác của em gây gián đoạn ngắn và cần thông báo cho nhóm, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "behavioral",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://www.kernel.org/doc/html/latest/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "SYSADMIN-BEHAVIOR-05",
        "role": "System Administrator",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí System Administrator, nếu em cần bàn giao thông tin tài khoản hoặc cấu hình một cách an toàn, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với System Administrator.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "System Administrator",
          "behavioral",
          "SYSADMIN"
        ],
        "sourceRefs": [
          "https://ubuntu.com/server/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      }
    ]
  },
  {
    "role": "Network Engineer",
    "group": "webMobile",
    "groupLabel": "Hạ tầng, DevOps & Cloud",
    "aliases": [
      "network engineer",
      "junior network engineer",
      "network administrator",
      "ky su mang"
    ],
    "questions": [
      {
        "id": "NETWORK-FOUND-01",
        "role": "Network Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Network Engineer, em hãy giải thích địa chỉ IP private và public khác nhau ở phạm vi định tuyến nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "foundation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-FOUND-02",
        "role": "Network Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Network Engineer, em hãy giải thích subnet mask và CIDR xác định số địa chỉ usable ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "foundation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-FOUND-03",
        "role": "Network Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Network Engineer, em hãy giải thích DNS phân giải tên miền thành địa chỉ IP qua những bước nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "foundation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.wireshark.org/docs/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-FOUND-04",
        "role": "Network Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Network Engineer, em hãy giải thích DHCP cấp địa chỉ IP động cho thiết bị theo quy trình nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "foundation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-FOUND-05",
        "role": "Network Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Network Engineer, em hãy giải thích switch layer 2 và router layer 3 chuyển tiếp lưu lượng khác nhau ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "foundation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-FOUND-06",
        "role": "Network Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Network Engineer, em hãy giải thích TCP handshake khác UDP ở độ tin cậy và thiết lập kết nối thế nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "foundation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.wireshark.org/docs/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SKILL-01",
        "role": "Network Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao chia một dải mạng nhỏ thành subnet cho các nhóm thiết bị, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "practical_skills",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SKILL-02",
        "role": "Network Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao dùng ping, traceroute và nslookup để kiểm tra một lỗi kết nối, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "practical_skills",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SKILL-03",
        "role": "Network Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao đọc bảng ARP và xác định địa chỉ MAC của thiết bị cùng mạng, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "practical_skills",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.wireshark.org/docs/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SKILL-04",
        "role": "Network Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao cấu hình VLAN cơ bản và mô tả cách kiểm tra thiết bị được gán đúng VLAN, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "practical_skills",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SKILL-05",
        "role": "Network Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao lọc một capture Wireshark để tìm DNS query bị timeout, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "practical_skills",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SKILL-06",
        "role": "Network Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao kiểm tra DHCP lease khi máy khách nhận địa chỉ APIPA, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "practical_skills",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.wireshark.org/docs/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SKILL-07",
        "role": "Network Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao xác minh firewall rule chỉ mở đúng cổng dịch vụ cần dùng, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "practical_skills",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SKILL-08",
        "role": "Network Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao ghi lại sơ đồ cổng switch và địa chỉ IP để hỗ trợ bàn giao, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "practical_skills",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SCENARIO-01",
        "role": "Network Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Một ticket mạng mô tả tình huống: laptop vừa chuyển VLAN, nhận IP mới nhưng không học được địa chỉ MAC của gateway. Em sẽ kiểm tra theo từng lớp mạng bằng lệnh hoặc bằng chứng nào để khoanh vùng?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "scenario",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SCENARIO-02",
        "role": "Network Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Một ticket mạng mô tả tình huống: nhiều thiết bị cùng lúc nhận IP trùng nhau. Em sẽ kiểm tra theo từng lớp mạng bằng lệnh hoặc bằng chứng nào để khoanh vùng?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "scenario",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SCENARIO-03",
        "role": "Network Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Một ticket mạng mô tả tình huống: DNS cache vẫn trả về địa chỉ máy chủ cũ sau khi dịch vụ vừa được chuyển sang IP mới. Em sẽ kiểm tra theo từng lớp mạng bằng lệnh hoặc bằng chứng nào để khoanh vùng?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "scenario",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.wireshark.org/docs/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SCENARIO-04",
        "role": "Network Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Một ticket mạng mô tả tình huống: mạng chậm chỉ xảy ra ở một VLAN trong khi các VLAN khác bình thường. Em sẽ kiểm tra theo từng lớp mạng bằng lệnh hoặc bằng chứng nào để khoanh vùng?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "scenario",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SCENARIO-05",
        "role": "Network Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Một ticket mạng mô tả tình huống: gói tin đến server nhưng phản hồi không quay lại máy khách. Em sẽ kiểm tra theo từng lớp mạng bằng lệnh hoặc bằng chứng nào để khoanh vùng?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "scenario",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-SCENARIO-06",
        "role": "Network Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Một ticket mạng mô tả tình huống: một port switch không hoạt động sau khi thay thiết bị đầu cuối. Em sẽ kiểm tra theo từng lớp mạng bằng lệnh hoặc bằng chứng nào để khoanh vùng?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "scenario",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.wireshark.org/docs/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-CV-01",
        "role": "Network Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện sơ đồ subnet hoặc VLAN em đã thiết kế trong lab hay đồ án ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "cv_validation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-CV-02",
        "role": "Network Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện lệnh mạng em đã dùng để tìm nguyên nhân của một lỗi kết nối ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "cv_validation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-CV-03",
        "role": "Network Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện capture Wireshark em đã phân tích và dấu hiệu em tìm thấy ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "cv_validation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.wireshark.org/docs/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-CV-04",
        "role": "Network Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện cách em ghi lại địa chỉ, port và kết quả kiểm tra mạng ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "cv_validation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-CV-05",
        "role": "Network Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện lỗi DNS hoặc DHCP em từng mô phỏng và cách em xác nhận đã sửa ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "cv_validation",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-BEHAVIOR-01",
        "role": "Network Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Network Engineer, nếu người dùng báo mất mạng nhưng chỉ có thể mô tả bằng ngôn ngữ thông thường, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "behavioral",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-BEHAVIOR-02",
        "role": "Network Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Network Engineer, nếu em cần thay đổi cấu hình switch và muốn hạn chế ảnh hưởng người dùng, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "behavioral",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-BEHAVIOR-03",
        "role": "Network Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Network Engineer, nếu log hoặc sơ đồ bàn giao không đầy đủ khi em nhận ca xử lý, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "behavioral",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.wireshark.org/docs/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-BEHAVIOR-04",
        "role": "Network Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Network Engineer, nếu developer và network team đưa ra hai giả thuyết khác nhau về lỗi, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "behavioral",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1918",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "NETWORK-BEHAVIOR-05",
        "role": "Network Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Network Engineer, nếu em phát hiện một cổng mạng đang mở rộng hơn yêu cầu công việc, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Network Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Network Engineer",
          "behavioral",
          "NETWORK"
        ],
        "sourceRefs": [
          "https://www.rfc-editor.org/rfc/rfc1034",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      }
    ]
  },
  {
    "role": "Infrastructure Engineer",
    "group": "webMobile",
    "groupLabel": "Hạ tầng, DevOps & Cloud",
    "aliases": [
      "infrastructure engineer",
      "junior infrastructure engineer",
      "it infrastructure engineer"
    ],
    "questions": [
      {
        "id": "INFRA-FOUND-01",
        "role": "Infrastructure Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Infrastructure Engineer, em hãy giải thích server, storage và network phối hợp để cung cấp một ứng dụng nội bộ ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "foundation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-FOUND-02",
        "role": "Infrastructure Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Infrastructure Engineer, em hãy giải thích virtual machine và container phù hợp với hai kiểu workload nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "foundation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-FOUND-03",
        "role": "Infrastructure Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Infrastructure Engineer, em hãy giải thích Infrastructure as Code giúp theo dõi thay đổi hạ tầng thế nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "foundation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://prometheus.io/docs/introduction/overview/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-FOUND-04",
        "role": "Infrastructure Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Infrastructure Engineer, em hãy giải thích monitoring metric khác alert ở mục đích sử dụng nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "foundation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-FOUND-05",
        "role": "Infrastructure Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Infrastructure Engineer, em hãy giải thích load balancer phân phối request và kiểm tra health backend ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "foundation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-FOUND-06",
        "role": "Infrastructure Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Infrastructure Engineer, em hãy giải thích RTO và RPO giúp xác định yêu cầu backup, disaster recovery thế nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "foundation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://prometheus.io/docs/introduction/overview/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SKILL-01",
        "role": "Infrastructure Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao dựng một môi trường thử nghiệm gồm máy chủ, mạng và lưu trữ cơ bản, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "practical_skills",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SKILL-02",
        "role": "Infrastructure Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao đọc Terraform plan để phát hiện tài nguyên sắp bị thay đổi hoặc xóa, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "practical_skills",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SKILL-03",
        "role": "Infrastructure Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao thêm dashboard theo dõi CPU, bộ nhớ, ổ đĩa và trạng thái service, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "practical_skills",
          "INFRA"
        ],
        "sourceRefs": [
          "https://prometheus.io/docs/introduction/overview/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SKILL-04",
        "role": "Infrastructure Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao cấu hình health check cho một backend sau load balancer, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "practical_skills",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SKILL-05",
        "role": "Infrastructure Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao kiểm tra dung lượng storage và xác định tốc độ tăng theo thời gian, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "practical_skills",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SKILL-06",
        "role": "Infrastructure Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao tạo bản kê tài nguyên với owner, môi trường và mục đích sử dụng, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "practical_skills",
          "INFRA"
        ],
        "sourceRefs": [
          "https://prometheus.io/docs/introduction/overview/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SKILL-07",
        "role": "Infrastructure Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao thực hiện cập nhật hạ tầng trên môi trường staging trước production, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "practical_skills",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SKILL-08",
        "role": "Infrastructure Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao ghi lại sơ đồ kết nối và các bước khôi phục dịch vụ cơ bản, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "practical_skills",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SCENARIO-01",
        "role": "Infrastructure Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Infrastructure Engineer, dashboard báo dung lượng volume gần đầy nhưng ứng dụng vẫn chạy. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "scenario",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SCENARIO-02",
        "role": "Infrastructure Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Infrastructure Engineer, một backend bị health check đánh dấu unhealthy sau khi deploy. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "scenario",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SCENARIO-03",
        "role": "Infrastructure Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Infrastructure Engineer, Terraform plan đề xuất thay thế một tài nguyên đang được sử dụng. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "scenario",
          "INFRA"
        ],
        "sourceRefs": [
          "https://prometheus.io/docs/introduction/overview/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SCENARIO-04",
        "role": "Infrastructure Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Infrastructure Engineer, mất kết nối giữa ứng dụng và database sau thay đổi network rule. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "scenario",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SCENARIO-05",
        "role": "Infrastructure Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Infrastructure Engineer, nhiều server gặp cảnh báo cùng lúc sau một thay đổi dùng chung. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "scenario",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-SCENARIO-06",
        "role": "Infrastructure Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Infrastructure Engineer, nhóm phát hiện một máy ảo thử nghiệm không rõ chủ sở hữu. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "scenario",
          "INFRA"
        ],
        "sourceRefs": [
          "https://prometheus.io/docs/introduction/overview/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-CV-01",
        "role": "Infrastructure Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện sơ đồ hạ tầng em đã dựng trong lab và luồng request đi qua các thành phần ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "cv_validation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-CV-02",
        "role": "Infrastructure Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện module hoặc cấu hình IaC em đã viết và cách em kiểm tra plan ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "cv_validation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-CV-03",
        "role": "Infrastructure Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện dashboard hoặc alert em từng tạo cho một môi trường thử nghiệm ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "cv_validation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://prometheus.io/docs/introduction/overview/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-CV-04",
        "role": "Infrastructure Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện bảng kiểm kê server với owner, môi trường và ngày cập nhật gần nhất ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "cv_validation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-CV-05",
        "role": "Infrastructure Engineer",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện một sự cố kết nối hạ tầng em đã khoanh vùng bằng log hoặc metric ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "cv_validation",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-BEHAVIOR-01",
        "role": "Infrastructure Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Infrastructure Engineer, nếu một nhóm yêu cầu thay đổi production nhưng chưa có kế hoạch rollback, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "behavioral",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-BEHAVIOR-02",
        "role": "Infrastructure Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Infrastructure Engineer, nếu em phát hiện tài liệu sơ đồ hạ tầng không còn khớp với thực tế, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "behavioral",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-BEHAVIOR-03",
        "role": "Infrastructure Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Infrastructure Engineer, nếu một cảnh báo ảnh hưởng nhiều nhóm và cần xác định người phụ trách, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "behavioral",
          "INFRA"
        ],
        "sourceRefs": [
          "https://prometheus.io/docs/introduction/overview/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-BEHAVIOR-04",
        "role": "Infrastructure Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Infrastructure Engineer, nếu em chưa hiểu rõ tác động của một thay đổi IaC được đề xuất, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "behavioral",
          "INFRA"
        ],
        "sourceRefs": [
          "https://developer.hashicorp.com/terraform/docs",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "INFRA-BEHAVIOR-05",
        "role": "Infrastructure Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Infrastructure Engineer, nếu em cần ưu tiên giữa ticket người dùng và công việc bảo trì định kỳ, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Infrastructure Engineer.",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Infrastructure Engineer",
          "behavioral",
          "INFRA"
        ],
        "sourceRefs": [
          "https://docs.docker.com/get-started/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      }
    ]
  },
  {
    "role": "Business Analyst (IT)",
    "group": "productUX",
    "groupLabel": "Sản phẩm & Quản trị",
    "aliases": [
      "business analyst it",
      "it business analyst",
      "business analyst (it)",
      "ba it",
      "chuyen vien phan tich nghiep vu it"
    ],
    "questions": [
      {
        "id": "BA_IT-FOUND-01",
        "role": "Business Analyst (IT)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Business Analyst (IT), em hãy giải thích phân biệt yêu cầu business, yêu cầu user và yêu cầu chức năng và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "foundation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-FOUND-02",
        "role": "Business Analyst (IT)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Business Analyst (IT), em hãy giải thích user story thường có cấu trúc nào và giúp mô tả giá trị người dùng ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "foundation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-FOUND-03",
        "role": "Business Analyst (IT)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Business Analyst (IT), em hãy giải thích acceptance criteria khác tài liệu đặc tả chi tiết ở mục đích nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "foundation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.atlassian.com/agile/project-management/acceptance-criteria",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-FOUND-04",
        "role": "Business Analyst (IT)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Business Analyst (IT), em hãy giải thích luồng as-is và to-be giúp làm rõ thay đổi nghiệp vụ như thế nào và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "foundation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-FOUND-05",
        "role": "Business Analyst (IT)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Business Analyst (IT), em hãy giải thích stakeholder, end user và system owner có thể có nhu cầu khác nhau ra sao và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "foundation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-FOUND-06",
        "role": "Business Analyst (IT)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Ở mức Intern/Fresher Business Analyst (IT), em hãy giải thích UAT xác nhận điều gì trước khi một tính năng được nghiệm thu và nêu một ví dụ dễ hiểu.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm khái niệm gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "foundation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.atlassian.com/agile/project-management/acceptance-criteria",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SKILL-01",
        "role": "Business Analyst (IT)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao chuyển một yêu cầu “báo cáo nhanh hơn” thành câu hỏi và tiêu chí đo được, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "practical_skills",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SKILL-02",
        "role": "Business Analyst (IT)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao viết user story kèm acceptance criteria cho chức năng quên mật khẩu, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "practical_skills",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SKILL-03",
        "role": "Business Analyst (IT)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao vẽ luồng xử lý khi người dùng tạo và xác nhận một đơn hàng, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "practical_skills",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.atlassian.com/agile/project-management/acceptance-criteria",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SKILL-04",
        "role": "Business Analyst (IT)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao lập danh sách trường hợp kiểm thử UAT cho màn hình đăng ký tài khoản, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "practical_skills",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SKILL-05",
        "role": "Business Analyst (IT)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao dùng SQL cơ bản để kiểm tra số lượng bản ghi theo trạng thái đơn hàng, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "practical_skills",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SKILL-06",
        "role": "Business Analyst (IT)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao ghi lại quyết định, giả định và câu hỏi còn mở trong buổi trao đổi, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "practical_skills",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.atlassian.com/agile/project-management/acceptance-criteria",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SKILL-07",
        "role": "Business Analyst (IT)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao phân tích tác động khi một trường dữ liệu đổi từ tùy chọn thành bắt buộc, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "practical_skills",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SKILL-08",
        "role": "Business Analyst (IT)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi được giao ưu tiên backlog khi nhiều bên liên quan đề nghị tính năng cùng lúc, em sẽ làm theo những bước nào và xác nhận kết quả ra sao?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "practical_skills",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SCENARIO-01",
        "role": "Business Analyst (IT)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Business Analyst (IT), hai stakeholder mô tả quy tắc tính phí khác nhau. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "scenario",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SCENARIO-02",
        "role": "Business Analyst (IT)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Business Analyst (IT), developer hiểu acceptance criteria theo cách khác với người dùng. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "scenario",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SCENARIO-03",
        "role": "Business Analyst (IT)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Business Analyst (IT), người dùng đổi yêu cầu sau khi nhóm đã bắt đầu phát triển. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "scenario",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.atlassian.com/agile/project-management/acceptance-criteria",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SCENARIO-04",
        "role": "Business Analyst (IT)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Business Analyst (IT), UAT phát hiện dữ liệu hiển thị sai nhưng chưa rõ lỗi ở rule hay dữ liệu nguồn. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "scenario",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SCENARIO-05",
        "role": "Business Analyst (IT)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Business Analyst (IT), một báo cáo không khớp số liệu giữa màn hình và file xuất. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "scenario",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-SCENARIO-06",
        "role": "Business Analyst (IT)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong ca hỗ trợ của Business Analyst (IT), yêu cầu ban đầu quá rộng và thời gian trao đổi với stakeholder có hạn. Em sẽ kiểm tra nguyên nhân, xử lý và báo lại như thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "scenario",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.atlassian.com/agile/project-management/acceptance-criteria",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-CV-01",
        "role": "Business Analyst (IT)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện đồ án hoặc case study em từng chuyển yêu cầu người dùng thành user story ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "cv_validation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-CV-02",
        "role": "Business Analyst (IT)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện sơ đồ quy trình nghiệp vụ em đã vẽ và cách kiểm tra với stakeholder ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "cv_validation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-CV-03",
        "role": "Business Analyst (IT)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện test case UAT em từng chuẩn bị và cách ghi nhận kết quả ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "cv_validation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.atlassian.com/agile/project-management/acceptance-criteria",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-CV-04",
        "role": "Business Analyst (IT)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện truy vấn SQL hoặc bảng dữ liệu em từng dùng để xác minh báo cáo ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "cv_validation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-CV-05",
        "role": "Business Analyst (IT)",
        "category": "cv_validation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong bài tập, lab hoặc dự án học tập, em đã thực hiện một yêu cầu mơ hồ em đã làm rõ bằng câu hỏi hoặc ví dụ cụ thể ra sao? Hãy nói rõ phần em trực tiếp làm.",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "cv_validation",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-BEHAVIOR-01",
        "role": "Business Analyst (IT)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Business Analyst (IT), nếu stakeholder bận và liên tục hoãn buổi xác nhận yêu cầu, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "behavioral",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-BEHAVIOR-02",
        "role": "Business Analyst (IT)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Business Analyst (IT), nếu developer đề nghị bỏ một acceptance criterion vì thời gian gấp, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "behavioral",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-BEHAVIOR-03",
        "role": "Business Analyst (IT)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Business Analyst (IT), nếu em phát hiện tài liệu mình viết thiếu một trường hợp ngoại lệ, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "behavioral",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.atlassian.com/agile/project-management/acceptance-criteria",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-BEHAVIOR-04",
        "role": "Business Analyst (IT)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Business Analyst (IT), nếu người dùng phản hồi tính năng khó hiểu dù đã đáp ứng yêu cầu ghi nhận, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "behavioral",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.iiba.org/knowledgehub/business-analysis-standard/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      },
      {
        "id": "BA_IT-BEHAVIOR-05",
        "role": "Business Analyst (IT)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Khi làm việc ở vị trí Business Analyst (IT), nếu em cần trình bày một rủi ro nghiệp vụ cho người không chuyên kỹ thuật, em sẽ trao đổi với nhóm và theo dõi việc tiếp theo thế nào?",
        "evaluationCriteria": [
          "Giải thích đúng trọng tâm quy trình gắn với Business Analyst (IT).",
          "Nêu được các bước kiểm tra hoặc căn cứ lựa chọn, không chỉ kể tên công cụ.",
          "Biết giới hạn quyền hạn của Intern/Fresher và xác nhận trước khi tác động môi trường thật."
        ],
        "followUps": [
          "Em sẽ kiểm tra tài liệu hoặc dấu hiệu nào đầu tiên cho nội dung này?",
          "Nếu bước đầu chưa hiệu quả, em sẽ thu thập thêm thông tin gì và nhờ ai hỗ trợ?"
        ],
        "tags": [
          "Business Analyst (IT)",
          "behavioral",
          "BA_IT"
        ],
        "sourceRefs": [
          "https://www.agilealliance.org/glossary/user-stories/",
          "Tình huống phỏng vấn tự biên soạn - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra thao tác có thể gây rủi ro mà không kiểm tra quyền, phạm vi ảnh hưởng hoặc phương án khôi phục.",
          "Không phân biệt điều mình đã làm với phần chỉ quan sát hoặc được hướng dẫn."
        ]
      }
    ]
  }
];
