import { request } from "./http";
import type {
  DreamImageResponse,
  DreamListResponse,
  DreamRecord,
  DreamSource,
  HealthResponse,
} from "../types/dream";

export function checkHealth(): Promise<HealthResponse> {
  return request("/api/v1/health");
}

export function listDreams(params?: { limit?: number; offset?: number }): Promise<DreamListResponse> {
  const limit = params?.limit ?? 20;
  const offset = params?.offset ?? 0;
  return request(`/api/v1/dreams?limit=${limit}&offset=${offset}`);
}

export function fetchDreamById(id: string): Promise<DreamRecord> {
  return request(`/api/v1/dreams/${encodeURIComponent(id)}`);
}

export function createDream(body: {
  raw_text: string;
  source?: DreamSource;
  generate_image?: boolean;
}): Promise<DreamRecord> {
  return request("/api/v1/dreams", {
    method: "POST",
    body: JSON.stringify({
      source: "text",
      generate_image: false,
      ...body,
    }),
  });
}

export function reorganizeDream(id: string, style?: string): Promise<DreamRecord> {
  return request(`/api/v1/dreams/${encodeURIComponent(id)}/reorganize`, {
    method: "POST",
    body: JSON.stringify(style ? { style } : {}),
  });
}

export function generateDreamImage(id: string, useMock = false): Promise<DreamImageResponse> {
  return request(`/api/v1/dreams/${encodeURIComponent(id)}/generate-image`, {
    method: "POST",
    body: JSON.stringify({ use_mock: useMock }),
  });
}

export function deleteDream(id: string): Promise<void> {
  return request(`/api/v1/dreams/${encodeURIComponent(id)}`, { method: "DELETE" });
}
