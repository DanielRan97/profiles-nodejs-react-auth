import {Routes, Route } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import Auth from "../containers/auth/auth";
import Profile from "../containers/profile/profile";

const Router = () => {
  return (
      <Routes>
      <Route path="/" element={<Auth />}/>
      <Route path="*" element={<Auth />}/>
        <Route path="/auth" element={<Auth />}/>
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
  );
}

export default Router;
