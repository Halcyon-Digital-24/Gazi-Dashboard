import { ChangeEvent, useEffect, useState } from 'react';
import Display from '../../components/display';
import Pagination from '../../components/pagination';
import Column from '../../components/table/column';
import Row from '../../components/table/row';
import Filter from '../../components/filter';
import CustomIconArea from '../../components/custom-icon-area';
import DeleteButton from '../../components/button/delete';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import { toast } from 'react-toastify';
import { getLocations, reset } from '../../redux/location/locationSlice';
import CardBody from '../../components/card-body';

const Shipping: React.FC = () => {
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [displayItem, setDisplayItem] = useState(10);
  const { locations, isError, isDelete, message, totalCount } = useAppSelector(
    (state) => state.location
  );

  const totalPage = Math.ceil(totalCount / displayItem);

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
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
        <Row className="row">
          <Column className="col-md-4">Location</Column>
          <Column className="col-md-4">Price</Column>
          <Column className="col-md-4">Actions</Column>
        </Row>
        {locations.map((location, index) => (
          <Row className="row" key={index}>
            <Column className="col-md-3">{location.location}</Column>
            <Column className="col-md-3">{location.price}</Column>
            <Column className="col-md-3">
              <CustomIconArea>
                <DeleteButton onClick={() => console.log('first')} />
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