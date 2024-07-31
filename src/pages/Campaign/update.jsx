import { useEffect, useRef, useState, useMemo } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import { Controller, useForm } from "react-hook-form";
import "./index.scss";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getFrontendProducts,
  updateProduct,
} from "../../redux/products/product-slice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "../../components/select";
import { updateCampaign, reset } from "../../redux/campaign/campaignSlice";
import { useDebounce } from "../../utills/debounce";
import axios from "axios";
import { API_ROOT, API_URL } from "../../constants";

const UpdateCampaign = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isUpdate, message } = useAppSelector((state) => state.campaign);
  const { products } = useAppSelector((state) => state.product);
  const [campaignProduct, setCampaignProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discount, setDiscount] = useState(0);
  const [discounts, setDiscounts] = useState({});
  const [discountTypes, setDiscountTypes] = useState({});
  const [previousImage, setPreviousImage] = useState("");
  const areaRef = useRef(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    dispatch(getFrontendProducts({ search, page: 1, limit: 100 }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/campings/${slug}`);
        const data = response.data.data;
        setValue("name", data.name);
        setValue(
          "start_date",
          new Date(data.start_date).toISOString().split("T")[0]
        );
        setValue(
          "end_date",
          new Date(data.end_date).toISOString().split("T")[0]
        );
        const productIdsArray = JSON.parse(data.product_id);
        const productIds = productIdsArray.map(Number);
        setCampaignProduct(productIds);
        setPreviousImage(data.image);

        // Initialize product discounts
        const discounts = {};
        const discountTypes = {};
        productIds.forEach((id) => {
          discounts[id] = 0; // Default discount values
          discountTypes[id] = "percent"; // Default discount type
        });
        setDiscounts(discounts);
        setDiscountTypes(discountTypes);

        // Set main discount values if available
        if (data.main_discount) {
          const [value, type] = data.main_discount.split(":");
          setDiscount({
            value: parseFloat(value) || 0,
            type: type || "percent",
          });
        }
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };

    fetchData();
  }, [slug, setValue]);

  const addProduct = (id) => {
    if (!campaignProduct.includes(id)) {
      setCampaignProduct((prevCampaignProduct) => [...prevCampaignProduct, id]);
      setDiscounts((prevDiscounts) => ({ ...prevDiscounts, [id]: 0 }));
      setDiscountTypes((prevDiscountTypes) => ({
        ...prevDiscountTypes,
        [id]: "percent",
      }));
    }
  };

  const removeProduct = (id) => {
    setCampaignProduct((prevCampaignProduct) =>
      prevCampaignProduct.filter(
        (campaignProductId) => campaignProductId !== id
      )
    );
    setDiscounts((prevDiscounts) => {
      const updatedDiscounts = { ...prevDiscounts };
      delete updatedDiscounts[id];
      return updatedDiscounts;
    });
    setDiscountTypes((prevDiscountTypes) => {
      const updatedDiscountTypes = { ...prevDiscountTypes };
      delete updatedDiscountTypes[id];
      return updatedDiscountTypes;
    });
  };

  const calculateDiscountPrice = useMemo(() => {
    return (regularPrice, discount, discountType) => {
      if (discountType === "percent") {
        return regularPrice - (regularPrice * discount) / 100;
      }
      return regularPrice - discount;
    };
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);

    if (campaignProduct.length > 0) {
      const camProucts = `[${campaignProduct.join(",")}]`;
      formData.append("product_id", camProucts);
    } else {
      toast.error("Please Select Product");
      return;
    }

    if (discount.value > 0) {
      formData.append("main_discount", `${discount.value}:${discount.type}`);
    }

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    } else {
      formData.append("previous_image", previousImage);
    }

    dispatch(updateCampaign({ slug, campaigndata: formData }));

    // Handle individual product discounts
    for (const id of campaignProduct) {
      const product = products.find((product) => product.id === id);
      if (product) {
        const productDiscount =
          discounts[id] !== undefined ? discounts[id] : discount.value;
        const productDiscountType =
          discountTypes[id] !== undefined ? discountTypes[id] : discount.type;
        const discountPrice = calculateDiscountPrice(
          product.regular_price,
          productDiscount,
          productDiscountType
        );

        const updatedProductData = new FormData();
        updatedProductData.append("discount_price", discountPrice);
        updatedProductData.append("camping_name", data.name);
        updatedProductData.append("camping_id", slug); // Use the obtained campaign ID

        await axios.patch(
          `${API_URL}/products/${id}`,
          updatedProductData
        );
      }
    }
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

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      setSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

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
          
          <div className="invoice-discount-area">
            <div style={{ width: "60%", marginRight: "2%" }}>
              <Input
                placeholder="Main Discount Value"
                label="Main Discount Value"
                htmlFor="main-discount-value"
                value={discount.value || ""}
                onChange={(e) =>
                  setDiscount((prev) => ({
                    ...prev,
                    value: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div style={{ width: "38%" }}>
              <Select
                onChange={(e) =>
                  setDiscount((prev) => ({ ...prev, type: e.target.value }))
                }
                value={discount.type || "percent"}
              >
                <option value="flat">Flat</option>
                <option value="percent">Percent</option>
              </Select>
            </div>
          </div>
          <div className="selected-products">
            {campaignProduct.map((id) => {
              const product = products.find((product) => product.id === id);
              return (
                <div className="selected-product" key={id}>
                  <div style={{ width: "50%", marginRight: "2%" }}>
                    <span>{product.title}</span>
                  </div>
                  <div
                    className="invoice-discount-area"
                    style={{ width: "45%", marginRight: "3%" }}
                  >
                    <div style={{ width: "60%", marginRight: "2%" }}>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discounts[id] || ""}
                        onChange={(e) =>
                          setDiscounts((prevDiscounts) => ({
                            ...prevDiscounts,
                            [id]: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="discount-input"
                        placeholder="Discount Value"
                      />
                    </div>
                    <div style={{ width: "38%" }}>
                      <Select
                        className="discount-select"
                        value={discountTypes[id] || "percent"}
                        onChange={(e) =>
                          setDiscountTypes((prevDiscountTypes) => ({
                            ...prevDiscountTypes,
                            [id]: e.target.value,
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
