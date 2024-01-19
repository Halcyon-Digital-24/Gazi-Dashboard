import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import axios from "../../lib";
import { useForm } from "react-hook-form";

const UpdateVideo = () => {
  const { slug } = useParams();

  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors }} = useForm();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/videos/${slug}`);
        setValue("title", res.data.data.title);
        setValue("url", res.data.data.url);
      } catch (error) {
        console.log("Video fetch error" + error);
      }
    };
    fetchData();
  }, [slug]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(`/videos/${slug}`, data);
      navigate('/videos');
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error saving data';
    toast.error(errorMessage);
    }
  };

  return (
    <div>
      <CardBody to="/videos" text="back" header="Update Video" />

      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>

        <div className="text">
            <label htmlFor="title">Video Title *</label>
            <input
              type="text"
              placeholder="video title"
              {...register("title", {
                required: "Location is required",
                pattern: {
                  value: /^[a-zA-Z ]+$/,
                  message: "Enter a valid title"
                }
              })}
            />
            {errors.title && (
              <p className="validation__error">{errors.title.message}</p>
            )}
          </div>


          <div className="text">
            <label htmlFor="title">Video Embed URL *</label>
            <input
              type="text"
              placeholder="Enter video embed code"
              {...register("url", {
                required: "url is required",
                pattern: {
                  value: /^[a-zA-Z ]+$/,
                  message: "Enter a valid url"
                }
              })}
            />
            {errors.url && (
              <p className="validation__error">{errors.url.message}</p>
            )}
          </div>



          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateVideo;
