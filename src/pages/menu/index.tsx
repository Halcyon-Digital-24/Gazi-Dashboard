import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteMenu, getMenus, reset } from "../../redux/menus/menuSlice";
import Pagination from "../../components/pagination";

const Menus = () => {
  const dispatch = useAppDispatch();
  const { menus, isDelete, message, totalCount } = useAppSelector(
    (state) => state.menu
  );
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(totalCount / 10);

  const handleDelete = (id: number) => {
    dispatch(deleteMenu([id]));
  };

  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
    dispatch(getMenus({ page: pageNumber }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, pageNumber, message]);

  return (
    <div>
      <CardBody header="Menus" to="/setup/menus/create" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-3">Name</Column>
          <Column className="col-md-3">Slug</Column>
          <Column className="col-md-3">Position</Column>
          <Column className="col-md-3">Action</Column>
        </Row>
        {menus.map((menu) => (
          <Row className="row">
            <Column className="col-md-3">{menu.name}</Column>
            <Column className="col-md-3">{menu.slug}</Column>
            <Column className="col-md-3">{menu.position}</Column>
            <Column className="col-md-3">
              <CustomIconArea>
                <EditButton editUrl={`/setup/menus/edit/${menu.id}`} />
                <DeleteButton onClick={() => handleDelete(menu.id as number)} />
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

export default Menus;
