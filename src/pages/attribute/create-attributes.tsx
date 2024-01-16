import React, { FormEvent, useState } from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import { Button } from "../../components/button";
import axios from "../../lib";
import { API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const attributeData = {
  name: "",
  value: "",
};
const CreateAttributes = () => {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState(attributeData);

  const handlePostAttributes = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/attributes`, attributes);
      toast.success(response.data.message);
      navigate("/attributes");
    } catch (error) {
      // Handle error
      console.error("Failed to post attributes", error);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAttributes((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  return (
    <div>
      <CardBody header="Attributes" to="/attributes" text="Back" />
      <Display>
        <form onSubmit={handlePostAttributes}>
          <Input
            name="name"
            htmlFor="name"
            label="Name"
            placeholder="Attribute Name"
            onChange={handleChange}
          />
          <Input
            name="value"
            htmlFor="value"
            label="Values"
            placeholder="use comma(,) for separate attribute like x,y"
            onChange={handleChange}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateAttributes;
