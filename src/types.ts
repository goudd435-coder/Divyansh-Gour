export interface MembershipEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  start_date?: string;
  expiry_date?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Trainer {
  id: number;
  name: string;
  role: string;
  experience: string;
  specialization: string[];
  imageUrl: string;
  rating: number;
}

export interface GymService {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
}

export interface MembershipPlan {
  id: number;
  name: 'Monthly' | 'Quarterly' | 'Yearly';
  price: string;
  originalPrice: string;
  savings?: string;
  features: string[];
  popular: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  feedback: string;
  rating: number;
  imageUrl: string;
  transformation?: {
    before: string;
    after: string;
  };
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface GalleryItem {
  id: number;
  category: 'equipment' | 'workout' | 'interior' | 'transformation';
  title: string;
  imageUrl: string;
}
