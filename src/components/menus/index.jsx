import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Row from "../table/row";
import Column from "../table/column";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import "./index.scss";
import { deleteMenu, updateMenus } from "../../redux/menus/menuSlice";
import { useAppDispatch } from "../../redux/hooks";

const FooterOne = ({ name, slug, position, id }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const onSubmit = (data) => {
    dispatch(updateMenus({ menuData: data, id }));
  };
  const handleDelete = () => {
    dispatch(deleteMenu([id]));
  };

  useEffect(() => {
    setValue("name", name);
    setValue("slug", slug);
    setValue("position", position);
  }, [name, slug, position]);

  return (
    <div className="foo_ter">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="row">
          <Column className="col-md-4">
            <div className="text">
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
          </Column>
          <Column className="col-md-6">
            <div className="text">
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
          </Column>
          <Column className="col-md-1">
            <div className="icon">
              <button type="submit">
                <FaCheck />
              </button>
            </div>
          </Column>
          <Column className="col-md-1">
            <div className="icon" onClick={handleDelete}>
              <RxCross2 />
            </div>
          </Column>
        </Row>
      </form>
    </div>
  );
};

export default FooterOne;
