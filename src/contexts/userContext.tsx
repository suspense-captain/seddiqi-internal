import { ReactNode, createContext, useState, useEffect } from "react";

// Define the structure of user data and context properties
interface UserContextProps {
  userInfo: any;
  tokenInfo: any;
  updateUserInfo: (data: any) => void;
  updateTokenInfo: (data: any) => void;
  clearUserInfo: () => void;
  clearTokenInfo: () => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const updateUserInfo = (data: any) => {
    setUserInfo(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  const updateTokenInfo = (data: any) => {
    setTokenInfo(data);
    localStorage.setItem("tokenInfo", JSON.stringify(data));
  };

  const clearUserInfo = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
  };

  const clearTokenInfo = () => {
    setTokenInfo(null);
    localStorage.removeItem("tokenInfo");
  };

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    const storedTokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));

    if (storedTokenInfo) {
        setTokenInfo(storedTokenInfo);
    }

    if (storedUserInfo) {
        setUserInfo(storedUserInfo);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        tokenInfo,
        updateUserInfo,
        updateTokenInfo,
        clearUserInfo,
        clearTokenInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
