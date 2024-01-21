import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import Loader from "../../components/loader";
import Column from "../../components/table/column";
import { API_URL } from "../../constants";
import axios from "../../lib";
import {
  getCategories,
  reset,
  updateCategory,
} from "../../redux/category/categorySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const UpdateCategory = () => {
  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { slug } = useParams();
  const { categories, isUpdate, error } = useAppSelector(
    (state) => state.category
  );
  const [loading, setIsLoading] = useState(true);

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    dispatch(updateCategory({ slug, categoryData: formData }));
  };

  useEffect(() => {
    if (isUpdate) {
      navigate("/category");
    }
    dispatch(getCategories({ page: 1, limit: 50 }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isUpdate, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/categories/${slug}`);
        const data = response.data.data;

        // Set state values based on the fetched data
        setValue("title", data.title);
        setValue("slug", data.slug);
        setValue("parent_category", data.parent_category);
        setValue("image", data.image);
        setValue("meta_title", data.meta_title);
        setValue("meta_description", data.meta_description);
        setValue("order_id", data.order_id);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching category data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <CardBody header="Update Category" to="/category" text="back" />
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
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Display>
    </div>
  );
};

export default UpdateCategory;
