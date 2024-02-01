import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./edit.scss";

interface IProps {
  editUrl: string;
  onClick?: () => void;
}

const EditButton: React.FC<IProps> = ({ editUrl, onClick }) => {
  return (
    <Link to={editUrl}>
      <div title="Edit" className="edit-icon" onClick={onClick}>
        <FaRegEdit className="i" />
      </div>
    </Link>
  );
};

export default EditButton;
