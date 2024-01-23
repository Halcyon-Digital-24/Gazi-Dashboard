import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import Select from "../../components/select";
import "./index.scss";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createCoupon, reset } from "../../redux/coupon/couponSlice";
import { getProducts } from "../../redux/products/product-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateCoupon = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isCreate } = useAppSelector((state) => state.coupon);
  const [couponType, setCouponType] = useState("");
  const [discountType, setDiscountType] = useState();
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discountPrice, setDiscountPrice] = useState(0);
  const [totalCoupon, setTotalCoupon] = useState(0);
  const [date, setDate] = useState("");
  const { products } = useAppSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const areaRef = useRef < HTMLDivElement > null;
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

  const couponData = {
    code: code,
    total_coupons: totalCoupon,
    discount_type: discountType,
    discount_amount: discountPrice,
    expire_date: date,
    product_id: coupons.length > 0 ? coupons.join() : null,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCoupon(couponData));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success("Coupon Create Successfully");
      navigate("/coupons");
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, navigate, dispatch]);
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
          <form onSubmit={handleSubmit}>
            <Input
              htmlFor="coupon"
              placeholder="Coupon code"
              label="Coupon Code"
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Select
              onChange={(e) => setDiscountType(e.target.value)}
              htmlFor="Discount Type"
              required
            >
              <option>Select One</option>
              <option value="flat">Flat</option>
              <option value="percent">Percent</option>
            </Select>
            <Input
              placeholder="Discount Price"
              label="Discount Price"
              htmlFor="discount-price"
              onChange={(e) => setDiscountPrice(Number(e.target.value))}
              required
            />
            <Input
              placeholder="Total Coupons"
              label="Total Coupons"
              htmlFor="t-coupon"
              onChange={(e) => setTotalCoupon(e.target.value)}
              required
            />
            <label htmlFor="d">Expire Date</label>
            <input
              className="date"
              type="date"
              onChange={(e) => setDate(e.target.value)}
            />
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
          <form onSubmit={handleSubmit}>
            <Input
              htmlFor="coupon"
              placeholder="Coupon code"
              label="Coupon Code"
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Select
              onChange={(e) => setDiscountType(e.target.value)}
              htmlFor="Discount Type"
              required
            >
              <option>Select One</option>
              <option value="flat">Flat</option>
              <option value="percent">Percent</option>
            </Select>
            <Input
              placeholder="Discount Price"
              label="Discount Price"
              htmlFor="discount-price"
              onChange={(e) => setDiscountPrice(Number(e.target.value))}
              required
            />
            <Input
              placeholder="Total Coupons"
              label="Total Coupons"
              htmlFor="t-coupon"
              onChange={(e) => setTotalCoupon(e.target.value)}
              required
            />
            <label htmlFor="d">Expire Date</label>
            <label htmlFor="d">Expire Date</label>
            <input
              className="date"
              type="date"
              onChange={(e) => setDate(e.target.value)}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Display>
      )}
    </div>
  );
};

export default CreateCoupon;
