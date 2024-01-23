import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import axios from "../../lib";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { reset, updateMenus } from "../../redux/menus/menuSlice";

const UpdateMenu = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isUpdate } = useAppSelector((state) => state.menu);
  const { slug: menuSlug } = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const onSubmit = (data) => {
    dispatch(updateMenus({ menuData: data, id: menuSlug }));
  };

  useEffect(() => {
    if (isUpdate) {
      navigate("/setup/menus");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, navigate, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/menu/${menuSlug}`);
        setValue("name", res.data.data.name);
        setValue("slug", res.data.data.slug);
        setValue("position", res.data.data.position);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [menuSlug]);

  return (
    <div>
      <CardBody header="Update Menu" to="/setup/menus" text="remove" />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text">
            <label htmlFor="name">Menu Name *</label>
            <input
              type="text"
              placeholder="name"
              {...register("name", {
                trim: true,
                required: "Name is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid title",
                },
              })}
            />
            {errors.name && (
              <p className="validation__error">{errors.name.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="name">Url *</label>
            <input
              type="text"
              placeholder="url"
              {...register("slug", {
                trim: true,
                required: "Url is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid url",
                },
              })}
            />
            {errors.slug && (
              <p className="validation__error">{errors.slug.message}</p>
            )}
          </div>

          <label className="label">Select Position</label>
          <div className="select-wrapper">
            <select
              id="select"
              className="select"
              {...register("position", {
                required: "Position is required",
              })}
              htmlFor="position"
            >
              <option value="">Select Options</option>
              <option value="help">Help</option>
              <option value="customer_service">Customer Service</option>
              <option value="home_appliance">Gazi Home Appliance</option>
            </select>
          </div>
          {errors.position && (
            <p className="validation__error">{errors.position.message}</p>
          )}

          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateMenu;
