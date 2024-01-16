import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { API_URL } from "../../constants";
import { Attribute, IAttributeResponse } from "../../interfaces/attribute";
import axios from "../../lib";
import Loader from "../../components/loader";

const Attributes = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get<IAttributeResponse>(
        `${API_URL}/attributes`
      );
      setLoading(false);
      setAttributes(response.data?.data?.rows);
    } catch (error) {
      setLoading(true);
      console.error("Failed to fetch data", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAttribute = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/attributes?ids=[${id}]`);

      if (response.status === 200) {
        toast.success(response.data.message);

        fetchData();
      } else {
        console.error(`Failed to delete attribute with id ${id}`);
      }
    } catch (error) {
      console.error("Error while deleting attribute", error);
    }
  };

  return (
    <div>
      <CardBody header="Attributes" to="/attributes/create" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-5">Attributes</Column>
          <Column className="col-md-5">Attributes Value</Column>
          <Column className="col-md-2">Actions</Column>
        </Row>
        {isLoading ? (
          <>
            <Loader />
          </>
        ) : (
          attributes.map((attribute, index) => (
            <Row className="row" key={index}>
              <Column className="col-md-5">{attribute.name}</Column>
              <Column className="col-md-5">{attribute.value}</Column>
              <Column className="col-md-2">
                <CustomIconArea>
                  <EditButton editUrl={`/attributes/edit/${attribute.id}`} />
                  <DeleteButton
                    onClick={() => handleDeleteAttribute(attribute.id)}
                  />
                </CustomIconArea>
              </Column>
            </Row>
          ))
        )}
      </Display>
    </div>
  );
};

export default Attributes;
