import React, { useEffect, useState } from "react";
import axios from "../../lib";
import { API_URL } from "../../constants";
import Input from "../../components/forms/text-input";
import FileInput from "../../components/forms/file-input";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

const UpdateVariant = ({ addVariants, handleRemoveAddVariant }) => {
  console.log(addVariants);
  const { slug } = useParams();
  const [productAttributes, setProductAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDeleteAttribute = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await axios.delete(
        `${API_URL}/product-attributes/?ids=[${id}]`
      );
      console.log(data);
      toast.success(data.message);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/products/${slug}
`
        );
        const { productAttribute } = response.data;
        setProductAttributes(productAttribute?.rows);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching update product data:", error);
      }
    };
    fetchProductData();
  }, [slug, isLoading]);

  return (
    <div>
      {(productAttributes?.length > 0 || addVariants.length > 0) && (
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
                <SingleVariant
                  att={att}
                  handleDeleteAttribute={handleDeleteAttribute}
                  key={i}
                />
              ))}
              {addVariants?.map((variant, i) => (
                <SingleUploadVariant
                  key={i}
                  variant={variant}
                  slug={slug}
                  handleRemoveAddVariant={handleRemoveAddVariant}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const SingleVariant = ({ att, handleDeleteAttribute }) => {
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);

  const handleUpdateAttribute = async () => {
    const formData = new FormData();
    formData.append("attribute_quantity", quantity);
    if (image) {
      formData.append("attrbute_image", image);
    }
    try {
      const response = await axios.patch(
        `${API_URL}/product-attributes/${att.id}
`,
        formData
      );
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setQuantity(att.attribute_quantity);
  }, []);

  return (
    <tr>
      <td>{att?.attribute_key?.replace("_", " ")}</td>
      <td>{att?.attribute_value}</td>
      <td>
        <Input
          htmlFor="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </td>
      <td>
        <FileInput onChange={(e) => setImage(e.target.files[0])} />
      </td>
      <td>
        <div className="check" onClick={handleUpdateAttribute}>
          <FaCheck />
        </div>
      </td>
      <td>
        <div className="delete" onClick={() => handleDeleteAttribute(att.id)}>
          <RiDeleteBin6Line />
        </div>
      </td>
    </tr>
  );
};
const SingleUploadVariant = ({ variant, slug, handleRemoveAddVariant }) => {
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);

  const handleSubmitAttribute = async () => {
    const formData = new FormData();
    formData.append("product_id", slug);
    formData.append("attribute_key", variant.attribute_key);
    formData.append("attribute_value", variant.attribute_value);
    formData.append("attribute_quantity", quantity);
    if (image) {
      formData.append("attrbute_image", image);
    }
    try {
      const response = await axios.post(
        `${API_URL}/product-attributes
`,
        formData
      );
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <tr>
      <td>{variant?.attribute_key?.replace("_", " ")}</td>
      <td>{variant?.attribute_value}</td>
      <td>
        <Input
          htmlFor="quantity"
          type="number"
          onBlur={(e) => setQuantity(e.target.value)}
          required
        />
      </td>
      <td>
        <FileInput onChange={(e) => setImage(e.target.files[0])} />
      </td>
      <td>
        <div className="check" onClick={handleSubmitAttribute}>
          <FaCheck />
        </div>
      </td>
      <td>
        <div className="delete" onClick={() => handleRemoveAddVariant(variant)}>
          <RiDeleteBin6Line />
        </div>
      </td>
    </tr>
  );
};

export default UpdateVariant;
