export interface CartItem {
  courseId: string;
  slug: string;
  title: string;
  price: number;
  language: string;
  imageUrl: string;
  duration: number;
  lessonCount: number;
  accessDuration: number;
  isFromPrice?: boolean;
}
