import { ChangeEvent } from "react";
import "./index.scss";

interface propsType {
  handleDisplayItem: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSearch?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  leftElements?: React.ReactNode;
  isFilter?: boolean;
}
const Filter: React.FC<propsType> = ({
  handleDisplayItem,
  onSearch,
  leftElements,
  isFilter = false,
}) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="dataTables_length" id="admin-table_length">
          <label className="filter-item">
            Show
            <select
              onChange={(e) => handleDisplayItem(e)}
              name="admin-table_length"
              aria-controls="admin-table"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            entries
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <div className="row left-element">
          {leftElements}
          {isFilter && (
            <div id="admin-table_filter" className="filter-search">
              <label>Search </label>
              <input
                type="search"
                placeholder=""
                aria-controls="admin-table"
                onChange={onSearch}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
