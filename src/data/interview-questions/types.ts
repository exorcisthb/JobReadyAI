export type QuestionCategory =
  | 'foundation'          // Kiến thức nền tảng
  | 'practical_skills'   // Kỹ năng, công cụ & quy trình chuyên môn
  | 'scenario'           // Tình huống thực tế & giải quyết vấn đề
  | 'cv_validation'      // Dự án, kinh nghiệm & xác thực CV
  | 'behavioral';        // Hành vi, giao tiếp, phối hợp & ra quyết định

export type QuestionDifficulty = 'basic' | 'intermediate' | 'advanced';

export type SeniorityLevel = 'fresher_intern' | 'junior' | 'middle' | 'senior_lead';

export interface InterviewQuestion {
  id: string;
  role: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  seniority: SeniorityLevel;
  question: string;
  evaluationCriteria: string[];
  followUps: string[];
  tags: string[];
  sourceRefs: string[];
  redFlags: string[];
}

export interface RoleQuestionBank {
  role: string;
  group: string;
  groupLabel: string;
  aliases: string[];
  questions: InterviewQuestion[];
}
