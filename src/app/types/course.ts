export interface Course {
  PK: string;
  SK: string;
  courseId: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnailImage: string;
  price: number;
  sort: number;
  currency: string;
  language: string;
  categories: [
    {
      categoryId: string;
      title: string;
      language: Language;
    }
  ];

  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  lessonCount: number;
  lessonsOrder?: [
    {
      lessonId: string;
      order: number;
    }
  ];
  authorId: string;
  accessPlans: AccessPlan[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  completionStatus: {
    title: boolean;
    description: boolean;
    price: boolean;
    category: boolean;
    lessons: boolean;
    thumbnail: boolean;
  };

  isPublished: boolean;
}

export interface AccessPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export interface CreateCourseInitialData {
  title: string;
  authorId: string;
}

export interface CourseUpdateInfoData {
  courseTitle: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailSrc: string;
  assignedCategories: Pick<Category, "categoryId" | "title" | "language">[];
}

export type LessonsStatus = "waiting" | "preparing" | "ready";

export interface Lesson {
  PK: string;
  SK: string;
  lessonId: string;
  title: string;
  shortDesc: string;
  videoUrl: string;
  duration: number;
  assetId: string | null;
  playbackId: string | null;
  status: LessonsStatus;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Language = "lt" | "ru";

export interface Category {
  PK: string;
  SK: string;
  categoryId: string;
  title: string;
  language: Language;
  description: string;
  createdAt: string;
  updatedAt: string;
}
