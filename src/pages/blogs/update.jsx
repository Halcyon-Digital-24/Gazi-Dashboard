import { useEffect } from "react";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import DescriptionInput from "../../components/description";
import { useForm, Controller } from "react-hook-form";
import "./index.scss";
import { reset, updateBlog } from "../../redux/blogs/blogSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Column from "../../components/table/column";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../lib";
import { toast } from "react-toastify";

const UpdateBlog = () => {
  const {
    register,
    setError,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isUpdate, isError, error, errorMessage, message } = useAppSelector(
    (state) => state.blogs
  );
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    dispatch(updateBlog({ id: slug, blogData: formData }));
  };

  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);
      navigate("/blogs");
    }
    if (isError) {
      setError("slug", { type: "validate", message: error.slug });
      toast.error(`${errorMessage}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, dispatch, message, navigate, isError]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/blogs/${slug}`);
        const data = response.data.data;
        // Set state values based on the fetched data
        setValue("title", data.title);
        setValue("slug", data.slug);
        setValue("description", data.description);
        setValue("image", data.image);
        setValue("meta_description", data.meta_description);
        setValue("meta_title", data.meta_title);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, [slug]);

  return (
    <div>
      <CardBody header="Update Blog" to="/blogs" text="back" />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <Column className="col-md-8">
              <div className="text">
                <label htmlFor="name">Title *</label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  {...register("title", {
                    trim: true,
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
              <div className="text">
                <label htmlFor="name">Slug *</label>
                <input
                  type="text"
                  placeholder="slug"
                  {...register("slug", {
                    trim: true,
                    required: "slug is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid slug",
                    },
                  })}
                />
                {errors.slug && (
                  <p className="validation__error">{errors.slug.message}</p>
                )}
              </div>

              <label className="label" htmlFor="select">
                Image *
              </label>
              <Controller
                control={control}
                name={"image"}
                rules={{ required: "image is required" }}
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
              <Controller
                name="description"
                rules={{ required: "Description is required" }}
                control={control} // Set your default value if needed
                render={({ field }) => (
                  <DescriptionInput
                    value={field.value}
                    setValue={field.onChange}
                  />
                )}
              />
              {errors.description && (
                <p className="validation__error">
                  {errors.description.message}
                </p>
              )}
            </Column>
            <Column className="col-md-4">
              <div className="text">
                <label htmlFor="meta_title">Meta Title</label>
                <input
                  type="text"
                  placeholder="Meta title"
                  {...register("meta_title", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a Valid Meta title",
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
                    trim: true,
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
            </Column>
          </div>
          <Button>Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateBlog;
