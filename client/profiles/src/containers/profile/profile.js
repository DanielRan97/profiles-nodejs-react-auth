import React, { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
const Profile = () => {
  const { userData } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {userData?.fullName || "User"}!</h1>
    </div>
  );
};

export default Profile;