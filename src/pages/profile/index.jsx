import { useEffect, useState } from "react";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { Controller, useForm } from "react-hook-form";
import axios from "../../lib";
import { useNavigate, useParams } from "react-router-dom";
import { API_ROOT } from "../../constants";
import Input from "../../components/forms/text-input";
import { toast } from "react-toastify";

const Profile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [prevImage, setPrevImage] = useState("");
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "confirm_password") {
        formData.append(key, value);
      }
    });
    try {
      await axios.patch(`/users/${slug}`, formData);
      navigate("/");
    } catch (error) {
      toast(error.response.data.message);
    }
  };

  const watchPassword = (value) => {
    setPassword(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/users/${slug}`);
        setValue("name", data.data.name);
        setValue("email", data.data.email);
        setValue("mobile", data.data.mobile);
        setValue("address", data.data.address);
        setValue("image", data.data.image);
        setPrevImage(data.data.image);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div>
      <CardBody header="Admin Profile" to="#" />

      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Name"
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid name",
                },
              })}
            />
            {errors.name && (
              <p className="validation__error">{errors.name.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Email"
              {...register("email", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Enter a valid name",
                },
              })}
            />
            {errors.email && (
              <p className="validation__error">{errors.email.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="name">Address</label>
            <input
              type="text"
              placeholder="Address"
              {...register("address", {
                pattern: {
                  value: /\S/,
                  message: "Enter a valid address",
                },
              })}
            />
            {errors.address && (
              <p className="validation__error">{errors.address.message}</p>
            )}
          </div>
          <label className="label" htmlFor="select">
            Choose Explore Image
          </label>
          <Controller
            control={control}
            name={"image"}
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Input
                  {...field}
                  value={value?.fileName}
                  onChange={(event) => {
                    onChange(event.target.files[0]);
                  }}
                  type="file"
                  id="picture"
                />
              );
            }}
          />
          {errors.image && (
            <p className="validation__error">{errors.image.message}</p>
          )}
          <br />

          <img src={`${API_ROOT}/images/user/${prevImage}`} alt="profile" />

          <div className="text">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                pattern: {
                  value: /\S/,
                  message: "Enter a valid password",
                },
              })}
              onChange={(e) => watchPassword(e.target.value)}
            />
            {errors.password && (
              <p className="validation__error">{errors.password.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirm_password", {
                required: password ? "Confirm Password is required" : false,
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirm_password && (
              <p className="validation__error">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default Profile;
