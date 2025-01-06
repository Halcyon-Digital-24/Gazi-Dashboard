import { ChangeEvent } from "react";
import { toast } from "react-toastify";
import { IOrder } from "../../interfaces/order";
import Column from "../table/column";
import Row from "../table/row";
import "./index.scss";
import SingleItem from "./singleItem";
import Loader from "../loader";
import { useDeleteOrderMutation, useUpdateOrderMutation } from "../../redux/order/orderApi";

interface IProps {
  orders: IOrder[];
  handleAllSelectedOrders?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectedOrder?: (orderId: number) => void;
  selectedOrders?: number[];
  isLoading?: boolean;
}

const OrderTable = ({
  orders,
  handleAllSelectedOrders,
  handleSelectedOrder,
  selectedOrders,
  isLoading
}: IProps) => {
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const handleOrderDelete = async (id: number) => {
    console.log(id);

    try {
      await deleteOrder([id]).unwrap();
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const handleStatusChange = async (orderId: number, e: ChangeEvent<HTMLSelectElement>) => {
    try {
      await updateOrder({ id: orderId, orderData: { order_status: e.target.value } }).unwrap();
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handlePaymentChange = async (orderId: number, e: ChangeEvent<HTMLSelectElement>) => {
    try {
      await updateOrder({ id: orderId, orderData: { delivery_method: e.target.value } }).unwrap();
      toast.success("Payment method updated successfully");
    } catch (error) {
      toast.error("Failed to update payment method");
    }
  };

  if (isLoading) return <Loader />;
  if (!orders.length) return <p className="text-center font-semibold mt-20">No orders available.</p>;

  return (
    <div className="order-table">
      <div className="table">
        <>
          <Row className="row-table sm-table-width-mid text-bold">
            <Column className="col-md-1 col-sm-1">
              <form>
                <input
                  type="checkbox"
                  name="select-all"
                  id="select-all"
                  onChange={(e) =>
                    handleAllSelectedOrders
                      ? handleAllSelectedOrders(e)
                      : console.log("first")
                  }
                />
                <p className="sudo">SI NO.</p>
              </form>
            </Column>
            <Column className="col-md-1 col-sm-1">Invoice NO</Column>
            <Column className="col-md-1 col-sm-1">Total Amount</Column>
            <Column className="col-md-2 col-sm-2">Customer</Column>
            <Column className="col-md-2 col-sm-2">Contact No</Column>
            <Column className="col-md-1 col-sm-1">Products</Column>
            {/*  <Column className="col-md-1 col-sm-1">Payment Status</Column> */}
            <Column className="col-md-1 col-sm-1">Delivery Status</Column>
            <Column className="col-md-1 col-sm-1">Order From</Column>
            <Column className="col-md-2 col-sm-2">Options</Column>
          </Row>
        </>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {orders.map((order, index) => (
              <SingleItem
                key={index}
                order={order}
                handleOrderDelete={handleOrderDelete}
                handlePaymentChange={handlePaymentChange}
                handleStatusChange={handleStatusChange}
                handleSelectedOrder={handleSelectedOrder}
                selectedOrders={selectedOrders}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
