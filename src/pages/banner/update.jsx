import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import { API_ROOT } from "../../constants";
import axios from "../../lib";
import { reset, updateAddBanner } from "../../redux/add-banner/addBannerSlice";
import { getCategories } from "../../redux/category/categorySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const UpdateBanner = () => {
  const { slug } = useParams();
  const {
    register,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [prevImage, setPrevImage] = useState("");
  const { categories } = useAppSelector((state) => state.category);
  const { isUpdate, message, isError } = useAppSelector(
    (state) => state.banner
  );

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    dispatch(updateAddBanner({ bannerData: formData, id: slug }));
  };

  useEffect(() => {
    dispatch(getCategories({ page: 1, limit: 100 }));
  }, [dispatch]);
  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);
      navigate("/banner");
    }
    if (isError) {
      toast.error();
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, message, dispatch, isError, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/banner/${slug}`);
        setValue("group_by", data.data.group_by);
        setValue("url", data.data.url);
        setValue("image", data.data.image);
        setPrevImage(data.data.image);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div>
      <CardBody header="Update Banner" to="/banner" text="Back" />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="label" htmlFor="select">
            Banner Image
          </label>
          <Controller
            control={control}
            name={"image"}
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Input
                  {...field}
                  value={value?.fileName}
                  onChange={(event) => {
                    onChange(event.target.files[0]);
                  }}
                  type="file"
                  id="image"
                />
              );
            }}
          />
          {errors.image && (
            <p className="validation__error">{errors.image.message}</p>
          )}
          <div>
            <img
              style={{ width: "200px" }}
              src={`${API_ROOT}/images/banner/${prevImage}`}
              alt=""
            />
          </div>

          <div className="text">
            <label htmlFor="name">URL *</label>
            <input
              type="text"
              placeholder="URL"
              {...register("url", {
                required: "Url is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid url",
                },
              })}
            />
            {errors.url && (
              <p className="validation__error">{errors.url.message}</p>
            )}
          </div>
          <label className="label" htmlFor="select">
            Select Position
          </label>
          <div className="select-wrapper">
            <select
              id="select"
              className="select"
              {...register("group_by", {
                required: "Banner position is required",
              })}
              htmlFor="Choose Position"
              name="group_by"
            >
              <option value="">Select Banner Position</option>
              <option value="home">Home-horizontal</option>
              <option value="home-v">Home-vertical</option>
              <option value="product">Product</option>
              <option value="category">Category</option>
              <option value="video">Video</option>
              <option value="blog">Blog</option>
              {categories.map((category, index) => (
                <option key={index} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {errors.group_by && (
            <p className="validation__error">{errors.group_by.message}</p>
          )}
          <br />
          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateBanner;
