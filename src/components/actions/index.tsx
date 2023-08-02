import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

const Actions = () => {
  return (
    <div className="rect-icon">
      <div title="Edit" className="icon">
        <FaRegEdit className="i" />
      </div>
      <div title="Delete" className="icon">
        <RiDeleteBin6Line />
      </div>
    </div>
  );
};

export default Actions;