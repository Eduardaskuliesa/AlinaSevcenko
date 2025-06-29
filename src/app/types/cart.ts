export interface CartItem {
  courseId: string;
  userId: string;
  slug: string;
  title: string;
  price: number;
  language: string;
  imageUrl: string;
  duration: number;
  lessonCount: number;
  accessDuration: number;
  accessPlanId: string;
  isFromPrice?: boolean;
}
