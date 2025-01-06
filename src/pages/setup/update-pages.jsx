import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Display from "../../components/display";
import DescriptionInput from "../../components/description";
import Column from "../../components/table/column";
import { Button } from "../../components/button";
import axios from "../../lib";
import { API_URL } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import CardBody from "../../components/card-body";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { reset, updatePages } from "../../redux/pages/pageSlice";
import { toast } from "react-toastify";

const UpdatePage = () => {
  const {
    register,
    setValue,
    setError,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUpdate } = useAppSelector((state) => state.pages);

  const onSubmit = async (data) => {
    dispatch(updatePages({ id: slug, pageData: data }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/pages/${slug}`);
        const data = response.data.data;

        // Set state values based on the fetched data
        setValue("title", data.title);
        setValue("slug", data.slug);
        setValue("content", data.content);
        setValue("meta_title", data.meta_title);
        setValue("meta_description", data.meta_description);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (isUpdate) {
      toast.success("Page updated successfully");
      navigate("/setup/pages");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, navigate, dispatch]);

  return (
    <div>
      <CardBody header="Update Page" to="/setup/pages" text="Back" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <Column className="col-md-8 col-sm-12">
            <Display>
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
              <Controller
                name="content"
                rules={{ required: "Description is required" }}
                control={control}
                render={({ field }) => (
                  <DescriptionInput
                    value={field.value}
                    setValue={field.onChange}
                  />
                )}
              />
              {errors.content && (
                <p className="validation__error">{errors.content.message}</p>
              )}
            </Display>
          </Column>
          <Column className="col-md-4 col-sm-12">
            <Display>
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
              <Button type="submit">Update Page</Button>
            </Display>
          </Column>
        </div>
      </form>
    </div>
  );
};

export default UpdatePage;
