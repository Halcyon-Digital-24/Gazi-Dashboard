import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import axios from "../../lib";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateLocation } from "../../redux/location/locationSlice";

const UpdateShipping = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const { isUpdate } = useAppSelector((state) => state.location);
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateLocation({ id: slug, locationData: { location, price } })
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/shippings/${slug}`);
        setLocation(res.data.data.location);
        setPrice(res.data.data.price);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (isUpdate) {
      toast.success("Update Success");
      navigate("/shipping");
    }
  }, [isUpdate, navigate]);

  return (
    <div>
      <CardBody header="Update Shipping" to="/shipping" text="Back" />

      <Display>
        <form onSubmit={handleSubmit}>
          <Input
            label="District Name"
            htmlFor="name"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            label="Price"
            htmlFor="name"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateShipping;
