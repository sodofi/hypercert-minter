import {
  createContext,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
import { Chain } from "viem";
type AppContextProps = {
  children: React.ReactNode;
};
interface RoundBg {
  pattern: string;
  color: string;
}
type State = {
  isWrongNetwork: boolean;
  setIsWrongNetwork: Dispatch<SetStateAction<boolean>>;
  correctNetwork: Chain | undefined;
  setCorrectNetwork: Dispatch<SetStateAction<Chain | undefined>>;
  roundColor: RoundBg;
  setRoundColor: Dispatch<SetStateAction<RoundBg>>;
};

const Context = createContext<State | undefined>(undefined);

export const AppContext = ({ children }: AppContextProps) => {
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const [correctNetwork, setCorrectNetwork] = useState<Chain | undefined>(
    undefined
  );
  const [roundColor, setRoundColor] = useState<RoundBg>({
    pattern: "",
    color: "",
  });
  const state: State = {
    isWrongNetwork,
    setIsWrongNetwork,
    correctNetwork,
    setCorrectNetwork,
    roundColor,
    setRoundColor,
  };
  return <Context.Provider value={state}>{children}</Context.Provider>;
};

export const useAppContext = (): State => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useContext must be used within a StateContext Provider");
  }
  return context;
};
