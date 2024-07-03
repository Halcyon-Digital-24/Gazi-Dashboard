import React, { useEffect, useState } from "react";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import EditButton from "../../components/button/edit";
import DeleteButton from "../../components/button/delete";
import Display from "../../components/display";
import Row from "../../components/table/row";
import Column from "../../components/table/column";
import Pagination from "../../components/pagination";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getRole,
  selectRole,
  reset,
  deleteRole,
} from "../../redux/roles/roleSlice";

const Roles = () => {
  const dispatch = useAppDispatch();
  const { roles, totalCount, isDelete, message, errorMessage, isError } =
    useAppSelector(selectRole);
    console.log(roles);
  const [pageNumber, setPageNumber] = useState(1);

  const handlePageChange = (selectedItem) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleDeleteRole = (id) => {
    dispatch(deleteRole(id));
  };

  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
    if (isError) {
      toast.error(`${errorMessage}`);
    }

    return () => {
      dispatch(reset());
    };
  }, [isDelete, errorMessage, dispatch, message, isError]);

  useEffect(() => {
    dispatch(getRole({ page: pageNumber, limit: 10 }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, isDelete]);

  return (
    <div>
      <CardBody header="Roles" to="/roles/create" />
      <Display>
        <Row className="row">
          <Column className="col-md-8">Name </Column>
          <Column className="col-md-4">Options</Column>
        </Row>
        {roles.map((role, i) => (
          <Row key={i} className="row">
            <Column className="col-md-8">{role.name} </Column>
            <Column className="col-md-4">
              <CustomIconArea>
                <EditButton editUrl={`/roles/edit/${role.id}`} />
                <DeleteButton onClick={() => handleDeleteRole(role.id)} />
              </CustomIconArea>
            </Column>
          </Row>
        ))}

        <Pagination
          pageCount={pageNumber}
          handlePageClick={handlePageChange}
          totalPage={Math.ceil(totalCount / 10)}
        />
      </Display>
    </div>
  );
};

export default Roles;
