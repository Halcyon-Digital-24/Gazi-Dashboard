import React from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { useForm, Controller } from "react-hook-form";
import ToggleButton from "../../components/forms/checkbox";
import { Button } from "../../components/button";

const UpdateRole = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div>
      <CardBody header="Update Role Information" to="/roles" text="Back" />
      <Display>
        <form>
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
          <div>
            <div className="row">
              <div className="col-md-8">Products</div>
              <div className="col-md-4">
                <Controller
                  name="isChecked"
                  control={control}
                  defaultValue={false}
                  render={({ field: { onChange, value } }) => (
                    <ToggleButton
                      isChecked={value}
                      onClick={() => onChange(!value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">All Orders</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Inhouse orders</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Seller Orders</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Pick-up Point Order</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Refunds</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Customers</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Sellers</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Reports</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Marketing</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Support</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Website Setup</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Setup & Configurations</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Staffs</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Addon Manager</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">Blog System</div>
              <div className="col-md-4">
                <ToggleButton isChecked />
              </div>
            </div>
          </div>
          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateRole;
