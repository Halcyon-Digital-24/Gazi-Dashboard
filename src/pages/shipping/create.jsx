import CardBody from '../../components/card-body';
import Display from '../../components/display';
import Input from '../../components/forms/text-input';
import { Button } from '../../components/button';
import { FormEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createLocation, reset } from '../../redux/location/locationSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateShipping = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCreate } = useAppSelector((state) => state.location);
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const handleLocationCreate = (e) => {
    e.preventDefault();
    dispatch(createLocation({ location, price }));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success('Location create successfully');
      navigate('/shipping');
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isCreate, navigate]);

  return (
    <div>
      <CardBody header="Create Shipping" to="/shipping" text="Back" />

      <Display>
        <form onSubmit={handleLocationCreate}>
          <Input
            label="District Name"
            htmlFor="name"
            onBlur={(e) => setLocation(e.target.value)}
          />
          <Input
            label="Price"
            htmlFor="name"
            onBlur={(e) => setPrice(e.target.value)}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateShipping;
