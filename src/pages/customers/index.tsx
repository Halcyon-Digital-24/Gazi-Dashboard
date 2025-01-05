import { ChangeEvent, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { BsDownload } from "react-icons/bs";
import { toast } from "react-toastify";
import DeleteButton from "../../components/button/delete";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Filter from "../../components/filter";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import {
  deleteCustomer,
  getCustomers,
  reset,
} from "../../redux/customer/customerSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { DateRangePicker } from "rsuite";
import { formatDateForURL } from "../../utills/formateDate";
import { useDebounce } from "../../utills/debounce";
import Loader from "../../components/loader";

const Customers: React.FC = () => {
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [displayItem, setDisplayItem] = useState(25);
  const [orderDate, setOrderDate] = useState<[Date, Date] | null>(null);
  const [onSearch, setOnSearch] = useState("");
  const { customers, isError, isDelete, message, totalCount, isLoading } = useAppSelector(
    (state) => state.customer
  );

  const totalPage = Math.ceil(totalCount / displayItem);

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleCustomerDelete = (id: number) => {
    dispatch(deleteCustomer([id]));
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
    if (isDelete) {
      toast.success(`${message}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [isDelete, isError, dispatch, message]);

  useEffect(() => {
    dispatch(
      getCustomers({
        page: pageNumber,
        limit: displayItem,
        search: onSearch,
        start_date: orderDate ? formatDateForURL(orderDate[0]) : "",
        end_date: orderDate ? formatDateForURL(orderDate[1]) : "",
      })
    );
    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, displayItem, isDelete, orderDate, onSearch]);

  return (
    <div>
      <Display>
        <div className="row filter-action">
          <div className="title">
            <h3>Customers</h3>
          </div>
        </div>
        <div className="date-area">
          <DateRangePicker
            className={`date-area`}
            value={orderDate}
            onChange={(dateRange) => setOrderDate(dateRange)}
          />
        </div>
        <div className="csv-icon" title="Download CSV">
          <CSVLink data={customers}>
            <BsDownload />
          </CSVLink>
        </div>
        <Filter handleDisplayItem={handleDisplayItem} onSearch={handleOnSearch} isFilter />
        <div className="table">
          <Row className="row-table text-bold">
            <Column className="col-md-3">Name</Column>
            <Column className="col-md-3">Email</Column>
            <Column className="col-md-3">Phone</Column>
            <Column className="col-md-3">Actions</Column>
          </Row>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {customers.map((customer, index) => (
                <Row className="row-table" key={index}>
                  <Column className="col-md-3">{customer.name}</Column>
                  <Column className="col-md-3">{customer.email}</Column>
                  <Column className="col-md-3">{customer.mobile}</Column>
                  <Column className="col-md-3">
                    <CustomIconArea>
                      <DeleteButton
                        onClick={() => handleCustomerDelete(customer.id as number)}
                      />
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

export default Customers;
