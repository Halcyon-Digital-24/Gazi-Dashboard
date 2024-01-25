import React, { useEffect } from "react";
import Display from "../../components/display";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../../components/button";
import { toast } from "react-toastify";
import Input from "../../components/forms/text-input";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  updateSettings,
  reset,
  getSettings,
} from "../../redux/settings/settingSlice";
import { API_ROOT } from "../../constants";

const DynamicImages = () => {
  const dispatch = useAppDispatch();
  const { isUpdate, setting, message } = useAppSelector(
    (state) => state.settings
  );
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    dispatch(updateSettings(formData));
  };

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch, message, isUpdate]);

  useEffect(() => {
    dispatch(getSettings());
    setValue("logo", setting.logo);
    setValue("popup_image", setting.popup_image);
    setValue("favicon", setting.favicon);
  }, [dispatch, isUpdate, setting.logo, setting.favicon, setting.popup_image]);

  return (
    <Display>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="label" htmlFor="select">
          Logo
        </label>
        <Controller
          control={control}
          rules={{ required: "Logo is required" }}
          name={"logo"}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <Input
                {...field}
                value={value?.fileName}
                onChange={(event) => {
                  onChange(event.target.files[0]);
                }}
                type="file"
              />
            );
          }}
        />
        {errors.logo && (
          <p className="validation__error">{errors.logo.message}</p>
        )}

        <img src={`${API_ROOT}/images/setting/${setting.logo}`} alt="logo" />

        <label className="label" htmlFor="select">
          Favicon
        </label>
        <Controller
          control={control}
          rules={{ required: "favicon is required" }}
          name={"favicon"}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <Input
                {...field}
                value={value?.fileName}
                onChange={(event) => {
                  onChange(event.target.files[0]);
                }}
                type="file"
              />
            );
          }}
        />
        {errors.favicon && (
          <p className="validation__error">{errors.favicon.message}</p>
        )}

        <img
          src={`${API_ROOT}/images/setting/${setting.favicon}`}
          alt="favicon"
        />
        <label className="label" htmlFor="select">
          Popup
        </label>
        <Controller
          control={control}
          rules={{ required: "Popup is required" }}
          name={"popup_image"}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <Input
                {...field}
                value={value?.fileName}
                onChange={(event) => {
                  onChange(event.target.files[0]);
                }}
                type="file"
              />
            );
          }}
        />
        {errors.popup_image && (
          <p className="validation__error">{errors.popup_image.message}</p>
        )}

        <img
          src={`${API_ROOT}/images/setting/${setting.popup_image}`}
          alt="popup"
        />
        <div>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Display>
  );
};

export default DynamicImages;
