import { createContext, useState } from "react";
import { getAccessTokenFromLS, getProfileFromLS } from "../utils/auth";
import { User } from "../types/user.type";
import { ExtendedPurchase } from "../types/purchase.type";

interface AppContextInterface {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    profile: User | null;
    setProfile: React.Dispatch<React.SetStateAction<User | null>>;
    extendedPurchases: ExtendedPurchase[];
    setExtendedPurchase: React.Dispatch<
        React.SetStateAction<ExtendedPurchase[]>
    >;
}

const initialAppContext: AppContextInterface = {
    isAuthenticated: Boolean(getAccessTokenFromLS()),
    setIsAuthenticated: () => null,
    profile: getProfileFromLS(),
    setProfile: () => null,
    extendedPurchases: [],
    setExtendedPurchase: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        initialAppContext.isAuthenticated
    );
    const [extendedPurchases, setExtendedPurchase] = useState<
        ExtendedPurchase[]
    >(initialAppContext.extendedPurchases);
    const [profile, setProfile] = useState<User | null>(
        initialAppContext.profile
    );

    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                profile,
                setProfile,
                extendedPurchases,
                setExtendedPurchase,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
