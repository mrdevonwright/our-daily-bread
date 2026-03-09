// =============================================
// Database row types (match Supabase schema)
// =============================================

export type UserRole = "baker" | "church_admin" | "super_admin";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  church_id: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  loaves_sold: number;
  money_raised: number;
  created_at: string;
  updated_at: string;
}

export interface Church {
  id: string;
  name: string;
  denomination: string | null;
  address: string | null;
  city: string;
  state: string;
  zip: string | null;
  website: string | null;
  admin_id: string | null;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaleLog {
  id: string;
  baker_id: string;
  church_id: string;
  loaves_count: number;
  amount_raised: number;
  notes: string | null;
  sold_at: string;
  created_at: string;
  baker?: Profile;
  church?: Church;
}

export interface GlobalStats {
  id: 1;
  total_churches: number;
  total_bakers: number;
  total_loaves: number;
  total_raised: number;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  author_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface StorySubmission {
  id: string;
  name: string;
  church_name: string | null;
  story: string;
  photo_url: string | null;
  approved: boolean;
  submitted_by: string | null;
  created_at: string;
}

// =============================================
// Form input types
// =============================================

export interface ChurchSignupInput {
  church_name: string;
  denomination?: string;
  city: string;
  state: string;
  zip?: string;
  website?: string;
  admin_full_name: string;
  admin_email: string;
  admin_password: string;
  confirm_password: string;
}

export interface BakerJoinInput {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  church_id: string;
}

export interface SaleLogInput {
  loaves_count: number;
  amount_raised: number;
  sold_at: string;
  notes?: string;
}

export interface ContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface DonationAmountInput {
  amount: number;
  is_recurring: boolean;
  donor_name?: string;
  donor_email?: string;
}

// =============================================
// Component prop types
// =============================================

export interface BlogCardProps {
  post: BlogPost;
}

export interface StatsTickerProps {
  initialStats: GlobalStats;
}

export interface BibleVerseData {
  reference: string;
  text: string;
  theme: string;
  reflection: string;
}

export interface TestimonialData {
  quote: string;
  author: string;
  church: string;
}

export interface RecipeStep {
  day: string;
  title: string;
  duration: string;
  instructions: string[];
  tip?: string;
}

export interface ChurchWithStats extends Church {
  baker_count?: number;
}

export interface Invitation {
  id: string;
  church_id: string;
  email: string;
  token: string;
  invited_by: string;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
}
