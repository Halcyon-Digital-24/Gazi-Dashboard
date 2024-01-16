import CardBody from '../../components/card-body';
import { Button } from '../../components/button';
import Input from '../../components/forms/text-input';
import Display from '../../components/display';
import './custom-order.scss';
import { useEffect, useRef, useState } from 'react';
import { getProducts, reset } from '../../redux/products/product-slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import axios from '../../lib';
import { API_URL } from '../../constants';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import { LuMinus } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate, useParams } from 'react-router-dom';
import { ISingleOrder } from '../../interfaces/order';
import { IProduct } from '../../interfaces/product';
import Column from '../../components/table/column';

const UpdateOrder = () => {
  const { slug } = useParams();
  const { products } = useAppSelector((state) => state.product);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [shipping, setShipping] = useState(0);
  const [orderItems, setOrderItems] = useState<ISingleOrder[]>([]);
  const [isFocus, setIsFocus] = useState(false);
  const [search, setSearch] = useState('');
  const productAreaRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const orderData = {
    name,
    email,
    mobile,
    address,
    city,
  };

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/orders/${slug}`, orderData).then((res) => {
        toast.success(`${res.data.message}`);
        navigate('/orders');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/${slug}`);
        const data = response.data.data;
        // Set state values based on the fetched data
        setName(data.name);
        setEmail(data.email);
        setMobile(data.mobile);
        setAddress(data.address);
        setCity(data.city);
        setOrderItems(data.orderItems);
        setShipping(data.delivery_fee)
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchData();
  }, [slug, loading]);

  const handleIncrementOrderItem = async (data: ISingleOrder) => {
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
  const handleDecrementOrderItem = async (data: ISingleOrder) => {
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

  const handleRemoveOrderItem = async (data: ISingleOrder) => {
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
  const addOrderItem = async (data: IProduct) => {
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
        toast.success('Product added successfully');
      });
      // Total price updated
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CardBody header="Update Order" to="/orders" text="Back" />
      <Display>
        <div>
          <form onSubmit={handleOrder}>
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
                      <Input
                        label="Name"
                        htmlFor="customer"
                        value={name}
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Input
                        label="Email"
                        htmlFor="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        label="Mobile"
                        htmlFor="mobile"
                        value={mobile}
                        placeholder="Mobile"
                        onChange={(e) => setMobile(e.target.value)}
                      />
                      <Input
                        label="Address"
                        htmlFor="address"
                        value={address}
                        placeholder="Address"
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <Input
                        label="City"
                        htmlFor="city"
                        value={city}
                        placeholder="City"
                        onChange={(e) => setCity(e.target.value)}
                      />
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
                          <p className="heading sort-summery">৳ {shipping}</p>
                          <p className="heading sort-summery">
                            Discount
                          </p>
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
                            0
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
