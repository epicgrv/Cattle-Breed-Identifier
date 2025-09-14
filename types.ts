// FIX: Removed incorrect import of `Language` from `./constants` to resolve a circular dependency.

export enum Language {
  EN = 'en',
  HI = 'hi',
  MR = 'mr', // Marathi
  GU = 'gu', // Gujarati
  TE = 'te', // Telugu
  ML = 'ml', // Malayalam
  TA = 'ta', // Tamil
  KN = 'kn', // Kannada
}

export enum AnalysisStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum View {
  IDENTIFIER = 'identifier',
  FIELD_WORKER = 'field_worker',
  ANALYTICS = 'analytics',
  PROFILE = 'profile',
  SCHEMES = 'schemes',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface AIResult {
  name: string;
  confidence: 'High' | 'Medium' | 'Low';
  locations: string[];
  milkCapacity: string;
  milkQuality: {
    fat: string;
    protein: string;
  };
  rating: number; // 1 to 5
}

export interface AnalysisResult {
  aiResult: AIResult;
  species: 'COW' | 'BUFFALO';
}

export interface WebResult {
  uri: string;
  title: string;
}

export interface FieldWorkData {
  id: number;
  breed: string;
  location: string;
  date: string;
}

export interface BreedAnalyticsData {
  id: number;
  name: string;
  milkQuality: {
    fat: string;
    protein: string;
  };
  location: string;
  ranking: number;
  suitability: {
    [key in Language]?: string;
  };
  monthlyExpense: {
    [key in Language]?: string;
  };
  breedingSeason: {
    [key in Language]?: string;
  };
  matingSuggestions: {
    [key in Language]?: string[];
  };
}


export interface SchemeData {
  id: number;
  name: {
    [key in Language]?: string;
  };
  description: {
    [key in Language]?: string;
  };
  eligibility: {
    [key in Language]?: string[];
  };
  link: string;
}