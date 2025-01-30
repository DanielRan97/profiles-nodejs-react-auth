import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import PrivateRoute from "./privateRoute";
import AuthContainer from "../containers/auth/AuthContainer";
import ProfileContainer from "../containers/profile/profileContainer";

const Router = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/profile" /> : <AuthContainer />}
      />
      <Route
        path="/auth"
        element={isLoggedIn ? <Navigate to="/profile" /> : <AuthContainer />}
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfileContainer />
          </PrivateRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/profile" : "/auth"} />}
      />
    </Routes>
  );
};

export default Router;
