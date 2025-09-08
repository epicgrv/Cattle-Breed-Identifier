export enum Language {
  EN = 'en',
  HI = 'hi',
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
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface AIResult {
  name: string;
  confidence: 'High' | 'Medium' | 'Low';
  description: string;
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
  ranking: number; // 1 to 5
}