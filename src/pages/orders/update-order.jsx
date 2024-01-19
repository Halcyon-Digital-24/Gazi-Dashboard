import CardBody from "../../components/card-body";
import { Button } from "../../components/button";
import Input from "../../components/forms/text-input";
import Display from "../../components/display";
import "./custom-order.scss";
import { useEffect, useRef, useState } from "react";
import { getProducts, reset } from "../../redux/products/product-slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import axios from "../../lib";
import { API_URL } from "../../constants";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import { LuMinus } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import Column from "../../components/table/column";
import { useForm } from "react-hook-form";

const UpdateOrder = () => {
  const { slug } = useParams();
  const { products } = useAppSelector((state) => state.product);
  const navigate = useNavigate();
  const [order, setOrder]= useState("");
  const dispatch = useAppDispatch();
  const [isFocus, setIsFocus] = useState(false);
  const [search, setSearch] = useState("");
  const productAreaRef = useRef(null);
  const [loading, setLoading] = useState(false);

   const {name , email, mobile, address, city, orderItems, delivery_fee }= order;

  const orderData = {
    name,
    email,
    mobile,
    address,
    city,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/orders/${slug}`, orderData).then((res) => {
        toast.success(`${res.data.message}`);
        navigate("/orders");
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getProducts({ search: search, page: 1, limit: 30 }));

    return () => {
      dispatch(reset());
    };
  }, [search, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/${slug}`);
        const data = response.data.data;
        setOrder(data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, [slug, loading]);

  const handleIncrementOrderItem = async (data) => {
    const orderId = data.id;

    try {
      setLoading(true);

      // Update order item quantity
      await axios.patch(`${API_URL}/order-items/${orderId}`, {
        quantity: data.quantity + 1,
      });

      // Handle success if needed
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDecrementOrderItem = async (data) => {
    const orderId = data.id;

    try {
      setLoading(true);

      // Update order item quantity
      await axios.patch(`${API_URL}/order-items/${orderId}`, {
        quantity: data.quantity - 1,
      });

      // Handle success if needed
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => console.log(data)
  console.log(order)
  const handleRemoveOrderItem = async (data) => {
    const orderId = data.id;

    try {
      setLoading(true);

      // Delete order item quantity
      await axios.delete(`${API_URL}/order-items/?ids=[${orderId}]`);

      // Handle success if needed
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const addOrderItem = async (data) => {
    const itemData = {
      order_id: slug,
      product_id: data.id,
      product_name: data.title,
      quantity: 1,
      regular_price: data.regular_price,
      discount_price: data.discount_price,
    };
    try {
      setLoading(true);
      await axios.post(`${API_URL}/order-items`, itemData).then(() => {
        toast.success("Product added successfully");
      });
      // Total price updated
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log('email:', mobile);

  return (
    <div>
      <CardBody header="Update Order" to="/orders" text="Back" />
      <Display>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <>
              <div className="invoice">
                <div className="invoice-header">
                  <div className="title">
                    <img
                      src="/assets/images/invoice-header.png"
                      alt="invoice"
                    />
                  </div>
                  <h4 className="customer-details">Customer Details</h4>
                  <div className="details">
                    <div className="left">
                      <div className="text">
                        <label>Name</label>
                        <input type="text" defaultValue={name} {...register("name", {required: "name is required"})}/>
                        {errors.name && (
            <p className="validation__error">{errors.name.message}</p>
          )}
                      </div>


                      <div className="text">
                        <label htmlFor="Email">Email</label>
                        <input type="text" defaultValue={email} {...register("email", {required: "email is required"})}/>
                        {errors.email && (
            <p className="validation__error">{errors.email.message}</p>
          )}
                      </div>

                      <div className="text">
                        <label htmlFor="Mobile">Mobile</label>
                        <input type="text" defaultValue={mobile} {...register("mobile", {required: "mobile is required"})}/>
                        {errors.mobile && (
            <p className="validation__error">{errors.mobile.message}</p>
          )}
                      </div>
                     
                     
                      <div className="text">
                        <label htmlFor="Address">Address</label>
                        <input type="text" defaultValue={address} {...register("address", {required: "address is required"})}/>
                        {errors.address && (
            <p className="validation__error">{errors.address.message}</p>
          )}
                      </div>

                       <div className="text">
                        <label htmlFor="City">City</label>
                        <input type="text" defaultValue={address} {...register("city", {required: "city is required"})}/>
                        {errors.city && (
            <p className="validation__error">{errors.city.message}</p>
          )}
                      </div> 
               
                    </div>
                    <div className="order-details right">
                      <div className="product-area" ref={productAreaRef}>
                        <Input
                          label="Search"
                          htmlFor="search"
                          placeholder="Search Product"
                          onChange={(e) => setSearch(e.target.value)}
                          autocomplete="off"
                          onFocus={() => setIsFocus(true)}
                        />
                        {isFocus && (
                          <div className="select-product">
                            <ul>
                              {products.map((product) => (
                                <li onClick={() => addOrderItem(product)}>
                                  {product.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="invoice-table">
                  <div className="row ">
                    <Column className="col-md-2 heading">SL. </Column>
                    <Column className="col-md-4 heading">Description</Column>
                    <Column className="col-md-2 heading">Qty</Column>
                    <Column className="col-md-2 heading">
                      Unit price (BDT)
                    </Column>
                    <Column className="col-md-2 heading">Total</Column>
                  </div>
                  {
                    <>
                      {orderItems?.map((product, index) => (
                        <div className="row" key={index}>
                          <Column className="col-md-2 heading">
                            <RxCross2
                              className="cross"
                              onClick={() => handleRemoveOrderItem(product)}
                            />
                            {index + 1}
                          </Column>
                          <Column className="col-md-4 heading">
                            {product.product_name}
                          </Column>

                          <Column className="col-md-2 heading">
                            <div className="qnty">
                              <FiPlus
                                className="plus"
                                onClick={() =>
                                  handleIncrementOrderItem(product)
                                }
                              />
                              <p>{product.quantity}</p>
                              <LuMinus
                                className="minus"
                                onClick={() =>
                                  handleDecrementOrderItem(product)
                                }
                              />
                            </div>
                          </Column>
                          <Column className="col-md-2 heading">
                            ৳{product.discount_price ?? product.regular_price}
                          </Column>
                          <Column className="col-md-2 heading">
                            ৳
                            {product.discount_price
                              ? product.discount_price * product.quantity
                              : product.regular_price * product.quantity}
                          </Column>
                        </div>
                      ))}
                    </>
                  }
                  <div className="row">
                    <Column className="col-md-8 "> </Column>
                    <Column className="col-md-4">
                      <div className="summery">
                        <div className="row">
                          <p className="heading sort-summery">Sub Total</p>
                          <p className="heading sort-summery">{`৳${orderItems?.reduce(
                            (sum, item) => {
                              if (
                                item.discount_price === null ||
                                item.discount_price === 0
                              ) {
                                sum += item.regular_price * item.quantity;
                              } else {
                                sum += item.discount_price * item.quantity;
                              }
                              return sum;
                            },
                            0
                          )}`}</p>
                          <p className="heading sort-summery">Shipping cost</p>
                          <p className="heading sort-summery">৳ {delivery_fee}</p>
                          <p className="heading sort-summery">Discount</p>
                          <p className="heading sort-summery">৳00.00</p>
                          <p className="heading sort-summery">Grand Total</p>
                          <p className="heading sort-summery">{`৳${orderItems?.reduce(
                            (sum, item) => {
                              if (
                                item.discount_price === null ||
                                item.discount_price === 0
                              ) {
                                sum += item.regular_price * item.quantity;
                              } else {
                                sum += item.discount_price * item.quantity;
                              }
                              return sum;
                            },
                            delivery_fee
                          )}`}</p>
                        </div>
                      </div>
                    </Column>
                  </div>
                </div>
              </div>
            </>
            <Button type="submit">Update Order</Button>
          </form>
        </div>
      </Display>
    </div>
  );
};

export default UpdateOrder;
