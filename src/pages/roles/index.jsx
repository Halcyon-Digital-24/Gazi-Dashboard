import React from "react";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import EditButton from "../../components/button/edit";
import DeleteButton from "../../components/button/delete";
import Display from "../../components/display";
import Row from "../../components/table/row";
import Column from "../../components/table/column";
import Pagination from "../../components/pagination";

const Roles = () => {
  return (
    <div>
      <CardBody header="Roles" to="/roles/create" />
      <Display>
        <Row className="row">
          <Column className="col-md-8">Name </Column>
          <Column className="col-md-4">Options</Column>
        </Row>
        <Row className="row">
          <Column className="col-md-8">Accounts </Column>
          <Column className="col-md-4">
            <CustomIconArea>
              <EditButton editUrl={`/roles/edit/1`} />
              <DeleteButton onClick={() => console.log("first")} />
            </CustomIconArea>
          </Column>
        </Row>
        <Pagination
          pageCount={2}
          handlePageClick={() => console.log("first")}
          totalPage={50}
        />
      </Display>
    </div>
  );
};

export default Roles;
