import { useEffect, useState } from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getNotification,
  reset,
} from "../../redux/notification/notificationSlice";

const Notification = () => {
  const dispatch = useAppDispatch();
  const { notifications, totalCount } = useAppSelector(
    (state) => state.notification
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const totalPage = Math.ceil(totalCount / 10);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  useEffect(() => {
    dispatch(getNotification({ page: pageNumber }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber]);
  return (
    <div>
      <CardBody header="Notifications" to="/notification/create" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-2">Notification ID</Column>
          <Column className="col-md-5">Title</Column>
          <Column className="col-md-5">Details</Column>
        </Row>
        {notifications.map((n, index) => (
          <Row className="row" key={index}>
            <Column className="col-md-2">{n.id}</Column>
            <Column className="col-md-5">{n.title}</Column>
            <Column className="col-md-5">{n.details}</Column>
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

export default Notification;
