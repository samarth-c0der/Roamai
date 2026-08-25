export const config = {
  api: {
    geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  db: {
    schema: 'public',
    tables: {
      users: 'users',
      trips: 'trips',
      places: 'places'
    }
  },
  app: {
    url: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
    name: 'RoamAI',
  },
  models: {
    defaultAiModel: 'gemini-3.6-flash',
  }
};
