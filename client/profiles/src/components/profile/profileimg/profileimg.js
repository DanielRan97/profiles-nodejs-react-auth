import { useState, useEffect } from "react";
import defaultUserImg from "../../../assets/images/defoultUserImg.avif";
import classes from "../profile.module.css";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/authContext";

const ProfileImg = ({ user }) => {
  const {authContextEditUser} = useContext(AuthContext);
  const [profileImg, setProfileImg] = useState(defaultUserImg);

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImg(`http://localhost:4000/auth${user.profileImage}`);
    } else {
      setProfileImg(defaultUserImg);
    }
  }, [user?.profileImage]);

  const changeProfileImg = async (img) => {
    let userData = {
      fullName: user.fullName,
      email: user.email,
      nickName: user.nickName,
      _id: user._id,
      profileImage: img
    }
    try {
      await authContextEditUser(userData);
    } catch (error) {
      alert(error);
    }

  }

  return (
    <div className={classes.profileImgDiv}>
      <label htmlFor="profileImgInput" className={classes.profileImgWrapper}>
        <img
          src={profileImg}
          alt="User profile img"
          className={classes.profileImg}
        />
        <div className={classes.overlay}>Change Profile Img</div>
      </label>
      <input
        type="file"
        id="profileImgInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => changeProfileImg(e.target.files[0])}
      />
    </div>
  );
};

export default ProfileImg;
