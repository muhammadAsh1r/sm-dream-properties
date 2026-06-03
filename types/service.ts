export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  rating: number;
};
