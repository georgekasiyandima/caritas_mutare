// Data types for Caritas Mutare content management

export interface NewsArticle {
  id: number;
  title_en: string;
  title_sh: string;
  excerpt_en: string;
  excerpt_sh: string;
  content_en: string;
  content_sh: string;
  featured_image?: string;
  published_at: string;
  author: string;
  category: 'general' | 'programs' | 'emergency' | 'achievements';
  featured: boolean;
}

export interface Program {
  id: number;
  key: string;
  title_en: string;
  title_sh: string;
  description_en: string;
  description_sh: string;
  icon: string;
  color: string;
  image?: string;
  stats: {
    families_served: number;
    communities_reached: number;
    budget_allocated: number;
    staff_count: number;
  };
  achievements: string[];
  needs: string[];
}

export interface ContactInfo {
  address: {
    street: string;
    city: string;
    country: string;
    postal_code: string;
  };
  phone: {
    main: string;
    emergency: string;
    admin: string;
  };
  email: {
    general: string;
    admin: string;
    volunteer: string;
    donations: string;
  };
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  office_hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface OrganizationStats {
  families_served: number;
  communities_reached: number;
  lives_impacted: number;
  years_of_service: number;
  active_programs: number;
  total_volunteers: number;
  annual_budget: number;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image?: string;
  email?: string;
  phone?: string;
}

export interface DonationOption {
  id: number;
  amount: number;
  currency: string;
  description: string;
  category: 'general' | 'specific_program' | 'emergency';
  program_id?: number;
}

export interface VolunteerOpportunity {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  time_commitment: string;
  location: string;
  category: 'education' | 'healthcare' | 'administration' | 'field_work';
  urgent: boolean;
}

export interface Achievement {
  id: number;
  year: number;
  title: string;
  description: string;
  impact: string;
  category: 'program_success' | 'award' | 'milestone' | 'partnership';
  image?: string;
}

/** Canonical project type for donor-funded and own initiatives (from org material). */
export interface CaritasProject {
  id: string;
  slug: string;
  acronym?: string;
  title_en: string;
  title_sh: string;
  summary_en: string;
  summary_sh: string;
  description_en: string;
  description_sh: string;
  /** Donor names (e.g. "Oak Foundation", "CAFOD"). */
  donors: string[];
  /** Partner names (e.g. "Trocaire Zimbabwe", "CBM Global Zimbabwe"). */
  partners: string[];
  /** Logo paths under public/ (e.g. "/images/partners/cafod.png"). */
  donorLogoUrls?: string[];
  partnerLogoUrls?: string[];
  /** Target description (e.g. "1200 individuals", "500 households"). */
  target: string;
  /** Location (wards, districts). */
  location: string;
  /** Duration (e.g. "Oct 2024 – Oct 2026", "Ongoing"). */
  duration: string;
  /** Staff count or "All Caritas Staff" etc. */
  staff?: string;
  theoryOfChange_en?: string;
  theoryOfChange_sh?: string;
  keyPathways: string[];
  /** Route for programme page (e.g. "/programs/soup-kitchen"). */
  route: string;
  /** Hero image path. */
  heroImage?: string;
  /** Gallery image paths. */
  galleryImages?: string[];
  status: 'active' | 'completed' | 'ongoing';
  /** MUI icon name or programme category for card styling. */
  icon?: string;
  color?: string;
}
