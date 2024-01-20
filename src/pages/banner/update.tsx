import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import FileInput from "../../components/forms/file-input";
import Input from "../../components/forms/text-input";
import Select from "../../components/select";
import { API_ROOT } from "../../constants";
import axios from "../../lib";
import { reset, updateAddBanner } from "../../redux/add-banner/addBannerSlice";
import { getCategories } from "../../redux/category/categorySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const UpdateBanner = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState("");
  const [group_by, setGroup_by] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { categories } = useAppSelector((state) => state.category);
  const { isUpdate, message, isError } = useAppSelector(
    (state) => state.banner
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("group_by", group_by);
    if (image) {
      formData.append("image", image);
    }
    formData.append("url", url);

    dispatch(updateAddBanner({ bannerData: formData, id: Number(slug) }));
  };

  useEffect(() => {
    dispatch(getCategories({ page: 1, limit: 100 }));
  }, [dispatch]);
  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);
      navigate("/banner");
    }
    if (isError) {
      toast.error("Update field");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, message, dispatch, isError, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/banner/${slug}`);
        setGroup_by(data.data.group_by);
        setPrevImage(data.data.image);
        setUrl(data.data.url);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div>
      <CardBody header="Update Banner" to="/banner" text="Back" />
      <Display>
        <form onSubmit={handleSubmit}>
          <FileInput
            name="image"
            label="Banner Image"
            required
            onChange={(e) => {
              if (e.target.files) {
                setImage(e.target.files[0]);
              }
            }}
          />
          <div>
            <img
              style={{ width: "200px" }}
              src={`${API_ROOT}/images/banner/${prevImage}`}
              alt=""
            />
          </div>
          <Input
            htmlFor="url"
            label="URL"
            name="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <Select>
            <option value="home" selected={group_by === "home"}>
              Home Horizontal
            </option>
            <option value="home-v" selected={group_by === "home-v"}>
              Home vertical
            </option>
            <option value="product" selected={group_by === "product"}>
              Product
            </option>
            <option value="category" selected={group_by === "category"}>
              Category
            </option>
            <option value="video" selected={group_by === "video"}>
              Video
            </option>
            <option value="blog" selected={group_by === "blog"}>
              Blog
            </option>
            {categories.map((category, index) => (
              <option
                key={index}
                value={category.slug}
                selected={group_by === category.slug}
              >
                {category.title}
              </option>
            ))}
          </Select>

          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateBanner;
