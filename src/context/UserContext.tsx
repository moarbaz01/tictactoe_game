import React, { createContext, ReactNode, useState } from "react";

interface UserContextType {
  name: string;
  opponentName: string;
  setName: (name: string) => void;
  setOpponentName: (opponentName: string) => void;
  turn: number;
  setTurn: (turn: number) => void;
  yourInput: string;
  setYourInput: (input: string) => void;
  opponentInput: string;
  setOpponentInput: (input: string) => void;
  loading: boolean;
  setLoading: (input: boolean) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserContextProviderProps {
  children: ReactNode;
}

const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [name, setName] = useState<string>("");
  const [opponentName, setOpponentName] = useState<string>("");
  const [turn, setTurn] = useState<number>(0);
  const [yourInput, setYourInput] = useState<string>("");
  const [opponentInput, setOpponentInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const value: UserContextType = {
    name,
    setName,
    opponentName,
    setOpponentName,
    turn,
    setTurn,
    yourInput,
    setYourInput,
    opponentInput,
    setOpponentInput,
    loading,
    setLoading,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
