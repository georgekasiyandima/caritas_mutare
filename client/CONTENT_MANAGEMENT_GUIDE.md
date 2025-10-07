# Caritas Mutare Content Management Guide

This guide explains how to replace the placeholder content with real information from your organization.

## 📁 File Structure

```
src/data/
├── types.ts          # Data structure definitions
├── mockData.ts       # Placeholder content (replace this)
├── contentManager.ts # Content management utilities
└── README.md         # This guide
```

## 🔄 How to Replace Content

### 1. News Articles (`mockData.ts` → `newsArticles`)

Replace the `mockNewsArticles` array with your real news content:

```typescript
export const mockNewsArticles: NewsArticle[] = [
  {
    id: 1,
    title_en: "Your Actual News Title",
    title_sh: "Musoro Wechinyorwa Chako Chaicho",
    excerpt_en: "Brief description of the news article...",
    excerpt_sh: "Tsananguro pfupi yechinyorwa...",
    content_en: "Full article content in English...",
    content_sh: "Zviri mukati zvechinyorwa muchiShona...",
    featured_image: "/images/news/your-image.jpg", // Add your image
    published_at: "2024-01-15", // YYYY-MM-DD format
    author: "Author Name",
    category: "programs", // or "general", "emergency", "achievements"
    featured: true // true for featured articles
  }
  // Add more articles...
];
```

### 2. Programs (`mockData.ts` → `programs`)

Update the `mockPrograms` array with your actual programs:

```typescript
export const mockPrograms: Program[] = [
  {
    id: 1,
    key: "education", // Keep this as identifier
    title_en: "Your Program Name",
    title_sh: "Zita Rechirongwa Chako",
    description_en: "Detailed program description...",
    description_sh: "Tsananguro yakadzama yechirongwa...",
    icon: "School", // Material-UI icon name
    color: "primary.main", // Theme color
    stats: {
      families_served: 150, // Real numbers
      communities_reached: 25,
      budget_allocated: 50000,
      staff_count: 8
    },
    achievements: [
      "Real achievement 1",
      "Real achievement 2"
    ],
    needs: [
      "What you need help with",
      "Resources required"
    ]
  }
  // Add more programs...
];
```

### 3. Contact Information (`mockData.ts` → `contactInfo`)

Replace with your actual contact details:

```typescript
export const mockContactInfo: ContactInfo = {
  address: {
    street: "Your Actual Street Address",
    city: "Mutare",
    country: "Zimbabwe",
    postal_code: "Your Postal Code"
  },
  phone: {
    main: "+263 XX XXX XXXX", // Your main phone
    emergency: "+263 XX XXX XXXX", // Emergency contact
    admin: "+263 XX XXX XXXX" // Admin contact
  },
  email: {
    general: "your-email@caritasmutare.org",
    admin: "admin@caritasmutare.org",
    volunteer: "volunteer@caritasmutare.org",
    donations: "donations@caritasmutare.org"
  },
  social_media: {
    facebook: "https://facebook.com/yourpage",
    twitter: "https://twitter.com/yourhandle",
    instagram: "https://instagram.com/yourhandle"
  },
  office_hours: {
    weekdays: "Your actual hours",
    saturday: "Saturday hours",
    sunday: "Sunday hours or 'Closed'"
  }
};
```

### 4. Organization Statistics (`mockData.ts` → `organizationStats`)

Update with your real statistics:

```typescript
export const mockOrganizationStats: OrganizationStats = {
  families_served: 500, // Your actual numbers
  communities_reached: 50,
  lives_impacted: 1000,
  years_of_service: 10,
  active_programs: 5,
  total_volunteers: 100,
  annual_budget: 500000 // In your preferred currency
};
```

### 5. Team Members (`mockData.ts` → `teamMembers`)

Add your actual team information:

```typescript
export const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Actual Team Member Name",
    position: "Their Actual Position",
    bio: "Brief bio about the team member...",
    image: "/images/team/team-member.jpg", // Add their photo
    email: "their-email@caritasmutare.org",
    phone: "+263 XX XXX XXXX"
  }
  // Add more team members...
];
```

### 6. Donation Options (`mockData.ts` → `donationOptions`)

Define your actual donation categories:

```typescript
export const mockDonationOptions: DonationOption[] = [
  {
    id: 1,
    amount: 50, // In your preferred currency
    currency: "USD", // or "ZWL", "EUR", etc.
    description: "What this donation amount provides",
    category: "specific_program", // or "general", "emergency"
    program_id: 1 // If specific to a program
  }
  // Add more donation options...
];
```

### 7. Volunteer Opportunities (`mockData.ts` → `volunteerOpportunities`)

List your actual volunteer needs:

```typescript
export const mockVolunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: 1,
    title: "Volunteer Position Title",
    description: "Detailed description of volunteer role...",
    requirements: [
      "Required skill 1",
      "Required skill 2"
    ],
    time_commitment: "How much time needed",
    location: "Where the volunteer will work",
    category: "education", // or "healthcare", "administration", "field_work"
    urgent: false // true if urgently needed
  }
  // Add more opportunities...
];
```

### 8. Achievements (`mockData.ts` → `achievements`)

Document your organization's achievements:

```typescript
export const mockAchievements: Achievement[] = [
  {
    id: 1,
    year: 2023,
    title: "Achievement Title",
    description: "What was accomplished...",
    impact: "How it helped the community...",
    category: "award", // or "program_success", "milestone", "partnership"
    image: "/images/achievements/achievement.jpg" // Optional image
  }
  // Add more achievements...
];
```

## 🖼️ Adding Images

1. **Create image folders:**
   ```
   public/images/
   ├── news/
   ├── team/
   ├── achievements/
   ├── programs/
   └── general/
   ```

2. **Add your images** to the appropriate folders

3. **Update image paths** in the data files to match your image locations

## 🔧 Switching to Real Data

Once you've replaced all the mock data:

1. Open `src/data/contentManager.ts`
2. Change `USE_REAL_DATA: false` to `USE_REAL_DATA: true`
3. The app will automatically use your real data

## 📝 Content Guidelines

### Text Content:
- Keep descriptions concise but informative
- Use clear, simple language
- Include both English and Shona translations when possible

### Images:
- Use high-quality images (minimum 800px width)
- Optimize images for web (compress to reduce file size)
- Use descriptive filenames
- Maintain consistent aspect ratios

### Contact Information:
- Always include both phone and email
- Verify all contact details are current
- Include emergency contact information

## 🚀 Quick Start Checklist

- [ ] Replace news articles with real content
- [ ] Update program information and statistics
- [ ] Add actual contact information
- [ ] Include real team member profiles
- [ ] Define actual donation options
- [ ] List current volunteer opportunities
- [ ] Document recent achievements
- [ ] Add organization photos and images
- [ ] Test all contact forms and links
- [ ] Switch to real data mode

## 📞 Need Help?

If you need assistance updating the content, contact your web developer or refer to the technical documentation in the project repository.

---

**Note:** This system is designed to make content updates easy. You can start by replacing just one section at a time and gradually update all content as information becomes available.
