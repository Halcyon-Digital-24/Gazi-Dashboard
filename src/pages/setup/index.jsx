import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import ToggleButton from "../../components/forms/checkbox";
import Input from "../../components/forms/text-input";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { API_ROOT, API_URL } from "../../constants";
import axios from "../../lib";
import { useForm, Controller } from "react-hook-form";
import CustomScript from "./Script";
import DynamicImage from "./Images";
import {
  getCategories,
  reset as categoryReset,
} from "../../redux/category/categorySlice";
import {
  deleteBanner,
  getAddBanner,
  updateAddBanner,
} from "../../redux/add-banner/addBannerSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getSettings, reset } from "../../redux/settings/settingSlice";
import "./index.scss";

const SetupPage = () => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const { isDelete: bannerDelete, isUpdate: bannerUpdate } = useAppSelector(
    (state) => state.banner
  );
  const [addBanner, setAddBanner] = useState([]);
  const { categories } = useAppSelector((state) => state.category);
  const { isUpdate, isSuccess: settingSuccess } = useAppSelector(
    (state) => state.settings
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [specialPhoto, setSpecialPhoto] = useState("");

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    setIsSuccess(false);

    await axios
      .put(`${API_URL}/home-page`, formData)
      .then((res) => {
        setIsSuccess(true);
        toast.success(`${res.data.message}`);
      })
      .catch((error) => {
        console.log("upload homepage data error" + error);
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteBanner(id));
  };

  const handleVisibility = (banner) => {
    dispatch(
      updateAddBanner({
        id: Number(banner.id),
        bannerData: { is_visible: !banner.is_visible },
      })
    );
  };

  useEffect(() => {
    if (isUpdate) {
      toast.success("Updated successfully");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, dispatch]);

  // Load setting data
  useEffect(() => {
    dispatch(getSettings());
    /*  return () => {
      dispatch(reset());
    }; */
  }, [dispatch, settingSuccess, isUpdate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/banners?slider=true`);
        setAddBanner(response?.data?.rows);
      } catch (error) {
        console.log("Banner data fetch error" + error);
      }
    };
    fetchData();
  }, [isUpdate, bannerDelete, bannerUpdate]);

  // Load category data
  useEffect(() => {
    dispatch(getCategories({ page: 1, limit: 100 }));

    return () => {
      dispatch(categoryReset());
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/home-page`);
        const data = response.data.homePage;
        // set Value
        setValue("mobile_number", data.mobile_number);
        setValue("office_time", data.office_time);
        setValue("special_product_link", data.special_product_link);
        setValue("meta_title", data.meta_title);
        setValue("meta_description", data.meta_description);
        setValue("category_one", data.category_one);
        setValue("category_two", data.category_two);
        setValue("category_three", data.category_three);
        //category title
        setValue("category_one_title", data.category_one_title);
        setValue("category_two_title", data.category_two_title);
        setValue("category_three_title", data.category_three_title);
        setSpecialPhoto(data.special_product_photo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isSuccess]);

  return (
    <div>
      <div className="row">
        <Column className="col-md-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Display>
              <div className="text">
                <label htmlFor="name">Mobile Number *</label>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  {...register("mobile_number", {
                    trim: true,
                    required: "Mobile is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid mobile number",
                    },
                  })}
                />
                {errors.mobile_number && (
                  <p className="validation__error">
                    {errors.mobile_number.message}
                  </p>
                )}
              </div>
              <div className="text">
                <label htmlFor="name">Office Time</label>
                <input
                  type="text"
                  placeholder="Office Number"
                  {...register("office_time", {
                    trim: true,
                    required: "Title is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid time",
                    },
                  })}
                />
                {errors.office_time && (
                  <p className="validation__error">
                    {errors.office_time.message}
                  </p>
                )}
              </div>
              <div className="text">
                <label htmlFor="name">First Category Title</label>
                <input
                  type="text"
                  placeholder="Category title"
                  {...register("category_one_title", {
                    trim: true,
                    required: "Category title is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.category_one_title && (
                  <p className="validation__error">
                    {errors.category_one_title.message}
                  </p>
                )}
              </div>
              <>
                <label className="label" htmlFor="select">
                  First Category
                </label>
                <div className="select-wrapper">
                  <select
                    id="select"
                    className="select"
                    {...register("category_one", {
                      required: "Category is required",
                    })}
                    htmlFor="category_one"
                    name="category_one"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.slug}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.category_one && (
                  <p className="validation__error">
                    {errors.category_one.message}
                  </p>
                )}
              </>
              <div className="text">
                <label htmlFor="name">Second Category Title</label>
                <input
                  type="text"
                  placeholder="Category title"
                  {...register("category_two_title", {
                    trim: true,
                    required: "Category title is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.category_two_title && (
                  <p className="validation__error">
                    {errors.category_two_title.message}
                  </p>
                )}
              </div>
              <>
                <label className="label" htmlFor="select">
                  Second Category
                </label>
                <div className="select-wrapper">
                  <select
                    id="select"
                    className="select"
                    {...register("category_two", {
                      required: "Category is required",
                    })}
                    htmlFor="category_two"
                    name="category_two"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.slug}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.category_two && (
                  <p className="validation__error">
                    {errors.category_two.message}
                  </p>
                )}
              </>
              <div className="text">
                <label htmlFor="name">Third Category Title</label>
                <input
                  type="text"
                  placeholder="Category title"
                  {...register("category_three_title", {
                    trim: true,
                    required: "Category title is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.category_three_title && (
                  <p className="validation__error">
                    {errors.category_three_title.message}
                  </p>
                )}
              </div>
              <>
                <label className="label" htmlFor="select">
                  Third Category
                </label>
                <div className="select-wrapper">
                  <select
                    id="select"
                    className="select"
                    {...register("category_three", {
                      required: "Category is required",
                    })}
                    htmlFor="category_three"
                    name="category_three"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.slug}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.category_three && (
                  <p className="validation__error">
                    {errors.category_three.message}
                  </p>
                )}
              </>
              <div className="text">
                <label htmlFor="name">Special Product Link</label>
                <input
                  type="text"
                  placeholder="Special Product Link"
                  {...register("special_product_link", {
                    trim: true,
                    required: "Url is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid url",
                    },
                  })}
                />
                {errors.special_product_link && (
                  <p className="validation__error">
                    {errors.special_product_link.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="select">
                  Special Product Image
                </label>
                <Controller
                  control={control}
                  name={"special_product_photo"}
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
                {errors.special_product_photo && (
                  <p className="validation__error">
                    {errors.special_product_photo.message}
                  </p>
                )}
              </div>
              <img
                src={`${API_ROOT}/images/home-page/${specialPhoto}`}
                alt="ads"
              />
              <div className="text-right">
                <Button type="submit">Update</Button>
              </div>
            </Display>
          </form>
          <DynamicImage />
        </Column>
        <Column className="col-md-6">
          <Display>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text">
                <label htmlFor="name">Meta Title</label>
                <input
                  type="text"
                  placeholder="Meta title"
                  {...register("meta_title", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid meta title",
                    },
                  })}
                />
                {errors.meta_title && (
                  <p className="validation__error">
                    {errors.meta_title.message}
                  </p>
                )}
              </div>
              <div className="textarea">
                <label htmlFor="textarea">Meta Description</label>
                <textarea
                  {...register("meta_description", {
                    pattern: {
                      value: /\S/,
                      message: "Enter Valid Meta Description",
                    },
                  })}
                  id="textarea"
                  placeholder="Enter Meta Description"
                />
                {errors.meta_description && (
                  <p className="validation__error">
                    {errors.meta_description.message}
                  </p>
                )}
              </div>
              <div>
                <Button type="submit">Update</Button>
              </div>
            </form>
          </Display>
          <Display>
            <CardBody header="Create New Banner" to="/setup/sliders/create" />
            <Row className="row">
              <Column className="col-md-4">Image</Column>
              <Column className="col-md-4">Link</Column>
              <Column className="col-md-2">Status</Column>
              <Column className="col-md-2">Action</Column>
            </Row>
            <>
              {addBanner?.map((banner, index) => (
                <Row key={index} className="row banner">
                  <Column className="col-md-4">
                    <img
                      src={`${API_ROOT}/images/banner/${banner.image}`}
                      alt="banner"
                    />
                  </Column>
                  <Column className="col-md-4">
                    <p>{banner.url}</p>
                  </Column>
                  <Column className="col-md-2">
                    <ToggleButton
                      onClick={() => handleVisibility(banner)}
                      isChecked={banner.is_visible}
                    />
                  </Column>
                  <Column className="col-md-2">
                    <CustomIconArea>
                      <EditButton
                        editUrl={`/setup/sliders/edit/${banner.id}`}
                      />
                      <DeleteButton onClick={() => handleDelete(banner.id)} />
                    </CustomIconArea>
                  </Column>
                </Row>
              ))}
            </>
          </Display>
          <CustomScript />
        </Column>
      </div>
    </div>
  );
};

export default SetupPage;
