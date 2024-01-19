import CardBody from '../../components/card-body';
import { Button } from '../../components/button';
import Input from '../../components/forms/text-input';
import Display from '../../components/display';
import './custom-order.scss';
import { useEffect, useRef, useState } from 'react';
import { getProducts, reset } from '../../redux/products/product-slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  addToCart,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../../redux/cart/cartSlice';
import axios from '../../lib';
import { API_URL } from '../../constants';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import { LuMinus } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

const CustomOrder = () => {
  const { products } = useAppSelector((state) => state.product);
  const { cart: cartItems } = useAppSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [thana, setThana] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [search, setSearch] = useState('');
  const productAreaRef = useRef<HTMLDivElement>(null);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const final_price = cartItems.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );

  const orderItem = cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
  }));

  const orderData = {
    name,
    email,
    mobile,
    address,
    city,
    thana,
    order_form: 'custom',
    final_price: final_price + shipping - discount,
    delivery_fee: 0,
    payment_method: 'custom',
    order_status: 'pending',
    delivery_method: 'custom',
    orderItem,
  };

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/orders`, orderData).then(() => {
        toast.success('Order create successfully');
        dispatch(clearCart());
        navigate('/orders');
        // window.location.reload();
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productAreaRef.current &&
        !productAreaRef.current.contains(event.target as Node)
      ) {
        setIsFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocus]);

  return (
    <div>
      <CardBody header="Custom Order" to="/orders" text="Back" />
      <Display>
        <div>
          <form onSubmit={handleOrder}>
            <div className="row">
              <div className="col-md-5 custom-item">
                <Input
                  htmlFor="customer"
                  placeholder="Name"
                  label="Customer Name"
                  onBlur={(e) => setName(e.target.value)}
                />
                <Input
                  htmlFor="email"
                  placeholder="Email"
                  label="Customer Email"
                  onBlur={(e) => setEmail(e.target.value)}
                />
                <Input
                  htmlFor="mobile"
                  placeholder="Mobile"
                  label="Customer Mobile"
                  onBlur={(e) => setMobile(e.target.value)}
                />
                <Input
                  htmlFor="address"
                  placeholder="Address"
                  label="Address"
                  onBlur={(e) => setAddress(e.target.value)}
                />
                <Input
                  htmlFor="city"
                  placeholder="City"
                  label="City"
                  onBlur={(e) => setCity(e.target.value)}
                />
                <Input
                  htmlFor="thana"
                  placeholder="Thana"
                  label="Thana"
                  onBlur={(e) => setThana(e.target.value)}
                />
              </div>
              <div className="col-md-4 custom-item">
                <Input
                  htmlFor="discount"
                  placeholder="discount"
                  label="Discount Price"
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
                <Input
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
                                  product_id: product?.id as number,
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
                    <div className="col-md-9 left">Discount</div>
                    <div className="col-md-3 right">{discount}</div>
                    <div className="col-md-9 left">Total</div>
                    <div className="col-md-3 right">
                      {final_price + shipping - discount}
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
