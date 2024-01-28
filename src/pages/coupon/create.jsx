import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import Select from "../../components/select";
import { useForm } from "react-hook-form";
import "./index.scss";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createCoupon, reset } from "../../redux/coupon/couponSlice";
import { getProducts } from "../../redux/products/product-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateCoupon = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isCreate, message } = useAppSelector((state) => state.coupon);
  const [couponType, setCouponType] = useState("");
  const [coupons, setCoupons] = useState([]);
  const { products } = useAppSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const areaRef = useRef(null);
  const [isFocus, setIsFocus] = useState(false);

  const addProduct = (id) => {
    if (!coupons.includes(id)) {
      setCoupons((prevCoupons) => [...prevCoupons, id]);
    } else {
      setCoupons((prevCoupons) =>
        prevCoupons.filter((couponId) => couponId !== id)
      );
    }
  };

  const onSubmit = (data) => {
    dispatch(createCoupon(data));
  };

  const onProductSubmit = (data) => {
    const ids = coupons.length > 0 ? coupons.join() : null;
    if (coupons.length > 0) {
      dispatch(createCoupon({ ...data, product_id: ids }));
    } else {
      toast.error("Please Select Product");
    }
  };

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/coupons");
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, navigate, dispatch, message]);

  useEffect(() => {
    dispatch(getProducts({ page: 1, limit: 100, search: search }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, search]);

  // display hide and show
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (areaRef.current && !areaRef.current.contains(event.target)) {
        setIsFocus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocus]);

  return (
    <div className="coupon">
      <CardBody header="Create Coupon" to="/coupons" />

      <Display>
        <Select onChange={(e) => setCouponType(e.target.value)}>
          <option value="order">For Total Orders</option>
          <option value="product">For Products</option>
        </Select>
      </Display>
      {couponType === "product" && (
        <Display>
          <form onSubmit={handleSubmit(onProductSubmit)}>
            <div className="text">
              <label htmlFor="name">Coupon Code *</label>
              <input
                type="text"
                placeholder="Coupon Code"
                {...register("code", {
                  trim: true,
                  required: "Code is required",
                  pattern: {
                    value: /\S/,
                    message: "Enter a valid Code",
                  },
                })}
              />
              {errors.code && (
                <p className="validation__error">{errors.code.message}</p>
              )}
            </div>
            <>
              <label className="label" htmlFor="select">
                Discount Type
              </label>
              <div className="select-wrapper">
                <select
                  id="select"
                  className="select"
                  {...register("discount_type", {
                    trim: true,
                    required: "Discount type is required",
                  })}
                  htmlFor="select"
                >
                  <option value={""}>Select One</option>
                  <option value="flat">Flat</option>
                  <option value="percent">Percent</option>
                </select>
              </div>
              {errors.discount_type && (
                <p className="validation__error">
                  {errors.discount_type.message}
                </p>
              )}
            </>
            <div className="text">
              <label htmlFor="order_id">Discount Price</label>
              <input
                type="text"
                placeholder="Discount Price"
                {...register("discount_amount", {
                  required: "Discount amount is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid price (number only)",
                  },
                })}
              />
              {errors.discount_amount && (
                <p className="validation__error">
                  {errors.discount_amount.message}
                </p>
              )}
            </div>
            <div className="text">
              <label htmlFor="order_id">Total Coupons</label>
              <input
                type="text"
                placeholder="Total coupons"
                {...register("total_coupons", {
                  required: "Total coupons is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid coupon number (number only)",
                  },
                })}
              />
              {errors.total_coupons && (
                <p className="validation__error">
                  {errors.total_coupons.message}
                </p>
              )}
            </div>
            <div className="text">
              <label htmlFor="order_id">Expire Date</label>
              <input
                type="date"
                {...register("expire_date", {
                  required: "Expire date is require",
                  pattern: {
                    value: /\S/,
                    message: "Enter a valid coupon number (number only)",
                  },
                })}
              />
              {errors.expire_date && (
                <p className="validation__error">
                  {errors.expire_date.message}
                </p>
              )}
            </div>
            <div className="select-product" ref={areaRef}>
              <Input
                placeholder="Search products"
                label="Search Products"
                htmlFor="t-coupon"
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocus(true)}
              />
              {isFocus && (
                <div className="select-area">
                  <ul className="product-list">
                    {products.map((product, index) => (
                      <li
                        className="item"
                        key={index}
                        onClick={() => addProduct(product.id)}
                      >
                        <span> {product.title}</span>
                        {coupons.includes(product.id) && (
                          <span>
                            <FaCheck />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Display>
      )}
      {couponType === "order" && (
        <Display>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text">
              <label htmlFor="name">Coupon Code *</label>
              <input
                type="text"
                placeholder="Coupon Code"
                {...register("code", {
                  trim: true,
                  required: "Code is required",
                  pattern: {
                    value: /\S/,
                    message: "Enter a valid Code",
                  },
                })}
              />
              {errors.code && (
                <p className="validation__error">{errors.code.message}</p>
              )}
            </div>
            <>
              <label className="label" htmlFor="select">
                Discount Type
              </label>
              <div className="select-wrapper">
                <select
                  id="select"
                  className="select"
                  {...register("discount_type", {
                    trim: true,
                    required: "Discount type is required",
                  })}
                  htmlFor="select"
                >
                  <option value={""}>Select One</option>
                  <option value="flat">Flat</option>
                  <option value="percent">Percent</option>
                </select>
              </div>
              {errors.discount_type && (
                <p className="validation__error">
                  {errors.discount_type.message}
                </p>
              )}
            </>
            <div className="text">
              <label htmlFor="order_id">Discount Price</label>
              <input
                type="text"
                placeholder="Discount Price"
                {...register("discount_amount", {
                  required: "Discount amount is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid price (number only)",
                  },
                })}
              />
              {errors.discount_amount && (
                <p className="validation__error">
                  {errors.discount_amount.message}
                </p>
              )}
            </div>
            <div className="text">
              <label htmlFor="order_id">Total Coupons</label>
              <input
                type="text"
                placeholder="Total coupons"
                {...register("total_coupons", {
                  required: "Total coupons is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid coupon number (number only)",
                  },
                })}
              />
              {errors.total_coupons && (
                <p className="validation__error">
                  {errors.total_coupons.message}
                </p>
              )}
            </div>
            <div className="text">
              <label htmlFor="order_id">Expire Date</label>
              <input
                type="date"
                {...register("expire_date", {
                  required: "Expire date is require",
                  pattern: {
                    value: /\S/,
                    message: "Enter a valid coupon number (number only)",
                  },
                })}
              />
              {errors.expire_date && (
                <p className="validation__error">
                  {errors.expire_date.message}
                </p>
              )}
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Display>
      )}
    </div>
  );
};

export default CreateCoupon;
