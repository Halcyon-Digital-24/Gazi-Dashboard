import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { useForm } from "react-hook-form";
import axios from "../../lib";
import "./index.scss";

const CreateFaq = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.is_visible = true;
    try {
      const response = await axios.post("/faqs", data);
      navigate("/faqs");
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error saving data");
      console.error(error);
    }
  };

  return (
    <div>
      <CardBody header="Create Faq" to="/faqs" text="back" />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="text ">
            <label htmlFor="Question">Question*</label>
            <input
              type="text"
              placeholder="Question here..."
              {...register("question", {
                required: "question is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid question",
                },
              })}
            />
            {errors.question && (
              <p className="validation__error">{errors.question.message}</p>
            )}
          </div>

          <div className="text">
            <label htmlFor="Question">Answer*</label>

            <textarea
              name="answer"
              className="text__area"
              placeholder="Answer here..."
              {...register("answer", {
                required: "answer is required",
                pattern: {
                  value: /\S/,
                  message: "Enter a valid answer",
                },
              })}
            />

            {errors.answer && (
              <p className="validation__error">{errors.answer.message}</p>
            )}
          </div>
          <Button>Create</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateFaq;
