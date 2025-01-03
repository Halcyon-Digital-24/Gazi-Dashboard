import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import FileInput from "../../components/forms/file-input";
import DescriptionInput from "../../components/description";
import { Button } from "../../components/button";
import TextArea from "../../components/forms/textarea";
import Select from "../../components/select";
import "./create-product.scss";
import ToggleButton from "../../components/forms/checkbox";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getCategories } from "../../redux/category/categorySlice";
import { DateRangePicker } from "rsuite";

import { toast } from "react-toastify";
import "rsuite/dist/rsuite.css";
import { reset, updateProduct } from "../../redux/products/product-slice";
import axios from "../../lib";
import { API_ROOT, API_URL } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
// import AttributeSingle from "../attribute/attribute-single";
import { IAttributeResponse } from "../../interfaces/attribute";
import GalleryImages from "./galleryImages";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UpdateVariant from "./Updatevariant";

const UpdateProduct: React.FC = () => {
  // let runCount = 0;
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const [campaignDate, setCampaignDate] = useState<[Date, Date] | null>(null);
  const { isUpdate, isError, message, errorMessage, error } = useAppSelector(
    (state) => state.product
  );
  const [title, setTile] = useState<string>("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [updateImage, setUpdateImage] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState(0);
  const [regularPrice, setRegularPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountType, setDiscountType] = useState<"percent" | "flat" | "">("");
  const [discountSelectedAmount, setDiscountSelectedAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState<0 | 1>(1);
  const [isSale, setIsSale] = useState<0 | 1>(0);
  const [isFeature, setIsFeature] = useState<0 | 1>(0);
  const [isNew, setIsNew] = useState<0 | 1>(0);
  const [isHomePage, setIsHomePage] = useState<any[]>([]);
  const [sortDesc, setSortDesc] = useState("");
  const [policy, setPolicy] = useState("");
  const [availability, setAvailability] = useState<number>(0);

  const [isVariant, setIsVariant] = useState(false);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [selectedAttributes] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [exitingVariants, setExitingVariants] = useState<any[]>([]);
  const [addVariants, setAddVariants] = useState<any[]>([]);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<IAttributeResponse>(
          `${API_URL}/attributes`
        );
        setAttributes(data.data.rows);
        const attrs = data.data.rows
          .map((row) => {
            const attributeValues = row.value.split(",").map((value) => ({
              attribute_key: row.name.replace(" ", "_"),
              attribute_value: value.trim(),
              attribute_quantity: 0,
              attribute_image: "",
            }));
            return attributeValues;
          })
          .flat();
        setVariants(attrs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const handleAddAttribute = (name: string) => {
    const findAttr = name.trim().replace(" ", "_");
    const filterVariants = variants.filter((v) => v.attribute_key == findAttr);
    const filteredItems = filterVariants.filter((variant) => {
      // Check if variant exists in exitsItem
      return !exitingVariants.some(
        (exitItem) =>
          exitItem.attribute_key === variant.attribute_key &&
          exitItem.attribute_value === variant.attribute_value
      );
    });

    setAddVariants((prevAddVariants) => [...prevAddVariants, ...filteredItems]);
    setExitingVariants((prevAddVariants) => [
      ...prevAddVariants,
      ...filteredItems,
    ]);
  };

  const handleRemoveAddVariant = (att: any) => {
    console.log("variant", att)
    setAddVariants(
      addVariants.filter((v) => v.attribute_value !== att.attribute_value)
    );

    setExitingVariants(
      exitingVariants.filter((v) => v.attribute_value !== att.attribute_value)
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setUpdateImage(file);
    }
  };



  const handleProductSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("slug", url);
    formData.append("description", description);
    formData.append("policy", policy);
    if (updateImage !== null) {
      formData.append("image", updateImage);
    }
    formData.append("category_slug", category);
    formData.append("default_quantity", quantity.toString());
    formData.append("regular_price", regularPrice.toString());
    formData.append("discount_price", discountPrice.toString());
    formData.append("delivery_fee", deliveryFee.toString());
    formData.append("is_visible", status.toString());
    formData.append("video_url", videoUrl);
    if (campaignDate !== null) {
      formData.append("camping_start_date", campaignDate[0].toString());
      formData.append("camping_end_date", campaignDate[1].toString());
    }
    formData.append("upload_by", "admin");
    formData.append("availability", availability.toString());
    formData.append("meta_title", metaTitle);
    formData.append("meta_description", metaDescription);
    formData.append("sort_description", sortDesc);
    formData.append("is_homepage", isHomePage.toString());
    formData.append("is_sale", isSale.toString());
    formData.append("is_feature", isFeature.toString());
    formData.append("is_new", isNew.toString());



    if (isVariant) {
      const tempSelAttri: any[] = [];
      selectedAttributes?.map((item) => {
        if (item?.selectedValues?.length > 0) {
          tempSelAttri.push({
            name: item.name,
            value: item?.selectedValues,
          });
        }
      });
      formData.append("attributes", JSON.stringify(tempSelAttri));
    } else {
      formData.append("attributes", JSON.stringify([]));
    }
    dispatch(updateProduct({ id: Number(slug), productData: formData }));
  };

  const handleAvailability = (data: string) => setAvailability(Number(data));

  useEffect(() => {
    if (isError) {
      toast.error(`${errorMessage}`);
    }
  }, [isError, errorMessage]);
  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);
      navigate("/products");
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isUpdate, message, navigate]);

  useEffect(() => {
    dispatch(getCategories({ limit: 200 }));
  }, [dispatch]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${slug}`);
        const { product, productAttribute } = response.data;
        setTile(product.title);
        setUrl(product.slug);
        setDescription(product.description);
        setImage(product.image);
        setCategory(product.category_slug);
        setQuantity(product.default_quantity);
        setRegularPrice(product.regular_price);
        setDiscountPrice(Number(product.discount_price));
        setStatus(product.is_visible);
        setDeliveryFee(product.delivery_fee);
        setVideoUrl(product.video_url);
        setMetaTitle(product.meta_title);
        setMetaDescription(product.meta_description);
        setIsHomePage(product.is_homepage)
        setIsSale(product.is_sale);
        setIsFeature(product.is_feature);
        setIsNew(product.is_new);
        setSortDesc(product.sort_description);
        setPolicy(product?.policy || "");
        setAvailability(product.availability);
        setExitingVariants(productAttribute?.rows);

        if (product.camping_start_date && product.camping_end_date) {
          setCampaignDate([
            new Date(product.camping_start_date),
            new Date(product.camping_end_date),
          ]);
        }
        if (productAttribute?.count > 0) {
          setIsVariant(true);
        }
      } catch (error) {
        console.error("Error fetching EMI data:", error);
      }
    };
    fetchProductData();
  }, [slug]);

  useEffect(() => {
    if (discountType === "flat") {
      setDiscountPrice(regularPrice - discountSelectedAmount);
    } else if (discountType === "percent") {
      setDiscountPrice(
        regularPrice - (regularPrice * discountSelectedAmount) / 100
      );
    }
  }, [discountType, discountSelectedAmount]);




  return (
    <div className="create-product">
      <CardBody header="Update Product" to="/products" text="back" />
      <form onSubmit={handleProductSubmit}>
        <div className="row">
          <div className="col-md-8">
            <div className="left-body">
              <Display>
                <Input
                  label="Product Title *"
                  placeholder="Enter Name"
                  value={title}
                  onChange={(e) => setTile(e.target.value)}
                  htmlFor="name"
                  required
                  errorMessage={error.title}
                />
                <Input
                  label="Slug *"
                  value={url}
                  placeholder="Enter Slug"
                  onChange={(e) => setUrl(e.target.value)}
                  htmlFor="slug"
                  required
                  errorMessage={error.slug}
                />
              </Display>
              <Display>
                <FileInput
                  label="Featured Image *"
                  onChange={handleImageChange}
                />
                <p className="wearing">
                  Image Size Should Be 600 x 600.
                  <br /> or square size
                </p>
                {typeof image === "string" && (
                  <div className="product-image">
                    <img
                      src={`${API_ROOT}/images/product/${image}`}
                      alt="gazi home appliance"
                    />
                  </div>
                )}
                <br />
              </Display>
              <Display>
                <label htmlFor="">Campaign Date</label>
                <DateRangePicker
                  className={`date-area`}
                  value={campaignDate}
                  onChange={(dateRange) => setCampaignDate(dateRange)}
                />
                <Input
                  placeholder="Video Link"
                  label="Video Link"
                  value={videoUrl}
                  htmlFor="video"
                  onChange={(e) => setVideoUrl(e.target.value)}
                  errorMessage={error.video_url}
                />
                <p className="wearing">
                  Use proper link without extra parameter.
                  <br /> Don't use short share link/embedded iframe code.
                </p>
              </Display>
              <GalleryImages slug={slug as string} />
              <Display>
                <div></div>
                <div className="variant">
                  <p>Product Variation</p>
                  <ToggleButton
                    onClick={() => setIsVariant((prevState) => !prevState)}
                    isChecked={isVariant}
                  />
                </div>
                {isVariant && (
                  <>
                    <select
                      name="attributes"
                      onChange={(e) => handleAddAttribute(e.target.value)}
                      className="attribute-list"
                      value={""}
                    >
                      <option value="">Select attributes</option>
                      {attributes?.length > 0 &&
                        attributes?.map((item, i) => (
                          <option key={i} value={item?.name}>
                            {item?.name}
                          </option>
                        ))}
                    </select>

                    <div className="varian-table">
                      <UpdateVariant
                        addVariants={addVariants}
                        title={title}
                        handleRemoveAddVariant={handleRemoveAddVariant}
                      />
                    </div>
                  </>
                )}
              </Display>
              <Display>
                <h5 className="product-title">Product Description</h5>
                <div className="des-none">
                  <TextArea label="Description" value={description} required />
                </div>
                <DescriptionInput
                  value={description}
                  setValue={setDescription}
                />
                {error.description && (
                  <p className="validation__error">{error.description}</p>
                )}
                <h5 className="product-title">Product Policy</h5>
                <div className="des-none">
                  <TextArea label="policy" value={policy} required />
                </div>
                <DescriptionInput value={policy} setValue={setPolicy} />
                {error.policy && (
                  <p className="validation__error">{error.policy}</p>
                )}
              </Display>
            </div>
          </div>
          <div className="col-md-4">
            <div className="right-body">
              <Display>
                <Button className="save-btn" type="submit">
                  Save & Update
                </Button>
              </Display>
              <Display>
                <Input
                  placeholder="Regular Price"
                  label="Regular Price"
                  htmlFor="regular-price"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(Number(e.target.value))}
                  required
                  errorMessage={error.regular_price}
                />
                <Input
                  label="Current Discount Price"
                  htmlFor="regular-price"
                  value={discountPrice}
                  readOnly
                  errorMessage={error.regular_price}
                />

                <div className="discount-area">
                  <Input
                    placeholder="Discount Price"
                    label="Discount Price"
                    htmlFor="discount-price"
                    onChange={(e) =>
                      setDiscountSelectedAmount(Number(e.target.value))
                    }
                    errorMessage={error.discount_price}
                  />
                  <div>
                    <Select
                      onChange={(e) =>
                        setDiscountType(e.target.value as "flat" | "percent")
                      }
                    >
                      <option value="flat">Flat</option>
                      <option value="percent">Percent</option>
                    </Select>
                  </div>
                </div>
              </Display>

              <Display>
                <label className="label">Select Category*</label>
                <Select onChange={(e) => setCategory(e.target.value)} required>
                  {categories.map((ctg) => {
                    return (
                      <option
                        key={ctg.id}
                        value={ctg.slug}
                        selected={ctg?.slug == category}
                      >
                        {ctg.title}
                      </option>
                    );
                  })}
                </Select>
                <Select
                  htmlFor="Availability"
                  onChange={(e) => handleAvailability(e.target.value)}
                >
                  <option value="1" selected={availability === 1}>
                    In Stock
                  </option>
                  <option value="2" selected={availability === 2}>
                    Out of Stock
                  </option>
                  <option value="3" selected={availability === 3}>
                    Upcoming
                  </option>
                </Select>
                <TextArea
                  label="Product short description *"
                  placeholder="Product short description"
                  value={sortDesc}
                  onChange={(e) => setSortDesc(e.target.value)}
                  errorMessage={error.sort_description}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  label="Quantity"
                  htmlFor="Quantity"
                  value={quantity?.toString()}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  errorMessage={error.quantity}
                />
              </Display>

              <Display>
                <div className="sudo-item">
                  <span>New</span>
                  <ToggleButton
                    isChecked={isNew == 1}
                    onClick={() => setIsNew(isNew == 0 ? 1 : 0)}
                  />
                </div>
                <div className="sudo-item">
                  <span>Top Sale</span>
                  <ToggleButton
                    isChecked={isSale === 1}
                    onClick={() => setIsSale(isSale == 0 ? 1 : 0)}
                  />
                </div>
                <div className="sudo-item">
                  <span>Feature</span>
                  <ToggleButton
                    isChecked={isFeature == 1}
                    onClick={() => setIsFeature(isFeature == 0 ? 1 : 0)}
                  />
                </div>
                <div className="sudo-item">
                  <span>Status</span>
                  <ToggleButton
                    isChecked={status == 1}
                    onClick={() => setStatus(status == 0 ? 1 : 0)}
                  />
                </div>
              </Display>
              <Display>
                <Input
                  placeholder="Meta Title"
                  htmlFor="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
                <TextArea
                  placeholder="Meta Description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
              </Display>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
