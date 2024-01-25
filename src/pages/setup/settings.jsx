import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import Display from "../../components/display";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useForm } from "react-hook-form";
import axios from "../../lib";
import "./settings.scss";

const Settings = () => {
  const {
    register,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.put("/settings", data);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/settings`);
        const data = response.data.setting;

        setValue("app_store_url", data.app_store_url);
        setValue("contact_email", data.contact_email);
        setValue("facebook_url", data.facebook_url);
        setValue("footer_copywrite", data.footer_copywrite);
        setValue("footer_info", data.footer_info);
        setValue("instagram_url", data.instagram_url);
        setValue("play_store_url", data.play_store_url);
        setValue("twitter_url", data.twitter_url);
        setValue("youtube_url", data.youtube_url);
        setValue("address", data.address);
        setValue("contact_number", data.contact_number);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="footer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="row">
          <Column className="col-md-12 button">
            <Button type="submit">Update</Button>
          </Column>
        </Row>
        <Row className="row">
          <Column className="col-md-6">
            <Display>
              <div className="text">
                <label htmlFor="name">Footer info</label>
                <input
                  type="text"
                  placeholder="Footer info"
                  {...register("footer_info", {
                    trim: true,
                    required: "Footer is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid info",
                    },
                  })}
                />
                {errors.footer_info && (
                  <p className="validation__error">
                    {errors.footer_info.message}
                  </p>
                )}
              </div>

              <div className="text">
                <label htmlFor="name">Footer Copy Write *</label>
                <input
                  type="text"
                  placeholder="footer copy write"
                  {...register("footer_copywrite", {
                    trim: true,
                    required: "Footer is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid info",
                    },
                  })}
                />
                {errors.footer_copywrite && (
                  <p className="validation__error">
                    {errors.footer_copywrite.message}
                  </p>
                )}
              </div>

              <div className="text">
                <label htmlFor="name">Contact Number</label>
                <input
                  type="text"
                  placeholder="contact number"
                  {...register("contact_number", {
                    required: "Mobile number is required",
                    trim: true,
                    pattern: {
                      value: /^\+880\s\d{4}\s\d{6}$/,
                      message: "Mobile formate +880 17...",
                    },
                  })}
                />
                {errors.contact_number && (
                  <p className="validation__error">
                    {errors.contact_number.message}
                  </p>
                )}
              </div>

              <div className="text">
                <label htmlFor="name">Contact Email</label>
                <input
                  type="text"
                  placeholder="contact email"
                  {...register("contact_email", {
                    trim: true,
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.contact_email && (
                  <p className="validation__error">
                    {errors.contact_email.message}
                  </p>
                )}
              </div>

              <div className="textarea">
                <label htmlFor="textarea">Address</label>
                <textarea
                  {...register("address", {
                    pattern: {
                      value: /\S/,
                      message: "Enter Valid address",
                    },
                  })}
                  id="textarea"
                  placeholder="Enter address"
                />
                {errors.address && (
                  <p className="validation__error">{errors.address.message}</p>
                )}
              </div>
            </Display>
          </Column>
          <Column className="col-md-6">
            <Display>
              <div className="text">
                <label htmlFor="name">Play store Link</label>
                <input
                  type="text"
                  placeholder="Play Store Link"
                  {...register("play_store_url", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid url",
                    },
                  })}
                />
                {errors.play_store_url && (
                  <p className="validation__error">
                    {errors.play_store_url.message}
                  </p>
                )}
              </div>

              <div className="text">
                <label htmlFor="name">App Store Link</label>
                <input
                  type="text"
                  placeholder="App Store Link"
                  {...register("app_store_url", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid url",
                    },
                  })}
                />
                {errors.app_store_url && (
                  <p className="validation__error">
                    {errors.app_store_url.message}
                  </p>
                )}
              </div>
            </Display>
            <Display>
              <div className="text">
                <label htmlFor="name">Facebook url</label>
                <input
                  type="text"
                  placeholder="facebook url"
                  {...register("facebook_url", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid url",
                    },
                  })}
                />
                {errors.facebook_url && (
                  <p className="validation__error">
                    {errors.facebook_url.message}
                  </p>
                )}
              </div>

              <div className="text">
                <label htmlFor="name">Youtube url</label>
                <input
                  type="text"
                  placeholder="youtube url"
                  {...register("youtube_url", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid url",
                    },
                  })}
                />
                {errors.youtube_url && (
                  <p className="validation__error">
                    {errors.youtube_url.message}
                  </p>
                )}
              </div>

              <div className="text">
                <label htmlFor="name">Twitter url</label>
                <input
                  type="text"
                  placeholder="twitter url"
                  {...register("twitter_url", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid url",
                    },
                  })}
                />
                {errors.twitter_url && (
                  <p className="validation__error">
                    {errors.twitter_url.message}
                  </p>
                )}
              </div>

              <div className="text">
                <label htmlFor="name">Instagram url</label>
                <input
                  type="text"
                  placeholder="instagram url"
                  {...register("instagram_url", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid url",
                    },
                  })}
                />
                {errors.instagram_url && (
                  <p className="validation__error">
                    {errors.instagram_url.message}
                  </p>
                )}
              </div>
            </Display>
          </Column>
        </Row>
      </form>
    </div>
  );
};

export default Settings;
