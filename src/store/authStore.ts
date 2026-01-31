import { create } from "zustand";

type User = {
  username: string;
  password: string;
};

type AuthStore = {
  users: User[];
  loggedInUser: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Add users here
  users: [
    { username: "admin", password: "1234" },
    { username: "staff1", password: "abcd" },
    { username: "staff2", password: "pass" },
  ],
  loggedInUser: null,
  login: (username, password) => {
    const user = get().users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      set({ loggedInUser: username });
      return true;
    }
    return false;
  },
  logout: () => set({ loggedInUser: null }),
}));
