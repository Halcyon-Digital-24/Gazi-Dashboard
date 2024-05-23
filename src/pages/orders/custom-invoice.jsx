import CardBody from "../../components/card-body";
import { Button } from "../../components/button";
import Input from "../../components/forms/text-input";
import Display from "../../components/display";
import "./custom-order.scss";
import './custom-invoice.scss'
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import axios from "../../lib";
import { API_URL } from "../../constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";


const CustomInvoice = () => {
  const { cart: cartItems } = useAppSelector((state) => state.cart);
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [productArray, setProductArray] = useState([{
    product_name: '',
    product_attribute: '',
    quantity: '',
    regular_price: ''
  }])
  const productAreaRef = useRef(null);
  const [advancedPayment, setAdvancedPayment] = useState(0);

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
  useEffect(() => {
    console.log('watch', watch('order_prefix'))
  }, [watch('order_prefix')])

  const onSubmit = async (data) => {
    console.log(data)
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
          custom_discount: discount

        })
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

  console.log('productArray', productArray)
  const addNewLine = () => {
    let temp = [...productArray]
    temp.push({
      product_name: '',
      product_attribute: '',
      quantity: '',
      regular_price: ''
    })
    setProductArray(temp)
  }
  const onChangeProduct = (value, index, key) => {
    let temp = [...productArray]
    if (temp[index]) {
      temp[index][key] = value
      setProductArray(temp)
    }

  }

  const handelDelete = (index) => {
    let tempProducts = [...productArray];
    tempProducts = tempProducts.filter((_, i) => index != i)
    setProductArray(tempProducts)
  }

  return (
    <div>
      <CardBody header="Custom Invoice" to="/orders" text="Back" />
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
                  <label htmlFor="name">Customer Mobile *</label>
                  <input
                    type="text"
                    required

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
              <div className="col-md-4 custom-item">
                <Input
                  type="number"
                  required
                  htmlFor="shipping"
                  placeholder="Delivery Charges"
                  label="Delivery Charges"
                  onChange={(e) => setShipping(Number(e.target.value))}
                />
                <Input
                  type="number"
                  required
                  htmlFor="discount"
                  placeholder="Discount Price"
                  label="Discount Price"
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
                <Input
                  required
                  type="number"
                  htmlFor="advanced_payment"
                  placeholder="Advanced payment"
                  label="Advanced Price"
                  onChange={(e) => setAdvancedPayment(Number(e.target.value))}
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
                  {
                    watch('order_prefix') == 'GPHA' ?
                      <span className="prefix">GPHA</span>
                      : watch('order_prefix') == 'GHA' ?
                        <span className="prefix">GHA</span>
                        : <span className="prefix">-</span>
                  }
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
              </div>
              {/* <Input htmlFor="variant" placeholder="variant" /> */}

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
                    <div className="col-md-9 left text-bold">Due Amount</div>
                    <div className="col-md-3 right text-bold">
                      {final_price + shipping - discount - advancedPayment}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-9 custom-item">

                <div className="product-area" ref={productAreaRef}>

                  {
                    productArray?.map((item, index) => {
                      return (
                        <div className="product-form w-100" key={index}>
                          <div style={{ width: "50%", marginRight: '2%' }}>
                            <Input
                              required
                              htmlFor="product_name"
                              placeholder="Product Title"
                              // label="Product Title"
                              value={item?.product_name}
                              onChange={(e) => onChangeProduct(e.target.value, index, 'product_name')}
                              autocomplete="off"
                            />
                          </div>

                          <div style={{ width: "24%", marginRight: '2%' }}>
                            <Input
                              htmlFor="product_attribute"
                              placeholder="Attributes"
                              // label="Product Attributes"
                              value={item?.product_attribute}

                              onChange={(e) => onChangeProduct(e.target.value, index, "product_attribute")}
                              autocomplete="off"
                            />
                          </div>
                          <div style={{ width: "10%", marginRight: '2%' }}>
                            <Input
                              required

                              htmlFor="quantity"
                              placeholder="Quantity"
                              value={item?.quantity}
                              // label="Product Quantity"
                              onChange={(e) => onChangeProduct(e.target.value, index, "quantity")}
                              autocomplete="off"
                            />
                          </div>
                          <div style={{ width: "10%" }}>
                            <Input
                              required

                              htmlFor="regular_price"
                              placeholder="Price"
                              // label="Product Price"
                              value={item?.regular_price}

                              onChange={(e) => onChangeProduct(e.target.value, index, "regular_price")}
                              autocomplete="off"
                            />
                          </div>
                          {
                            productArray?.length > 1 ?
                              <div className="delete-button">
                                <button type="button" onClick={() => handelDelete(index)}><FaTimes />  </button>
                              </div> : null
                          }
                        </div>
                      )
                    })
                  }

                  <div className="create-button">
                    <Button type="button" onClick={addNewLine}>Add Line</Button>

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
