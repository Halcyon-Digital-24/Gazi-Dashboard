import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Column from "../../components/table/column";
import "./index.scss";
import { Button } from "../../components/button";
import axios from "../../lib";
import { toast } from "react-toastify";

const SettingPage = () => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/colors", data);
      // console.log(response);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/colors");
        setValue("primary_text", data.primary_text);
        setValue("secondary_tex", data.secondary_tex);
        setValue("tertiary_text", data.tertiary_text);
        setValue("primary_background", data.primary_background);
        setValue("secondary_background", data.secondary_background);
        setValue("tertiary_background", data.tertiary_background);
        setValue("border", data.border);
        setValue("active", data.active);
        setValue("disable", data.disable);
        setValue("success", data.success);
        setValue("info", data.info);
        setValue("warning", data.warning);
        setValue("error", data.error);
        setValue("link", data.link);
        setValue("hover", data.hover);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <CardBody
        header="Basic Settings
"
        text="Back"
        isHide
      />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <Column className="col-md-6">
              <div className="color-input">
                <label htmlFor="name">Primary Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("primary_text", {
                    trim: true,
                    required: "Title is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.primary_text && (
                  <p className="validation__error">
                    {errors.primary_text.message}
                  </p>
                )}
              </div>
              <div className="color-input">
                <label htmlFor="name">Secondary Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("secondary_tex", {
                    trim: true,
                    required: "Title is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.secondary_tex && (
                  <p className="validation__error">
                    {errors.secondary_tex.message}
                  </p>
                )}
              </div>
              <div className="color-input">
                <label htmlFor="name">Tertiary Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("tertiary_text", {
                    trim: true,
                    required: "Tertiary color is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.tertiary_text && (
                  <p className="validation__error">
                    {errors.tertiary_text.message}
                  </p>
                )}
              </div>
              <div className="color-input">
                <label htmlFor="name">Primary Background Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("primary_background", {
                    trim: true,
                    required: "primary background color is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.primary_background && (
                  <p className="validation__error">
                    {errors.primary_background.message}
                  </p>
                )}
              </div>
              <div className="color-input">
                <label htmlFor="name">Secondary Background Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("secondary_background", {
                    trim: true,
                    required: "secondary background color is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.secondary_background && (
                  <p className="validation__error">
                    {errors.secondary_background.message}
                  </p>
                )}
              </div>
              <div className="color-input">
                <label htmlFor="name">Tertiary Background Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("tertiary_background", {
                    trim: true,
                    required: "tertiary background color is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.tertiary_background && (
                  <p className="validation__error">
                    {errors.tertiary_background.message}
                  </p>
                )}
              </div>
              <div className="color-input">
                <label htmlFor="name">Hover Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("hover", {
                    trim: true,
                    required: "hover color is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.hover && (
                  <p className="validation__error">{errors.hover.message}</p>
                )}
              </div>
              <div className="color-input">
                <label htmlFor="name">Link Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("link", {
                    trim: true,
                    required: "link color is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid link",
                    },
                  })}
                />
                {errors.link && (
                  <p className="validation__error">{errors.link.message}</p>
                )}
              </div>
            </Column>
            <Column className="col-md-6">
              <div className="color-input">
                <label htmlFor="name">Border Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("border", {
                    trim: true,
                    required: "border color is required",
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
              <div className="color-input">
                <label htmlFor="name">Active Color</label>
                <input
                  type="color"
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
              <div className="color-input">
                <label htmlFor="name">Disable Color</label>
                <input
                  type="color"
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
              <div className="color-input">
                <label htmlFor="name">Success Color</label>
                <input
                  type="color"
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
              <div className="color-input">
                <label htmlFor="name">Info Color</label>
                <input
                  type="color"
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
              <div className="color-input">
                <label htmlFor="name">Warning Color</label>
                <input
                  type="color"
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
              <div className="color-input">
                <label htmlFor="name">Error Color</label>
                <input
                  type="color"
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
            </Column>
          </div>
          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default SettingPage;
