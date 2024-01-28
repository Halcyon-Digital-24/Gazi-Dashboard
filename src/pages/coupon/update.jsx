import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import { useForm } from "react-hook-form";
import "./index.scss";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { reset, updateCoupon } from "../../redux/coupon/couponSlice";
import { getProducts } from "../../redux/products/product-slice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../lib";
import { API_URL } from "../../constants";

const UpdateCoupon = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isUpdate, message } = useAppSelector((state) => state.coupon);
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
    dispatch(updateCoupon({ slug, coupondata: data }));
  };

  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);
      navigate("/coupons");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, navigate, dispatch, message]);
  useEffect(() => {
    dispatch(getProducts({ page: 1, limit: 50, search: search }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/coupons/${slug}`);
        const data = response.data.data;

        // Set state values based on the fetched data
        setValue("code", data.code);
        setValue("discount_amount", data.discount_amount);
        setValue("total_coupons", data.total_coupons);
        setValue("discount_type", data.discount_type);
        setValue(
          "expire_date",
          new Date(data.expire_date).toISOString().split("T")[0]
        );
        const productIdsArray = data.product_id.split(",").map(Number);
        setCoupons(productIdsArray);
      } catch (error) {
        console.error("Error fetching coupon data:", error);
      }
    };

    fetchData();
  }, [slug]);
  console.log(setValue);

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
      <CardBody header="Create Coupon" to="/coupons" text="Back" />

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
              <p className="validation__error">{errors.expire_date.message}</p>
            )}
          </div>
          {coupons.length > 0 ? (
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
          ) : null}

          <Button type="submit">Submit</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateCoupon;
