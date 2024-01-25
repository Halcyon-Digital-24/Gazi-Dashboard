import React, { useEffect } from "react";
import Display from "../../components/display";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import axios from "../../lib";
import { toast } from "react-toastify";

const CustomScript = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`/settings`, data);
      toast.success(response.data.message);
    } catch (error) {
      console.log("Script update error" + error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/settings");
        const data = response.data.setting;
        setValue("google_analytics", data.google_analytics);
        setValue("facebook_pixel", data.facebook_pixel);
        setValue("header_script", data.header_script);
        setValue("footer_script", data.footer_script);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Display>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="textarea">
          <label htmlFor="textarea">Google analytics</label>
          <textarea
            {...register("google_analytics", {
              trim: true,
              pattern: {
                value: /\S/,
                message: "Enter a valid analytics script",
              },
            })}
            id="textarea"
            placeholder="Enter a google analytics code"
          />
          {errors.google_analytics && (
            <p className="validation__error">
              {errors.google_analytics.message}
            </p>
          )}
        </div>
        <div className="textarea">
          <label htmlFor="textarea">Facebook Pixel</label>
          <textarea
            {...register("facebook_pixel", {
              trim: true,
              pattern: {
                value: /\S/,
                message: "Enter Valid pixel script",
              },
            })}
            id="textarea"
            placeholder="Enter a pixel script"
          />
          {errors.facebook_pixel && (
            <p className="validation__error">{errors.facebook_pixel.message}</p>
          )}
        </div>
        <div className="textarea">
          <label htmlFor="textarea">Header Script</label>
          <textarea
            {...register("header_script", {
              trim: true,
              pattern: {
                value: /\S/,
                message: "Enter a valid script",
              },
            })}
            id="textarea"
            placeholder="header script"
          />
          {errors.header_script && (
            <p className="validation__error">{errors.header_script.message}</p>
          )}
        </div>
        <div className="textarea">
          <label htmlFor="textarea">Footer Script</label>
          <textarea
            {...register("footer_script", {
              trim: true,
              pattern: {
                value: /\S/,
                message: "Enter a valid script",
              },
            })}
            id="textarea"
            placeholder="footer script"
          />
          {errors.footer_script && (
            <p className="validation__error">{errors.footer_script.message}</p>
          )}
        </div>
        {/*  <TextArea
          label="google analytics"
          value={settings.google_analytics}
          name="google_analytics"
          onChange={handleChange}
        /> */}
        {/*  <TextArea
          label="Facebook pixel"
          value={settings.facebook_pixel}
          name="facebook_pixel"
          onChange={handleChange}
        /> */}
        {/*  <TextArea
          label="Footer script"
          value={settings.footer_script}
          name="footer_script"
          onChange={handleChange}
        /> */}
        {/* <TextArea
          label="Header Script"
          value={settings.header_script}
          name="header_script"
          onChange={handleChange}
        /> */}
        <div>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Display>
  );
};

export default CustomScript;
