import { useEffect, useState } from "react";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import ToggleButton from "../../components/forms/checkbox";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { IFaq } from "../../interfaces/faq";
import {
  deleteFaq,
  getFaqs,
  reset,
  updateFaq,
} from "../../redux/faqs/faqSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

const FaqPage: React.FC = () => {
  const { faqs, isUpdate, totalCount, isDelete, isLoading } = useAppSelector(
    (state) => state.faqs
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const dispatch = useAppDispatch();

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(totalCount / 25);

  useEffect(() => {
    dispatch(getFaqs({ page: pageNumber, limit: 25 }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, isUpdate, pageNumber]);

   useEffect(() => {
    if (isUpdate) {
      toast.success(`Faq status updated successfully`);
    }
    if (isDelete) {
      toast.success('Faq delete successfully');
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, isDelete, dispatch]); 

  const handleStatusChange = (faq: IFaq) => {
    dispatch(updateFaq({ id: faq.id, is_visible: !faq.is_visible }));
  };

  const handleDeleteVideo = (id: number) => {
    dispatch(deleteFaq(id));
  };

  return (
    <div>
      <CardBody header="FAQ" to="/faqs/create" />
      <Display>
        <div className="table">
        <Row className="row-table sm-table-width text-bold">
          <Column className="col-md-1 col-sm-1">SI No.</Column>
          <Column className="col-md-4 col-sm-3">Questions</Column>
          <Column className="col-md-5 col-sm-5">Answers</Column>
          <Column className="col-md-1 col-sm-1">Status</Column>
          <Column className="col-md-1 col-sm-2">Actions</Column>
        </Row>
        {isLoading ? (
          <Loader />
        ) : (
          <>
          {faqs?.map((faq, index) => (
          <Row className="row-table sm-table-width" key={index}>
            <Column className="col-md-1 col-sm-1">{faq.id}</Column>
            <Column className="col-md-4 col-sm-3">{faq.question}</Column>
            <Column className="col-md-5 col-sm-5">{faq.answer}</Column>
            <Column className="col-md-1 col-sm-1">
              <ToggleButton
                isChecked={faq.is_visible}
                onClick={() => handleStatusChange(faq)}
              />
            </Column>
            <Column className="col-md-1 col-sm-2">
              <CustomIconArea>
                <EditButton editUrl={`/faqs/edit/${faq.id}`} />
                <DeleteButton
                  onClick={() => handleDeleteVideo(faq.id as number)}
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

export default FaqPage;
