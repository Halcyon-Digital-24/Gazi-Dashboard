import React, { FormEvent, useEffect, useState } from "react";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import { Button } from "../../components/button";
import axios from "../../lib";
import { API_URL } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const attributeData = {
  name: "",
  value: "",
};
const UpdateAttribute = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [attributes, setAttributes] = useState(attributeData);

  const handleUpdateAttributes = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${API_URL}/attributes/${slug}`,
        attributes
      );
      toast.success(response.data.message);
      navigate("/attributes");
    } catch (error) {
      // Handle error
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/attributes/${slug}`);
        const data = response.data.data;

        // Set state values based on the fetched data
        setAttributes({
          name: data.name,
          value: data.value,
        });
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, [slug]);
  return (
    <div>
      <CardBody header="Attributes" to="/attributes" text="Back" />
      <Display>
        <form onSubmit={handleUpdateAttributes}>
          <Input
            name="name"
            htmlFor="name"
            label="Name"
            placeholder="Attribute Name"
            value={attributes.name}
            onChange={handleChange}
          />
          <Input
            name="value"
            htmlFor="value"
            label="Values"
            value={attributes.value}
            placeholder="use comma(,) for separate attribute like x,y"
            onChange={handleChange}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateAttribute;
