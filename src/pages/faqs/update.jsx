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
