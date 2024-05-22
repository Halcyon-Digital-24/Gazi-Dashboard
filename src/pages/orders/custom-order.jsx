import CardBody from "../../components/card-body";
import { Button } from "../../components/button";
import Input from "../../components/forms/text-input";
import Display from "../../components/display";
import "./custom-order.scss";
import { useEffect, useRef, useState } from "react";
import { getFrontendProducts, reset } from "../../redux/products/product-slice";
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
import { FaCheck } from "react-icons/fa";
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
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [search, setSearch] = useState("");
  const productAreaRef = useRef(null);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [advancedPayment, setAdvancedPayment] = useState(0);

  const handleAttributeClick = (attribute) => {
    const isExists = selectedAttributes.filter(
      (attr) =>
        attr.attribute_id === attribute.id ||
        attr.attribute_key === attribute.attribute_key ||
        attr.attribute_name === attribute.attribute_value
    );
    if (isExists.length < 1) {
      setSelectedAttributes((prev) => [
        ...prev,
        {
          attribute_id: attribute.id,
          attribute_name: attribute.attribute_value,
          attribute_quantity: 1,
          attribute_key: attribute.attribute_key,
        },
      ]);
    } else {
      const sameType = selectedAttributes.filter(
        (attr) => attr.attribute_key !== attribute.attribute_key
      );
      setSelectedAttributes([
        ...sameType,
        {
          attribute_id: attribute.id,
          attribute_name: attribute.attribute_value,
          attribute_quantity: 1,
          attribute_key: attribute.attribute_key,
        },
      ]);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      address: "",
      city: "",
      order_form: "custom",
      order_prefix: "GHA",
      order_status: "pending",
      payment_method: "cod", // || 'onlinePayment'
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
    attribute: item?.attribute,
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
          advance_payment: advancedPayment,
          custom_discount: discount,
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
    dispatch(getFrontendProducts({ search: search, page: 1, limit: 50 }));

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
                    name="name"
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
                    <p className="validation__error">{errors.city?.message}</p>
                  )}
                </div>
                <Input
                  type="number"
                  htmlFor="shipping"
                  placeholder="Shipping"
                  label="Shipping Price"
                  onChange={(e) => setShipping(Number(e.target.value))}
                />
              </div>
              <div className="col-md-4 custom-item">
                <Input
                  type="number"
                  htmlFor="discount"
                  placeholder="Discount Price"
                  label="Discount Price"
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
                <Input
                  type="number"
                  htmlFor="advanced_payment"
                  placeholder="Advanced payment"
                  label="Advanced Price"
                  onChange={(e) => setAdvancedPayment(Number(e.target.value))}
                />

                <>
                  <label className="label" htmlFor="select">
                    Invoice Prefix
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="select"
                      className="select"
                      {...register("order_prefix")}
                      htmlFor="Choose Parent category"
                      name="order_prefix"
                    >
                      <option value="">Select Parent Category</option>
                      <option value="GHA">Home Appliance</option>
                      <option value="GPHA">Gazi Pumps & Motors</option>
                    </select>
                  </div>

                  {errors.order_prefix && (
                    <p className="validation__error">
                      {errors.order_prefix.message}
                    </p>
                  )}
                </>
                <>
                  <label className="label" htmlFor="select">
                    Payment Status
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="select"
                      className="select"
                      {...register("payment_status")}
                      htmlFor="Choose Parent category"
                      name="payment_status"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                  {errors.order_prefix && (
                    <p className="validation__error">
                      {errors.order_prefix.message}
                    </p>
                  )}
                </>
                <>
                  <label className="label" htmlFor="select">
                    Payment Method
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="select"
                      className="select"
                      {...register("payment_method")}
                      htmlFor="Choose Parent category"
                      name="payment_status"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="cod">Cash on Delivery</option>
                      <option value="online">Online Payment</option>
                    </select>
                  </div>

                  {errors.order_prefix && (
                    <p className="validation__error">
                      {errors.order_prefix.message}
                    </p>
                  )}
                </>
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
                        {products.map((product, i) => {
                          return (
                            <li key={i}>
                              <div
                                className={`wrapper ${
                                  product.availability === 1 &&
                                  product.default_quantity > 0 &&
                                  product.is_visible !== 0
                                    ? "instock"
                                    : "stockout"
                                }`}
                                onClick={() => {
                                  if (product.default_quantity <= 0) {
                                    return toast.error("Stock out");
                                  }
                                  if (
                                    product["product-attributes"] &&
                                    product["product-attributes"].length > 0 &&
                                    selectedAttributes.length < 1
                                  ) {
                                    toast.error("Please Select Variant");
                                    return;
                                  }
                                  if (
                                    product.availability === 1 &&
                                    product.default_quantity > 0
                                  ) {
                                    dispatch(
                                      addToCart({
                                        product_id: product?.id,
                                        price:
                                          (Number(product.discount_price) !== 0 || Number(product.discount_price) != undefined)
                                            ? Number(product.discount_price)
                                            : Number(product.regular_price),
                                        title: product.title,
                                        quantity: 1,
                                        attribute: selectedAttributes,
                                      })
                                    );
                                    setSelectedAttributes([]);
                                  } else {
                                    toast.error("Product  not in stock");
                                  }
                                }}
                              >
                                <span>{product.title}</span>
                                {cartItems.some(
                                  (p) => p.product_id === product.id
                                ) && (
                                  <span>
                                    <FaCheck />
                                  </span>
                                )}
                              </div>

                              {product["product-attributes"] &&
                                product["product-attributes"].length > 0 && (
                                  <div className="variant py-2">
                                    <>
                                      {(() => {
                                        let uniqueAttributes = {}; // Initialize uniqueAttributes as an object

                                        product["product-attributes"]?.forEach(
                                          (attr) => {
                                            if (
                                              !uniqueAttributes[
                                                attr.attribute_key
                                              ]
                                            ) {
                                              uniqueAttributes[
                                                attr.attribute_key
                                              ] = [];
                                            }
                                            uniqueAttributes[
                                              attr.attribute_key
                                            ].push(attr.attribute_value);
                                          }
                                        );

                                        return Object.keys(
                                          uniqueAttributes
                                        ).map((key, i) => (
                                          <div key={i}>
                                            <div className="attribute-wrapper">
                                              {uniqueAttributes[key].map(
                                                (value, j) => {
                                                  const findAttribute = product[
                                                    "product-attributes"
                                                  ]?.find(
                                                    (att) =>
                                                      att.attribute_key ===
                                                        key &&
                                                      att.attribute_value ===
                                                        value
                                                  );

                                                  return (
                                                    <>
                                                      <div
                                                        key={j}
                                                        className={`attribute-item ${
                                                          selectedAttributes.find(
                                                            (item) =>
                                                              item.attribute_id ===
                                                              findAttribute?.id
                                                          )
                                                            ? "selected"
                                                            : ""
                                                        }`}
                                                        onClick={() => {
                                                          handleAttributeClick(
                                                            findAttribute
                                                          );
                                                        }}
                                                      >
                                                        {value}
                                                      </div>
                                                    </>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        ));
                                      })()}
                                    </>
                                  </div>
                                )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {cartItems.map((cart, i) => (
                    <div key={i} className="row order-item">
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
                    <div className="col-md-9 left">Discount</div>
                    <div className="col-md-3 right">{discount}</div>
                    <div className="col-md-9 left">Advanced</div>
                    <div className="col-md-3 right">{advancedPayment}</div>
                    <div className="col-md-9 left">Due Amount</div>
                    <div className="col-md-3 right">
                      {final_price + shipping - discount - advancedPayment}
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
