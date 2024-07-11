import { useEffect, useRef, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import { useForm, Controller } from "react-hook-form";
import "./index.scss";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getProducts } from "../../redux/products/product-slice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../lib";
import { API_ROOT, API_URL } from "../../constants";
import { updateCampaign, reset } from "../../redux/campaign/campaignSlice";

const UpdateCampaign = () => {
  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isUpdate, message } = useAppSelector((state) => state.campaign);
  const [campaignProduct, setCampaignProduct] = useState([]);
  const { products } = useAppSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const areaRef = useRef(null);
  const [isFocus, setIsFocus] = useState(false);

  const addProduct = (id) => {
    if (!campaignProduct.includes(id)) {
      setCampaignProduct((prevCampaignProduct) => [...prevCampaignProduct, id]);
    } else {
      setCampaignProduct((prevCampaignProduct) =>
        prevCampaignProduct.filter((campaignProductId) => campaignProductId !== id)
      );
    }
  };

  const removeProduct = (id) => {
    setCampaignProduct((prevCampaignProduct) =>
      prevCampaignProduct.filter((campaignProductId) => campaignProductId !== id)
    );
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
   
    if (campaignProduct.length > 0) {
      const camProucts= `[${campaignProduct.join(',')}]`;
      formData.append("product_id", camProucts);
    } else {
      toast.error("Please Select Product");
      return;
    }

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    } else {
      formData.append("previous_image", previousImage);
    }


    dispatch(updateCampaign({ slug, campaigndata: formData }));
  };

  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);
      navigate("/campaign");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, navigate, dispatch, message]);

  useEffect(() => {
    dispatch(getProducts({ page: 1, limit: 1000, search: search }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/campings/${slug}`);
        const data = response.data.data;
        console.log(data);
        setValue("name", data.name);
        setValue(
          "start_date",
          new Date(data.start_date).toISOString().split("T")[0]
        );
        setValue(
          "end_date",
          new Date(data.end_date).toISOString().split("T")[0]
        );
        const productIdsArray = data.product_id.split(",").map(Number);
        setCampaignProduct(productIdsArray);
        setPreviousImage(data.image);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };

    fetchData();
  }, [slug, setValue]);

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
    <div className="campaign">
      <CardBody header="Update Campaign" to="/campaign" text="Back" />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text">
            <label htmlFor="name">Campaign Name *</label>
            <input
              type="text"
              placeholder="Campaign Name"
              {...register("name", {
                trim: true,
                required: "Campaign Name is required",
              })}
            />
            {errors.name && (
              <p className="validation__error">{errors.name.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="start_date">Start Date</label>
            <input
              type="date"
              {...register("start_date", {
                required: "Start date is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid start date",
                },
              })}
            />
            {errors.start_date && (
              <p className="validation__error">{errors.start_date.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="end_date">Expire Date</label>
            <input
              type="date"
              {...register("end_date", {
                required: "Expire date is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid expire date",
                },
              })}
            />
            {errors.end_date && (
              <p className="validation__error">{errors.end_date.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="image">Campaign Image</label>
            {previousImage && (
              <div className="previous-image">
                <img
                  src={`${API_ROOT}/images/camping/${previousImage}`}
                  style={{ width: "50%", height: "auto" }}
                  alt="Previous Campaign"
                />
              </div>
            )}
            <Controller
              control={control}
              name={"image"}
              render={({ field: { onChange, ...field } }) => (
                <Input
                  {...field}
                  onChange={(event) => onChange(event.target.files)}
                  type="file"
                  id="picture"
                />
              )}
            />
            {errors.image && (
              <p className="validation__error">{errors.image.message}</p>
            )}
          </div>

          <div className="selected-products">
            {campaignProduct.map((id) => {
              const product = products.find((product) => product.id === id);
              return (
                <div className="selected-product" key={id}>
                  <span>{product?.title}</span>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeProduct(id)}
                  >
                    <FaTimes />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="select-product" ref={areaRef}>
            <Input
              placeholder="Search products"
              label="Search Products"
              htmlFor="select-product"
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
                      {campaignProduct.includes(product.id) && (
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
    </div>
  );
};

export default UpdateCampaign;
