import { useState } from "react";
// import { BsBell } from 'react-icons/bs';
import Icon from "../icon";
import Popup from "../popup";
import ProfilePopup from "../popup/profile";
import "./index.scss";

function Header({
  handleOpen,
  isOpen,
}: {
  handleOpen: () => void;
  isOpen: boolean;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isProfile, setIsProfile] = useState(false);

  const handleProfileClick = () => {
    setIsProfile(!isProfile);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <header className="header">
      {!isOpen && (
        <button onClick={handleOpen}>
          <Icon iconName="left-double-arrow.svg" />
        </button>
      )}
      <div></div>
      <div className=" header-main">
        {isPopupOpen && <Popup closePopup={handleClosePopup} />}
        <img
          onClick={handleProfileClick}
          className="avatar"
          src="/assets/images/user.png"
          alt="avatar"
        />
        {isProfile && <ProfilePopup closePopup={() => setIsProfile(false)} />}
      </div>
    </header>
  );
}

export default Header;
