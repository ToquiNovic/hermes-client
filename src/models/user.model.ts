// user.model.ts
export interface User {
  username: string;
  role: "admin" | "student";
  password?: string;
  team?: string;
  isLeader?: boolean;
  refreshToken?: string;
}

export interface UserWithId extends User {
  _id: string;
}
