import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import TextArea from "../../components/forms/textarea";
import axios from "../../lib";
import { reset, updateFaq } from "../../redux/faqs/faqSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const UpdateFaq: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message, isUpdate, isError, isLoading } = useAppSelector(
    (state) => state.faqs
  );
  const { slug } = useParams();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);
      navigate("/faqs");
    }
    if (isError) {
      toast.error("Update filed");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, dispatch, isError, message, navigate]);

  const faqData = {
    id: slug,
    question,
    answer,
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(updateFaq(faqData));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/faqs/${slug}`);
        setQuestion(response.data.data.question);
        setAnswer(response.data.data.answer);
      } catch (error) {
        console.log("Faq fetch error" + error);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div>
      <CardBody header="Update Faq" to="/faqs" text="back" />
      <Display>
        <form onSubmit={handleSubmit}>
          <Input
            name="question"
            onChange={(e) => setQuestion(e.target.value)}
            htmlFor="title"
            label="Question *"
            placeholder="Question here..."
            value={question}
            required
          />

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
