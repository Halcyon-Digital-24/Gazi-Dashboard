import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import axios from "../../lib";
import { useForm } from "react-hook-form";

const UpdateShipping = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors }} = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/shippings/${slug}`);
        setValue("location", res.data.data.location);
        setValue("price", res.data.data.price);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error saving data';
        toast.error(errorMessage);
      }
    };
    fetchData();
  }, [slug]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(`/shippings/${slug}`, data);
      navigate('/shipping');
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error saving data';
    toast.error(errorMessage);
    }
  };

  return (
    <div>
      <CardBody header="Update Shipping" to="/shipping" text="Back" />

      <Display>
        <form  onSubmit={handleSubmit(onSubmit)}>
     
        <div className="text">
            <label htmlFor="location">District Name</label>
            <input
              type="text"
              {...register("location", {
                required: "Location is required",
                pattern: {
                  value: /^[a-zA-Z ]+$/,
                  message: "Enter a valid location name"
                }
              })}
            />
            {errors.location && (
              <p className="validation__error">{errors.location.message}</p>
            )}
          </div>

          <div className="text">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              {...register("price", {
                required: "Price is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Enter a valid number for price"
                }
              })}
            />
            {errors.price && (
              <p className="validation__error">{errors.price.message}</p>
            )}
          </div>

          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateShipping;
