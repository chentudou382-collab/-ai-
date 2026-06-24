export interface Order {
  id: string;
  userName: string;
  targetAudience: string;
  creationReason: string;
  keyMemories: string;
  coreMessage: string;
  emotions: string;
  scenes: string;
  musicStyle: string;
  singerGender: string;
  referenceSong: string;
  language: string;
  tempo: string;
  songTitle: string;
  lyricsStyle: string;
  mustIncludeWords: string;
  mustAvoidWords: string;
  planPrice: number;
  planName: string;
  addons: Array<{ name: string; price: number }>;
  totalPrice: number;
  paymentMemo: string;
  userWechat: string;
  referralChannel: string;
  status: 'pending' | 'reconciled' | 'processing' | 'completed';
  lyrics?: string;
  melodyAdvice?: string;
  aiNotes?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  platform: 'xiaohongshu' | 'douyin' | 'pinduoduo';
  username: string;
  avatarColor: string;
  commentText: string;
  matchedKeyword: string;
  postTitle?: string;
  postedTime: string;
  sentiment: 'positive' | 'neutral' | 'high_intent';
  status: 'new' | 'pitched' | 'converted';
  pitchMessage?: string;
  pushedAt?: string;
}

export interface Feedback {
  id: string;
  ratingScore: number;
  comment: string;
  timestamp: string;
}

export interface Settings {
  wechatId: string;
  alipayQrCodeText: string;
  wechatQrCodeText: string;
  aiSystemPrompt: string;
}

export interface SongResult {
  songTitle: string;
  lyrics: string;
  melodyAdvice: string;
  aiNotes: string;
  isRealAi?: boolean;
}
