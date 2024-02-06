import { useState, useEffect } from "react";
import "./index.scss";
// import Chart from '../../components/chart';
import { API_URL } from "../../constants";
import axios from "../../lib";
import { Link } from "react-router-dom";

/* interface IData {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

const data: IData[] = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]; */

const HomePage: React.FC = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  /* const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = data[activeIndex];

  const handleClick = useCallback(
    (_: IData, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  ); */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboards`);

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const items = [
    {
      to: "/orders",
      imageSrc: "/assets/images/checkout.png",
      title: "Total Orders",
      value: data.totalOrder,
      role_identity: "orders",
    },
    {
      to: "/orders/pending",
      imageSrc: "/assets/images/pending.png",
      title: "Pending Orders",
      value: data.totalPendingOrder,
      role_identity: "orders",
    },
    {
      to: "/products",
      imageSrc: "/assets/images/gift.png",
      title: "Total Products",
      value: data.totalProduct,
      role_identity: "products",
    },
    {
      to: "/customers",
      imageSrc: "/assets/images/people.png",
      title: "Total Customers",
      value: data.totalUser,
      role_identity: "customers",
    },
    {
      to: "/products/stockout",
      imageSrc: "/assets/images/out-of-stock.png",
      title: "Stock Out Products",
      value: data.totalOutStock,
      role_identity: "products",
    },
    {
      to: "/subscriber",
      imageSrc: "/assets/images/subscribe.png",
      title: "Subscribers",
      value: data.totalSubscribe,
      role_identity: "support",
    },
    {
      to: "/blogs",
      imageSrc: "/assets/images/blog.png",
      title: "Blogs",
      value: data.totalBlog,
      role_identity: "blogs",
    },
    {
      to: "/queries",
      imageSrc: "/assets/images/question.png",
      title: "Queries",
      value: data.totalQuery,
      role_identity: "support",
    },
  ];

  return (
    <div className="">
      <div className="row">
        {items.map((item, index) => (
          <div className="col-md-3" key={index}>
            <Link to={item.to}>
              <div className="chart-card">
                <div className="img">
                  <img src={item.imageSrc} alt="cart" />
                </div>
                <div className="info">
                  <h5>{item.title}</h5>
                  <h3>{item.value}</h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
