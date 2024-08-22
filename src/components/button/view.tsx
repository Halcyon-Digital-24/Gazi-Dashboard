import React from 'react';
import { Link } from 'react-router-dom';
import './view.scss';
import { AiFillEye } from 'react-icons/ai';

interface IProps {
  href: string;
  onClick?: () => void;
  target?: '_blank' | '_self';
}
const ViewButton: React.FC<IProps> = ({ href, onClick, target }) => {
  return (
    <div title="View" className="view-icon" onClick={onClick}>
      <Link to={href} target={target}>
        <AiFillEye className="i" />
      </Link>
    </div>
  );
};

export default ViewButton;
