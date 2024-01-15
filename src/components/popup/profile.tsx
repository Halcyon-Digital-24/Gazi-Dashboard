import React, { useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./profile.scss";

interface PopupProps {
  closePopup: () => void;
}

const ProfilePopup: React.FC<PopupProps> = ({ closePopup }) => {
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  const handleLogOut = () => {
    localStorage.removeItem('user');
    
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
      <ul>
        <li className="item" onClick={handleProfile}>
          <CgProfile className="icon" />
          <p>Profile</p>
        </li>
        <li className="item" onClick={handleLogOut}>
          <IoIosLogOut className="icon" />
          <p>Logout</p>
        </li>
      </ul>
    </div>
  );
};

export default ProfilePopup;
