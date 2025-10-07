import { 
  NewsArticle, 
  Program, 
  ContactInfo, 
  OrganizationStats, 
  TeamMember, 
  DonationOption, 
  VolunteerOpportunity, 
  Achievement 
} from './types';

// Mock news articles - Replace with real content from organization
export const mockNewsArticles: NewsArticle[] = [
  {
    id: 1,
    title_en: "Caritas Mutare Launches New Education Initiative",
    title_sh: "Caritas Mutare Yatanga Chirongwa Chitsva Chedzidzo",
    excerpt_en: "A new program to support primary education in rural communities across the diocese.",
    excerpt_sh: "Chirongwa chitsva chekutsigira dzidzo yeprimary munharaunda dzekumaruwa mudiyocese.",
    content_en: "Full article content will be provided by the organization...",
    content_sh: "Zviri mukati zvechinyorwa zvichapihwa nesangano...",
    featured_image: "/images/news/education-initiative.jpg",
    published_at: "2024-01-15",
    author: "Caritas Mutare Communications",
    category: "programs",
    featured: true
  },
  {
    id: 2,
    title_en: "Emergency Relief for Cyclone-Affected Families",
    title_sh: "Rubatsiro Rwechimbichimbi Kune Mhuri Dzakakanganiswa Nedutu",
    excerpt_en: "Providing immediate assistance to families affected by recent weather events.",
    excerpt_sh: "Kupa rubatsiro rwekukurumidza kune mhuri dzakakanganiswa nemamiriro ekunze achangobva kuitika.",
    content_en: "Full article content will be provided by the organization...",
    content_sh: "Zviri mukati zvechinyorwa zvichapihwa nesangano...",
    featured_image: "/images/news/emergency-relief.jpg",
    published_at: "2024-01-10",
    author: "Caritas Mutare Emergency Response Team",
    category: "emergency",
    featured: true
  },
  {
    id: 3,
    title_en: "Annual Report 2023: Impact and Achievements",
    title_sh: "Gwaro Regore 2023: Mhedzisiro Uye Zvakawanikwa",
    excerpt_en: "Reviewing our impact and achievements throughout 2023.",
    excerpt_sh: "Kuongorora mhedzisiro yedu uye zvakawanikwa mugore rose ra2023.",
    content_en: "Full article content will be provided by the organization...",
    content_sh: "Zviri mukati zvechinyorwa zvichapihwa nesangano...",
    featured_image: "/images/news/annual-report-2023.jpg",
    published_at: "2024-01-05",
    author: "Caritas Mutare Administration",
    category: "achievements",
    featured: false
  }
];

// Mock programs - Replace with real program data
export const mockPrograms: Program[] = [
  {
    id: 1,
    key: "education",
    title_en: "Education & Training",
    title_sh: "Dzidzo neKudzidzisa",
    description_en: "Providing access to quality education and vocational training for children and adults across the diocese.",
    description_sh: "Kupa mukana wekuwana dzidzo yemhando yepamusoro uye kudzidziswa kwehunyanzvi kuvana nevakuru mudiyocese yese.",
    icon: "School",
    color: "primary.main",
    stats: {
      families_served: 150,
      communities_reached: 25,
      budget_allocated: 50000,
      staff_count: 8
    },
    achievements: [
      "Built 3 new classrooms",
      "Trained 50 teachers",
      "Provided scholarships to 100 students"
    ],
    needs: [
      "Educational materials",
      "Volunteer teachers",
      "Infrastructure development"
    ]
  },
  {
    id: 2,
    key: "healthcare",
    title_en: "Healthcare & Nutrition",
    title_sh: "Hutano neKudya",
    description_en: "Improving health outcomes through medical care, nutrition programs, and health education.",
    description_sh: "Kuvandudza hutano hwevanhu kuburikidza nekurapa, zvirongwa zvekudya, uye dzidziso yehutano.",
    icon: "LocalHospital",
    color: "primary.main",
    stats: {
      families_served: 200,
      communities_reached: 30,
      budget_allocated: 75000,
      staff_count: 12
    },
    achievements: [
      "Established 5 health clinics",
      "Vaccinated 500 children",
      "Provided nutrition support to 300 families"
    ],
    needs: [
      "Medical supplies",
      "Healthcare volunteers",
      "Nutrition supplements"
    ]
  },
  {
    id: 3,
    key: "agriculture",
    title_en: "Agriculture & Food Security",
    title_sh: "Kurima neKudya Kwakachengeteka",
    description_en: "Supporting sustainable farming practices and food security initiatives.",
    description_sh: "Kutsigira nzira dzekurima dzakasimba uye zvirongwa zvekudya kwakachengeteka.",
    icon: "Agriculture",
    color: "success.main",
    stats: {
      families_served: 300,
      communities_reached: 40,
      budget_allocated: 60000,
      staff_count: 10
    },
    achievements: [
      "Distributed seeds to 500 farmers",
      "Established 10 community gardens",
      "Trained 200 farmers in sustainable practices"
    ],
    needs: [
      "Seeds and tools",
      "Agricultural training",
      "Irrigation systems"
    ]
  },
  {
    id: 4,
    key: "livelihood",
    title_en: "Livelihood Support",
    title_sh: "Kutsigira Hupenyu",
    description_en: "Creating economic opportunities through microfinance and skills development.",
    description_sh: "Kugadzira mikana yehupfumi kuburikidza nemari diki uye kusimudzira hunyanzvi.",
    icon: "Work",
    color: "warning.main",
    stats: {
      families_served: 100,
      communities_reached: 20,
      budget_allocated: 40000,
      staff_count: 6
    },
    achievements: [
      "Provided micro-loans to 50 families",
      "Started 20 small businesses",
      "Trained 75 people in vocational skills"
    ],
    needs: [
      "Start-up capital",
      "Business training",
      "Market access support"
    ]
  },
  {
    id: 5,
    key: "emergency",
    title_en: "Emergency Response",
    title_sh: "Kupindura Njodzi",
    description_en: "Providing immediate assistance during crises and natural disasters.",
    description_sh: "Kupa rubatsiro rwekukurumidza panguva yenhamo uye njodzi dzechisikigo.",
    icon: "CrisisAlert",
    color: "error.main",
    stats: {
      families_served: 500,
      communities_reached: 15,
      budget_allocated: 100000,
      staff_count: 15
    },
    achievements: [
      "Responded to 3 natural disasters",
      "Provided emergency shelter to 200 families",
      "Distributed relief supplies to 1000 people"
    ],
    needs: [
      "Emergency supplies",
      "Disaster response training",
      "Transportation resources"
    ]
  }
];

