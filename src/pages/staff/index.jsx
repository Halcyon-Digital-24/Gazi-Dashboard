import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import Pagination from "../../components/pagination";
import {
  getStaff,
  selectStaff,
  reset,
  deleteStaff,
} from "../../redux/staff/staffSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import Filter from "../../components/filter";
import { toast } from "react-toastify";
import { useDebounce } from "../../utills/debounce";
import Loader from "../../components/loader";

const Staff = () => {
  const dispatch = useAppDispatch();
  const { staffs, totalCount, isDelete, message, isLoading } =
    useAppSelector(selectStaff);
  const [displayItem, setDisplayItem] = useState(25);
  const [pageNumber, setPageNumber] = useState(1);
  const [onSearch, setOnSearch] = useState("");
  const totalPage = Math.ceil(totalCount / displayItem);

  const handlePageChange = (selectedItem) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay

  const handleOnSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      // Your search request logic here
      // console.log('Search query:', debouncedSearchQuery);
      setOnSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const handleDisplayItem = (e) => {
    setDisplayItem(Number(e.target.value));
  };

  const handleDelete = (id) => {
    dispatch(deleteStaff(id));
  };

  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
    dispatch(
      getStaff({ search: onSearch, page: pageNumber, limit: displayItem })
    );
    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, isDelete, message, onSearch, displayItem]);

  return (
    <div>
      <CardBody to="/staffs/create" header="Staff List" />

      <Display>
        <Filter
          handleDisplayItem={handleDisplayItem}
          onSearch={handleOnSearch}
          isFilter
        />
        <div className="table">
          <Row className="row-table sm-table-width">
            <Column className="col-md-3 col-sm-3">Name</Column>
            <Column className="col-md-3 col-sm-6">Email</Column>
            <Column className="col-md-3 col-sm-1">Role</Column>
            <Column className="col-md-3 col-sm-2">Actions</Column>
          </Row>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {staffs.map((staff, index) => (
                <Row className="row-table sm-table-width" key={index}>
                  <Column className="col-md-3 col-sm-3">{staff.name}</Column>
                  <Column className="col-md-3 col-sm-6">{staff.email}</Column>
                  <Column className="col-md-3 col-sm-1">{staff.access_id}</Column>
                  <Column className="col-md-3 col-sm-2">
                    <CustomIconArea>
                      <EditButton editUrl={`/staffs/edit/${staff.id}`} />
                      <DeleteButton onClick={() => handleDelete(staff.id)} />
                    </CustomIconArea>
                  </Column>
                </Row>
              ))}
            </>
          )}
        </div>

        <Pagination
          pageCount={pageNumber}
          handlePageClick={handlePageChange}
          totalPage={totalPage}
        />
      </Display>
    </div>
  );
};

export default Staff;
