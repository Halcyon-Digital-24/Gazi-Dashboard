import { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Select from "../../components/forms/select";
import Input from "../../components/forms/text-input";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createMenu, reset } from "../../redux/menus/menuSlice";

const options = [
  { label: "help", value: "help" },
  { label: "Customer Service", value: "customer_service" },
  { label: "Gazi Home Appliance", value: "home_appliance" },
];

const CreateMenu: FC = () => {
  const { isCreate } = useAppSelector((state) => state.menu);
  console.log(isCreate);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [position, setPosition] = useState("");

  const dispatch = useAppDispatch();

  const submitData = { name, slug, position };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createMenu(submitData));
  };

  useEffect(() => {
    if (isCreate) {
      navigate("/setup/menus");
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, navigate, dispatch]);

  return (
    <div>
      <CardBody header="Create Menu" to="/setup/menus" text="remove" />
      <Display>
        <form onSubmit={handleSubmit}>
          <Input
            htmlFor="Name"
            label="Menu Name"
            placeholder="Name"
            onBlur={(e) => setName(e.target.value)}
            required
          />
          <Input
            htmlFor="url"
            label="URL"
            placeholder="URL"
            onBlur={(e) => setSlug(e.target.value)}
            required
          />
          <Select
            name="group_by"
            onChange={(e) => setPosition(e.target.value)}
            label="Select Group"
            options={options}
            required
          />
          <Button type="submit">Submit</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateMenu;
