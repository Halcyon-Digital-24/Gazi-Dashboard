import React from "react";
import { useForm } from "react-hook-form";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Column from "../../components/table/column";
import FileInput from "../../components/forms/file-input";
import "./index.scss";

const SettingPage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div>
      <CardBody
        header="Basic Settings
"
        text="Back"
        isHide
      />
      <Display>
        <form>
          <div className="row">
            <Column className="col-md-6">
              <div className="color-input">
                <label htmlFor="name">Primary Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("title", {
                    trim: true,
                    required: "Title is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.title && (
                  <p className="validation__error">{errors.title.message}</p>
                )}
              </div>
              <div className="color-input">
                <label htmlFor="name">Secondary Color</label>
                <input
                  type="color"
                  placeholder="Enter Title"
                  {...register("title", {
                    trim: true,
                    required: "Title is required",
                    pattern: {
                      value: /\S/,
                      message: "Enter a valid title",
                    },
                  })}
                />
                {errors.title && (
                  <p className="validation__error">{errors.title.message}</p>
                )}
              </div>
              <div className="radio-wrapper">
                <label htmlFor=""> Cash on Delivery</label>
                <div className="radio-container">
                  <div className="radio-item">
                    <input type="radio" id="enable" name="cod" value="HTML" />
                    <label for="enable">Enable</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="disable"
                      name="cod"
                      value="CSS"
                    ></input>
                    <label for="disable">Disable</label>
                  </div>
                </div>
              </div>
              <div className="radio-wrapper">
                <label htmlFor=""> Online Payment Gateway</label>
                <div className="radio-container">
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="o-enable"
                      name="opg"
                      value="enable"
                    />
                    <label for="o-enable">Enable</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="o-disable"
                      name="opg"
                      value="o-disable"
                    ></input>
                    <label for="o-disable">Disable</label>
                  </div>
                </div>
              </div>
            </Column>
            <Column className="col-md-6">
              <div>
                <FileInput
                  label="Current Gateway Image *"
                  //   onChange={handleImageChange}
                  required
                />
                <div className="gateway">
                  <img src="/payment.png" alt="gazi home appliance" />
                </div>
                {/* {image && (
                )} */}
                <p className="wearing">
                  Image Size Should Be 800 x 200. or square size
                </p>
              </div>
              <br />
              <div className="textarea">
                <label htmlFor="textarea">Copyright *</label>
                <textarea
                  {...register("copyright", {
                    pattern: {
                      value: /\S/,
                      message: "Enter Valid Copyright",
                    },
                  })}
                  id="textarea"
                  placeholder="Enter Copyright"
                />
                {errors.meta_description && (
                  <p className="validation__error">
                    {errors.meta_description.message}
                  </p>
                )}
              </div>
            </Column>
          </div>
        </form>
      </Display>
    </div>
  );
};

export default SettingPage;
