export interface User {
  username: string;
  role: "admin" | "student";
  password?: string;
  team?: string;
  isLeader?: boolean;
}

export interface UserWithId extends User {
  _id: string;
}
