import { useState, useEffect } from "react";
import "./attribute-single.scss";

interface IProps {
  data: any;
  handleAddAttribute: (
    attribute: string,
    attributeValue?: string | null
  ) => void;
  handleRemoveAttribute: (
    attribute: string,
    attributeValue?: string | null
  ) => void;
}

const AttributeSingle: React.FC<IProps> = ({
  data,
  handleAddAttribute,
  handleRemoveAttribute,
}) => {
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<any[]>(
    []
  );

  useEffect(() => {
    if (data?.value?.indexOf(",") > -1) {
      setAttributeValues(data?.value?.split(","));
    } else {
      if (data?.value != "") {
        setAttributeValues([data?.value]);
      } else {
        setAttributeValues([]);
      }
    }
    if (data?.selectedValues?.length > 0) {
      setSelectedAttributeValues(data?.selectedValues);
    } else {
      setSelectedAttributeValues([]);
    }
  }, [data?.value, data?.selectedValues?.length]);

  return (
    <div className="attribute-single">
      <select
        name="attributes"
        className="attribute-value-list"
        value={""}
        onChange={(e) => handleAddAttribute(data.name, e.target.value)}
      >
        <option value="">Select atribute values</option>
        {attributeValues?.length > 0 &&
          attributeValues?.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))}
      </select>
      <div className="attributes">
        <div
          className="attribute"
          onClick={() => handleRemoveAttribute(data.name)}
        >
          {data?.name}
        </div>
        {selectedAttributeValues?.length > 0 &&
          selectedAttributeValues?.map((item, i) => (
            <div
              key={i}
              className="attribute-value"
              onClick={() => handleRemoveAttribute(data.name, item)}
            >
              {item}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AttributeSingle;