// Mock contact information - Replace with real contact details
export const mockContactInfo: ContactInfo = {
  address: {
    street: "123 Bishop Street", // Replace with actual address
    city: "Mutare",
    country: "Zimbabwe",
    postal_code: "263"
  },
  phone: {
    main: "+263 20 6XXXXXX", // Replace with actual phone numbers
    emergency: "+263 77 XXXX XXX",
    admin: "+263 20 6XXXXXX"
  },
  email: {
    general: "info@caritasmutare.org", // Replace with actual emails
    admin: "admin@caritasmutare.org",
    volunteer: "volunteer@caritasmutare.org",
    donations: "donations@caritasmutare.org"
  },
  social_media: {
    facebook: "https://facebook.com/caritasmutare", // Replace with actual social media
    twitter: "https://twitter.com/caritasmutare",
    instagram: "https://instagram.com/caritasmutare"
  },
  office_hours: {
    weekdays: "8:00 AM - 5:00 PM",
    saturday: "8:00 AM - 1:00 PM",
    sunday: "Closed"
  }
};

// Mock organization statistics - Replace with real stats
export const mockOrganizationStats: OrganizationStats = {
  families_served: 500,
  communities_reached: 50,
  lives_impacted: 1000,
  years_of_service: 10,
  active_programs: 5,
  total_volunteers: 100,
  annual_budget: 500000
};

// Mock team members - Replace with real team information
export const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Rev. Father John Smith", // Replace with actual names
    position: "Director",
    bio: "Leading Caritas Mutare with over 15 years of experience in community development.",
    image: "/images/team/director.jpg",
    email: "director@caritasmutare.org",
    phone: "+263 20 6XXXXXX"
  },
  {
    id: 2,
    name: "Sr. Mary Johnson",
    position: "Program Coordinator",
    bio: "Coordinating education and healthcare programs across the diocese.",
    image: "/images/team/coordinator.jpg",
    email: "coordinator@caritasmutare.org"
  }
];

// Mock donation options - Replace with real donation categories
export const mockDonationOptions: DonationOption[] = [
  {
    id: 1,
    amount: 50,
    currency: "USD",
    description: "Support a child's education for one month",
    category: "specific_program",
    program_id: 1
  },
  {
    id: 2,
    amount: 100,
    currency: "USD",
    description: "Provide emergency relief for one family",
    category: "emergency"
  },
  {
    id: 3,
    amount: 200,
    currency: "USD",
    description: "Support agricultural training for 5 farmers",
    category: "specific_program",
    program_id: 3
  }
];

// Mock volunteer opportunities - Replace with real opportunities
export const mockVolunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: 1,
    title: "Teaching Assistant",
    description: "Assist teachers in primary schools across rural communities.",
    requirements: ["Teaching experience", "Patience with children", "Transportation"],
    time_commitment: "2-3 days per week",
    location: "Rural communities around Mutare",
    category: "education",
    urgent: false
  },
  {
    id: 2,
    title: "Medical Volunteer",
    description: "Provide basic medical care and health education.",
    requirements: ["Medical background", "First aid certification", "Compassion"],
    time_commitment: "1-2 days per week",
    location: "Health clinics and communities",
    category: "healthcare",
    urgent: true
  }
];

// Mock achievements - Replace with real achievements
export const mockAchievements: Achievement[] = [
  {
    id: 1,
    year: 2023,
    title: "Diocese Excellence Award",
    description: "Recognized for outstanding service to the community",
    impact: "Increased community trust and support",
    category: "award",
    image: "/images/achievements/excellence-award-2023.jpg"
  },
  {
    id: 2,
    year: 2023,
    title: "10,000 Lives Impacted Milestone",
    description: "Reached the milestone of impacting 10,000 lives since inception",
    impact: "Demonstrated sustained growth and impact",
    category: "milestone"
  }
];
