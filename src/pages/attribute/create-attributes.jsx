import { useForm } from "react-hook-form";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { Button } from "../../components/button";
import axios from "../../lib";
import { API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateAttributes = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const handlePostAttributes = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/attributes`, data);
      toast.success(response.data.message);
      navigate("/attributes");
    } catch (error) {
      // Handle error
      console.error("Failed to post attributes", error);
    }
  };

  return (
    <div>
      <CardBody header="Attributes" to="/attributes" text="Back" />
      <Display>
        <form onSubmit={handleSubmit(handlePostAttributes)}>
          <div className="text">
            <label htmlFor="title">Attribute Name *</label>
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
          {/* <Input
            name="name"
            htmlFor="name"
            label="Name"
            placeholder="Attribute Name"
            onChange={handleChange}
          /> */}
          {/*  <Input
            name="value"
            htmlFor="value"
            label="Values"
            placeholder="use comma(,) for separate attribute like x,y"
            onChange={handleChange}
          /> */}
          <div className="text">
            <label htmlFor="title">Product Title *</label>
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
          <Button type="submit">Submit</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateAttributes;
