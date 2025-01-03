import { useEffect, useState } from "react";
import DeleteButton from "../../components/button/delete";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteSubscriber,
  getSubscribers,
} from "../../redux/subscribe/subscribeSlice";
import Loader from "../../components/loader";

const Subscriber = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const dispatch = useAppDispatch();
  const { subscribers, isDelete, totalCount, isLoading } = useAppSelector(
    (state) => state.subscribers
  );

  const totalPage = Math.ceil(totalCount / 15);

  const handleSubscriber = (id: number) => {
    dispatch(deleteSubscriber(id));
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  useEffect(() => {
    dispatch(getSubscribers({ page: pageNumber, limit: 15 }));
  }, [dispatch, isDelete, pageNumber]);

  return (
    <div>
      <CardBody header="Subscriber" to="/" text="back" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-11">Email</Column>
          <Column className="col-md-1">Actions</Column>
        </Row>
        {isLoading ? (
          <Loader />
        ) : (
          <>
          {subscribers.map((subscribe, index) => (
          <Row key={index} className="row">
            <Column className="col-md-11">{subscribe.email}</Column>
            <Column className="col-md-1">
              <CustomIconArea>
                <DeleteButton
                  onClick={() => handleSubscriber(subscribe.id as number)}
                />
              </CustomIconArea>
            </Column>
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

export default Subscriber;
