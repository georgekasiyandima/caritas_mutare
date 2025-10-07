// Content configuration for Caritas Mutare
// Easy switch between mock data and real data

export const CONTENT_CONFIG = {
  // Set to true when you have real data from the organization
  USE_REAL_DATA: false,
  
  // Set to true to enable debug mode (shows data source info)
  DEBUG_MODE: true,
  
  // Data refresh intervals (in milliseconds)
  REFRESH_INTERVALS: {
    NEWS: 5 * 60 * 1000, // 5 minutes
    STATS: 10 * 60 * 1000, // 10 minutes
    PROGRAMS: 30 * 60 * 1000, // 30 minutes
  },
  
  // Image settings
  IMAGES: {
    DEFAULT_PLACEHOLDER: '/images/placeholder.jpg',
    QUALITY: 80, // Image compression quality
    MAX_WIDTH: 1200,
    MAX_HEIGHT: 800,
  },
  
  // Content limits
  LIMITS: {
    FEATURED_NEWS: 3,
    LATEST_NEWS: 6,
    TEAM_MEMBERS: 10,
    VOLUNTEER_OPPORTUNITIES: 8,
    ACHIEVEMENTS: 5,
  }
};

// Helper function to check if using real data
export const isUsingRealData = () => CONTENT_CONFIG.USE_REAL_DATA;

// Helper function to get debug info
export const getDebugInfo = () => ({
  dataSource: CONTENT_CONFIG.USE_REAL_DATA ? 'Real Data' : 'Mock Data',
  debugMode: CONTENT_CONFIG.DEBUG_MODE,
  lastUpdated: new Date().toISOString()
});
