import { ChangeEvent, useEffect, useState } from "react";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { deleteEmi, getEmis, reset } from "../../redux/emi/emiSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import DeleteButton from "../../components/button/delete";
import { toast } from "react-toastify";
import Filter from "../../components/filter";
import { useDebounce } from "../../utills/debounce";
import Loader from "../../components/loader";

const EmiPage = () => {
  const dispatch = useAppDispatch();
  const { emis, totalCount, isDelete, message, isLoading } = useAppSelector(
    (state) => state.emi
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [onSearch, setOnSearch] = useState("");
  const [displayItem, setDisplayItem] = useState(25);
  const handleDelete = (id: number) => {
    dispatch(deleteEmi(id));
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };


  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      // Your search request logic here
      // console.log('Search query:', debouncedSearchQuery);
      setOnSearch(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery]);

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  const totalPage = Math.ceil(totalCount / displayItem);

  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
  }, [isDelete, message]);

  useEffect(() => {
    dispatch(getEmis({ page: pageNumber, limit: displayItem, bank_name: onSearch, }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, isDelete, onSearch, displayItem]);

  return (
    <div>
      <CardBody header="Available Emi" to="/emi/create"></CardBody>
      <Display>
        <Filter handleDisplayItem={handleDisplayItem} onSearch={handleOnSearch} isFilter />
        <div className="table">

          <Row className="row-table sm-table-width text-bold">
            <Column className="col-md-3 col-sm-2">Bank Name</Column>
            <Column className="col-md-1">Three months</Column>
            <Column className="col-md-1">Six Months</Column>
            <Column className="col-md-1">Nine Months</Column>
            <Column className="col-md-1">Twelve Months</Column>
            <Column className="col-md-1">Eighteen Months</Column>
            <Column className="col-md-1 col-sm-2">Twenty_four Months</Column>
            <Column className="col-md-1">Thirty Months</Column>
            <Column className="col-md-1">Thirty_six Months</Column>
            <Column className="col-md-1">Action</Column>
          </Row>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {emis.map((emi, index) => (
                <Row className="row-table sm-table-width" key={index}>
                  <Column className="col-md-3 col-sm-2">{emi.bank_name}</Column>
                  <Column className="col-md-1">{emi.three_months}</Column>
                  <Column className="col-md-1">{emi.six_months}</Column>
                  <Column className="col-md-1">{emi.nine_months}</Column>
                  <Column className="col-md-1">{emi.twelve_months}</Column>
                  <Column className="col-md-1">{emi.eighteen_months}</Column>
                  <Column className="col-md-1 col-sm-2">{emi.twenty_four_months}</Column>
                  <Column className="col-md-1">{emi.thirty_months}</Column>
                  <Column className="col-md-1">{emi.thirty_six_months}</Column>
                  <Column className="col-md-1">
                    <CustomIconArea>
                      <EditButton editUrl={`/emi/edit/${emi.id}`} />
                      <DeleteButton onClick={() => handleDelete(Number(emi?.id))} />
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

export default EmiPage;
