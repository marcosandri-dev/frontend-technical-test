import {
  createFileRoute,
  Navigate,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useAuthentication } from "../contexts/authentication";
import { Loader } from "../components/loader";

export const Route = createFileRoute("/_authentication")({
  component: () => {
    const { state } = useAuthentication();
    const { pathname } = useLocation();

    if (!state.isAuthenticated) {
      if (state.isLoading) {
        return <Loader data-testid="login-loader" />;
      }
      return <Navigate to="/login" search={{ redirect: pathname }} replace />;
    }

    return <Outlet />;
  },
});
