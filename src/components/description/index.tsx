import "./index.scss";
import TextEditor from "../forms/text-editor";
interface IProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const DescriptionInput: React.FC<IProps> = ({ value, setValue }) => {

  return(
    <div style={{marginBottom:'1rem'}}>
      <TextEditor onChangeFunction={(e:any)=>setValue(e)}editroText={value} />
      </div>
  )
};

export default DescriptionInput;
