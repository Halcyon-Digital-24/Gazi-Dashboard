import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteButton from "../../components/button/delete";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteQueries, getQueries, reset } from "../../redux/query/querySlice";
import { DateRangePicker } from "rsuite";
import { formatDateForURL } from "../../utills/formateDate";
import CardBody from "../../components/card-body";
import Loader from "../../components/loader";

const Queries = () => {
  const dispatch = useAppDispatch();
  const { queries, isDelete, totalCount, isLoading } = useAppSelector(
    (state) => state.query
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [orderDate, setOrderDate] = useState<[Date, Date] | null>(null);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(totalCount / 10);

  const handleDelete = (id: number) => {
    dispatch(deleteQueries(id));
  };

  useEffect(() => {
    if (isDelete) {
      toast.success("Query deleted successfully");
    }
    dispatch(
      getQueries({
        page: pageNumber,
        start_date: orderDate ? formatDateForURL(orderDate[0]) : "",
        end_date: orderDate ? formatDateForURL(orderDate[1]) : "",
      })
    );

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, pageNumber, orderDate]);

  return (
    <div>
      <CardBody header="Contact Us and Product Queries" to="/" text="back" />
      <Display>
        <div className="date-area">
          <DateRangePicker
            className={`date-area`}
            value={orderDate}
            onChange={(dateRange) => setOrderDate(dateRange)}
          />
        </div>
        <div className="table">

          <Row className="row-table sm-table-width text-bold">
            <Column className="col-md-1">#</Column>
            <Column className="col-md-2">Date</Column>
            <Column className="col-md-2">Product Title</Column>
            <Column className="col-md-2">Mobile</Column>
            <Column className="col-md-3">Question</Column>
            <Column className="col-md-2">Options</Column>
          </Row>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {queries.map((query, index) => (
                <Row className="row-table sm-table-width" key={index}>
                  <Column className="col-md-1">{query.id}</Column>
                  <Column className="col-md-2">
                    {new Date(query.created_at).toISOString().slice(0, 10)}
                  </Column>
                  <Column className="col-md-2">{query.product_name}</Column>
                  <Column className="col-md-2">{query.mobile}</Column>
                  <Column className="col-md-3">{query.question}</Column>
                  <Column className="col-md-2">
                    <CustomIconArea>
                      <DeleteButton onClick={() => handleDelete(Number(query.id))} />
                    </CustomIconArea>
                  </Column>
                </Row>
              ))}
            </>
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

export default Queries;
