import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import TextArea from "../../components/forms/textarea";
import axios from "../../lib";

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

  return (
    <div>
      <CardBody header="Update Faq" to="/faqs" text="back" />
      <Display>
        <form onSubmit={handleSubmit}>

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

          <TextArea
            name="answer"
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            label="Answer"
            placeholder="Answer here..."
            required
          />
          <Button>{isLoading ? "Loading" : "Update"}</Button>
        </form>
      </Display>
    </div>
  );
};

export default UpdateFaq;
