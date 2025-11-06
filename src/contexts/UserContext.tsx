import { createContext, useContext, useState, ReactNode } from "react";

type UserType = "bapt" | "imrane";

type TableName = 
  | "Leads Linkedin"
  | "Posts En Ligne"
  | "competitors"
  | "competitor_posts";

interface UserContextType {
  selectedUser: UserType;
  setSelectedUser: (user: UserType) => void;
  getTableName: (baseName: TableName) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<UserType>("bapt");

  const getTableName = (baseName: TableName): any => {
    return `${baseName}_${selectedUser}` as any;
  };

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser, getTableName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
