import { useState, useEffect } from "react";
import "./index.scss";
// import Chart from '../../components/chart';
import { API_URL } from "../../constants";
import axios from "../../lib";
import { Link } from "react-router-dom";
import TextEditor from "../../components/forms/text-editor";
import Loader from "../../components/loader";



const HomePage: React.FC = () => {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editorData, setEditorData] = useState<any>('')


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboards`);

        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
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
    {
      to: "/products/reviews",
      imageSrc: "/assets/images/review.png",
      title: "Total Review",
      value: data.totalReview,
      role_identity: "products",
    },
    {
      to: "/products/reviews",
      imageSrc: "/assets/images/pending_review.png",
      title: "Pending Review",
      value: data.pendingReview,
      role_identity: "products",
    },
    {
      to: "/refund",
      imageSrc: "/assets/images/refund.png",
      title: "Total Refund Products",
      value: data.totalRefund,
      role_identity: "refund",
    },
    {
      to: "/refund",
      imageSrc: "/assets/images/pending_refund.png",
      title: "Pending Refund Products",
      value: data.prendingRefund,
      role_identity: "refund",
    },

    {
      to: "/html-generator",
      imageSrc: "/assets/images/html.png",
      title: "HTML Generator",
      value: '',
      role_identity: "html-generator",
    },
  ];

  // Filter items based on user permissions
  const userPermissions = JSON.parse(
    localStorage.getItem("user") || ""
  ).permissions;
  const filteredItems = items.filter((item) =>
    userPermissions?.includes(item.role_identity) ||
    item.role_identity?.includes('html-generator')

  );

  const handleChange = (data: any) => {
    setEditorData(data)
    const view: any = document.getElementById('view-html')
    if (view) view.innerHTML = data

  }

  return (
    <div className="">
      <div className="row">
        {filteredItems.map((item, index) => (
          <div className="grid-class" key={index}>
            <Link to={item.to}>
              <div className="chart-card">
                <div className={"img " + item.role_identity?.includes('html-generator') ? 'img-lg' : ''}>
                  <img src={item.imageSrc} alt="cart" />
                </div>
                <div className="info">
                  <h5>{item.title}</h5>
                  {
                    item?.value != '' ?
                      <h3>{item.value}</h3> : ''
                  }
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div style={{ display: 'none' }}>

        <div className="row mt5 mb-5">
          <TextEditor onChangeFunction={handleChange} editorText={editorData} />
        </div>
        <div className="row mt5 mb-5">
          <div id="view-html" ></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
