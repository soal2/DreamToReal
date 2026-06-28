export type DreamSource = "text" | "voice";
export type DreamStatus = "organized" | "image_generated" | "draft" | "failed";

export type AudioFile = {
  name: string;
  duration: string;
  size: string;
  storage: string;
};

export interface DreamRecord {
  id: string;
  title: string;
  raw_text: string;
  organized_text: string;
  image_prompt: string;
  image_url: string;
  keywords: string[];
  emotions: string[];
  scenes: string[];
  source: DreamSource;
  status: DreamStatus;
  created_at: string;
  updated_at: string;
}

export type Dream = DreamRecord & {
  audio?: AudioFile;
};

export interface DreamListItem {
  id: string;
  title: string;
  image_url: string;
  keywords: string[];
  emotions: string[];
  scenes: string[];
  status: DreamStatus;
  created_at: string;
}

export interface DreamListResponse {
  items: DreamListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface DreamImageResponse {
  id: string;
  image_url: string;
  status: DreamStatus;
}

export interface HealthResponse {
  status: "ok";
  service: string;
  version: string;
}

export interface ApiErrorBody {
  error: { code: string; message: string };
}
