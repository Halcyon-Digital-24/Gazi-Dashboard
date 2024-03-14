import React, { useEffect, useState } from "react";
import axios from "../../lib";
import { API_URL } from "../../constants";
import Input from "../../components/forms/text-input";
import FileInput from "../../components/forms/file-input";
import { RiDeleteBin6Line } from "react-icons/ri";

const UpdateVariant = ({ title }) => {
  const [productAttributes, setProductAttributes] = useState([]);

  const handleDeleteAttribute = async (id) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/product-attributes/?ids=[${id}]`
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/frontend/products/Gazi%20Smiss%20Gas%20Stove%20%7C%20B-23
`
        );
        const { data } = response.data;
        setProductAttributes(data.productAttribute);

        console.log(data);
      } catch (error) {
        console.error("Error fetching EMI data:", error);
      }
    };
    fetchProductData();
  }, []);

  return (
    <div>
      {productAttributes?.length > 0 && (
        <div className="varian-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Variant</th>
                <th>Quantity</th>
                <th>Photo</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productAttributes?.map((att, i) => (
                <tr key={i}>
                  <td>{att?.attribute_key?.replace("_", " ")}</td>
                  <td>{att?.attribute_value}</td>
                  <td>
                    <Input
                      htmlFor="quantity"
                      type="number"
                      value={att.attribute_quantity}
                      required
                    />
                  </td>
                  <td>
                    <FileInput />
                  </td>
                  <td>
                    <div className="delete">
                      <RiDeleteBin6Line />
                    </div>
                  </td>
                  <td>
                    <div
                      className="delete"
                      onClick={() => handleDeleteAttribute(att.id)}
                    >
                      <RiDeleteBin6Line />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpdateVariant;
