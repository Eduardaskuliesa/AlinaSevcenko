export interface Course {
  PK: string;
  SK: string;
  courseId: string;
  title: string;
  slug: string;
  slugId: string;
  description: string;
  shortDescription: string;
  thumbnailImage: string;
  duration: number;
  price: number;
  sort: number;
  currency: string;
  language: string;
  enrollmentCount: number;
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
      isPreview: boolean;
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

export interface FilteredCourse {
  courseId: string;
  title: string;
  slug: string;
  shortDescription: string;
  sort: number;
  language: string;
  thumbnailImage: string;
  categories: [
    {
      categoryId: string;
      title: string;
      language: Language;
    }
  ];
  accessPlans: AccessPlan[];
  isPublished: boolean;
  lessonCount: number;
  duration: number;
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
  slug: string;
  slugId: string;
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

export interface Slug {
  PK: string;
  SK: string;
  slugId: string;
  slug: string;
  redirect: boolean;
  redirectTo: string | null;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}
