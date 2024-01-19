import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import TextArea from "../../components/forms/textarea";


const CreateFaq = () => {
  const navigate = useNavigate();


  return (
    <div>
      <CardBody header="Create Faq" to="/faqs" text="back" />
      <Display>
        <form onSubmit={handleSubmit}>
          <Input
            name="question"
            onChange={handleChange}
            htmlFor="title"
            label="Question *"
            placeholder="Question here..."
            value={faqData.question}
            required
          />

          <TextArea
            name="answer"
            onChange={handleChange}
            value={faqData.answer}
            label="Answer"
            placeholder="Answer here..."
            required
          />
          <Button>{isLoading ? "Loading" : "Create"}</Button>
        </form>
      </Display>
    </div>
  );
};

export default CreateFaq;
