import CardBody from "../../components/card-body";
import { Button } from "../../components/button";
import Input from "../../components/forms/text-input";
import Select from "../../components/select";
import Display from "../../components/display";
import "./custom-order.scss";
import "./custom-invoice.scss";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import axios from "../../lib";
import { API_URL } from "../../constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";

const CustomInvoice = () => {
  const navigate = useNavigate();
  const [shipping, setShipping] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [productArray, setProductArray] = useState([
    {
      product_name: "",
      product_attribute: "",
      quantity: "1",
      regular_price: "",
    },
  ]);
  const productAreaRef = useRef(null);
  const [advancedPayment, setAdvancedPayment] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  console.log(discountType);

  const {
    register,
    watch,
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

  const final_price = productArray.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.regular_price * currentValue.quantity,
    0
  );

  const onSubmit = async (data) => {
    if (productArray.length <= 0) {
      toast.error("Please select product");
    } else {
      try {
        let temp = [...productArray];
        for (let i = 0; i < temp.length; i++) {
          temp[i].product_id = i + 1;
        }

        const response = await axios.post(`${API_URL}/invoices`, {
          ...data,
          orderItem: temp,
          delivery_fee: shipping,
          advance_payment: advancedPayment,
          custom_discount: discountAmount,
        });
        toast.success(response.data.message);
        navigate("/orders");
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

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

  const addNewLine = () => {
    let temp = [...productArray];
    temp.push({
      product_name: "",
      product_attribute: "",
      quantity: "",
      regular_price: "",
    });
    setProductArray(temp);
  };

  const formatAmountForDisplay = (value) => {
    // Remove any non-digit characters except commas
    const cleanedValue = value.replace(/[^\d,]/g, "");
    // Remove any commas
    const numericValue = cleanedValue.replace(/,/g, "");
    // Format the value with commas
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedValue;
  };

  const extractNumericValue = (value) => {
    // Remove any non-digit characters
    const numericValue = value.replace(/[^\d]/g, "");
    return numericValue;
  };

  const onChangeProduct = (value, index, key) => {
    let temp = [...productArray];
    if (temp[index]) {
      temp[index][key] = value;
      setProductArray(temp);
    }
  };

  const handelDelete = (index) => {
    let tempProducts = [...productArray];
    tempProducts = tempProducts.filter((_, i) => index != i);
    setProductArray(tempProducts);
  };

  useEffect(() => {
    if (discountType === "flat") {
      setDiscountAmount(discount);
    } else if (discountType === "percent") {
      setDiscountAmount((final_price * discount) / 100);
    }
  }, [discountType, discount]);

  return (
    <div>
      <CardBody header="Custom Invoice" to="/orders" text="Back" />
      <Display>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-5 col-sm-12 custom-item">
                <div className="text">
                  <label htmlFor="name">Customer Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
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
                  <label htmlFor="name">Customer Email </label>
                  <input
                    placeholder="Enter your email"
                    type="email"
                    {...register("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="validation__error">{errors.email.message}</p>
                  )}
                </div>

                <div className="text">
                  <label htmlFor="name">Customer Mobile *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mobile"
                    {...register("mobile", {
                      required: "Mobile Number is required",
                      pattern: {
                        value: /^01[3-9]\d{8}(,\s*01[3-9]\d{8})?$/, // Updated pattern to allow optional comma-separated second number
                        message:
                          "Enter a valid mobile number or two valid mobile numbers separated by commas",
                      },
                    })}
                  />
                  {errors.mobile && (
                    <p className="validation__error">{errors.mobile.message}</p>
                  )}
                </div>

                <div className="text">
                  <label htmlFor="name">Address *</label>
                  <input
                    type="text"
                    placeholder="Address"
                    required
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
                  <label htmlFor="name">City *</label>
                  <input
                    required
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
                <div className="text">
                  <label htmlFor="note">Notes</label>
                  <input
                    type="text"
                    placeholder="Note"
                    {...register("note", {
                      trim: true,
                    })}
                  />
                  {errors.city && (
                    <p className="validation__error">{errors.city?.message}</p>
                  )}
                </div>
              </div>
              <div className="col-md-4 col-sm-12 custom-item">
                <Input
                  type="number"
                  required
                  htmlFor="shipping"
                  placeholder="Delivery Charges"
                  label="Delivery Charges"
                  defaultValue="0"
                  onChange={(e) => setShipping(Number(Math.round(e.target.value)))}
                />
                <div className="invoice-discount-area">
                  <div style={{ width: "60%", marginRight: "2%" }}>
                    <Input
                      placeholder="Discount Price"
                      defaultValue="0"
                      label="Discount Price"
                      htmlFor="discount-price"
                      onChange={(e) => setDiscount(Number(Math.round(e.target.value)))}
                    />
                  </div>

                  <div style={{ width: "38%" }}>
                    <Select onChange={(e) => setDiscountType(e.target.value)}>
                      <option value="flat">Flat</option>
                      <option value="percent">Percent</option>
                    </Select>
                  </div>
                </div>

                <Input
                  required
                  type="number"
                  htmlFor="advanced_payment"
                  placeholder="Advanced payment"
                  label="Advanced Price"
                  defaultValue="0"
                  onChange={(e) => setAdvancedPayment(Number(Math.round(e.target.value)))}
                />

                <>
                  <label className="label" htmlFor="select">
                    Invoice Prefix *
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
                      <option value="GC">gCart</option>
                    </select>
                  </div>

                  {errors.order_prefix && (
                    <p className="validation__error">
                      {errors.order_prefix.message}
                    </p>
                  )}
                </>
                <div className="text invoice-no">
                  <label htmlFor="name">Invoice No. *</label>
                  <input
                    type="text"
                    name="invoice_no"
                    placeholder="Invoice No"
                    {...register("invoice_no", {
                      trim: true,
                    })}
                  />
                  {errors.invoice_no && (
                    <p className="validation__error">{errors.name.message}</p>
                  )}
                  {watch("order_prefix") == "GPHA" ? (
                    <span className="prefix">GPHA</span>
                  ) : watch("order_prefix") == "GHA" ? (
                    <span className="prefix">GHA</span>
                  ) : (
                    <span className="prefix">GC</span>
                  )}
                </div>
                <>
                  <label className="label" htmlFor="select">
                    Payment Status *
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
                    Payment Method *
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="select"
                      className="select"
                      {...register("payment_method")}
                      htmlFor="Choose Parent category"
                      name="payment_method"
                    >
                      {/* <option value="">Select Payment Method</option> */}
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
              </div>

              <div className="col-md-3 col-sm-12 custom-item">
                <div className="summery">
                  <div className="row">
                    <div className="col-md-9 left">Product Total Price</div>
                    <div className="col-md-3 right">{Math.round(final_price)}</div>
                    <div className="col-md-9 left">Shipping</div>
                    <div className="col-md-3 right">
                      {shipping < 0 ? "+" : ""}
                      {Math.round(shipping)}
                    </div>
                    <div className="col-md-9 left">Discount</div>
                    <div className="col-md-3 right">
                      {discountAmount > 0 ? "-" : ""}
                      {Math.round(discountAmount)}
                    </div>
                    <div className="col-md-9 left text-bold">Total Amount</div>
                    <div className="col-md-3 right text-bold">
                      {Math.round(final_price + shipping - discountAmount)}
                    </div>
                    <div className="col-md-9 left">Advanced</div>
                    <div className="col-md-3 right">
                      {advancedPayment > 0 ? "-" : ""}
                      {Math.round(advancedPayment)}
                    </div>
                    <div className="col-md-9 left text-bold">Due Amount</div>
                    <div className="col-md-3 right text-bold">
                      {Math.round(final_price +
                        shipping -
                        discountAmount -
                        advancedPayment)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-9 col-sm-12 ">
                <div className="product-area" ref={productAreaRef}>
                  {productArray?.map((item, index) => {
                    return (
                      <div className="product-form w-100" key={index}>
                        <div style={{ width: "45%", marginRight: "2%" }}>
                          <Input
                            required
                            htmlFor="product_name"
                            placeholder="Product Title"
                            // label="Product Title"
                            value={item?.product_name}
                            onChange={(e) =>
                              onChangeProduct(
                                e.target.value,
                                index,
                                "product_name"
                              )
                            }
                            autocomplete="off"
                          />
                        </div>

                        <div style={{ width: "20%", marginRight: "2%" }}>
                          <Input
                            htmlFor="product_attribute"
                            placeholder="Attributes"
                            // label="Product Attributes"
                            value={item?.product_attribute}
                            onChange={(e) =>
                              onChangeProduct(
                                e.target.value,
                                index,
                                "product_attribute"
                              )
                            }
                            autocomplete="off"
                          />
                        </div>
                        <div style={{ width: "10%", marginRight: "2%" }}>
                          <Input
                            required
                            type="number"
                            htmlFor="quantity"
                            placeholder="Quantity"
                            value={item?.quantity}
                            // label="Product Quantity"
                            onChange={(e) =>
                              onChangeProduct(e.target.value, index, "quantity")
                            }
                            autocomplete="off"
                          />
                        </div>
                        <div style={{ width: "19%" }}>
                          <Input
                            required
                            htmlFor="regular_price"
                            placeholder="Price"
                            // label="Product Price"
                            value={formatAmountForDisplay(item?.regular_price)}
                            onChange={(e) =>
                              onChangeProduct(
                                extractNumericValue(e.target.value),
                                index,
                                "regular_price"
                              )
                            }
                            autocomplete="off"
                          />
                        </div>
                        {productArray?.length > 1 ? (
                          <div className="delete-button">
                            <button
                              type="button"
                              onClick={() => handelDelete(index)}
                            >
                              <FaTimes />{" "}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="create-button">
                    <Button type="button" onClick={addNewLine}>
                      Add Line
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit">Create Invoice</Button>
          </form>
        </div>
      </Display>
    </div>
  );
};

export default CustomInvoice;
