// import React from 'react';
import { useEffect, useState } from "react";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { API_ROOT } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteKeypoint,
  getKeypoints,
  reset,
} from "../../redux/service/keypointSlice";
import Loader from "../../components/loader";

const Services = () => {
  const dispatch = useAppDispatch();
  const { services, isDelete, totalCount, isLoading } = useAppSelector(
    (state) => state.services
  );
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(totalCount / 10);

  useEffect(() => {
    dispatch(getKeypoints({ page: pageNumber, limit: 10 }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, pageNumber]);

  const handleDelete = (id: number) => {
    dispatch(deleteKeypoint(id));
  };
  return (
    <div>
      <CardBody header="Service" to="/setup/services/create" />
      <Display>
        <div className="table">
          <Row className="row-table sm-table-width text-bold">
            <Column className="col-md-2 col-sm-2">Icon</Column>
            <Column className="col-md-2 col-sm-3">Url</Column>
            <Column className="col-md-2 col-sm-2">Title</Column>
            <Column className="col-md-2 col-sm-2">Sub Title</Column>
            <Column className="col-md-2 col-sm-1">Position</Column>
            <Column className="col-md-2 col-sm-2">Options</Column>
          </Row>

          {isLoading ? (
            <Loader />
          ) : (
            <>
              {services.map((service, index) => (
                <Row className="row-table sm-table-width" key={index}>
                  <Column className="col-md-2 col-sm-2">
                    <img
                      src={`${API_ROOT}/images/key-point/${service.image}`}
                      alt="service"
                    />
                  </Column>
                  <Column className="col-md-2 col-sm-3">{service.url}</Column>
                  <Column className="col-md-2 col-sm-2">{service.title}</Column>
                  <Column className="col-md-2 col-sm-2">{service.subtitle}</Column>
                  <Column className="col-md-2 col-sm-1">{service.group_by}</Column>

                  <Column className="col-md-2 col-sm-2">
                    <CustomIconArea>
                      <EditButton editUrl={`/setup/services/edit/${service.id}`} />
                      <DeleteButton
                        onClick={() => handleDelete(Number(service.id))}
                      />
                    </CustomIconArea>
                  </Column>
                </Row>
              ))}
            </>
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

export default Services;
