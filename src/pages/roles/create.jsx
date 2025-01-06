import React, { useEffect, useState } from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { useForm } from "react-hook-form";
import ToggleButton from "../../components/forms/checkbox";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createRole, selectRole, reset } from "../../redux/roles/roleSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./index.scss";

const PermissionToggle = ({ label, value, isChecked, onToggle }) => (
  <div className="row">
    <div className="col-md-8">{label}</div>
    <div className="col-md-4 mt-5">
      <ToggleButton isChecked={isChecked} onClick={() => onToggle(value)} />
    </div>
  </div>
);

const CreateRole = () => {
  const { register, setError, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCreate, error, isError } = useAppSelector(selectRole);
  const [permissions, setPermissions] = useState([]);

  const addOptions = (item) => {
    const updatedPermissions = permissions.includes(item)
      ? permissions.filter((perm) => perm !== item)
      : [...permissions, item];
    setPermissions(updatedPermissions);
  };

  const onSubmit = (data) => {
    if (permissions.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }
    dispatch(createRole({ ...data, permissions }));
  };

  useEffect(() => {
    if (isError) {
      setError("name", { type: "validate", message: error.name });
      toast.error(error.message || "Error creating role.");
    }
    if (isCreate) {
      navigate("/roles");
      toast.success("Role created successfully!");
    }
    return () => dispatch(reset());
  }, [dispatch, navigate, isError, isCreate]);

  return (
    <div>
      <CardBody header="Role Information" to="/roles" text="Back" />
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
          <div className="permissions">
            {[
              { label: "Category", value: "categories" },
              { label: "Products", value: "products" },
              { label: "All Orders", value: "orders" },
              { label: "Refund", value: "refund" },
              { label: "Blogs", value: "blogs" },
              { label: "Customer", value: "customers" },
              { label: "Notifications", value: "notifications" },
              { label: "Videos", value: "videos" },
              { label: "Faqs", value: "faqs" },
              { label: "Marketing", value: "marketing" },
              { label: "Ads Banner", value: "ads" },
              { label: "Support", value: "support" },
              { label: "Payment", value: "payment" },
              { label: "Setup & Configurations", value: "setting" },
              { label: "Staffs", value: "staff" },
            ].map((perm) => (
              <PermissionToggle
                key={perm.value}
                label={perm.label}
                value={perm.value}
                isChecked={permissions.includes(perm.value)}
                onToggle={addOptions}
              />
            ))}
          </div>
          <Button type="submit">Create</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateRole;
