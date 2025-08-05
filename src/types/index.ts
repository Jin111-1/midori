// Database Types
export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Version {
  id: string;
  project_id: string;
  code: string;
  created_at: string;
}

export interface Prompt {
  id: string;
  project_id: string;
  prompt_text: string;
  created_at: string;
  cached_summary?: string;
}

export interface TokenUsage {
  id: string;
  user_id: string;
  model_used: string;
  token_count: number;
  created_at: string;
}

export interface Draft {
  id: string;
  project_id: string;
  prompt_id: string;
  code: string;
  is_saved: boolean;
  created_at: string;
}

export interface ChatHistory {
  id: string;
  project_id: string;
  role: 'user' | 'assistant' | 'midori';
  content: string;
  created_at: string;
}

// UI Types
export interface MidoriResponse {
  summary: string;
  clarifications?: string[];
  refinedPrompt: string;
}

export interface CodeGenerationResponse {
  code: string;
  explanation: string;
  tokenUsage: number;
}

export interface EditorState {
  content: string;
  language: string;
  isDraft: boolean;
  lastSaved?: string;
}