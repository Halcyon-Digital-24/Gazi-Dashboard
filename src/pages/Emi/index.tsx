import { useEffect, useState } from "react";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { deleteEmi, getEmis, reset } from "../../redux/emi/emiSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import DeleteButton from "../../components/button/delete";
import { toast } from "react-toastify";

const EmiPage = () => {
  const dispatch = useAppDispatch();
  const { emis, totalCount, isDelete, message } = useAppSelector(
    (state) => state.emi
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const handleDelete = (id: number) => {
    dispatch(deleteEmi(id));
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(totalCount / 10);

  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
  }, [isDelete]);

  useEffect(() => {
    dispatch(getEmis({ page: pageNumber, limit: 10 }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, isDelete]);

  return (
    <div>
      <CardBody header="Available Emi" to="/emi/create"></CardBody>
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-3">Bank Name</Column>
          <Column className="col-md-1">Three months</Column>
          <Column className="col-md-1">Six Months</Column>
          <Column className="col-md-1">Nine Months</Column>
          <Column className="col-md-1">Twelve Months</Column>
          <Column className="col-md-1">Eighteen Months</Column>
          <Column className="col-md-1">Twenty_four Months</Column>
          <Column className="col-md-1">Thirty Months</Column>
          <Column className="col-md-1">Thirty_six Months</Column>
          <Column className="col-md-1">Action</Column>
        </Row>
        {emis.map((emi, index) => (
          <Row className="row" key={index}>
            <Column className="col-md-3">{emi.bank_name}</Column>
            <Column className="col-md-1">{emi.three_months}</Column>
            <Column className="col-md-1">{emi.six_months}</Column>
            <Column className="col-md-1">{emi.nine_months}</Column>
            <Column className="col-md-1">{emi.twelve_months}</Column>
            <Column className="col-md-1">{emi.eighteen_months}</Column>
            <Column className="col-md-1">{emi.twenty_four_months}</Column>
            <Column className="col-md-1">{emi.thirty_months}</Column>
            <Column className="col-md-1">{emi.thirty_six_months}</Column>
            <Column className="col-md-1">
              <CustomIconArea>
                <EditButton editUrl={`/emi/edit/${emi.id}`} />
                <DeleteButton onClick={() => handleDelete(Number(emi?.id))} />
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

export default EmiPage;
