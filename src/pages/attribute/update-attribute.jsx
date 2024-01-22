import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { Button } from "../../components/button";
import axios from "../../lib";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateAttribute = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleUpdateAttributes = async (data) => {
    try {
      const response = await axios.patch(`/attributes/${slug}`, data);
      toast.success(response.data.message);
      navigate("/attributes");
    } catch (error) {
      // Handle error

      console.error("Failed to post attributes", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/attributes/${slug}`);
        setValue("name", response.data.data.name);
        setValue("value", response.data.data.value);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, [slug]);
  return (
    <div>
      <CardBody header="Attributes" to="/attributes" text="Back" />
      <Display>
        <form onSubmit={handleSubmit(handleUpdateAttributes)}>
          <div className="text">
            <label htmlFor="name">Attribute Name *</label>
            <input
              type="text"
              placeholder="Attribute Name"
              {...register("name", {
                required: "Attribute Name is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid Name",
                },
              })}
            />
            {errors.name && (
              <p className="validation__error">{errors.name.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="value">Values *</label>
            <input
              type="text"
              placeholder="use comma(,) for separate attribute like x,y"
              {...register("value", {
                required: "Value is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid value format",
                },
              })}
            />
            {errors.value && (
              <p className="validation__error">{errors.value.message}</p>
            )}
          </div>
          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateAttribute;
