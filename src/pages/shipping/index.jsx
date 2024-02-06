import { useEffect, useState } from "react";
import DeleteButton from "../../components/button/delete";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Filter from "../../components/filter";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import axios from "../../lib";
import { toast } from "react-toastify";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import { getLocations, reset } from "../../redux/location/locationSlice";

const Shipping = () => {
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [displayItem, setDisplayItem] = useState(25);
  const { locations, isError, isDelete, message, totalCount } = useAppSelector(
    (state) => state.location
  );

  const totalPage = Math.ceil(totalCount / displayItem);

  const handleDisplayItem = (e) => {
    setDisplayItem(Number(e.target.value));
  };

  const handlePageChange = (selectedItem) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleDeleteVideo = async (id) => {
    try {
      const data = await axios.delete(`/shippings/?ids=[${id}]`);
      toast.success(data.data.message);
      dispatch(getLocations({ page: pageNumber, limit: displayItem }));
      toast.success(data.data.message);
    } catch (error) {
      console.log("Delete Shipping Error" + error);
    }
  };

  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [isDelete, isError]);

  useEffect(() => {
    dispatch(getLocations({ page: pageNumber, limit: displayItem }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, displayItem, isDelete]);

  return (
    <div>
      <CardBody header="Shipping" to="/shipping/create" />
      <Display>
        <Filter handleDisplayItem={handleDisplayItem} />
        <Row className="row text-bold">
          <Column className="col-md-4">Location</Column>
          <Column className="col-md-4">Price</Column>
          <Column className="col-md-4">Actions</Column>
        </Row>
        {locations?.map((location, index) => (
          <Row className="row" key={index}>
            <Column className="col-md-4">{location.location}</Column>
            <Column className="col-md-4">{location.price}</Column>
            <Column className="col-md-4">
              <CustomIconArea>
                <EditButton editUrl={`/shipping/edit/${location.id}`} />
                <DeleteButton onClick={() => handleDeleteVideo(location.id)} />
              </CustomIconArea>
            </Column>
          </Row>
        ))}
        <Pagination
          pageCount={pageNumber}
          handlePageClick={handlePageChange}
          totalPage={totalPage}
        />
      </Display>
    </div>
  );
};

export default Shipping;
