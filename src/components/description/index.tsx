import React from 'react';
import TextEditor from '../forms/text-editor';
import './index.scss';

interface IProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const DescriptionInput: React.FC<IProps> = ({ value, setValue }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <TextEditor onChangeFunction={(value: string) => setValue(value)} editorText={value} />
    </div>
  );
};

export default DescriptionInput;
