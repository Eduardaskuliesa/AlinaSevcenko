export interface EnrolledCourse {
  PK: string;
  SK: string;
  courseId: string;
  userId: string;
  purchaseId: string;
  paymentId: string;
  title: string;
  purchaseDate: string;
  expiresAt: string;
  status: "ACTIVE" | "EXPIRED";
  languge: string;
  thumbnailImage: string;
  accessPlanName: string;
  accessPlanDuration: number;
  courseVersion: number;
  lastSyncedAt: string;
  overallProgress: number;
  lastLessonId: string | null;
  lastLessonWatchTime: number;

  lessonProgress: {
    [lessonId: string]: {
      progress: number;
      completedAt?: string;
      wasReworked?: boolean;
    };
  };

  createdAt: string;
  updatedAt: string;
}
