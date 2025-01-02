import { ChangeEvent, useEffect, useState } from "react";
import ViewButton from "../../components/button/view";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import { formatDate } from "../../components/date-formate";
import Display from "../../components/display";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getSupport } from "../../redux/support/supportSlice";
import Pagination from "../../components/pagination";
import { DateRangePicker } from "rsuite";
import { formatDateForURL } from "../../utills/formateDate";
import Loader from "../../components/loader";
import Filter from "../../components/filter";

const TicketPage = () => {
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [orderDate, setOrderDate] = useState<[Date, Date] | null>(null);
  const { supports, totalCount, isLoading } = useAppSelector((state) => state.support);
  const [displayItem, setDisplayItem] = useState(25);

  const totalPage = Math.ceil(totalCount /displayItem );

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  useEffect(() => {
    dispatch(
      getSupport({
        page: pageNumber,
        limit: displayItem,
        start_date: orderDate ? formatDateForURL(orderDate[0]) : "",
        end_date: orderDate ? formatDateForURL(orderDate[1]) : "",
      })
    );
  }, [dispatch, pageNumber, orderDate]);

  return (
    <div>
      <CardBody header="Support Massages" to="/" text="back" />
      <Display>
        <div className="date-area">
          <DateRangePicker
            className={`date-area`}
            value={orderDate}
            onChange={(dateRange) => setOrderDate(dateRange)}
          />
        </div>
        <Filter handleDisplayItem={handleDisplayItem}   />
        <Row className="row text-bold">
          <Column className="col-md-2">Ticket ID</Column>
          <Column className="col-md-3">Subject</Column>
          <Column className="col-md-3">Message</Column>
          <Column className="col-md-2">Last reply</Column>
          <Column className="col-md-1">Options</Column>
        </Row>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {supports?.map((support, index) => (
              <Row className="row" key={index}>
                <Column className="col-md-2">{support.id}</Column>

                <Column className="col-md-3">{support.subject}</Column>
                <Column className="col-md-3">{support.details}</Column>
                <Column className="col-md-2">
                  {formatDate(support.created_at)}
                </Column>
                <Column className="col-md-1">
                  <CustomIconArea>
                    <ViewButton href={`/support/${support.id}`} />
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

export default TicketPage;
