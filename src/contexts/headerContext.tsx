import { ReactNode, createContext, useRef, useState } from "react";

interface HeaderContextProps {
  current: number;
  menuOpen: boolean;
  updateCurrent: (data: number) => void;
  setMenuOpen: (data: boolean) => void;
  headerData?: any;
  headerRef?: any;
}

export const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

interface HeaderProviderProps {
  children: ReactNode;
  headerData?: any;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children, headerData }) => {
  const [current, setCurrent] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const headerRef = useRef<any | null>(null);


  const updateCurrent = (data: number | null) => {
    setCurrent(data);
  };

  return (
    <HeaderContext.Provider
      value={{
        current,
        updateCurrent,
        headerData,
        menuOpen,
        setMenuOpen,
        headerRef
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
