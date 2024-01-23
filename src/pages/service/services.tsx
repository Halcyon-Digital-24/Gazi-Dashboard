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

const Services = () => {
  const dispatch = useAppDispatch();
  const { services, isDelete, totalCount } = useAppSelector(
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
        <Row className="row text-bold">
          <Column className="col-md-2">Icon</Column>
          <Column className="col-md-2">Url</Column>
          <Column className="col-md-2">Title</Column>
          <Column className="col-md-2">Sub Title</Column>
          <Column className="col-md-2">Position</Column>
          <Column className="col-md-2">Options</Column>
        </Row>
        {services.map((service, index) => (
          <Row className="row" key={index}>
            <Column className="col-md-2">
              <img
                src={`${API_ROOT}/images/key-point/${service.image}`}
                alt="service"
              />
            </Column>
            <Column className="col-md-2">{service.url}</Column>
            <Column className="col-md-2">{service.title}</Column>
            <Column className="col-md-2">{service.subtitle}</Column>
            <Column className="col-md-2">{service.group_by}</Column>

            <Column className="col-md-2">
              <CustomIconArea>
                <EditButton editUrl={`/setup/services/edit/${service.id}`} />
                <DeleteButton
                  onClick={() => handleDelete(Number(service.id))}
                />
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

export default Services;
