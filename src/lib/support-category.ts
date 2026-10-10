const SUPPORT_CATEGORY_KEYS: Record<string, string> = {
  "Sự cố kỹ thuật": "technical",
  "Đóng góp ý kiến": "feedback",
  "Tài khoản": "account",
  "Thanh toán": "payment",
  "Khác": "other",
};

export function getSupportCategoryLabel(category: string, translate: (key: string) => string) {
  const key = SUPPORT_CATEGORY_KEYS[category];
  return key ? translate(`supportPage.requestTypes.${key}`) : category;
}
