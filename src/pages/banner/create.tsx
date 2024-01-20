import { FormEvent, useEffect } from 'react';
import { Button } from '../../components/button';
import CardBody from '../../components/card-body';
import Display from '../../components/display';
import FileInput from '../../components/forms/file-input';
import Select from '../../components/forms/select';
import Input from '../../components/forms/text-input';
import { toast } from 'react-toastify';
import { useState, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createAddBanner, reset } from '../../redux/add-banner/addBannerSlice';
import { IAdBanner } from '../../interfaces/addBanner';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../redux/category/categorySlice';

const options = [
  { label: 'Home-horizontal', value: 'home' },
  { label: 'Home-vertical ', value: 'home-v' },
  { label: 'Product', value: 'product' },
  { label: 'Category', value: 'category' },
  { label: 'Video', value: 'video' },
  { label: 'Blog', value: 'blog' },
];

const initialState = {
  url: '',
  group_by: '',
  image: null as File | null,
  is_visible: true,
};
const CreateBanner = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const { isCreate, message, isError } = useAppSelector(
    (state) => state.banner
  );

  const categoriesFormate = categories.map((category) => {
    return {
      label: category.title,
      value: category.slug,
    };
  });

  const [bannerData, setBannerData] = useState<IAdBanner>(initialState);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]; // Get the first selected file

      setBannerData((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };
  const handleBannerData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setBannerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(bannerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    dispatch(createAddBanner(formData));
  };

  useEffect(() => {
    dispatch(getCategories({ page: 1, limit: 100 }));
  }, [dispatch]);
  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      setBannerData(initialState);
      navigate('/banner');
    }
    if (isError) {
      toast.error('Blog create filed');
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, message, dispatch, isError]);

  return (
    <div>
      <CardBody header="Create Banner" to="/banner" text="Back" />
      <Display>
        <form onSubmit={handleSubmit}>
          <FileInput
            name="image"
            onChange={handleImageChange}
            label="Banner Image"
            required
          />
          <Input
            htmlFor="url"
            label="URL"
            name="url"
            placeholder="URL"
            value={bannerData.url}
            onChange={handleBannerData}
            required
          />
          <Select
            name="group_by"
            onChange={handleBannerData}
            label="Select Group"
            value={bannerData.group_by as string}
            options={[...options, ...categoriesFormate]}
            required
          />
          <Button type="submit">Create</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateBanner;
