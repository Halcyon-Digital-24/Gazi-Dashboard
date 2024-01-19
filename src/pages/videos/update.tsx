import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import axios from "../../lib";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { reset, updateVideo } from "../../redux/videos/videoSlice";

const UpdateVideo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { slug } = useParams();
  const { isUpdate, isError } = useAppSelector((state) => state.videos);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const videoData = {
    id: slug,
    title,
    url,
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateVideo(videoData));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/videos/${slug}`);
        setTitle(response.data?.data?.title);
        setUrl(response.data?.data?.url);
      } catch (error) {
        console.log("Video fetch error" + error);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (isUpdate) {
      toast.success("Video Update successfully");
      navigate("/videos");
    }

    if (isError) {
      toast.error("Failed to update video");
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isUpdate, isError, navigate]);

  return (
    <div>
      <CardBody to="/videos" text="back" header="Update Video" />

      <Display>
        <form onSubmit={handleSubmit}>
          <Input
            label="Video Title *"
            placeholder="video title"
            htmlFor="video"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Video Embed URL *"
            placeholder="Enter video embed code"
            name="url"
            htmlFor="link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Button type="submit">Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateVideo;
