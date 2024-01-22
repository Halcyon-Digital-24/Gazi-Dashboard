import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import FileInput from "../../components/forms/file-input";
import Select from "../../components/forms/select";
import Input from "../../components/forms/text-input";
import Column from "../../components/table/column";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createKeypont } from "../../redux/service/keypointSlice";

const options = [
  { label: "Home", value: "home" },
  { label: "Product", value: "product" },
  { label: "Others", value: "other" },
];

const CreateService = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isCreate } = useAppSelector((state) => state.services);
  const [group, SetGroup] = useState<string>("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleBannerData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    SetGroup(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]; // Get the first selected file

      setImage(file);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("group_by", group);
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("url", slug);
    if (image) {
      formData.append("image", image);
    }

    dispatch(createKeypont(formData));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success("Service create successfully");
      navigate("/setup/services");
    }
  }, [isCreate]);

  return (
    <div>
      <CardBody header="Create Service" to="/setup/services" text="Back" />
      <form onSubmit={onSubmit}>
        <Display>
          <div className="row">
            <Column className="col-md-6">
              <Display>
                <Input
                  htmlFor="title"
                  label="Title"
                  placeholder="Enter Title"
                  required
                  onBlur={(e) => setTitle(e.target.value)}
                />
                <Input
                  htmlFor="s-title"
                  label="Sub Title"
                  placeholder="Enter Sub Title"
                  required
                  onBlur={(e) => setSubtitle(e.target.value)}
                />
                <Input
                  htmlFor="slug"
                  label="Slug"
                  placeholder="Slug"
                  required
                  onBlur={(e) => setSlug(e.target.value)}
                />
              </Display>
            </Column>
            <Column className="col-md-6">
              <Display>
                <FileInput label="Icon" required onChange={handleImageChange} />
                <Select
                  name="group_by"
                  onChange={handleBannerData}
                  label="Select Group"
                  value={group as string}
                  options={options}
                  required
                />
              </Display>
            </Column>
          </div>

          <Button type="submit">Create</Button>
        </Display>
      </form>
    </div>
  );
};

export default CreateService;
