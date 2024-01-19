import { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import Select from "../../components/select";
import axios from "../../lib";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { reset, updateMenus } from "../../redux/menus/menuSlice";

/* const options = [
  { label: "help", value: "help" },
  { label: "Customer Service ", value: "customer_service" },
  { label: "Gazi Home Appliance", value: "home_appliance" },
]; */

const UpdateMenu: FC = () => {
  const { isUpdate } = useAppSelector((state) => state.menu);
  const { slug: menuSlug } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [position, setPosition] = useState("");

  console.log(isUpdate);

  const dispatch = useAppDispatch();

  const submitData = { name, slug, position };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateMenus({ menuData: submitData, id: menuSlug as string }));
  };

  useEffect(() => {
    if (isUpdate) {
      navigate("/setup/menus");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, navigate, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/menu/${menuSlug}`);
        setName(res.data.data.name);
        setSlug(res.data.data.slug);
        setPosition(res.data.data.position);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [menuSlug]);

  return (
    <div>
      <CardBody header="Update Menu" to="/setup/menus" text="remove" />
      <Display>
        <form onSubmit={handleSubmit}>
          <Input
            htmlFor="Name"
            label="Menu Name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            htmlFor="url"
            label="URL"
            placeholder="URL"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <Select onChange={(e) => setPosition(e.target.value)}>
            <option value="help" selected={position === "help"}>
              Help
            </option>
            <option
              value="customer_service"
              selected={position === "customer_service"}
            >
              Customer Service
            </option>
            <option
              value="home_appliance"
              selected={position === "home_appliance"}
            >
              Gazi Home Appliance
            </option>
          </Select>

          <Button type="submit">Submit</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateMenu;
