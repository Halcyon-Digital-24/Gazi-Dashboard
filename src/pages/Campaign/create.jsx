import { useEffect, useRef, useState, useMemo } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import { Controller, useForm } from "react-hook-form";
import "./index.scss";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createCampaign, reset } from "../../redux/campaign/campaignSlice";
import {
  getFrontendProducts,
  updateProduct,
} from "../../redux/products/product-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "../../components/select";
import { useDebounce } from "../../utills/debounce";

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
  const { products } = useAppSelector((state) => state.product);
  const [campaignProduct, setCampaignProduct] = useState([]);
  const [search, setSearch] = useState("");
  const areaRef = useRef(null);
  const [isFocus, setIsFocus] = useState(false);
  const [discountType, setDiscountType] = useState("percent");
  const [discount, setDiscount] = useState(0);
  const [discounts, setDiscounts] = useState({});
  const [discountTypes, setDiscountTypes] = useState({});

  const addProduct = (id) => {
    if (!campaignProduct.some((product) => product.id === id)) {
      const selectedProduct = products.find((product) => product.id === id);
      setCampaignProduct((prevCampaign) => [...prevCampaign, selectedProduct]);
      setDiscounts((prevDiscounts) => ({ ...prevDiscounts, [id]: "" }));
      setDiscountTypes((prevDiscountTypes) => ({
        ...prevDiscountTypes,
        [id]: "percent",
      }));
    }
  };

  const removeProduct = (id) => {
    setCampaignProduct((prevCampaign) =>
      prevCampaign.filter((product) => product.id !== id)
    );
    setDiscounts((prevDiscounts) => {
      const { [id]: removed, ...rest } = prevDiscounts;
      return rest;
    });
    setDiscountTypes((prevDiscountTypes) => {
      const { [id]: removed, ...rest } = prevDiscountTypes;
      return rest;
    });
  };

  const calculateDiscountPrice = (regularPrice, productId) => {
    const individualDiscount =
      discounts[productId] !== "" ? discounts[productId] : discount;
    const individualDiscountType =
      discountTypes[productId] !== "percent"
        ? discountTypes[productId]
        : discountType;
    if (individualDiscountType === "percent") {
      return regularPrice - (regularPrice * individualDiscount) / 100;
    }
    return regularPrice - individualDiscount;
  };

  const onProductSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);

    if (campaignProduct.length > 0) {
      const camProucts = `[${campaignProduct
        .map((product) => product.id)
        .join(",")}]`;
      formData.append("product_id", camProucts);
    } else {
      toast.error("Please Select Product");
      return;
    }

    formData.append("image", data.image);

    try {
      const response = await dispatch(createCampaign(formData));
      const campaignId = response.payload.data.id; // Adjust based on how your response structure looks

      campaignProduct.forEach(async (product) => {
        const discountPrice = calculateDiscountPrice(
          product.regular_price,
          product.id
        );
        const updatedProductData = new FormData();

        updatedProductData.append("discount_price", discountPrice);
        updatedProductData.append("camping_name", data.name);
        updatedProductData.append("camping_id", campaignId); // Use the obtained campaign ID
        // Append other product fields if needed

        await dispatch(
          updateProduct({ id: product.id, productData: updatedProductData })
        );
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Error creating campaign. Please try again.");
    }
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

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      setSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    dispatch(getFrontendProducts({ search, page: 1, limit: 100 }));

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

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="campaign">
      <CardBody header="Create Campaign" to="/campaign" text="Back" />
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
            <label htmlFor="slug">Slug *</label>
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
            <label htmlFor="start_date">Start Date</label>
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
                  message: "Enter a valid date",
                },
              })}
            />
            {errors.end_date && (
              <p className="validation__error">{errors.end_date.message}</p>
            )}
          </div>
          <div className="invoice-discount-area">
            <div style={{ width: "60%", marginRight: "2%" }}>
              <Input
                placeholder="Discount Value"
                defaultValue="0"
                label="Discount Value"
                htmlFor="discount-value"
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div style={{ width: "38%" }}>
              <Select onChange={(e) => setDiscountType(e.target.value)}>
                <option value="flat">Flat</option>
                <option value="percent">Percent</option>
              </Select>
            </div>
          </div>
          <div className="selected-products">
            {campaignProduct.map((product) => (
              <div className="selected-product" key={product.id}>
                <div style={{ width: "50%", marginRight: "2%" }}>
                <span>{product.title}</span>
                </div>
                <div className="invoice-discount-area" style={{ width: "45%" , marginRight: "3%"}}>
                  <div style={{ width: "60%", marginRight: "2%" }}>
                    <Input
                      type="number"
                      placeholder="Discount Value"
                      className="discount-input"
                      value={discounts[product.id] || ""}
                      onChange={(e) =>
                        setDiscounts((prevDiscounts) => ({
                          ...prevDiscounts,
                          [product.id]: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div style={{ width: "38%" }}>
                    <Select
                      className="discount-select"
                      value={discountTypes[product.id] || "percent"}
                      onChange={(e) =>
                        setDiscountTypes((prevDiscountTypes) => ({
                          ...prevDiscountTypes,
                          [product.id]: e.target.value,
                        }))
                      }
                    >
                      <option value="flat">Flat</option>
                      <option value="percent">Percent</option>
                    </Select>
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeProduct(product.id)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          <div className="select-product" ref={areaRef}>
            <Input
              placeholder="Search products"
              label="Search Products"
              htmlFor="select-product"
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocus(true)}
            />
            {isFocus && (
              <div className="select-area">
                <ul className="product-list">
                  {filteredProducts.map((product) => (
                    <li
                      className="item"
                      key={product.id}
                      onClick={() => addProduct(product.id)}
                    >
                      <span>{product.title}</span>
                      {campaignProduct.some((p) => p.id === product.id) && (
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
