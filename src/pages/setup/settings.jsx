import { useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import TextArea from "../../components/forms/textarea";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getSettings,
  reset,
  updateSettings,
} from "../../redux/settings/settingSlice";
import "./settings.scss";

const Settings = () => {
  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /*  useEffect(() => {
    if (isUpdate) {
      toast.success("Updated successfully");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, dispatch]);

  useEffect(() => {
    dispatch(getSettings());
    setSettings(setting);
  }, [dispatch, isSuccess, isUpdate]); */

  return (
    <div className="footer">
      <form onSubmit={handleSubmit}>
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
              {/*  <Input
                onChange={handleChange}
                label="Footer info"
                htmlFor="info"
                name="footer_info"
                value={settings.footer_info}
                required
              /> */}
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
              {/*  <Input
                onChange={handleChange}
                label="Footer copy write"
                htmlFor="copywrite"
                value={settings.footer_copywrite}
                name="footer_copywrite"
                required
              /> */}
              <div className="text">
                <label htmlFor="name">Contact Number</label>
                <input
                  type="text"
                  placeholder="contact number"
                  {...register("contact_number", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid number",
                    },
                  })}
                />
                {errors.contact_number && (
                  <p className="validation__error">
                    {errors.contact_number.message}
                  </p>
                )}
              </div>
              {/*  <Input
                onChange={handleChange}
                label="Contact Number"
                htmlFor="mobile-No"
                value={settings.contact_number}
                name="contact_number"
                required
              /> */}
              <div className="text">
                <label htmlFor="name">Contact Email</label>
                <input
                  type="text"
                  placeholder="contact email"
                  {...register("contact_email", {
                    trim: true,
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.contact_email && (
                  <p className="validation__error">
                    {errors.contact_email.message}
                  </p>
                )}
              </div>
              {/* <Input
                onChange={handleChange}
                label="Contact Email"
                type="email"
                value={settings.contact_email}
                name="contact_email"
                htmlFor="email"
                required
              /> */}
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
              {/*    <TextArea
                label="Address"
                value={settings.address}
                onChange={handleChange}
                name="address"
                required
              /> */}
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
              {/*  <Input
                name="play_store_url"
                onChange={handleChange}
                htmlFor="play-store"
                label="Play Store Link"
                value={settings.play_store_url}
              /> */}
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
              {/*   <Input
                name="app_store_url"
                onChange={handleChange}
                htmlFor="app-store"
                label="App Store Link"
                value={settings.app_store_url}
              /> */}
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
              {/*  <Input
                onChange={handleChange}
                label="facebook url"
                value={settings.facebook_url}
                name="facebook_url"
                htmlFor="f-url"
              /> */}
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
              {/*   <Input
                onChange={handleChange}
                label="youtube url"
                value={settings.youtube_url}
                name="youtube_url"
                htmlFor="y-url"
              /> */}
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
              {/*   <Input
                onChange={handleChange}
                label="twitter url"
                value={settings.twitter_url}
                name="twitter_url"
                htmlFor="t-url"
              /> */}
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
              {/*    <Input
                onChange={handleChange}
                label="instagram url"
                value={settings.instagram_url}
                name="instagram_url"
                htmlFor="t-url"
              /> */}
            </Display>
          </Column>
        </Row>
      </form>
    </div>
  );
};

export default Settings;
