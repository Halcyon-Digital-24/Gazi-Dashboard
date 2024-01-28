import CardBody from "../../components/card-body";
import { Button } from "../../components/button";
import Input from "../../components/forms/text-input";
import Display from "../../components/display";
import "./custom-order.scss";
import { useEffect, useRef, useState } from "react";
import { getProducts, reset } from "../../redux/products/product-slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  addToCart,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../../redux/cart/cartSlice";
import axios from "../../lib";
import { API_URL } from "../../constants";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import { LuMinus } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const CustomOrder = () => {
  const { products } = useAppSelector((state) => state.product);
  const { cart: cartItems } = useAppSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [search, setSearch] = useState("");
  const productAreaRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      address: "",
      city: "",
      order_form: "custom",
      order_prefix: "GHA",
      order_status: "pending",
      payment_method: "cashOnDelivery", // || 'onlinePayment'
      delivery_method: "homeDelivery", // 'pickup'
    },
  });

  const final_price = cartItems.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );

  const orderItem = cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
  }));

  /*  const orderData = {
    name,
    email,
    mobile,
    address,
    city,
    thana,
    order_form: "custom",
    final_price: final_price + shipping - discount,
    delivery_fee: 0,
    payment_method: "custom",
    order_status: "pending",
    delivery_method: "custom",
    orderItem,
  }; */

  const onSubmit = async (data) => {
    if (orderItem.length <= 0) {
      toast.error("Please select product");
    } else {
      try {
        const response = await axios.post(`${API_URL}/orders`, {
          ...data,
          orderItem,
          delivery_fee: shipping,
        });
        toast.success(response.data.message);
        dispatch(clearCart());
        navigate("/orders");
        // window.location.reload();
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    dispatch(getProducts({ search: search, page: 1, limit: 100 }));

    return () => {
      dispatch(reset());
    };
  }, [search, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productAreaRef.current &&
        !productAreaRef.current.contains(event.target)
      ) {
        setIsFocus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocus]);

  return (
    <div>
      <CardBody header="Custom Order" to="/orders" text="Back" />
      <Display>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-5 custom-item">
                <div className="text">
                  <label htmlFor="name">Customer Name *</label>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    {...register("name", {
                      trim: true,
                      required: "Name is required",
                      pattern: {
                        value: /\S/,
                        message: "Enter a valid name",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="validation__error">{errors.name.message}</p>
                  )}
                </div>

                <div className="text">
                  <label htmlFor="name">Customer Email</label>
                  <input
                    type="text"
                    placeholder="Email"
                    {...register("email", {
                      trim: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="validation__error">{errors.email.message}</p>
                  )}
                </div>

                <div className="text">
                  <label htmlFor="name">Customer Mobile</label>
                  <input
                    type="text"
                    placeholder="Mobile"
                    {...register("mobile", {
                      trim: true,
                      required: "Mobile Number is required",
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message:
                          "Enter a valid mobile number starting with '01'",
                      },
                    })}
                  />
                  {errors.mobile && (
                    <p className="validation__error">{errors.mobile.message}</p>
                  )}
                </div>

                <div className="text">
                  <label htmlFor="name">Address</label>
                  <input
                    type="text"
                    placeholder="Address"
                    {...register("address", {
                      trim: true,
                      required: "Address is required",
                      pattern: {
                        value: /\S/,
                        message: "Enter a valid address",
                      },
                    })}
                  />
                  {errors.address && (
                    <p className="validation__error">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="text">
                  <label htmlFor="name">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    {...register("city", {
                      trim: true,
                      pattern: {
                        value: /\S/,
                        message: "Enter a valid city name",
                      },
                    })}
                  />
                  {errors.city && (
                    <p className="validation__error">{errors.city.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-4 custom-item">
                {/*   <div className="text">
                  <label htmlFor="name">Shipping Price</label>
                  <input
                    onChange={(e) => setShipping(Number(e.target.value))}
                    type="text"
                    placeholder="Shipping"
                    {...register("delivery_fee", {
                      trim: true,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Shipping price will be only numbers",
                      },
                    })}
                  />
                  {errors.delivery_fee && (
                    <p className="validation__error">
                      {errors.delivery_fee.message}
                    </p>
                  )}
                </div> */}
                <Input
                  type="number"
                  htmlFor="shipping"
                  placeholder="shipping"
                  label="Shipping Price"
                  onChange={(e) => setShipping(Number(e.target.value))}
                />
                {/* <Input htmlFor="variant" placeholder="variant" /> */}
                <div className="product-area" ref={productAreaRef}>
                  <Input
                    htmlFor="search"
                    placeholder="Search Product"
                    label="Search Product"
                    onChange={(e) => setSearch(e.target.value)}
                    // onBlur={() => setIsFocus(false)}
                    autocomplete="off"
                    onFocus={() => setIsFocus(true)}
                  />
                  {isFocus && (
                    <div className="select-product">
                      <ul>
                        {products.map((product) => (
                          <li
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  product_id: product?.id,
                                  price:
                                    Number(product.discount_price) !== 0
                                      ? Number(product.discount_price)
                                      : Number(product.regular_price),
                                  title: product.title,
                                  quantity: 1,
                                })
                              )
                            }
                          >
                            {product.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cartItems.map((cart) => (
                    <div className="row order-item">
                      <div className="col-md-6">
                        <p className="title">{cart.title}</p>
                      </div>
                      <div className="col-md-2 price">
                        <p>{cart.price}</p>
                      </div>
                      <div className="col-md-3">
                        <div className="qnty">
                          <FiPlus
                            className="plus"
                            onClick={() => dispatch(incrementQuantity(cart))}
                          />
                          <p>{cart.quantity}</p>
                          <LuMinus
                            className="minus"
                            onClick={() => dispatch(decrementQuantity(cart))}
                          />
                        </div>
                      </div>
                      <div className="col-md-1">
                        <RxCross2
                          className="cross"
                          onClick={() => dispatch(removeFromCart(cart))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-3 custom-item">
                <div className="summery">
                  <div className="row">
                    <div className="col-md-9 left">Product Total Price</div>
                    <div className="col-md-3 right">{final_price}</div>
                    <div className="col-md-9 left">Shipping</div>
                    <div className="col-md-3 right">{shipping}</div>
                    {/* <div className="col-md-9 left">Discount</div>
                    <div className="col-md-3 right">{discount}</div> */}
                    <div className="col-md-9 left">Total</div>
                    <div className="col-md-3 right">
                      {final_price + shipping}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit">Create Order</Button>
          </form>
        </div>
      </Display>
    </div>
  );
};

export default CustomOrder;
