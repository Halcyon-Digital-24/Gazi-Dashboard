import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteButton from "../../components/button/delete";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Select from "../../components/select";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteRefund,
  getRefund,
  reset,
  updateRefund,
} from "../../redux/refund/refundSlice";
import "./index.scss";

const Refund = () => {
  const dispatch = useAppDispatch();
  const { refunds, isUpdate, totalCount, isDelete } = useAppSelector(
    (state) => state.refund
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const totalPage = Math.ceil(totalCount / 10);
  const updateStatus = (id: number, status: string) => {
    dispatch(updateRefund({ refund_status: status, id }));
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  useEffect(() => {
    dispatch(getRefund({ page: pageNumber }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isUpdate, pageNumber, isDelete]);
  useEffect(() => {
    if (isUpdate) {
      toast.success("Refund updated successfully");
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isUpdate]);

  return (
    <div className="refund">
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-1">Order No</Column>
          <Column className="col-md-2">Product</Column>
          <Column className="col-md-1">Price</Column>
          <Column className="col-md-4">Message</Column>
          <Column className="col-md-2">Refund Status</Column>
          <Column className="col-md-2">Options</Column>
        </Row>
        {/* TODO:  */}
        {refunds.map((refund, index) => (
          <Row className="row" key={index}>
            <Column className="col-md-1">{refund.order_id}</Column>
            <Column className="col-md-2">{refund.product_name}</Column>
            <Column className="col-md-1">{refund.product_price}</Column>
            <Column className="col-md-4">{refund.message}</Column>
            <Column className="col-md-2">
              <Select onChange={(e) => updateStatus(refund.id, e.target.value)}>
                <option
                  value="pending"
                  selected={refund.refund_status === "pending"}
                >
                  Pending
                </option>
                <option
                  value="approved"
                  selected={refund.refund_status === "approved"}
                >
                  Approved
                </option>
                <option
                  value="cancel"
                  selected={refund.refund_status === "cancel"}
                >
                  Cancel
                </option>
              </Select>
            </Column>
            <Column className="col-md-2">
              <CustomIconArea>
                <DeleteButton
                  onClick={() => dispatch(deleteRefund(refund.id))}
                />
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

export default Refund;
