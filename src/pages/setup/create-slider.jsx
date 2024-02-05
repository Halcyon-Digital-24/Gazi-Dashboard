import { useEffect } from "react";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Input from "../../components/forms/text-input";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createAddBanner, reset } from "../../redux/add-banner/addBannerSlice";
import { useNavigate } from "react-router-dom";

const CreateSlider = () => {
  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCreate, message, isError, errorMessage } = useAppSelector(
    (state) => state.banner
  );

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("is_visible", true);
    formData.append("group_by", "slider");

    dispatch(createAddBanner(formData));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/setup/home-page");
    }
    if (isError) {
      toast.error(`${errorMessage}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, message, dispatch, isError, errorMessage, navigate]);

  return (
    <div>
      <CardBody header="Create Banner" to="/setup/home-page" text="Back" />
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
          <Button type="submit">Create</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateSlider;
