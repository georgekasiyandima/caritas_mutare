// Content management utilities for easy data replacement
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
import { 
  mockNewsArticles, 
  mockPrograms, 
  mockContactInfo, 
  mockOrganizationStats, 
  mockTeamMembers, 
  mockDonationOptions, 
  mockVolunteerOpportunities, 
  mockAchievements 
} from './mockData';

// Content Manager Class for easy data management
export class ContentManager {
  private static instance: ContentManager;
  private useRealData: boolean = false;

  private constructor() {}

  public static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager();
    }
    return ContentManager.instance;
  }

  // Toggle between mock and real data
  public setUseRealData(useReal: boolean): void {
    this.useRealData = useReal;
  }

  // News Articles
  public getNewsArticles(): NewsArticle[] {
    if (this.useRealData) {
      // TODO: Replace with API call or real data source
      return mockNewsArticles;
    }
    return mockNewsArticles;
  }

  public getFeaturedNews(): NewsArticle[] {
    return this.getNewsArticles().filter(article => article.featured);
  }

  public getLatestNews(limit: number = 3): NewsArticle[] {
    return this.getNewsArticles()
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, limit);
  }

  // Programs
  public getPrograms(): Program[] {
    if (this.useRealData) {
      // TODO: Replace with API call or real data source
      return mockPrograms;
    }
    return mockPrograms;
  }

  public getProgramByKey(key: string): Program | undefined {
    return this.getPrograms().find(program => program.key === key);
  }

  // Contact Information
  public getContactInfo(): ContactInfo {
    if (this.useRealData) {
      // TODO: Replace with real contact information
      return mockContactInfo;
    }
    return mockContactInfo;
  }

  // Organization Statistics
  public getOrganizationStats(): OrganizationStats {
    if (this.useRealData) {
      // TODO: Replace with real statistics
      return mockOrganizationStats;
    }
    return mockOrganizationStats;
  }

  // Team Members
  public getTeamMembers(): TeamMember[] {
    if (this.useRealData) {
      // TODO: Replace with real team data
      return mockTeamMembers;
    }
    return mockTeamMembers;
  }

  // Donation Options
  public getDonationOptions(): DonationOption[] {
    if (this.useRealData) {
      // TODO: Replace with real donation options
      return mockDonationOptions;
    }
    return mockDonationOptions;
  }

  // Volunteer Opportunities
  public getVolunteerOpportunities(): VolunteerOpportunity[] {
    if (this.useRealData) {
      // TODO: Replace with real volunteer opportunities
      return mockVolunteerOpportunities;
    }
    return mockVolunteerOpportunities;
  }

  public getUrgentVolunteerOpportunities(): VolunteerOpportunity[] {
    return this.getVolunteerOpportunities().filter(opp => opp.urgent);
  }

  // Achievements
  public getAchievements(): Achievement[] {
    if (this.useRealData) {
      // TODO: Replace with real achievements
      return mockAchievements;
    }
    return mockAchievements;
  }

  public getRecentAchievements(limit: number = 3): Achievement[] {
    return this.getAchievements()
      .sort((a, b) => b.year - a.year)
      .slice(0, limit);
  }
}

// Export singleton instance
export const contentManager = ContentManager.getInstance();

// Helper functions for easy access
export const getNewsArticles = () => contentManager.getNewsArticles();
export const getFeaturedNews = () => contentManager.getFeaturedNews();
export const getLatestNews = (limit?: number) => contentManager.getLatestNews(limit);
export const getPrograms = () => contentManager.getPrograms();
export const getProgramByKey = (key: string) => contentManager.getProgramByKey(key);
export const getContactInfo = () => contentManager.getContactInfo();
export const getOrganizationStats = () => contentManager.getOrganizationStats();
export const getTeamMembers = () => contentManager.getTeamMembers();
export const getDonationOptions = () => contentManager.getDonationOptions();
export const getVolunteerOpportunities = () => contentManager.getVolunteerOpportunities();
export const getUrgentVolunteerOpportunities = () => contentManager.getUrgentVolunteerOpportunities();
export const getAchievements = () => contentManager.getAchievements();
export const getRecentAchievements = (limit?: number) => contentManager.getRecentAchievements(limit);

// Configuration for easy data source switching
export const DATA_CONFIG = {
  // Set to true when you have real data ready
  USE_REAL_DATA: false,
  
  // API endpoints for real data (when ready)
  API_ENDPOINTS: {
    NEWS: '/api/news',
    PROGRAMS: '/api/programs',
    CONTACT: '/api/contact',
    STATS: '/api/stats',
    TEAM: '/api/team',
    DONATIONS: '/api/donations',
    VOLUNTEERS: '/api/volunteers',
    ACHIEVEMENTS: '/api/achievements'
  },
  
  // File paths for static data (alternative to API)
  STATIC_DATA_PATHS: {
    NEWS: '/data/news.json',
    PROGRAMS: '/data/programs.json',
    CONTACT: '/data/contact.json',
    STATS: '/data/stats.json',
    TEAM: '/data/team.json',
    DONATIONS: '/data/donations.json',
    VOLUNTEERS: '/data/volunteers.json',
    ACHIEVEMENTS: '/data/achievements.json'
  }
};
