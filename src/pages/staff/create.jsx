import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import axios from "../../lib";
import { useForm } from "react-hook-form";

const CreateProfile = () => {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <CardBody header="Admin Create Profile" to="/staffs" text="Back" />

      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="name"
              {...register("name", {
                trim: true,
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
            <label htmlFor="name">Emil</label>
            <input
              type="text"
              placeholder="Email"
              {...register("email", {
                trim: true,
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="validation__error">{errors.email.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="name">Mobile</label>
            <input
              type="text"
              placeholder="Mobile"
              {...register("mobile", {
                trim: true,
                required: "Mobile is required",
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message: "Enter a valid email (start with 01)",
                },
              })}
            />
            {errors.mobile && (
              <p className="validation__error">{errors.mobile.message}</p>
            )}
          </div>
          <div className="text">
            <label htmlFor="name">Password</label>
            <input
              type="text"
              placeholder="Password"
              {...register("password", {
                trim: true,
                required: "Password is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid password",
                },
              })}
            />
            {errors.password && (
              <p className="validation__error">{errors.password.message}</p>
            )}
          </div>
          <>
            <label className="label" htmlFor="select">
              Role
            </label>
            <div className="select-wrapper">
              <select
                id="role"
                className="select"
                {...register("role", {
                  required: "Please select role",
                })}
                htmlFor="role"
                name="role"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {errors.role && (
              <p className="validation__error">{errors.role.message}</p>
            )}
          </>
          <Button type="submit">Create</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateProfile;
