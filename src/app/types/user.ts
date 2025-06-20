export interface UserPreferences {
  userId: string;
  courseAccess: {
    courseId: string;
    expiresAt: string | "lifetime";
  }[];
  createdAt: string;
  updatedAt: string;
  languge: string;
  languageSuggestionDismissedAt?: number;
}
