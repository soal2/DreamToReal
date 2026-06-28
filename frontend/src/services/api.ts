import { mockDreams } from '../data/mockDreams';
import type { AudioFile, Dream } from '../types/dream';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function fetchDreams(): Promise<Dream[]> {
  await wait(350);
  return mockDreams;
}

export async function fetchDreamById(id: string): Promise<Dream | undefined> {
  await wait(250);
  return mockDreams.find((dream) => dream.id === id);
}

type CreateDreamInput = {
  rawText: string;
  audio?: AudioFile;
};

export async function createDream(input: CreateDreamInput): Promise<Dream> {
  await wait(1200 + Math.round(Math.random() * 600));
  const rawText = input.rawText.trim();

  return {
    ...mockDreams[0],
    id: `draft-${Date.now()}`,
    title: rawText.length > 12 ? `${rawText.slice(0, 12)}...` : '刚刚记录的梦',
    date: '2026年6月28日',
    time: '现在',
    groupDate: '今天',
    originalText: rawText || '语音记录整理中',
    audio: input.audio,
  };
}

export async function organizeDream(input: string): Promise<Dream> {
  return createDream({ rawText: input });
}
