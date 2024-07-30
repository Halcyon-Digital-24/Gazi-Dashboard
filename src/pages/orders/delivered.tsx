import { ChangeEvent, useEffect, useState } from "react";
import Display from "../../components/display";
import OrderTable from "../../components/order-table";
import Pagination from "../../components/pagination";
import Filter from "../../components/filter";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrders } from "../../redux/order/orderSlice";
import { toast } from "react-toastify";
import { reset } from "../../redux/products/product-slice";
import { DateRangePicker } from "rsuite";
import { formatDateForURL } from "../../utills/formateDate";
import { useDebounce } from "../../utills/debounce";

const Delivered: React.FC = () => {
  const dispatch = useAppDispatch();
  const [displayItem, setDisplayItem] = useState(25);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [onSearch, setOnSearch] = useState("");
  const [orderDate, setOrderDate] = useState<[Date, Date] | null>(null);
  const { orders, isDelete, totalCount } = useAppSelector(
    (state) => state.order
  );
  const totalPage = Math.ceil(totalCount / displayItem);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  useEffect(() => {
    dispatch(getOrders({
      order_status: "delivered",

      search_term: onSearch,
      page: pageNumber,
      limit: displayItem,
      start_date: orderDate ? formatDateForURL(orderDate[0]) : "",
      end_date: orderDate ? formatDateForURL(orderDate[1]) : "",
    }));
  }, [dispatch, onSearch, orderDate, displayItem, pageNumber]);

  useEffect(() => {
    if (isDelete) {
      toast.success("Order deleted successfully");
      dispatch(getOrders({
        order_status: "delivered", page: pageNumber,
        limit: displayItem,
      }));
    }
    return () => {
      dispatch(reset());
    };
  }, [isDelete, dispatch, pageNumber, displayItem]);

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

  return (
    <div>
      <Display>
        <div className="row filter-action">
          <div className="title">
            <h3>Delivered Orders</h3>
          </div>
        </div>
        <div className="date-area">
          <DateRangePicker
            className={`date-area`}
            value={orderDate}
            onChange={(dateRange) => setOrderDate(dateRange)}
          />
        </div>
      </Display>
      <Display>
        <Filter handleDisplayItem={handleDisplayItem} onSearch={handleOnSearch} isFilter />
        <OrderTable orders={orders} />
        <Pagination
          pageCount={pageNumber}
          handlePageClick={handlePageChange}
          totalPage={totalPage}
        />
      </Display>
    </div>
  );
};

export default Delivered;
