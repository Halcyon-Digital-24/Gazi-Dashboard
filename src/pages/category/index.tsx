import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Filter from "../../components/filter";
import ToggleButton from "../../components/forms/checkbox";
import Loader from "../../components/loader";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { API_ROOT } from "../../constants";
import { ICategory } from "../../interfaces/category";
import {
  deleteCategory,
  getCategories,
  reset,
  updateCategory,
} from "../../redux/category/categorySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const Categories: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    categories,
    isUpdate,
    isSuccess,
    message,
    isDelete,
    errorMessage,
    totalCount,
    isLoading,
  } = useAppSelector((state) => state.category);
  const [displayItem, setDisplayItem] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const totalPage = Math.ceil(totalCount / displayItem);

  const handleVisibility = (category: ICategory) => {
    dispatch(
      updateCategory({
        slug: category.id as number,
        categoryData: { is_feature: !category.is_feature },
      })
    );
  };

  const handleDeleteCategory = (id: number) => {
    dispatch(deleteCategory(id));
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    dispatch(
      getCategories({ page: pageNumber, limit: displayItem, title: search })
    );
  }, [
    dispatch,
    isUpdate,
    isDelete,
    pageNumber,
    search,
    isSuccess,
    displayItem,
  ]);

  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
    if (errorMessage) {
      toast.error(`${errorMessage}`);
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, errorMessage]);

  return (
    <div>
      <CardBody header="Categories" to="/categories/create" />
      <Display>
        <Filter
          handleDisplayItem={handleDisplayItem}
          onSearch={onSearch}
          isFilter
        />
        <Row className="row text-bold">
          <Column className="col-md-3">Banner</Column>
          <Column className="col-md-3">Name</Column>
          <Column className="col-md-2"> Category Position</Column>
          <Column className="col-md-2">Featured</Column>
          <Column className="col-md-1">Options</Column>
        </Row>
        {isLoading ? (
          <Loader />
        ) : (
          categories.map((category, index) => (
            <Row className="row" key={index}>
              <Column className="col-md-3">
                {category.image ? (
                  <img
                    src={`${API_ROOT}/images/category/${category.image}`}
                    alt="brand"
                  />
                ) : (
                  "—"
                )}
              </Column>
              <Column className="col-md-3">{category.title}</Column>
              <Column className="col-md-2">{category.parent_category}</Column>
              <Column className="col-md-2">
                <ToggleButton
                  onClick={() => handleVisibility(category)}
                  isChecked={category.is_feature}
                />
              </Column>
              <Column className="col-md-1">
                <CustomIconArea>
                  <EditButton editUrl={`/categories/edit/${category.id}`} />
                  <DeleteButton
                    onClick={() => handleDeleteCategory(category.id as number)}
                  />
                </CustomIconArea>
              </Column>
            </Row>
          ))
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

export default Categories;
