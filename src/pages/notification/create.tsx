import { FormEvent, useEffect, useState } from 'react';
import Input from '../../components/forms/text-input';
import TextArea from '../../components/forms/textarea';
import { Button } from '../../components/button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createNotification, reset } from '../../redux/notification/notificationSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Display from '../../components/display';
import CardBody from '../../components/card-body';
import './index.scss';

const CreateNotification = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isCreate, isError } = useAppSelector((state) => state.notification);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('details', details);
    
    if (image) { 
        formData.append('image', image);
    }

    dispatch(createNotification(formData));
};

  useEffect(() => {
    if (isCreate) {
      toast.success('Notification pushed successfully');
      navigate('/notification');
    }
    if (isError) {
      toast.error('Notification Error');
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, isError, navigate, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div>
      <CardBody header="New Notification" to="/notification" text="Back" />
      <Display>
        <form onSubmit={handleSubmit}>
          <Input
            htmlFor="title"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextArea
            placeholder="Details"
            onChange={(e) => setDetails(e.target.value)}
          />
          <div className='file'>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <Button type="submit">Push</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateNotification;
