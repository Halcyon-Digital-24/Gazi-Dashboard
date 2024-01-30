import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Row from "../table/row";
import Column from "../table/column";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import "./index.scss";
import { createMenu } from "../../redux/menus/menuSlice";
import { useAppDispatch } from "../../redux/hooks";

const MenuCreate = ({ position }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      position: position,
    },
  });
  const dispatch = useAppDispatch();
  const onSubmit = (data) => {
    dispatch(createMenu(data));
  };

  return (
    <div className="foo_ter">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="row">
          <Column className="col-md-4">
            <div className="text">
              <input
                type="text"
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
          <Column className="col-md-1"></Column>
        </Row>
      </form>
    </div>
  );
};

export default MenuCreate;
