import CardBody from '../../components/card-body';
import Display from '../../components/display';
import { Button } from '../../components/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import axios from "../../lib";

const CreateShipping = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }} = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/shippings', data);
      navigate('/shipping');
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Error saving data');
      console.error(error);
    }
  };


  return (
    <div>
      <CardBody header="Create Shipping" to="/shipping" text="Back" />

      <Display>
        <form  onSubmit={handleSubmit(onSubmit)}>

        <div className="text">
          <label htmlFor="District">District Name</label>
          <input type="text"  {...register("location", {required: "location is required"})}/>
          {errors.location && ( <p className="validation__error">{errors.location.message}</p> )}
        </div>

        <div className="text">
          <label htmlFor="Price">Price</label>
          <input type="text"  {...register("price", {required: "Price is required"})}/>
          {errors.price && ( <p className="validation__error">{errors.price.message}</p>)}
        </div>
          <Button type="submit">Submit</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateShipping;
