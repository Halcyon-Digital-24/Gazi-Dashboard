import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import axios from "../../lib";
import { useForm } from "react-hook-form";
import "./index.scss";

const UpdateFaq= () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { register, handleSubmit, setValue, formState: { errors }} = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/faqs/${slug}`);
        setValue("question", res.data.data.question);
        setValue("answer", res.data.data.answer);
      } catch (error) {
        console.log("Video fetch error" + error);
      }
    };
    fetchData();
  }, [slug]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(`/faqs/${slug}`, data);
      navigate('/faqs');
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error saving data';
    toast.error(errorMessage);
    }
  };

  return (
    <div>
      <CardBody header="Update Faq" to="/faqs" text="back" />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)} className="form">

        <div className="text">
            <label htmlFor="Question">Question*</label>
            <input
              type="text"
              placeholder="Question here..."
              {...register("question", {
                required: "question is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid question"
                }
              })}
            />
            {errors.question && (
              <p className="validation__error">{errors.question.message}</p>
            )}
          </div>

          <div className="text">
            <label htmlFor="Question">Question*</label>

          <textarea name="answer"  className="text__area" placeholder="Answer here..." 
          
          {...register("answer", {
            required: "answer is required",
            pattern: {
              value: /\S/,
              message: "Enter a valid answer"
            }
          })}

          />

{errors.answer && (
              <p className="validation__error">{errors.answer.message}</p>
            )}
 </div>
          <Button>Update</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateFaq;
