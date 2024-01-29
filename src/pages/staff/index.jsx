import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import Pagination from "../../components/pagination";

const Staff = () => {
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
        {[...Array(6).keys()].map(() => (
          <Row className="row">
            <Column className="col-md-3">Admin Name</Column>
            <Column className="col-md-3">admin@admin.com</Column>
            <Column className="col-md-3">admin</Column>
            <Column className="col-md-3">
              <CustomIconArea>
                <EditButton editUrl={`/staffs/edit/1`} />
                <DeleteButton
                  onClick={() => {
                    console.log("");
                  }}
                />
              </CustomIconArea>
            </Column>
          </Row>
        ))}
        <Pagination
          pageCount={2}
          handlePageClick={() => console.log("first")}
          totalPage={50}
        />
      </Display>
    </div>
  );
};

export default Staff;
