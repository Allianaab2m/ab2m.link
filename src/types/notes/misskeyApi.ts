export type MisskeyNote = {
  id: string;
  user: {
    username: string;
  };
  createdAt: string;
  text: string | null;
  cw: string | null;
  visibility: "public" | "home" | "followers" | "specified";
  localOnly: boolean;
};
