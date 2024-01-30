import { useEffect, useState } from "react";
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

const TicketPage = () => {
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { supports, totalCount } = useAppSelector((state) => state.support);

  const totalPage = Math.ceil(totalCount / 10);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  useEffect(() => {
    dispatch(getSupport({ page: pageNumber, limit: 10 }));
  }, [dispatch, pageNumber]);
  return (
    <div>
      <CardBody header="Support Massages" to="#" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-2">Ticket ID</Column>
          <Column className="col-md-3">Subject</Column>
          <Column className="col-md-3">Message</Column>
          <Column className="col-md-2">Last reply</Column>
          <Column className="col-md-1">Options</Column>
        </Row>
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
