import Pagination from "../../components/pagination";
import OrderTable from "../../components/order-table";
import Display from "../../components/display";
import Filter from "../../components/filter";
import { ChangeEvent, useEffect, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { CSVLink } from "react-csv";
import "./index.scss";
import Overflow from "../../components/overflow";
import { toast } from "react-toastify";
import { DateRangePicker } from "rsuite";
import { formatDateForURL } from "../../utills/formateDate";
import { useDebounce } from "../../utills/debounce";
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
} from "../../redux/order/orderApi";

const AllOrders: React.FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [onSearch, setOnSearch] = useState<string>("");
  const [orderDate, setOrderDate] = useState<[Date, Date] | null>(null);
  const [displayItem, setDisplayItem] = useState<number>(25);


  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  const debouncedSearchQuery = useDebounce(onSearch, 500);

  // Fetch data using RTK Query
  const { data, isFetching, refetch, error } = useGetAllOrdersQuery({
    page: pageNumber,
    limit: displayItem,
    order_status: orderStatus,
    search_term: debouncedSearchQuery,
    start_date: orderDate ? formatDateForURL(orderDate[0]) : "",
    end_date: orderDate ? formatDateForURL(orderDate[1]) : "",
  });

  const [deleteOrder] = useDeleteOrderMutation();
  const totalCount = data?.data?.count || 0;
  const totalPage = totalCount ? Math.ceil(totalCount / displayItem) : 0;


  const handleAllSelectedOrders = (e: ChangeEvent<HTMLInputElement>) => {
    if (data?.data?.rows) {
      const productIds = data?.data?.rows?.map((order) => Number(order.id));
      if (e.target.checked) {
        setSelectedOrders(productIds);
      } else {
        setSelectedOrders([]);
      }
    }
  };

  const handleSelectedOrder = (orderId: number) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const handleMultiDelete = async () => {
    if (selectedOrders.length === 0) {
      toast.warning("No orders selected for deletion");
      return;
    }
    try {
      await deleteOrder(selectedOrders).unwrap();
      toast.success("Selected orders deleted successfully");
      setSelectedOrders([]);
      refetch();
    } catch (error) {
      toast.error("Failed to delete selected orders");
    }
  };

  const flattenOrderItems = (orderItems: any[]): string =>
    orderItems
      .map(
        (item) =>
          `P_Name: ${item.product_name}, Attribute: ${item.product_attribute}, Qnt: ${item.quantity}, RP: ${item.regular_price}, DP: ${item.discount_price}`
      )
      .join("\n");

  const orderForCsv = data?.data?.rows
    ? data?.data?.rows?.map((order) => {
      const totalProductPrice = order.orderItems.reduce(
        (total: number, item: any) => total + item.regular_price,
        0
      );
      const totalAmount =
        totalProductPrice + order.delivery_fee - order.custom_discount;
      const dueAmount = totalAmount - order.advance_payment;

      return {
        OrderId: order.id,
        User_id: order.user_id,
        Name: order.name,
        Mobile: order.mobile,
        Email: order.email,
        Address: order.address,
        City: order.city,
        Thana: order.thana,
        Number_of_product: order.orderItems.length,
        ProductDetails: flattenOrderItems(order.orderItems),
        Delivery_fee: order.delivery_fee,
        Custom_discount: order.custom_discount,
        Advance_payment: order.advance_payment,
        Total_product_price: totalProductPrice,
        Total_amount: totalAmount,
        Due_amount: dueAmount,
        Payment_method: order.payment_method,
        Payment_status: order.payment_status,
        Transaction_id: order.transaction_id,
        Note: order.note,
        Order_prefix: order.order_prefix,
        Invoice_no: order.invoice_no,
        Order_form: order.order_form,
        Order_status: order.order_status,
        Delivery_method: order.delivery_method,
        Coupon_id: order.coupon,
        CreatedAt: order.created_at,
        UpdatedAt: order.updated_at,
      };
    })
    : [];

  const now = new Date();
  const formattedDate = now.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  // console.log(data);
  useEffect(() => {
    if (error) {
      toast.error(`${error?.data?.message}`);
    }
  }, [error]);
  // console.log(error);
  
  
  return (
    <div>
      <Display>
        <div className="csv-icon" title="Download CSV">
          <CSVLink data={orderForCsv} filename={`All-orders-${formattedDate}.csv`}>
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
            className="date-area"
            value={orderDate}
            onChange={(dateRange) => setOrderDate(dateRange)}
          />
        </div>
      </Display>
      <Display>
        <Filter
          handleDisplayItem={handleDisplayItem}
          onSearch={(e) => setOnSearch(e.target.value)}
          leftElements={
            <div className="action pointer">
              <Overflow title="Bulk Action">
                <div onClick={handleMultiDelete}>Delete Selection</div>
              </Overflow>
              <Overflow title="Filter by status">
                {["pending", "confirm", "pickup", "on_the_way", "delivered", "cancel"].map(
                  (status) => (
                    <div key={status}>
                      <p onClick={() => setOrderStatus(status)}>{status}</p>
                    </div>
                  )
                )}
              </Overflow>
            </div>
          }
          isFilter
        />
        {
          !error ? (
            <OrderTable
          orders={data?.data?.rows || []}
          handleAllSelectedOrders={handleAllSelectedOrders}
          handleSelectedOrder={handleSelectedOrder}
          selectedOrders={selectedOrders}
          isLoading={isFetching}
        />
          ) : (
            <p className="text-center font-semibold mt-20">No data found!</p>
          )
        }
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
