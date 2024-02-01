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
import { toast } from "react-toastify";

const Staff = () => {
  const dispatch = useAppDispatch();
  const { staffs, totalCount, isDelete, message } = useAppSelector(selectStaff);
  const [pageNumber, setPageNumber] = useState(1);
  const totalPage = Math.ceil(totalCount / 10);

  const handlePageChange = (selectedItem) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleDelete = (id) => {
    dispatch(deleteStaff(id));
  };

  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
    dispatch(getStaff({ page: pageNumber, limit: 10 }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, isDelete]);

  return (
    <div>
      <CardBody to="/staffs/create" header="Staff List" />

      <Display>
        <Row className="row">
          <Column className="col-md-3">Name</Column>
          <Column className="col-md-3">Email</Column>
          <Column className="col-md-3">Role</Column>
          <Column className="col-md-3">Actions</Column>
        </Row>
        {staffs.map((staff, index) => (
          <Row className="row" key={index}>
            <Column className="col-md-3">{staff.name}</Column>
            <Column className="col-md-3">{staff.email}</Column>
            <Column className="col-md-3">{staff.access_id}</Column>
            <Column className="col-md-3">
              <CustomIconArea>
                <EditButton editUrl={`/staffs/edit/${staff.id}`} />
                <DeleteButton onClick={() => handleDelete(staff.id)} />
              </CustomIconArea>
            </Column>
          </Row>
        ))}
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
