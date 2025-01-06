import { ChangeEvent, useEffect, useState } from "react";
import Display from "../../components/display";
import OrderTable from "../../components/order-table";
import Pagination from "../../components/pagination";
import Filter from "../../components/filter";
import { toast } from "react-toastify";
import { DateRangePicker } from "rsuite";
import { formatDateForURL } from "../../utills/formateDate";
import { useDebounce } from "../../utills/debounce";
import { useGetAllOrdersQuery } from "../../redux/order/orderApi";

const Canceled: React.FC = () => {
  const [displayItem, setDisplayItem] = useState(25);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [onSearch, setOnSearch] = useState("");
  const [orderDate, setOrderDate] = useState<[Date, Date] | null>(null);

  // Using the getOrdersQuery from the orderApi
  const { data: orders, isLoading, isFetching, error } = useGetAllOrdersQuery({
    order_status: "cancel",
    search_term: onSearch,
    page: pageNumber,
    limit: displayItem,
    start_date: orderDate ? formatDateForURL(orderDate[0]) : "",
    end_date: orderDate ? formatDateForURL(orderDate[1]) : "",
  });

  const totalCount = orders?.data.count || 0;

  const totalPage = Math.ceil(totalCount / displayItem);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      setOnSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(reset());
  //   };
  // }, [dispatch]);

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
    setPageNumber(1); // Reset page to 1 when display item changes
  };

  useEffect(() => {
    if (error) {
      toast.error(`No data found!`);
      <p className="text-center font-semibold">No Data Found</p>
    }
  }, [error]);

  return (
    <div>
      <Display>

        <div className="row filter-action">
          <div className="title">
            <h3>Canceled Orders</h3>
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
        <OrderTable orders={orders?.data?.rows || []} />
        <Pagination
          pageCount={pageNumber}
          handlePageClick={handlePageChange}
          totalPage={totalPage}
        />
      </Display>
    </div>
  );
};

export default Canceled;
