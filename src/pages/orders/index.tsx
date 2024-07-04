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
import { formatDateForURL } from "../../utills/formateDate";

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

  const flattenOrderItems = (orderItems) => {
    const lines = orderItems.map(item => {
      let attributeString = '';
  
      // Parse product_attribute string to an array of objects
      let attributes = [];
      try {
        attributes = JSON.parse(item.product_attribute);
      } catch (error) {
        console.error('Error parsing product_attribute:', error);
      }
  
      if (Array.isArray(attributes) && attributes.length > 0) {
        // Extract attribute_name from each object in the array
        const attributeNames = attributes.map(attr => attr.attribute_name);
        attributeString = attributeNames.join(', ');
      } else if (typeof attributes === 'object' && attributes.attribute_name) {
        attributeString = attributes.attribute_name;
      } else if (typeof item.product_attribute === 'string') {
        attributeString = item.product_attribute;
      }
  
      // Create a CSV line with field names prefixed
      const csvLine = [
        `P_Name: ${item.product_name}`,
        `Attribute: ${attributeString}`,
        `Qnt: ${item.quantity}`,
        `RP: ${item.regular_price}`,
        `DP: ${item.discount_price}`
      ].join(', ');
  
      return csvLine;
    });
  
    // Join all lines with new line character
    return lines.join('\n');
  };
  
  
  // order data for csv 
  const orderForCsv = orders.map(order => {
    const total_product_price = order.orderItems.reduce((total, item) => total + item.regular_price, 0);
    const total_amount = total_product_price + order.delivery_fee - order.custom_discount;
    const due_amount = total_amount - order.advance_payment;
    console.log(order.orderItems.length);
    
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
      ProductDetails: flattenOrderItems(order.orderItems),  // need to convert 
      Delivery_fee:order.delivery_fee,
      Custom_discount: order.custom_discount,
      Advance_payment: order.advance_payment,
      Total_product_price: total_product_price,
      Total_amount: total_amount,
      Due_amount: due_amount,
      Payment_method: order.payment_method,
      Payment_status: order.payment_status,
      Transaction_id: order.transaction_id,
      Note: order.note,
      Order_prefix:order.order_prefix,
      Invoice_no: order.invoice_no,
      Order_form: order.order_form,
      Order_status: order.order_status,
      Delivery_method: order.delivery_method,
      Coupon_id: order.coupon,
      CreatedAt: order.created_at,
      UpdatedAt: order.updated_at,
    };
  });
  
  console.log(orderForCsv);

  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });

  
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
