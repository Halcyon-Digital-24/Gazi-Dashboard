import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import Column from "../../components/table/column";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createKeypont, reset } from "../../redux/service/keypointSlice";

const CreateService = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isCreate, message } = useAppSelector((state) => state.services);

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    dispatch(createKeypont(formData));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/setup/services");
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, message, navigate]);

  return (
    <div>
      <CardBody header="Create Service" to="/setup/services" text="Back" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Display>
          <div className="row">
            <Column className="col-md-6 col-sm-12">
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
                  <label htmlFor="name">Sub Title</label>
                  <input
                    type="text"
                    placeholder="Enter sub title"
                    {...register("subtitle", {
                      trim: true,
                      required: "sub title is required",
                      pattern: {
                        value: /\S/,
                        message: "Enter a valid sub title",
                      },
                    })}
                  />
                  {errors.subtitle && (
                    <p className="validation__error">
                      {errors.subtitle.message}
                    </p>
                  )}
                </div>
                <div className="text">
                  <label htmlFor="name">Url *</label>
                  <input
                    type="text"
                    placeholder="Enter url"
                    {...register("url", {
                      required: "url is required",
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
              </Display>
            </Column>
            <Column className="col-md-6 col-sm-12">
              <Display>
                <label className="label" htmlFor="select">
                  Choose Icon
                </label>
                <Controller
                  control={control}
                  name={"image"}
                  rules={{ required: "Icon is required" }}
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
                <div className="select-wrapper">
                  <select
                    id="select"
                    className="select"
                    {...register("group_by", {
                      required: "Position is required",
                    })}
                    htmlFor="Choose Parent category"
                    name="group_by"
                  >
                    <option value="">select position</option>
                    <option value="home">Home</option>
                    <option value="product">Product</option>
                    <option value="other">Others</option>
                  </select>
                </div>

                {errors.group_by && (
                  <p className="validation__error">{errors.group_by.message}</p>
                )}
                {/*   <Select
                  name="group_by"
                  onChange={handleBannerData}
                  label="Select Group"
                  value={group as string}
                  options={options}
                  required
                /> */}
              </Display>
            </Column>
          </div>

          <Button type="submit">Create</Button>
        </Display>
      </form>
    </div>
  );
};

export default CreateService;
