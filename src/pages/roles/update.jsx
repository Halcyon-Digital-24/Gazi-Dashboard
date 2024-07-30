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
  // console.log(slug);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUpdate, error, isError, message } = useAppSelector(selectRole);
  const [permissions, setPermissions] = useState([]);

  const [getRoles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/roles/${slug}`);
        setRoles(data.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Role data fetch error: " + error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (getRoles.length > 0) {
      const matchedRole = getRoles.find(role => role.id.toString() === slug);
      if (matchedRole) {
        setRoleName(matchedRole.name);
      } else {
        setRoleName('Role not found');
      }
    }
  }, [getRoles, slug]);

  const addOptions = (item) => {
    const updatedPermissions = permissions.includes(item)
      ? permissions.filter((role) => role !== item)
      : [...permissions, item];
    setPermissions(updatedPermissions);
  };
  const onSubmit = (data) => {
    if (permissions.length > 0) {
      dispatch(
        updateRole({
          id: slug,
          roleData: { ...data, permissions: permissions },
        })
      );
    } else {
      toast.error("Please select minimum 1 permission");
    }
  };

  useEffect(() => {
    if (isError) {
      setError("name", { type: "validate", message: error.name });
    }
    if (isUpdate) {
      navigate("/roles");
      toast.success(`${message}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, navigate, isError, isUpdate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/roles/${slug}`);
        setPermissions(JSON.parse(data.data[0].permissions));
      } catch (error) {
        console.log("role data fetch error" + error);
      }
    };
    fetchData();
  }, [slug]);

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
            <div className="row">
              <div className="col-md-8">Category</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("categories")}
                  onClick={() => addOptions("categories")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Products</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("products")}
                  onClick={() => addOptions("products")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">All Orders</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("orders")}
                  onClick={() => addOptions("orders")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Refund</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("refund")}
                  onClick={() => addOptions("refund")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Blogs</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("blogs")}
                  onClick={() => addOptions("blogs")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Customer</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("customers")}
                  onClick={() => addOptions("customers")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Notifications</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("notifications")}
                  onClick={() => addOptions("notifications")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Videos</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("videos")}
                  onClick={() => addOptions("videos")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Faqs</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("faqs")}
                  onClick={() => addOptions("faqs")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Marketing</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("marketing")}
                  onClick={() => addOptions("marketing")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Ads Banner</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("ads")}
                  onClick={() => addOptions("ads")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Support</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("support")}
                  onClick={() => addOptions("support")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Payment</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("payment")}
                  onClick={() => addOptions("payment")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Setup & Configurations</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("setting")}
                  onClick={() => addOptions("setting")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Staffs</div>
              <div className="col-md-4">
                <ToggleButton
                  isChecked={permissions.includes("staff")}
                  onClick={() => addOptions("staff")}
                />
              </div>
            </div>
          </div>
          <Button type="submit">Update</Button>
        </form>
        )}
      </Display>
    </div>
  );
};

export default UpdateRole;
