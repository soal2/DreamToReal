export type DreamTag = '场景' | '人物' | '情绪' | '对话' | '动作' | '预兆' | '童年';

export type AudioFile = {
  name: string;
  duration: string;
  size: string;
  storage: string;
};

export type Dream = {
  id: string;
  title: string;
  date: string;
  time: string;
  groupDate: string;
  summary: string;
  originalText: string;
  tags: DreamTag[];
  mood: string;
  palette: string;
  imageTone: string;
  audio?: AudioFile;
};
