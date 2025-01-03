import { toast } from "react-toastify";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { Button } from "../../components/button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../lib";

const CreateVideo = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.is_visible = true;
    try {
      const response = await axios.post("/videos", data);
      navigate("/videos");
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error saving data");
      console.error(error);
    }
  };

  return (
    <div>
      <CardBody to="/videos" text="back" header="Create Video" />

      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text">
            <label htmlFor="title">Video Title *</label>
            <input
              type="text"
              placeholder="Video title"
              {...register("title", {
                required: "Video Title is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid title",
                },
              })}
            />
            {errors.title && (
              <p className="validation__error">{errors.title.message}</p>
            )}
          </div>

          <div className="text">
            <label htmlFor="url">Video Embed URL *</label>
            <input
              type="text"
              placeholder="Enter video embed code"
              {...register("url", {
                required: "URL is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid URL",
                },
              })}
            />
            {errors.url && (
              <p className="validation__error">{errors.url.message}</p>
            )}
          </div>

          <Button type="submit">Save</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateVideo;
