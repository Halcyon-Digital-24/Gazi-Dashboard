import React, { useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { CiSettings } from "react-icons/ci";
import "./profile.scss";

interface PopupProps {
  closePopup: () => void;
}

const ProfilePopup: React.FC<PopupProps> = ({ closePopup }) => {
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  const handleLogOut = () => {
    localStorage.removeItem("user");
  };

  const handleProfile = () => {
    navigate("/admin/profile");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePopup]);

  return (
    <div ref={popupRef} className="profile-popup">
      <div className="profile-area">
        <ul>
          <li className="item" onClick={handleProfile}>
            <CgProfile className="icon" />
            <p>Profile</p>
          </li>
          <Link to={"/setup/home-page"}>
            <li className="item" onClick={handleLogOut}>
              <CiSettings className="icon" />
              <p>Settings</p>
            </li>
          </Link>
          <li className="item" onClick={handleLogOut}>
            <IoIosLogOut className="icon" />
            <p>Logout</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePopup;
