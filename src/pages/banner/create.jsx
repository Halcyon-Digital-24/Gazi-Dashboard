import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createAddBanner, reset } from "../../redux/add-banner/addBannerSlice";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../redux/category/categorySlice";

const CreateBanner = () => {
  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const { isCreate, message, isError } = useAppSelector(
    (state) => state.banner
  );

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("is_visible", true);
    dispatch(createAddBanner(formData));
  };

  useEffect(() => {
    dispatch(getCategories({ page: 1, limit: 100 }));
  }, [dispatch]);
  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/banner");
    }
    if (isError) {
      toast.error("Blog create filed");
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, message, dispatch, isError, navigate]);
  return (
    <div>
      <CardBody header="Create Banner" to="/banner" text="Back" />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="label" htmlFor="select">
            Banner Image
          </label>
          <Controller
            control={control}
            name={"image"}
            rules={{ required: "Image is required" }}
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

          <div className="text">
            <label htmlFor="name">URL *</label>
            <input
              type="text"
              placeholder="URL"
              {...register("url")}
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

          <Button type="submit">Create</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateBanner;
