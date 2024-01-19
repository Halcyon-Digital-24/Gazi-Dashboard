import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import Input from "../../components/forms/text-input";
import TextArea from "../../components/forms/textarea";
import { useForm } from "react-hook-form";


const CreateFaq = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }} = useForm();

  const onSubmit = async (data) => {
    data.is_visible = true;
    try {
      const response = await axios.post('/faqs', data);
      navigate('/faqs');
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Error saving data');
      console.error(error);
    }
  };

  return (
    <div>
      <CardBody header="Create Faq" to="/faqs" text="back" />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
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
