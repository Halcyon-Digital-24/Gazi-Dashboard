import { ChangeEvent, useEffect, useState } from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { getComments, reset, updateComment } from "../../redux/comments/commentSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import ToggleButton from "rsuite/Toggle";
import Filter from "../../components/filter";
import { toast } from "react-toastify";
import Pagination from "../../components/pagination";
import Loader from "../../components/loader";

const BlogComment = () => {
  const { comments, totalCount, isLoading, isError, errorMessage, isUpdate, message } = useAppSelector((state) => state.comment);
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [displayItem, setDisplayItem] = useState(25);
  const totalPage = Math.ceil(totalCount / displayItem);

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  useEffect(() => {
    dispatch(getComments({ page: pageNumber, limit: displayItem }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, displayItem, isUpdate]);

  useEffect(() => {
    if (isError) {
      toast.error(`${errorMessage}`);
    }
    if (isUpdate) {
      toast.success(`${message}`);
    }
  }, [isError, errorMessage, isUpdate, message]);

  const handleUpdateComment = (status: boolean, id: number) => {
    dispatch(updateComment({ is_visible: status, id: id }));
  };

  return (
    <div>
      <CardBody header="Blog Comments" to="/" text="back" />
      <Display>
        <Filter handleDisplayItem={handleDisplayItem} />
        <div className="table">
          <Row className="row-table text-bold">
            <Column className="col-md-2">Name</Column>
            <Column className="col-md-2">Email</Column>
            <Column className="col-md-6">Comments</Column>
            <Column className="col-md-2">Published</Column>
          </Row>
          {isLoading ? (
            <Loader />
          ) : (
            comments.map((comment, index) => (
              <Row className="row-table" key={index}>
                <Column className="col-md-2">{comment.name}</Column>
                <Column className="col-md-2">{comment.email}</Column>
                <Column className="col-md-6">{comment.comment}</Column>
                <Column className="col-md-2">
                  <ToggleButton
                    checked={comment.is_visible}
                    onChange={() =>
                      handleUpdateComment(!comment.is_visible, comment.id)
                    }
                  />
                </Column>
              </Row>
            ))
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

export default BlogComment;
