import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Loader from "../../components/loader";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { API_URL } from "../../constants";
import { Attribute, IAttributeResponse } from "../../interfaces/attribute";
import axios from "../../lib";

const Attributes = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const totalPage = Math.ceil(count / 10);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get<IAttributeResponse>(
        `${API_URL}/attributes?page=${pageNumber}&limit=10`
      );
      setLoading(false);
      setAttributes(response.data?.data?.rows);
      setCount(response.data?.data?.count);
    } catch (error) {
      setLoading(true);
      console.error("Failed to fetch data", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [pageNumber]);

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
        <div className="table">
          <Row className="row-table text-bold">
            <Column className="col-md-3">Attributes</Column>
            <Column className="col-md-5">Attributes Value</Column>
            <Column className="col-md-4">Actions</Column>
          </Row>
          {isLoading ? (
            <>
              <Loader />
            </>
          ) : (
            attributes.map((attribute, index) => (
              <Row className="row-table" key={index}>
                <Column className="col-md-3">{attribute.name}</Column>
                <Column className="col-md-5">{attribute.value}</Column>
                <Column className="col-md-4">
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
        </div>
        <Pagination
          pageCount={pageNumber}
          handlePageClick={handlePageChange}
          totalPage={totalPage}
        />
      </Display>
    </div>
  );
};

export default Attributes;
