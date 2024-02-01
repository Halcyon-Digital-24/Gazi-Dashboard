import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getRole, selectRole } from "../../redux/roles/roleSlice";
import { useEffect } from "react";
import { createStaff, selectStaff, reset } from "../../redux/staff/staffSlice";

const CreateProfile = () => {
  const {
    register,
    setError,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role_id: 1,
    },
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector(selectRole);
  const { error, errorMessage, isError, message, isCreate } =
    useAppSelector(selectStaff);
  const onSubmit = (data) => {
    dispatch(createStaff(data));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/staffs");
    }
    if (isError) {
      toast.error(`${errorMessage}`);
      setError("email", { type: "validate", message: error.email });
      setError("mobile", { type: "validate", message: error.mobile });
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isCreate, isError, errorMessage, message, navigate]);

  useEffect(() => {
    dispatch(getRole({ page: 1, limit: 50 }));
  }, [dispatch]);

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
              type="password"
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
                id="access_id"
                className="select"
                {...register("access_id", {
                  required: "Please select role",
                })}
                htmlFor="access_id"
                name="access_id"
              >
                <option value="">Select Role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role.id}>
                    {role.name}
                  </option>
                ))}
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
