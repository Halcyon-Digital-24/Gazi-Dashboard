import CardBody from "../../components/card-body";
import { Button } from "../../components/button";
import Input from "../../components/forms/text-input";
import Display from "../../components/display";
import "./custom-order.scss";
import { useEffect, useRef, useState } from "react";
import { getProducts, reset } from "../../redux/products/product-slice";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../../redux/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import axios from "../../lib";
import { API_URL } from "../../constants";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";
import { LuMinus } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormatPrice from "../../utills/formatePrice";
import { FaCheck } from "react-icons/fa";
import { useDebounce } from "../../utills/debounce";


const UpdateOrder = () => {
  const { slug } = useParams();
  const { products } = useAppSelector((state) => state.product);
  const { cart: cartItems } = useAppSelector((state) => state.cart);

  const navigate = useNavigate();
  const [order, setOrder] = useState("");
  const [customDiscount, setCustomDiscount] = useState(0);
  const dispatch = useAppDispatch();
  const [isFocus, setIsFocus] = useState(false);
  const [search, setSearch] = useState("");
  const productAreaRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [amountBeforeCoupon, setAmountBeforeCoupon] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const { name, email, mobile, address, city, orderItems, delivery_fee } =
    order;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.patch(`${API_URL}/orders/${slug}`, data).then((res) => {
        toast.success(`${res.data.message}`);
        navigate("/orders");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay


  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      // Your search request logic here
      // console.log('Search query:', debouncedSearchQuery);
      setSearch(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    dispatch(getProducts({ search: search, page: 1, limit: 100 }));

    return () => {
      dispatch(reset());
    };
  }, [search, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/${slug}`);
        const data = await response.data.data;
        // console.log(data);
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("mobile", data.mobile);
        setValue("address", data.address);
        setValue("city", data.city);
        setValue("note", data.note);
        setValue("payment_status", data.payment_status);
        setValue("order_prefix", data.order_prefix);
        setValue("advance_payment", data.advance_payment);
        setCustomDiscount(data.custom_discount);
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

  useEffect(() => {
    if (orderItems?.length > 0) {
      let totalRegularPrice = 0;

      orderItems?.forEach((item) => {
        totalRegularPrice += item?.regular_price * item?.quantity;
      });

      setAmountBeforeCoupon(totalRegularPrice);

      if (order?.coupon) {
        let finalPrice = 0;
        orderItems?.map((item) => {
          finalPrice += item?.regular_price * item?.quantity;
        });
        setTotalPrice(finalPrice);
      } else {
        let finalPrice = 0;
        orderItems?.map((item) => {
          finalPrice +=
            (item?.discount_price
              ? item?.discount_price
              : item?.regular_price) * item?.quantity;
        });
        setTotalPrice(finalPrice);
      }
    }
  }, [order, orderItems]);

  useEffect(() => {
    setValue("custom_discount", customDiscount);
  }, [customDiscount]);

  const handleChangeAttribute = (product) => {
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
    if (product.availability === 1 && product.default_quantity > 0) {
      dispatch(
        addToCart({
          product_id: product?.id,
          price:
            Number(product.discount_price) !== 0 ||
            Number(product.discount_price) != undefined
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
  };

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
                        <input
                          type="text"
                          {...register("name", {
                            required: "name is required",
                            pattern: {
                              value: /\S/,
                              message: "Only space isn't allow",
                            },
                          })}
                        />
                        {errors.name && (
                          <p className="validation__error">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="text">
                        <label htmlFor="Email">Email</label>
                        <input
                          type="text"
                          {...register("email", {
                            // required: "email is required",
                            pattern: {
                              value: /\S/,
                              message: "Only space isn't allow",
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="validation__error">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="text">
                        <label htmlFor="Mobile">Mobile</label>
                        <input
                          type="text"
                          {...register("mobile", {
                            required: "mobile is required",
                            pattern: {
                              value: /\S/,
                              message: "Only space isn't allow",
                            },
                          })}
                        />
                        {errors.mobile && (
                          <p className="validation__error">
                            {errors.mobile.message}
                          </p>
                        )}
                      </div>
                      <div className="text">
                        <label htmlFor="custom_discount">
                          Special Discount
                        </label>
                        <input
                          type="number"
                          value={customDiscount}
                          onChange={(e) => {
                            setCustomDiscount(e.target.value);
                          }}
                        />
                        {errors.custom_discount && (
                          <p className="validation__error">
                            {errors.custom_discount.message}
                          </p>
                        )}
                      </div>
                      <div className="text">
                        <label htmlFor="name">Advance Payment</label>
                        <input
                          type="text"
                          placeholder="Advanced payment"
                          {...register("advance_payment", {
                            trim: true,
                            pattern: {
                              value: /^\d+$/,
                              message:
                                "Enter a valid price containing only numbers",
                            },
                          })}
                        />
                        {errors.advance_payment && (
                          <p className="validation__error">
                            {errors.advance_payment.message}
                          </p>
                        )}
                      </div>
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

                      <div className="text">
                        <label htmlFor="Address">Address</label>
                        <input
                          type="text"
                          {...register("address", {
                            required: "address is required",
                            pattern: {
                              value: /\S/,
                              message: "Only space isn't allow",
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
                        <label htmlFor="City">City</label>
                        <input
                          type="text"
                          {...register("city", {
                            required: "city is required",
                            pattern: {
                              value: /\S/,
                              message: "Only space isn't allow",
                            },
                          })}
                        />
                        {errors.city && (
                          <p className="validation__error">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div className="text">
                        <label htmlFor="Note">Note</label>
                        <input
                          type="text"
                          {...register("note", {
                            required: "note is required",
                          })}
                        />
                        {errors.note && (
                          <p className="validation__error">
                            {errors.note.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* <div className="order-details right">
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
                                <li
                                  style={{ cursor: "pointer" }}
                                  onClick={() => addOrderItem(product)}
                                >
                                  {product.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div> */}
                    <div className="product-area" ref={productAreaRef}>
                      <Input
                        htmlFor="search"
                        placeholder="Search Product"
                        label="Search Product"
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                                    onClick={() =>
                                      handleChangeAttribute(product)
                                    }
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
                                    product["product-attributes"].length >
                                      0 && (
                                      <div className="variant py-2">
                                        <>
                                          {(() => {
                                            let uniqueAttributes = {}; // Initialize uniqueAttributes as an object

                                            product[
                                              "product-attributes"
                                            ]?.forEach((attr) => {
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
                                            });

                                            return Object.keys(
                                              uniqueAttributes
                                            ).map((key, i) => (
                                              <div key={i}>
                                                <div className="attribute-wrapper">
                                                  {uniqueAttributes[key].map(
                                                    (value, j) => {
                                                      const findAttribute =
                                                        product[
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
                                onClick={() =>
                                  dispatch(incrementQuantity(cart))
                                }
                              />
                              <p>{cart.quantity}</p>
                              <LuMinus
                                className="minus"
                                onClick={() =>
                                  dispatch(decrementQuantity(cart))
                                }
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
                </div>

                <div className="invoice-table">
                  <table className="invoice-details-table">
                    <tr className="table-heading">
                      <th>SL.</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit price (BDT)</th>
                      <th>Total (BDT)</th>
                    </tr>
                    {orderItems?.map((product, index) => (
                      <tr key={index} className="order-item">
                        <td className="cross-tr">
                          <RxCross2
                            className="cross"
                            title="Delete"
                            onClick={() => handleRemoveOrderItem(product)}
                          />
                         {" "} {index + 1}
                        </td>
                        <td>{product.product_name}</td>
                        <td>
                          <div className="qnty ">
                            <FiPlus
                              className="plus"
                              onClick={() => handleIncrementOrderItem(product)}
                            />
                            <p>{product.quantity}</p>
                            <LuMinus
                              className="minus"
                              onClick={() => handleDecrementOrderItem(product)}
                            />
                          </div>
                        </td>
                        <td>৳ {FormatPrice(product.regular_price)}</td>
                        <td>
                          ৳{" "}
                          {FormatPrice(
                            product.regular_price * product.quantity
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="span-item" colSpan={3}></td>
                      <td className="heading-title">Sub Total</td>
                      <td>{` ${FormatPrice(amountBeforeCoupon)}`}</td>
                    </tr>

                    <tr>
                      {(() => {
                        const discountAmount =
                          amountBeforeCoupon -
                          totalPrice +
                          order.custom_discount;
                        const discountPercentage =
                          (discountAmount / amountBeforeCoupon) * 100;
                        const displayDiscountPercentage =
                          discountPercentage % 1 === 0
                            ? discountPercentage
                            : discountPercentage.toFixed(1);

                        return (
                          <>
                            <td className="span-item" colSpan={3}></td>
                            <td className="heading-title">
                              {displayDiscountPercentage}% Discount
                            </td>
                            <td>- {FormatPrice(discountAmount)}</td>
                          </>
                        );
                      })()}
                    </tr>

                    <tr>
                      <td className="span-item" colSpan={3}></td>
                      <td className="heading-title">After Discount</td>
                      <td>{FormatPrice(totalPrice - order.custom_discount)}</td>
                    </tr>

                    <tr>
                      <td className="span-item" colSpan={3}></td>
                      <td className="heading-title">Delivery</td>
                      <td>{FormatPrice(order.delivery_fee)}</td>
                    </tr>

                    <tr>
                      <td className="span-item" colSpan={3}></td>
                      <td className="heading-title">Advance</td>
                      <td>
                        {order.advance_payment ? "-" : ""}{" "}
                        {FormatPrice(order.advance_payment ?? 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="span-item" colSpan={3}></td>
                      <td className="text-bold">Due Amount</td>
                      <td>
                        {FormatPrice(
                          totalPrice +
                            order.delivery_fee -
                            order.custom_discount -
                            order.advance_payment ?? 0
                        )}
                      </td>
                    </tr>
                  </table>
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
