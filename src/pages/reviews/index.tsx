import { ChangeEvent, useEffect, useState } from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Filter from "../../components/filter";
import ToggleButton from "../../components/forms/checkbox";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getReview, reset, updateReview } from "../../redux/review/reviewSlice";
import Loader from "../../components/loader";
import { toast } from "react-toastify";

const Reviews: React.FC = () => {
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [displayItem, setDisplayItem] = useState(10);
  const {
    reviews,
    isUpdate,
    totalCount,
    isLoading,
    errorMessage,
    message,
    isError,
  } = useAppSelector((state) => state.review);
  const totalPage = Math.ceil(totalCount / displayItem);
  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleUpdateReview = (status: boolean, id: number) => {
    dispatch(updateReview({ is_visible: status, id: id }));
  };

  useEffect(() => {
    if (isError) {
      toast.error(`${errorMessage}`);
    }
    if (isUpdate) {
      toast.success(`${message}`);
    }
  }, [isError, errorMessage, isUpdate, message]);

  useEffect(() => {
    dispatch(getReview({ page: pageNumber, limit: displayItem }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, displayItem, isUpdate]);

  return (
    <div>
      <CardBody header="Reviews" to="/products/reviews#" isHide />
      <Display>
        <Filter handleDisplayItem={handleDisplayItem} />
        <Row className="row text-bold">
          <Column className="col-md-1">#</Column>
          <Column className="col-md-2">Name</Column>
          <Column className="col-md-4">Products</Column>
          <Column className="col-md-3">Review</Column>
          <Column className="col-md-1">Rating</Column>
          <Column className="col-md-1">Published</Column>
        </Row>
        {isLoading ? (
          <Loader />
        ) : (
          reviews.map((review, index) => (
            <Row className="row" key={index}>
              <Column className="col-md-1">1</Column>
              <Column className="col-md-2">{review.name}</Column>
              <Column className="col-md-4">{review.product_name}</Column>
              <Column className="col-md-3">{review.comment}</Column>
              <Column className="col-md-1">3.5</Column>
              <Column className="col-md-1">
                <ToggleButton
                  isChecked={review.is_visible}
                  onClick={() =>
                    handleUpdateReview(!review.is_visible, review.id)
                  }
                />
              </Column>
            </Row>
          ))
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

export default Reviews;
