import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import FileInput from "../../components/forms/file-input";
import Input from "../../components/forms/text-input";
import TextArea from "../../components/forms/textarea";
import Loader from "../../components/loader";
import Select from "../../components/select";
import Column from "../../components/table/column";
import { API_URL } from "../../constants";
import axios from "../../lib";
import {
  getCategories,
  reset,
  updateCategory,
} from "../../redux/category/categorySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const UpdateCategory: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { slug } = useParams();
  const { categories, isUpdate, error } = useAppSelector(
    (state) => state.category
  );
  const [loading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug_url, setSlug] = useState("");
  const [parent_category, setParentCategory] = useState("");
  const [image, setImage] = useState<File | string | null>(null);
  const [meta_title, setMetaTitle] = useState("");
  const [meta_description, setMetaDescription] = useState("");
  const [order_id, setOrderId] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  console.log(error);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("slug", slug_url);
    formData.append("parent_category", parent_category);
    if (image !== null) {
      formData.append("image", image);
    }
    formData.append("meta_title", meta_title);
    formData.append("meta_description", meta_description);
    formData.append("order_id", order_id);

    dispatch(updateCategory({ slug: slug as string, categoryData: formData }));
  };

  useEffect(() => {
    if (isUpdate) {
      navigate("/category");
    }
    dispatch(getCategories({ page: 1, limit: 50 }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isUpdate, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/categories/${slug}`);
        const data = response.data.data;

        // Set state values based on the fetched data
        setTitle(data.title);
        setSlug(data.slug);
        setParentCategory(data.parent_category);
        setImage(data.image);
        setMetaTitle(data.meta_title);
        setMetaDescription(data.meta_description);
        setOrderId(data.order_id);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching category data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <CardBody header="Update Category" to="/category" text="back" />
      <Display>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <Column className="col-md-8">
              <Input
                htmlFor="title"
                name="title"
                label="Title *"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title"
                value={title}
                required
                errorMessage={error.title}
              />
              <Input
                htmlFor="slug"
                name="slug"
                label="Slug *"
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Enter Slug"
                required
                value={slug_url}
                errorMessage={error.slug}
              />
              <Input
                htmlFor="order_id"
                name="order_id"
                label="Position No"
                value={order_id}
                placeholder="Enter Position"
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
              <Select
                htmlFor="Choose Parent category"
                name="parent_category"
                onChange={(e) => setParentCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option
                    key={index}
                    value={category.slug}
                    selected={category.slug === parent_category}
                  >
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
                onChange={(e) => setMetaTitle(e.target.value)}
                value={meta_title}
              />
              <TextArea
                name="meta_description"
                placeholder="Meta Description"
                onChange={(e) => setMetaDescription(e.target.value)}
                value={meta_description}
              />
            </Column>
          </div>
          <div className="text-right">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Display>
    </div>
  );
};

export default UpdateCategory;
