import { jwtDecode } from "jwt-decode";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "@tanstack/react-router";
import { getUserById } from "../api/api";

export type AuthenticationState =
  | {
      isAuthenticated: true;
      token: string;
      userId: string;
    }
  | {
      isLoading: boolean;
      isAuthenticated: false;
    };

export type Authentication = {
  state: AuthenticationState;
  authenticate: (token: string) => void;
  signout: () => void;
};

export const AuthenticationContext = createContext<Authentication | undefined>(
  undefined
);

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<AuthenticationState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkAuthStatus().then((authState) => setState(authState));
  }, []);

  const authenticate = useCallback(
    (token: string) => {
      setState({
        isAuthenticated: true,
        token,
        userId: jwtDecode<{ id: string }>(token).id,
      });
      // Adds the token to the browser session storage and solve the disconnect on refresh
      sessionStorage.setItem("authToken", token);
    },
    [setState]
  );

  const signout = useCallback(() => {
    setState({ isAuthenticated: false, isLoading: false });
    sessionStorage.removeItem("authToken");
  }, [setState]);

  const contextValue = useMemo(
    () => ({ state, authenticate, signout }),
    [state, authenticate, signout]
  );

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

// Retrieves the user from the Json token and automatically auth the user
async function checkAuthStatus(): Promise<AuthenticationState> {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    const userId = jwtDecode<{ id: string }>(token).id;
    // Checks for user
    const user = await getUserById(token, userId);
    if (user) {
      return {
        isAuthenticated: true,
        token,
        userId: user.id,
      };
    }
    sessionStorage.removeItem("authToken");
  }
  return { isAuthenticated: false, isLoading: false };
}

export function useAuthentication() {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error(
      "useAuthentication must be used within an AuthenticationProvider"
    );
  }
  return context;
}

export function useAuthToken() {
  const { state, signout } = useAuthentication();
  const router = useRouter();

  if (!state.isAuthenticated) {
    throw new Error("User is not authenticated");
  }

  // Decodes the token and check if it's expired
  const token = state.token;
  const decodedToken = jwtDecode<{ exp: number }>(token);
  const isTokenExpired = decodedToken.exp * 1000 < Date.now();

  // Logs out and go back to login page
  if (isTokenExpired) {
    signout();
    router.navigate({ to: "/login" });
  }

  return token;
}
