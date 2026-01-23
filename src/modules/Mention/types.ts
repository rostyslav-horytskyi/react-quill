export type MentionEntity = {
  id: string;
  label: string;
  value?: string;
  avatarUrl?: string;
  meta?: Record<string, string>;
};

export type MentionSource = (query: string) => Promise<MentionEntity[]>;

export type MentionModuleOptions = {
  source?: MentionSource;
  minChars?: number;
  maxChars?: number;
  maxItems?: number;
  emptyMessage?: string;
};
