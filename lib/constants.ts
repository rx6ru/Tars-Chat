export const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢"] as const;
export type EmojiReaction = typeof EMOJI_REACTIONS[number];

export const TYPING_TIMEOUT_MS = 2000;
