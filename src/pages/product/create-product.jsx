import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { DateRangePicker } from "rsuite";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import DescriptionInput from "../../components/description";
import Display from "../../components/display";
import ToggleButton from "../../components/forms/checkbox";
import FileInput from "../../components/forms/file-input";
import Input from "../../components/forms/text-input";
import TextArea from "../../components/forms/textarea";
import Select from "../../components/select";
import { getCategories } from "../../redux/category/categorySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createProduct, reset } from "../../redux/products/product-slice";
import "./create-product.scss";
// import makeAnimated from 'react-select/animated';
import { useNavigate } from "react-router-dom";
import "rsuite/dist/rsuite.css";
import { API_URL } from "../../constants";
import axios from "../../lib";
import AttributeSingle from "../attribute/attribute-single";

// const animatedComponents = makeAnimated();

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories } = useAppSelector((state) => state.category);
  const [campaignDate, setCampaignDate] = useState(null);
  const { isCreate, error, message, errorMessage, isError } = useAppSelector(
    (state) => state.product
  );
  const [title, setTile] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState(null);
  const [imageQuantities, setImageQuantities] = useState([]);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [regularPrice, setRegularPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [discountSelectedAmount, setDiscountSelectedAmount] = useState(0);
  // const [discount, setDiscount] = useState(0);
  const [deliveryFee] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [isSale, setIsSale] = useState(0);
  const [isFeature, setIsFeature] = useState(0);
  const [isNew, setIsNew] = useState(0);
  const [sortDesc, setSortDesc] = useState("");
  const [policy, setPolicy] = useState("");
  const [availability, setAvailability] = useState("");
  const [isVariant, setIsVariant] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/attributes`);
        if (response?.status === 200) {
          let tempAttributes = response?.data?.data?.rows;
          tempAttributes =
            tempAttributes?.length > 0
              ? tempAttributes?.map((item) => {
                  return { ...item, selectedValues: [] };
                })
              : [];
          setAttributes(tempAttributes);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleAddAttribute = (attribute, attributeValue = null) => {
    if (attributeValue) {
      setSelectedAttributes((prevState) =>
        prevState.map((item) => {
          if (item.name === attribute) {
            const tempAttrVals =
              item.value.indexOf(",") > -1
                ? item.value.split(",")
                : [item.value];
            const tempFilteredAttrVals = tempAttrVals.filter(
              (val) => val !== attributeValue
            );
            let tempFilteredValsString = "";
            if (tempFilteredAttrVals?.length > 1) {
              tempFilteredAttrVals?.map((val, i) => {
                if (tempFilteredAttrVals.length == i + 1) {
                  tempFilteredValsString += `${val}`;
                } else {
                  tempFilteredValsString += `${val},`;
                }
              });
            } else {
              tempFilteredValsString = tempFilteredAttrVals[0];
            }
            item.value =
              tempFilteredValsString === undefined
                ? ""
                : tempFilteredValsString;
            item.selectedValues.push(attributeValue);
          }
          return item;
        })
      );
    } else {
      if (attribute !== "") {
        let tempObj = {};
        attributes.map((item) => {
          if (item?.name === attribute) {
            tempObj = item;
          }
        });
        setAttributes((prevState) =>
          prevState?.filter((item) => item.name !== attribute)
        );
        setSelectedAttributes((prevState) => [tempObj, ...prevState]);
      }
    }
  };

  const handleRemoveAttribute = (attribute, attributeValue = null) => {
    if (attributeValue) {
      setSelectedAttributes((prevState) =>
        prevState.map((item) => {
          if (item.name === attribute) {
            item.value =
              item.value === ""
                ? attributeValue
                : `${item.value},${attributeValue}`;
            item.selectedValues = item.selectedValues.filter(
              (val) => val !== attributeValue
            );
          }
          return item;
        })
      );
    } else {
      let tempObj = {};
      selectedAttributes.map((item) => {
        if (item?.name === attribute) {
          tempObj = item;
        }
      });
      setSelectedAttributes((prevState) =>
        prevState?.filter((item) => item.name !== attribute)
      );
      setAttributes((prevState) => [tempObj, ...prevState]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  /* const handleGalleryImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages(files);
    }
  }; */
  const handleGalleryImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Initialize quantities for newly added images
      const newQuantities = Array(files.length).fill(1);

      setGalleryImages((prevImages) =>
        prevImages ? [...prevImages, ...files] : files
      );
      setImageQuantities((prevQuantities) => [
        ...prevQuantities,
        ...newQuantities,
      ]);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prevImages) => {
      if (prevImages) {
        const newImages = [...prevImages];
        newImages.splice(index, 1);
        return newImages;
      }
      return [];
    });

    setImageQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities.splice(index, 1);
      return newQuantities;
    });
  };

  const handleQuantityChange = (index, value) => {
    setImageQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = value;
      return newQuantities;
    });
  };

  /*  const removeGalleryImage = (file: File) => {
    if (galleryImages !== null) {
      const filterImages = galleryImages.filter(
        (singleFile) => singleFile.name != file.name
      );
      setGalleryImages(filterImages);
    }
  }; */

  const handleProductSubmit = () => {
    if (discountSelectedAmount && !discountType) {
      toast.error("Please select discount option");
      return;
    }
    const formData = new FormData();

    if (title.trim()) {
      formData.append("title", title.trim());
    }
    if (slug.trim()) {
      formData.append("slug", slug.trim());
    }
    if (description.trim()) {
      formData.append("description", description.trim());
    }
    if (policy.trim()) {
      formData.append("policy", policy.trim());
    }
    if (image !== null) {
      formData.append("image", image);
    }
    formData.append("category_slug", category);
    formData.append("quantity", quantity.toString().trim());
    formData.append("regular_price", regularPrice.toString().trim());
    formData.append("discount_price", discountPrice.toString().trim());
    formData.append("delivery_fee", deliveryFee.toString());
    formData.append("is_visible", status.toString());
    formData.append("video_url", videoUrl.trim());
    if (campaignDate !== null) {
      formData.append("camping_start_date", campaignDate[0].toString());
      formData.append("camping_end_date", campaignDate[1].toString());
    }
    formData.append("upload_by", "admin");
    formData.append("availability", availability);
    galleryImages?.forEach((g_image, index) => {
      formData.append("gallery_image", g_image);
      formData.append("order_number", imageQuantities[index].toString());
    });
    formData.append("meta_title", metaTitle.trim());
    formData.append("meta_description", metaDescription.trim());
    formData.append("sort_description", sortDesc.trim());
    formData.append("is_homepage", "0");
    formData.append("is_sale", isSale.toString());
    formData.append("is_feature", isFeature.toString());
    formData.append("is_new", isNew.toString());
    if (isVariant) {
      const tempSelAttri = [];
      selectedAttributes?.length > 0 &&
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
    dispatch(createProduct(formData));
  };

  useEffect(() => {
    if (discountType === "flat") {
      setDiscountPrice(regularPrice - discountSelectedAmount);
    } else if (discountType === "percent") {
      setDiscountPrice(
        regularPrice - (regularPrice * discountSelectedAmount) / 100
      );
    }
  }, [discountType, discountSelectedAmount]);

  useEffect(() => {
    if (isError) {
      toast.error(`${errorMessage}`);
    }
  }, [errorMessage, isError]);

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/products");
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isCreate, navigate, message]);

  useEffect(() => {
    dispatch(getCategories({ page: 1, limit: 200 }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  console.log(title, slug);

  return (
    <div className="create-product">
      <CardBody header="Create Product" to="/products" text="back" />
      <form onSubmit={handleSubmit(handleProductSubmit)}>
        <div className="row">
          <div className="col-md-8">
            <div className="left-body">
              <Display>
                <div className="text">
                  <label htmlFor="title">Product Title *</label>
                  <input
                    type="text"
                    placeholder="Product title"
                    onChange={(e) => console.log(e)}
                    {...register("title", {
                      required: "Title is required",
                      pattern: {
                        value: /\S/,
                        message: "Enter a valid title",
                      },
                    })}
                  />
                  {errors.title && (
                    <p className="validation__error">{errors.title.message}</p>
                  )}
                </div>
                {/*   <Input
                  label="Product Title *"
                  placeholder="Enter Name"
                  onBlur={(e) => setTile(e.target.value)}
                  htmlFor="name"
                  required
                  errorMessage={error.title}
                /> */}
                <div className="text">
                  <label htmlFor="title">Slug *</label>
                  <input
                    type="text"
                    placeholder="Enter Slug"
                    onChange={(e) => setSlug(e.target.value)}
                    {...register("slug", {
                      required: "Slug is required",
                      pattern: {
                        value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        message: "Enter a valid slug",
                      },
                    })}
                  />
                  {errors.slug && (
                    <p className="validation__error">{errors.slug.message}</p>
                  )}
                </div>
                {/*  <Input
                  label="Slug *"
                  placeholder="Enter Slug"
                  onBlur={(e) => setSlug(e.target.value)}
                  htmlFor="slug"
                  required
                  errorMessage={error.slug}
                /> */}
              </Display>

              <Display>
                <FileInput
                  label="Featured Image *"
                  onChange={handleImageChange}
                  required
                />
                {image && (
                  <div className="product-image">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="gazi home appliance"
                    />
                  </div>
                )}
                <br />
                <p className="wearing">
                  Image Size Should Be 800 x 800.
                  <br /> or square size
                </p>
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
                  htmlFor="video"
                  onBlur={(e) => setVideoUrl(e.target.value)}
                  errorMessage={error.video_url}
                />
                <p className="wearing">
                  Use proper link without extra parameter.
                  <br /> Don't use short share link/embedded iframe code.
                </p>
              </Display>

              <Display>
                <FileInput
                  label="Gallery Images"
                  onChange={handleGalleryImageChange}
                  multiple
                  required={galleryImages?.length <= 0}
                />
                <div>
                  {galleryImages &&
                    galleryImages.length > 0 &&
                    galleryImages.map((image, index) => (
                      <div key={index} className="product-image">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="gazi home appliance"
                        />
                        <input
                          type="number"
                          defaultValue={index + 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              parseInt(e.target.value, 10)
                            )
                          }
                        />
                        <span
                          className="cross"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <RxCross2 />
                        </span>
                      </div>
                    ))}
                </div>
                <p className="wearing">
                  Image Size Should Be 800 x 800. or square size.
                </p>
              </Display>
              <Display>
                <div></div>
                <div className="variant">
                  <p>Product Variation</p>
                  <ToggleButton
                    onClick={() => setIsVariant(!isVariant)}
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
                    <div className="attribute-selected">
                      {selectedAttributes?.length > 0 &&
                        selectedAttributes?.map((item, i) => (
                          <AttributeSingle
                            key={i}
                            data={item}
                            handleAddAttribute={handleAddAttribute}
                            handleRemoveAttribute={handleRemoveAttribute}
                          />
                        ))}
                    </div>
                  </>
                )}
              </Display>
              <Display>
                <h5 className="product-title">Product Description*</h5>
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
                <h5 className="product-title">Product Policy*</h5>
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
                  Save & Publish
                </Button>
                {/* <Button type="submit">Save & Unpublished</Button> */}
              </Display>

              <Display>
                <Input
                  type="number"
                  placeholder="Regular Price"
                  label="Regular Price"
                  htmlFor="regular-price"
                  onChange={(e) => setRegularPrice(Number(e.target.value))}
                  required
                  errorMessage={error.regular_price}
                />
                <div className="discount-area">
                  <Input
                    type="number"
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
                      onChange={(e) => setDiscountType(e.target.value)}
                      required={discountSelectedAmount ? true : false}
                    >
                      <option value="flat">Flat</option>
                      <option value="percent">Percent</option>
                    </Select>
                  </div>
                </div>
              </Display>

              <Display>
                <div className="p-wrapper">
                  <Select
                    htmlFor="Select Category*"
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.title}
                      </option>
                    ))}
                  </Select>
                  <Select
                    htmlFor="Availability"
                    onChange={(e) => setAvailability(e.target.value)}
                    required
                  >
                    <option value="1">In Stock</option>
                    <option value="2">Out of Stock</option>
                    <option value="3">Upcoming</option>
                  </Select>
                  <TextArea
                    label="Product short description *"
                    placeholder="Product short description"
                    onBlur={(e) => setSortDesc(e.target.value)}
                    errorMessage={error.sort_description}
                  />

                  <Input
                    type="number"
                    placeholder="Quantity"
                    label="Quantity"
                    htmlFor="Quantity"
                    onBlur={(e) => setQuantity(Number(e.target.value))}
                    required
                    errorMessage={error.quantity}
                  />
                </div>
              </Display>

              <Display>
                <div className="sudo-item">
                  <span>Is New</span>
                  <ToggleButton
                    isChecked={isNew == 1}
                    onClick={() => setIsNew(isNew == 0 ? 1 : 0)}
                  />
                </div>
                <div className="sudo-item">
                  <span>Is Sale</span>
                  <ToggleButton
                    isChecked={isSale === 1}
                    onClick={() => setIsSale(isSale == 0 ? 1 : 0)}
                  />
                </div>
                <div className="sudo-item">
                  <span>Is Feature</span>
                  <ToggleButton
                    isChecked={isFeature == 1}
                    onClick={() => setIsFeature(isFeature == 0 ? 1 : 0)}
                  />
                </div>
                <div className="sudo-item">
                  <span>Status</span>
                  <ToggleButton
                    isChecked={status === 1}
                    onClick={() => setStatus(status == 0 ? 1 : 0)}
                  />
                </div>
              </Display>
              <Display>
                <Input
                  placeholder="Meta Title"
                  htmlFor="meta-title"
                  onBlur={(e) => setMetaTitle(e.target.value)}
                />
                <TextArea
                  placeholder="Meta Description"
                  onBlur={(e) => setMetaDescription(e.target.value)}
                />
              </Display>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
