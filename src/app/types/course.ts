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
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  lessonCount: number;
  authorId: string;
  accessPlans: {
    planId: string;
    name: string;
    duration: number | null;
    price: number;
  }[];
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
  canBePublished: boolean;
}

export interface CreateCourseInitialData {
  title: string;
  authorId: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CourseUpdateInfoData {
  courseTitle: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailSrc: string;
  assignedCategories: Category[];
}

export interface Lesson {
  PK: string;
  SK: string;
  lessonId: string;
  title: string;
  shortDesc: string;
  videoUrl: string;
  duration: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}
