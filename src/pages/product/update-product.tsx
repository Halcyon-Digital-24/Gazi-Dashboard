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
import AttributeSingle from "../attribute/attribute-single";
import { IAttributeResponse } from "../../interfaces/attribute";
import GalleryImages from "./galleryImages";

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
  const [sortDesc, setSortDesc] = useState("");
  const [policy, setPolicy] = useState("");
  const [availability, setAvailability] = useState<number>(0);

  const [isVariant, setIsVariant] = useState(false);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<any[]>([]);
  const [previousSelectedAttributes, setPreviousSelectedAttributes] = useState<
    any[]
  >([]);
  console.log(previousSelectedAttributes);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<IAttributeResponse>(
          `${API_URL}/attributes`
        );
        if (response?.status === 200) {
          let tempAttributes: any[] = response?.data?.data?.rows;
          tempAttributes =
            tempAttributes?.length > 0
              ? tempAttributes?.map((item) => {
                  return { ...item, selectedValues: [] };
                })
              : [];
          try {
            const response2 = await axios.get(
              `${API_URL}/product-attributes/attributes/${slug}`
            );
            if (response2?.status === 200) {
              let selectedAttributeList = response2?.data?.data?.rows;
              if (selectedAttributeList?.length > 0) {
                setPreviousSelectedAttributes(selectedAttributeList);
                setIsVariant(true);
                if (tempAttributes?.length > 0) {
                  tempAttributes?.map((item) => {
                    let matchFound = false;
                    let valuesFound: any = "";
                    selectedAttributeList = selectedAttributeList?.filter(
                      (row: any) => {
                        if (item?.name === row?.attribute_key) {
                          matchFound = true;
                          valuesFound = row?.attribute_value;
                          return false;
                        } else {
                          return true;
                        }
                      }
                    );
                    if (matchFound) {
                      setSelectedAttributes((prevState) => {
                        if (Array.isArray(valuesFound)) {
                          valuesFound = valuesFound.join(",");
                        }
                        valuesFound =
                          valuesFound.indexOf(",") > -1
                            ? valuesFound.split(",")
                            : [valuesFound];
                        let itemValue: any[] =
                          item?.value?.indexOf(",") > -1
                            ? item?.value?.split(",")
                            : [item?.value];
                        itemValue = itemValue?.filter((val) => {
                          if (valuesFound.find((itm: any) => itm === val)) {
                            return false;
                          } else {
                            return true;
                          }
                        });
                        if (prevState?.length == 0) {
                          return [
                            {
                              ...item,
                              value: itemValue.join(","),
                              selectedValues: valuesFound,
                            },
                          ];
                        } else {
                          if (
                            prevState.find((attr) => attr?.name === item?.name)
                          ) {
                            return [...prevState];
                          } else {
                            return [
                              ...prevState,
                              {
                                ...item,
                                value: itemValue.join(","),
                                selectedValues: valuesFound,
                              },
                            ];
                          }
                        }
                      });
                    } else {
                      setAttributes((prevState) => {
                        if (prevState?.length == 0) {
                          return [item];
                        } else {
                          if (
                            prevState.find((attr) => attr?.name === item?.name)
                          ) {
                            return [...prevState];
                          } else {
                            return [...prevState, item];
                          }
                        }
                      });
                    }
                  });
                }
              }
            }
          } catch (error2) {
            setAttributes(tempAttributes);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleAddAttribute = (
    attribute: string,
    attributeValue: string | null = null
  ) => {
    if (attributeValue) {
      setSelectedAttributes((prevState) =>
        prevState.map((item) => {
          if (item.name === attribute) {
            let tempAttrVals: string[] =
              item.value.indexOf(",") > -1
                ? item.value.split(",")
                : [item.value];
            let tempFilteredAttrVals: string[] = tempAttrVals.filter(
              (val) => val !== attributeValue
            );
            let tempFilteredValsString: string = "";
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

  const handleRemoveAttribute = (
    attribute: string,
    attributeValue: string | null = null
  ) => {
    if (attributeValue) {
      setSelectedAttributes((prevState) =>
        prevState.map((item) => {
          if (item.name === attribute) {
            item.value =
              item.value === ""
                ? attributeValue
                : `${item.value},${attributeValue}`;
            item.selectedValues = item.selectedValues.filter(
              (val: string) => val !== attributeValue
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
    formData.append("quantity", quantity.toString());
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
    formData.append("is_homepage", "1");

    formData.append("is_sale", isSale.toString());
    formData.append("is_feature", isFeature.toString());
    formData.append("is_new", isNew.toString());
    if (isVariant) {
      let tempSelAttri: any[] = [];
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
        const { data } = response.data;
        setTile(data.title);
        setUrl(data.slug);
        setDescription(data.description);
        setImage(data.image);
        setCategory(data.category_slug);
        setQuantity(data.quantity);
        setRegularPrice(data.regular_price);
        setDiscountPrice(Number(data.discount_price));
        setStatus(data.is_visible);
        setDeliveryFee(data.delivery_fee);
        setVideoUrl(data.video_url);
        setMetaTitle(data.meta_title);
        setMetaDescription(data.meta_description);
        setIsSale(data.is_sale);
        setIsFeature(data.is_feature);
        setIsNew(data.is_new);
        setSortDesc(data.sort_description);
        setPolicy(data?.policy || "");
        setAvailability(data.availability);

        if (data.camping_start_date && data.camping_end_date) {
          setCampaignDate([
            new Date(data.camping_start_date),
            new Date(data.camping_end_date),
          ]);
        }

        /* if (data["product-photos"] && data["product-photos"].length > 0) {
          const galleryImageFiles = data["product-photos"].map(
            (photo: IPhoto) => ({
              id: photo.id,
              product_id: photo.product_id,
              image: photo.image,
              order_number: photo.order_number,
              created_at: photo.created_at,
              updated_at: photo.updated_at,
            })
          );
          setGalleryImages(galleryImageFiles);
        } */
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
                {/*  <Input
                  placeholder="Discount Price"
                  label="Discount Price"
                  htmlFor="discount-price"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(Number(e.target.value))}
                  errorMessage={error.discount_price}
                /> */}
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
                  value={quantity.toString()}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  errorMessage={error.quantity}
                />
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
