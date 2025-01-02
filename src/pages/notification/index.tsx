import { useEffect, useState } from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteNotification,
  getNotification,
  reset,
} from "../../redux/notification/notificationSlice";
import DeleteButton from "../../components/button/delete";
import { API_ROOT } from "../../constants";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

const Notification = () => {
  const dispatch = useAppDispatch();
  const { notifications, totalCount, isDelete, isLoading } = useAppSelector((state) => state.notification);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const totalPage = Math.ceil(totalCount / 10);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  useEffect(() => {
    dispatch(getNotification({ page: pageNumber, limit: 25 }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, isDelete]);

  const handleNotificationDelete = (id: any) => {
    dispatch(deleteNotification(id));
  };

  useEffect(() => {
    dispatch(getNotification({ page: pageNumber }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber]);

  useEffect(() => {
    if (isDelete) {
      toast.success('Notification deleted successfully');
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete]);

  return (
    <div>
      <CardBody header="Notifications" to="/notification/create" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-1">Notification ID</Column>
          <Column className="col-md-2">Image</Column>
          <Column className="col-md-2">Title</Column>
          <Column className="col-md-5">Details</Column>
          <Column className="col-md-2">Action</Column>
        </Row>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {notifications.map((n, index) => (
              <Row className="row" key={index}>
                <Column className="col-md-1">{n.id}</Column>
                <Column className="col-md-2">
                  <img
                    src={`${API_ROOT}/images/notification/${n.image}`}
                    alt="brand"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Column>
                <Column className="col-md-2">{n.title}</Column>
                <Column className="col-md-5">{n.details}</Column>
                <Column className="col-md-2"> <DeleteButton onClick={() => handleNotificationDelete(n.id)} /></Column>
              </Row>
            ))}
          </>
        )}

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
