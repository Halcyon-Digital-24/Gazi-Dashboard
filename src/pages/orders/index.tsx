import Pagination from "../../components/pagination";
import OrderTable from "../../components/order-table";
import Display from "../../components/display";
import Filter from "../../components/filter";
import { ChangeEvent, useEffect, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { CSVLink } from "react-csv";
import "./index.scss";
import Overflow from "../../components/overflow";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteOrder, getOrders, reset } from "../../redux/order/orderSlice";
import { toast } from "react-toastify";
import { DateRangePicker } from "rsuite";

const AllOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [onSearch, setOnSearch] = useState("");
  const [orderDate, setOrderDate] = useState<[Date, Date] | null>(null);
  const { orders, isDelete, totalCount } = useAppSelector(
    (state) => state.order
  );
  const [displayItem, setDisplayItem] = useState(25);
  const totalPage = Math.ceil(totalCount / displayItem);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  const handleOnSearch = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOnSearch(e.target.value);
  };
  const handleAllSelectedOrders = (e: ChangeEvent<HTMLInputElement>) => {
    const productIds = orders.map((order) => Number(order.id));
    if (e.target.checked) {
      setSelectedOrders(productIds);
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectedOrder = (orderId: number) => {
    const selectedOrdersSet = new Set(selectedOrders);

    if (selectedOrdersSet.has(orderId)) {
      selectedOrdersSet.delete(orderId);
    } else {
      selectedOrdersSet.add(orderId);
    }

    setSelectedOrders(Array.from(selectedOrdersSet));
  };
  const handleMultiDelete = () => {
    dispatch(deleteOrder([...selectedOrders]));
  };

  const formatDateForURL = (date: Date): string => {
    const isoString = date.toISOString();
    return isoString.split("T")[0];
  };

  useEffect(() => {
    dispatch(
      getOrders({
        page: pageNumber,
        limit: displayItem,
        order_status: orderStatus,
        search_term: onSearch,
        start_date: orderDate ? formatDateForURL(orderDate[0]) : "",
        end_date: orderDate ? formatDateForURL(orderDate[1]) : "",
      })
    );
  }, [dispatch, pageNumber, displayItem, orderStatus, onSearch, orderDate]);

  useEffect(() => {
    if (isDelete) {
      toast.success("Order deleted successfully");
      dispatch(getOrders({}));
    }
    return () => {
      dispatch(reset());
    };
  }, [isDelete, dispatch]);

  return (
    <div>
      <Display>
        <div className="csv-icon" title="Download CSV">
          <CSVLink data={orders}>
            <BsDownload />
          </CSVLink>
        </div>
        <div className="row filter-action">
          <div className="title">
            <h3>All Orders</h3>
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
        <Filter
          handleDisplayItem={handleDisplayItem}
          onSearch={handleOnSearch}
          leftElements={
            <div className="action">
              <Overflow title="Bulk Action">
                <div onClick={handleMultiDelete}>Delete Selection</div>
              </Overflow>
              <Overflow title="Filter by status">
                <div>
                  <p onClick={() => setOrderStatus("pending")}>Pending</p>
                </div>
                <div>
                  <p onClick={() => setOrderStatus("confirm")}>Confirmed</p>
                </div>
                <div>
                  <p onClick={() => setOrderStatus("pickup")}>Pick Up</p>
                </div>
                <div>
                  <p onClick={() => setOrderStatus("on_the_way")}>On The Way</p>
                </div>
                <div>
                  <p onClick={() => setOrderStatus("delivered")}>Delivered</p>
                </div>
                <div>
                  <p onClick={() => setOrderStatus("cancel")}>Cancel</p>
                </div>
              </Overflow>
            </div>
          }
          isFilter
        />
        <OrderTable
          orders={orders}
          handleAllSelectedOrders={handleAllSelectedOrders}
          handleSelectedOrder={handleSelectedOrder}
          selectedOrders={selectedOrders}
        />
        <Pagination
          pageCount={pageNumber}
          handlePageClick={handlePageChange}
          totalPage={totalPage}
        />
      </Display>
    </div>
  );
};

export default AllOrders;
