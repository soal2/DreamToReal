import { API_BASE_URL } from "../services/http";

export function resolveImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/")) return `${API_BASE_URL}${imageUrl}`;
  return null;
}
