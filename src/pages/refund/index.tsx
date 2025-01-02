import { ChangeEvent, useEffect, useState } from "react";
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
import Filter from "../../components/filter";
import { useDebounce } from "../../utills/debounce";
import Loader from "../../components/loader";

const Refund = () => {
  const dispatch = useAppDispatch();
  const { refunds, isUpdate, totalCount, isDelete, isLoading } = useAppSelector(
    (state) => state.refund
  );
  const [displayItem, setDisplayItem] = useState(25);
  const [onSearch, setOnSearch] = useState("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const totalPage = Math.ceil(totalCount / displayItem);

  const updateStatus = (id: number, status: string) => {
    dispatch(updateRefund({ refund_status: status, id }));
  };
  
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };


  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      // Your search request logic here
      // console.log('Search query:', debouncedSearchQuery);
      setOnSearch(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    dispatch(getRefund({
      search: onSearch,
      page: pageNumber,
      limit: displayItem,
    }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isUpdate, pageNumber, isDelete, displayItem, onSearch]);
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

        <div className="row filter-action">
          <div className="title">
            <h3>Refund</h3>
          </div>
        </div>

      </Display>
      <Display>
        <Filter handleDisplayItem={handleDisplayItem} onSearch={handleOnSearch} isFilter />
        <Row className="row text-bold">
          <Column className="col-md-1">Order No</Column>
          <Column className="col-md-2">Product</Column>
          <Column className="col-md-1">Price</Column>
          <Column className="col-md-4">Message</Column>
          <Column className="col-md-2">Refund Status</Column>
          <Column className="col-md-2">Options</Column>
        </Row>
        {/* TODO:  */}
        {isLoading ? (
          <Loader />
        ) : (
          <>
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

export default Refund;
