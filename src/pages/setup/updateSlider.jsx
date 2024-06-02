import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import FileInput from "../../components/forms/file-input";
import Input from "../../components/forms/text-input";
import { reset, updateAddBanner } from "../../redux/add-banner/addBannerSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import axios from "../../lib";
import { API_ROOT } from "../../constants";

const UpdateSlider = () => {
  const {
    register,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [prevImage, setPrevImage] = useState("");
  const { isUpdate, message, isError, errorMessage } = useAppSelector(
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
    if (isUpdate) {
      toast.success(`${message}`);
      navigate("/setup/home-page");
    }
    if (isError) {
      toast.error(`${errorMessage}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, message, dispatch, isError, navigate, errorMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/banner/${slug}`);
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
      <CardBody header="Update Banner" to="/setup/home-page" text="Back" />
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
          <div>
            <img
              style={{ width: "200px" }}
              src={`${API_ROOT}/images/banner/${prevImage}`}
              alt=""
            />
          </div>
          <div className="text">
            <label htmlFor="name">URL </label>
            <input
              type="text"
              placeholder="URL"
              {...register("url")}
            />
            {errors.url && (
              <p className="validation__error">{errors.url.message}</p>
            )}
          </div>
          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateSlider;
