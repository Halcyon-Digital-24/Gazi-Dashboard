import { useEffect, useRef, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import { Controller, useForm } from "react-hook-form";
import "./index.scss";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createCampaign, reset } from "../../redux/campaign/campaignSlice";
import { getProducts } from "../../redux/products/product-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateCampaign = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isCreate, message } = useAppSelector((state) => state.campaign);
  const [campaignProduct, setCampaignProduct] = useState([]);
  const { products } = useAppSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const areaRef = useRef(null);
  const [isFocus, setIsFocus] = useState(false);

  const addProduct = (id) => {
    if (!campaignProduct.includes(id)) {
      setCampaignProduct((prevCampaign) => [...prevCampaign, id]);
    } else {
      setCampaignProduct((prevCampaign) =>
        prevCampaign.filter((campaignId) => campaignId !== id)
      );
    }
  };

  const removeProduct = (id) => {
    setCampaignProduct((prevCampaign) =>
      prevCampaign.filter((campaignId) => campaignId !== id)
    );
  };

  const onProductSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);

    if (campaignProduct.length > 0) {
      const camProucts= `[${campaignProduct.join(',')}]`;
      formData.append("product_id", camProucts);
    } else {
      toast.error("Please Select Product");
      return;
    }
    
    formData.append("image", data.image);

    console.log([...formData.entries()]); // Logging FormData entries for debugging

    dispatch(createCampaign(formData));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/campaign");
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
      <CardBody header="Create Campaign" to="/campaign" />
      <Display>
        <form onSubmit={handleSubmit(onProductSubmit)}>
          <div className="text">
            <label htmlFor="name">Campaign Name *</label>
            <input
              type="text"
              placeholder="Campaign Name"
              {...register("name", {
                trim: true,
                required: "Campaign name is required",
              })}
            />
            {errors.name && (
              <p className="validation__error">{errors.name.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="name">Slug *</label>
            <input
              type="text"
              placeholder="Campaign Slug"
              {...register("slug", {
                trim: true,
                required: "Slug is required",
              })}
            />
            {errors.slug && (
              <p className="validation__error">{errors.slug.message}</p>
            )}
          </div>
          <label className="label" htmlFor="select">
            Banner *
          </label>
          <Controller
            control={control}
            name={"image"}
            rules={{ required: "Banner is required" }}
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Input
                  {...field}
                  value={value?.fileName}
                  onChange={(event) => {
                    onChange(event.target.files[0]);
                  }}
                  type="file"
                  id="picture"
                />
              );
            }}
          />
          {errors.image && (
            <p className="validation__error">{errors.image.message}</p>
          )}
          <div className="text">
            <label htmlFor="">Start Date</label>
            <input
              type="date"
              {...register("start_date", {
                required: "Start date is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid date",
                },
              })}
            />
            {errors.start_date && (
              <p className="validation__error">
                {errors.start_date.message}
              </p>
            )}
          </div>
          <div className="text">
            <label htmlFor="">Expire Date</label>
            <input
              type="date"
              {...register("end_date", {
                required: "Expire date is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid date",
                },
              })}
            />
            {errors.end_date && (
              <p className="validation__error">{errors.end_date.message}</p>
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

export default CreateCampaign;
