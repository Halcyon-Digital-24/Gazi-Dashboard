import { useEffect } from "react";
import Display from "../../components/display";
import { useForm, Controller } from "react-hook-form";
import DescriptionInput from "../../components/description";
import Column from "../../components/table/column";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import { createPages, reset } from "../../redux/pages/pageSlice";
import CardBody from "../../components/card-body";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const {
    register,
    setError,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCreate, isError, errorMessage, error, message } = useAppSelector(
    (state) => state.pages
  );

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/setup/pages");
    }
    if (isError) {
      setError("slug", { type: "validate", message: error.slug });
      toast.error(`${errorMessage}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, navigate, dispatch, message, isError, errorMessage]);

  const onSubmit = async (data) => {
    dispatch(createPages(data));
  };

  return (
    <div>
      <CardBody header="Create a new Page" to="/setup/pages" text="Back" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <Column className="col-md-8">
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
          <Column className="col-md-4">
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
              <Button type="submit">Save Page</Button>
            </Display>
          </Column>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
