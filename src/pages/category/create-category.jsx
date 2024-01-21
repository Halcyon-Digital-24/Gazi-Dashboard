import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import Column from "../../components/table/column";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createCategory,
  getCategories,
  reset,
} from "../../redux/category/categorySlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { categories, isCreate, message } = useAppSelector(
    (state) => state.category
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    dispatch(createCategory(formData));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/category");
    }

    return () => {
      dispatch(reset());
    };
  }, [isCreate, dispatch, message, navigate]);

  useEffect(() => {
    dispatch(getCategories({ page: 1, limit: 100 }));
  }, [dispatch]);
  return (
    <div>
      <CardBody header="Create Category" to="/category" text="back" />
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
                  placeholder="Enter Slug *"
                  {...register("slug", {
                    required: "Slug is required",
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
              <div className="text">
                <label htmlFor="order_id">Position No</label>
                <input
                  type="text"
                  placeholder="Enter Position Number"
                  {...register("order_id", {
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Enter a valid position number (numeric only)",
                    },
                  })}
                />
                {errors.order_id && (
                  <p className="validation__error">{errors.order_id.message}</p>
                )}
              </div>
              <label className="label" htmlFor="select">
                Parent Category
              </label>
              <div className="select-wrapper">
                <select
                  id="select"
                  className="select"
                  {...register("parent_category")}
                  htmlFor="Choose Parent category"
                  name="parent_category"
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.slug}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {errors.parent_category && (
                <p className="validation__error">
                  {errors.parent_category.message}
                </p>
              )}
              <label className="label" htmlFor="select">
                Choose Explore Image
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
                      id="picture"
                    />
                  );
                }}
              />
              {errors.image && (
                <p className="validation__error">{errors.image.message}</p>
              )}
              {/*   <FileInput
                label="Set Image"
                placeholder="Choose an Image"
                onChange={handleImageChange}
              /> */}
            </Column>
            <Column className="col-md-4">
              <div className="text">
                <label htmlFor="meta_title">Meta Title</label>
                <input
                  type="text"
                  placeholder="Enter Position Number"
                  {...register("meta_title", {
                    pattern: {
                      value: /\S/,
                      message: "Enter Valid Meta title",
                    },
                  })}
                />
                {errors.meta_title && (
                  <p className="validation__error">
                    {errors.meta_title.message}
                  </p>
                )}
              </div>
              {/*   <Input
                name="meta_title"
                placeholder="Meta Title"
                htmlFor="meta-title"
                errorMessage={error.meta_title}
              /> */}
              <div className="textarea">
                <label htmlFor="textarea">Meta Description</label>
                <textarea
                  {...register("meta_title", {
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
              {/*    <TextArea
                name="meta_description"
                placeholder="Meta Description"
              /> */}
            </Column>
          </div>
          <div className="text-right">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Display>
    </div>
  );
};

export default CreateCategory;
