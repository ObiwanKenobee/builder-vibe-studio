import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

export type PersonaType =
  | "custodian"
  | "creator"
  | "regenerator"
  | "citizen"
  | null;

export type UserLevel = "explorer" | "steward" | "custodian" | "guardian";

export interface User {
  address?: string;
  persona?: PersonaType;
  level: UserLevel;
  isConnected: boolean;
  onboardingComplete: boolean;
  badges: string[];
  dignityCoins: number;
  impactScore: number;
}

interface UserState {
  user: User;
  isConnecting: boolean;
  showOnboarding: boolean;
  showWalletModal: boolean;
}

type UserAction =
  | { type: "SET_CONNECTING"; payload: boolean }
  | { type: "SET_WALLET_MODAL"; payload: boolean }
  | { type: "SET_ONBOARDING"; payload: boolean }
  | { type: "CONNECT_WALLET"; payload: { address: string } }
  | { type: "SET_PERSONA"; payload: PersonaType }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "DISCONNECT_WALLET" }
  | { type: "UPDATE_STATS"; payload: Partial<User> };

const initialState: UserState = {
  user: {
    level: "explorer",
    isConnected: false,
    onboardingComplete: false,
    badges: [],
    dignityCoins: 0,
    impactScore: 0,
  },
  isConnecting: false,
  showOnboarding: false,
  showWalletModal: false,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "SET_CONNECTING":
      return { ...state, isConnecting: action.payload };
    case "SET_WALLET_MODAL":
      return { ...state, showWalletModal: action.payload };
    case "SET_ONBOARDING":
      return { ...state, showOnboarding: action.payload };
    case "CONNECT_WALLET":
      return {
        ...state,
        user: {
          ...state.user,
          address: action.payload.address,
          isConnected: true,
        },
        isConnecting: false,
        showWalletModal: false,
        showOnboarding: true,
      };
    case "SET_PERSONA":
      return {
        ...state,
        user: {
          ...state.user,
          persona: action.payload,
        },
      };
    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        user: {
          ...state.user,
          onboardingComplete: true,
        },
        showOnboarding: false,
      };
    case "DISCONNECT_WALLET":
      return {
        ...state,
        user: {
          ...initialState.user,
        },
      };
    case "UPDATE_STATS":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("atlas-user");
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        const userData = JSON.parse(savedUser);
        if (userData && typeof userData === "object" && userData.address) {
          dispatch({
            type: "CONNECT_WALLET",
            payload: { address: userData.address },
          });
          if (userData.persona) {
            dispatch({ type: "SET_PERSONA", payload: userData.persona });
          }
          if (userData.onboardingComplete) {
            dispatch({ type: "COMPLETE_ONBOARDING" });
          }
          if (
            userData.dignityCoins !== undefined ||
            userData.impactScore !== undefined ||
            userData.level
          ) {
            dispatch({
              type: "UPDATE_STATS",
              payload: {
                dignityCoins: userData.dignityCoins || 0,
                impactScore: userData.impactScore || 0,
                level: userData.level || "explorer",
                badges: userData.badges || [],
              },
            });
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Clear corrupted data
      localStorage.removeItem("atlas-user");
    }
  }, []);

  // Save user data to localStorage when state changes
  useEffect(() => {
    try {
      if (state.user.isConnected && state.user.address) {
        localStorage.setItem("atlas-user", JSON.stringify(state.user));
      } else {
        localStorage.removeItem("atlas-user");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }, [state.user]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Helper functions
export function getPersonaConfig(persona: PersonaType) {
  const configs = {
    custodian: {
      title: "Ethical Capital Custodian",
      description:
        "Redirect capital into regenerative, dignity-first investments",
      color: "atlas-gold",
      icon: "👑",
      workspaces: ["sanctum-map", "dignity-coin", "fellowship", "reports"],
      level: "custodian" as UserLevel,
    },
    creator: {
      title: "Cultural Creator",
      description: "Share wisdom and co-create narratives for ethical finance",
      color: "atlas-cosmic",
      icon: "🎨",
      workspaces: ["library", "pain-transmutation", "fellowship", "narratives"],
      level: "steward" as UserLevel,
    },
    regenerator: {
      title: "Planetary Regenerator",
      description: "Get visibility and funding for regenerative projects",
      color: "atlas-regenerative",
      icon: "🌱",
      workspaces: ["sanctum-map", "project-portal", "fellowship", "showcase"],
      level: "steward" as UserLevel,
    },
    citizen: {
      title: "Citizen of Conscience",
      description: "Gain understanding and agency in regenerative finance",
      color: "atlas-wisdom",
      icon: "🕊️",
      workspaces: [
        "sanctum-map",
        "pain-transmutation",
        "micro-dashboard",
        "advocacy",
      ],
      level: "explorer" as UserLevel,
    },
  };

  return persona ? configs[persona] : null;
}
