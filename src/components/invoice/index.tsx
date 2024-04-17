import { useEffect, useState } from "react";
import { formatDate } from "../date-formate";
import Column from "../table/column";
import "./index.scss";
import FormatPrice from "../../utills/formatePrice";

const Invoice = ({ order }: any) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderItems, setOrderItems] = useState<any[]>(
    order?.orderItems?.length > 0 ? order?.orderItems : []
  );
  const advancePayment = order.advance_payment ?? 0;
  const [amountBeforeCoupon, setAmountBeforeCoupon] = useState<number>(0);

  useEffect(() => {
    if (order?.coupon) {
      if (order?.coupon?.discount_type === "flat") {
        let tempDisCart = order?.orderItems;
        if (order?.coupon?.product_id) {
          let tempIdsArr: any[] = [];
          if (order?.coupon?.product_id?.split(",")?.length > 0) {
            tempIdsArr = order?.coupon?.product_id?.split(",");
          } else {
            tempIdsArr = [order?.coupon?.product_id];
          }
          tempDisCart = tempDisCart?.map((item: any) => {
            if (tempIdsArr.find((element) => element == item.product_id)) {
              return {
                ...item,
                discount_price:
                  item.regular_price - order?.coupon?.discount_amount,
              };
            }
            return item;
          });
        } else {
          tempDisCart = tempDisCart?.map((item: any) => {
            return {
              ...item,
              discount_price:
                item.regular_price - order?.coupon?.discount_amount,
            };
          });
        }
        setOrderItems(tempDisCart);
      } else {
        let tempDisCart = order?.orderItems;
        if (order?.coupon?.product_id) {
          let tempIdsArr: any[] = [];
          if (order?.coupon?.product_id?.split(",")?.length > 0) {
            tempIdsArr = order?.coupon?.product_id?.split(",");
          } else {
            tempIdsArr = [order?.coupon?.product_id];
          }
          tempDisCart = tempDisCart?.map((item: any) => {
            if (tempIdsArr.find((element) => element == item.product_id)) {
              return {
                ...item,
                discount_price:
                  item.regular_price -
                  item.regular_price * (order?.coupon.discount_amount / 100),
              };
            }
            return item;
          });
        } else {
          tempDisCart = tempDisCart?.map((item: any) => {
            return {
              ...item,
              discount_price:
                item.regular_price -
                item.regular_price * (order?.coupon.discount_amount / 100),
            };
          });
        }
        setOrderItems(tempDisCart);
      }
    }
  }, [order]);

  useEffect(() => {
    if (orderItems?.length > 0) {
      let totalRegularPrice = 0;

      orderItems?.forEach((item: any) => {
        totalRegularPrice += item?.regular_price * item?.quantity;
      });

      setAmountBeforeCoupon(totalRegularPrice);

      if (order?.coupon) {
        let finalPrice = 0;
        orderItems?.map((item: any) => {
          finalPrice += item?.discount_price * item?.quantity;
        });
        setTotalPrice(finalPrice);
      } else {
        let finalPrice = 0;
        orderItems?.map((item: any) => {
          finalPrice += item?.discount_price
            ? item?.discount_price
            : item?.regular_price * item?.quantity;
        });
        setTotalPrice(finalPrice);
      }
    }
  }, [order, orderItems]);

  useEffect(() => {
    setOrderItems(order.orderItems);
  }, [order]);

  return (
    <div className="invoice">
      <div className="invoice-header">
        <div className="title">
          {order.order_prefix === "GHA" ? (
            <img src="/assets/invoice/homeappliance.png" alt="invoice" />
          ) : (
            <img src="/assets/invoice/pum.png" alt="invoice" />
          )}
        </div>
        <h4 className="customer-details">Customer Details</h4>
        <div className="details">
          <div className="left">
            <p>
              <span className="invoice-title">Invoice:</span>{" "}
              {order.order_prefix}-{order.id}
            </p>
            <p>
              {" "}
              <span className="invoice-title">Name: </span> {order.name}
            </p>
            <p>
              <span className="invoice-title">Email: </span> {order.email}
            </p>
            <p>
              <span className="invoice-title">Phone: </span>{" "}
              {`+88${order.mobile}`}{" "}
            </p>
            <p>
              <span className="invoice-title"> Address: </span> {order.address}{" "}
              {order.city ? `, ${order.city}` : ""}{" "}
            </p>
          </div>
          <div className="order-details right">
            <p>
              <span className="invoice-title">Order Date: </span>{" "}
              {formatDate(order.created_at)}
            </p>
            <p>
              <span className="invoice-title"> Order Status:</span>{" "}
              {order?.order_status}
            </p>
            <p>
              <span className="invoice-title"> Total Order Amount : </span>{" "}
              {totalPrice + order.delivery_fee - order.custom_discount}
            </p>
            <p>
              <span className="invoice-title"> Shipping Method: </span>{" "}
              {order?.delivery_method === "homeDelivery"
                ? "Free Home Delivery"
                : "Express Delivery"}
            </p>
            <p>
              <span className="invoice-title"> Payment Method: </span>{" "}
              {order?.payment_method === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
            <p>
              <span className="invoice-title"> Payment Status: </span>{" "}
              {order?.payment_status}
            </p>
          </div>
        </div>
      </div>

      {/* <div className="invoice-body">
        <p>Bill to:</p>
        <p>Iftakher</p>
        <p> House: 12, Road: 01, Block I. Basundhara R/A, Dhaka, Bangladesh </p>
        <p>Email: iftebmw@gmail.com</p>
        <p>Phone: 01976100280</p>
      </div> */}

      <div className="invoice-table">
        <div className="row first-row">
          <Column className="col-md-1 heading top-header">SL. </Column>
          <Column className="col-md-4 heading top-header description">
            Description
          </Column>
          <Column className="col-md-2 heading top-header">Attribute</Column>
          <Column className="col-md-1 heading top-header">Qty</Column>
          <Column className="col-md-2 heading top-header">
            Unit price (BDT)
          </Column>
          <Column className="col-md-2 heading top-header">Total</Column>
        </div>
        {
          <>
            {orderItems?.length > 0 &&
              orderItems?.map((product, index) => (
                <div className="row orders" key={index}>
                  <Column className="col-md-1 heading">{index + 1}</Column>
                  <Column className="col-md-4 heading">
                    <p className="description">{product.product_name}</p>
                  </Column>
                  <Column className="col-md-2 heading">
                    {/* Attribute */}
                    {product.product_attribute
                      ? JSON.parse(product.product_attribute).map(
                          (v: any, i: number) => (
                            <span className="variant" key={i}>
                              {`${i ? "," : ""}${v.attribute_name}`}
                            </span>
                          )
                        )
                      : "-"}
                  </Column>
                  <Column className="col-md-1 heading">
                    {product.quantity}
                  </Column>
                  <Column className="col-md-2 heading">
                    {FormatPrice(product.regular_price)}
                  </Column>
                  <Column className="col-md-2 heading">
                    {FormatPrice(product.regular_price * product.quantity)}
                  </Column>
                </div>
              ))}
          </>
        }
        <div className="row">
          <Column className="col-md-7 "> </Column>
          <Column className="col-md-1 "> </Column>
          <Column className="col-md-4">
            <div className="summery">
              <div className="row">
                <p className="heading sort-summery">Sub Total</p>
                <p className="heading sort-summery">
                  <span className="amount">{` ${FormatPrice(
                    amountBeforeCoupon
                  )}`}</span>
                </p>
                <p className="heading sort-summery">Delivery</p>
                <p className="heading sort-summery">
                  <span className="amount">
                    {" "}
                    {FormatPrice(order.delivery_fee)}
                  </span>
                </p>
                <p className="heading sort-summery">Discount</p>
                <p className="heading sort-summery">
                  <span className="amount">
                    {" "}
                    {FormatPrice(
                      amountBeforeCoupon - totalPrice + order.custom_discount
                    )}
                  </span>
                </p>
                <p className="heading sort-summery">Advance</p>
                <p className="heading sort-summery">
                  <span className="amount">
                    {FormatPrice(order.advance_payment ?? 0)}
                  </span>
                </p>
                <p className="heading sort-summery">Due Amount</p>
                <p className="heading sort-summery">
                  <span className="amount">
                    {" "}
                    {FormatPrice(
                      totalPrice +
                        order.delivery_fee -
                        order.custom_discount -
                        advancePayment
                    )}
                  </span>
                </p>
              </div>
            </div>
          </Column>
          <Column className="col-md-12">
            <div className="notes">
              <h3>Notes:</h3>
              <p>
                1. All our products come with a{" "}
                {order.order_prefix === "GHA" ? "one-year" : "two-years"}{" "}
                service warranty. To claim the warranty, please present this
                invoice.
              </p>
              <p>
                2. Please ensure to check for any physical damage to the product
                upon receiving it. After receiving the product, no claims for
                physical damage will be accepted.
              </p>
              <p>
                3. For official installation, please inform us upon receiving
                the product if the customer wishes for us to install it. We will
                require 24 hours to complete the installation.
              </p>
            </div>
          </Column>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
