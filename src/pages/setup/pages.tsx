import { useEffect, useState } from "react";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deletePages, getPages, reset } from "../../redux/pages/pageSlice";
import { toast } from "react-toastify";
import ViewButton from "../../components/button/view";
import Loader from "../../components/loader";

const CommonPages: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pages, isDelete, totalCount, isError, errorMessage, message, isLoading } =
    useAppSelector((state) => state.pages);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(totalCount / 10);
  const handlePageDelete = (pageNumber: number) => {
    dispatch(deletePages(pageNumber));
  };
  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
    if (isError) {
      toast.error(`${errorMessage}`);
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, errorMessage, isError]);

  useEffect(() => {
    dispatch(getPages({ page: pageNumber }));
  }, [dispatch, isDelete, pageNumber]);

  return (
    <div>
      <CardBody header="Add More Pages" to="/setup/pages/create" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-3">#</Column>
          <Column className="col-md-3">Page Name</Column>
          <Column className="col-md-3">Slug</Column>
          <Column className="col-md-3">Action</Column>
        </Row>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {pages.map((page, index) => (
              <Row key={index} className="row">
                <Column className="col-md-3">{index + 1}</Column>
                <Column className="col-md-3">{page.title}</Column>
                <Column className="col-md-3">{page.slug}</Column>
                <Column className="col-md-3">
                  <CustomIconArea>
                    <ViewButton target="_blank" href={`https://gcart.com.bd/${page.slug}`} />
                    <EditButton editUrl={`/setup/pages/edit/${page.id}`} />
                    <DeleteButton
                      onClick={() => handlePageDelete(page.id as number)}
                    />
                  </CustomIconArea>
                </Column>
              </Row>
            ))}
          </>
        )}

        <Pagination
          pageCount={pageNumber}
          handlePageClick={handlePageChange}
          totalPage={totalPage}
        />
      </Display>
    </div>
  );
};

export default CommonPages;
