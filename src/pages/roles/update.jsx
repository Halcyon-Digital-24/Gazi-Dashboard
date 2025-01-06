import React, { useEffect, useState } from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { useForm } from "react-hook-form";
import ToggleButton from "../../components/forms/checkbox";
import { Button } from "../../components/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectRole, reset, updateRole } from "../../redux/roles/roleSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../lib";

const UpdateRole = () => {
  const {
    register,
    setError,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUpdate, error, isError, message } = useAppSelector(selectRole);
  const [permissions, setPermissions] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch role details
  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const { data } = await axios.get(`/roles/${slug}`);
        const role = data.data[0];
        setRoleName(role.name); // Set role name
        setPermissions(role.permissions); // Initialize permissions
        setIsLoading(false);
      } catch (err) {
        console.error("Role data fetch error: ", err);
        toast.error("Failed to load role details");
        setIsLoading(false);
      }
    };

    fetchRoleDetails();
  }, [slug]);

  const addOptions = (item) => {
    setPermissions((prevPermissions) =>
      prevPermissions.includes(item)
        ? prevPermissions.filter((perm) => perm !== item) // Remove if exists
        : [...prevPermissions, item] // Add if not exists
    );
  };

  const onSubmit = (data) => {
    if (permissions.length > 0) {
      dispatch(
        updateRole({
          id: slug,
          roleData: { ...data, permissions },
        })
      );
    } else {
      toast.error("Please select at least one permission");
    }
  };

  useEffect(() => {
    if (isError) {
      setError("name", { type: "validate", message: error.name });
    }
    if (isUpdate) {
      navigate("/roles");
      toast.success(message);
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, navigate, isError, isUpdate]);

  return (
    <div>
      <CardBody header="Role Information" to="/roles" text="Back" />
      <Display>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="name"
                defaultValue={roleName}
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
            <div>
              {[
                "categories",
                "products",
                "orders",
                "refund",
                "blogs",
                "customers",
                "notifications",
                "videos",
                "faqs",
                "marketing",
                "ads",
                "support",
                "payment",
                "setting",
                "staff",
              ].map((permission) => (
                <div key={permission} className="row ">
                  <div className="col-md-8">{permission.charAt(0).toUpperCase() + permission.slice(1)}</div>
                  <div className="col-md-4 mt-5">
                    <ToggleButton
                      isChecked={permissions.includes(permission)}
                      onClick={() => addOptions(permission)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button type="submit">Update</Button>
          </form>
        )}
      </Display>
    </div>
  );
};

export default UpdateRole;
