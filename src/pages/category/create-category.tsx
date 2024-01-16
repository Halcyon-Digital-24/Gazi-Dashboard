import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import FileInput from "../../components/forms/file-input";
import Input from "../../components/forms/text-input";
import TextArea from "../../components/forms/textarea";
import Column from "../../components/table/column";
import Select from "../../components/select";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createCategory,
  getCategories,
  reset,
} from "../../redux/category/categorySlice";
import { ICategory } from "../../interfaces/category";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialState = {
  title: "",
  slug: "",
  parent_category: "",
  image: null as File | null,
  is_feature: false,
  meta_title: "",
  meta_description: "",
  order_id: "",
};

const CreateCategory: React.FC = () => {
  const { categories, isCreate, error, message } = useAppSelector(
    (state) => state.category
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [categoryData, setCategoryData] = useState<ICategory>(initialState);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) =>
    setCategoryData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setCategoryData((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(categoryData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    dispatch(createCategory(formData));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/category");
    }

    return () => {
      dispatch(reset());
    };
  }, [isCreate, dispatch]);

  useEffect(() => {
    dispatch(getCategories({ page: 1, limit: 50 }));
  }, [dispatch]);
  return (
    <div>
      <CardBody header="Create Category" to="/category" text="back" />
      <Display>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <Column className="col-md-8">
              <Input
                htmlFor="title"
                name="title"
                label="Title *"
                onChange={handleChange}
                placeholder="Enter Title"
                required
                errorMessage={error.title}
              />
              <Input
                htmlFor="slug"
                name="slug"
                label="Slug *"
                onChange={handleChange}
                placeholder="Enter Slug"
                required
                errorMessage={error.slug}
              />
              <Input
                htmlFor="order_id"
                name="order_id"
                label="Position No"
                onChange={handleChange}
                placeholder="Enter Position"
                errorMessage={error.order_id}
              />
              <Select
                htmlFor="Choose Parent category"
                name="parent_category"
                onChange={handleChange}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </Select>
              <FileInput
                label="Set Image"
                placeholder="Choose an Image"
                onChange={handleImageChange}
              />
            </Column>
            <Column className="col-md-4">
              <br />
              <Input
                name="meta_title"
                placeholder="Meta Title"
                htmlFor="meta-title"
                onChange={handleChange}
                errorMessage={error.meta_title}
              />
              <TextArea
                name="meta_description"
                placeholder="Meta Description"
                onChange={handleChange}
              />
            </Column>
          </div>
          <div className="text-right">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Display>
    </div>
  );
};

export default CreateCategory;
