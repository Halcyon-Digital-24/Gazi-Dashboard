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
import Overflow from "../../components/overflow";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { API_ROOT } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteProduct,
  getProducts,
  reset,
  updateProduct,
} from "../../redux/products/product-slice";
import "./index.scss";

const AllProducts: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [onSearch, setOnSearch] = useState("");
  const dispatch = useAppDispatch();
  const [displayItem, setDisplayItem] = useState<number>(25);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sort_by, setSortBy] = useState("");

  const { products, isDelete, totalCount, isUpdate, message, isLoading } =
    useAppSelector((state) => state.product);
  const totalPage = Math.ceil(totalCount / displayItem);

  const handleOnSearch = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOnSearch(e.target.value);
  };

  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
    dispatch(
      getProducts({
        page: pageNumber,
        limit: displayItem,
        search: onSearch,
        sort_by: sort_by,
      })
    );
    return () => {
      dispatch(reset());
    };
  }, [
    dispatch,
    pageNumber,
    displayItem,
    isUpdate,
    isDelete,
    onSearch,
    message,
    sort_by,
  ]);

  const handleAllSelectedProducts = (e: ChangeEvent<HTMLInputElement>) => {
    const productIds = products.map((product) => Number(product.id));
    if (e.target.checked) {
      setSelectedProducts(productIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectedProducts = (productsId: number) => {
    const selectedProductsSet = new Set(selectedProducts);

    if (selectedProductsSet.has(productsId)) {
      selectedProductsSet.delete(productsId);
    } else {
      selectedProductsSet.add(productsId);
    }

    setSelectedProducts(Array.from(selectedProductsSet));
  };

  const handleMultiDelete = () => {
    dispatch(deleteProduct([...selectedProducts]));
  };

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleKeyPoint = (
    id: number,
    updateData: { [key: string]: string | number | boolean }
  ) => {
    dispatch(updateProduct({ id, productData: updateData }));
  };

  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);
    }

    return () => {
      dispatch(reset());
    };
  }, [isUpdate, dispatch, message]);

  return (
    <div>
      <CardBody header="Product" to="/products/create" />
      <Display>
        <Filter
          handleDisplayItem={handleDisplayItem}
          onSearch={handleOnSearch}
          leftElements={
            <div className="action">
              <Overflow title="Bulk Action">
                <div onClick={handleMultiDelete}>Delete Selection</div>
              </Overflow>
              <Overflow title="Sort By">
                <div onClick={() => setSortBy("high")}>
                  Price {"(high > low)"}
                </div>
                <div onClick={() => setSortBy("low")}>
                  Price {"(low > high)"}
                </div>
                <div onClick={() => setSortBy("")}>
                  <p>Latest</p>
                </div>
                <div onClick={() => setSortBy("oldest")}>
                  <p>Oldest</p>
                </div>
              </Overflow>
            </div>
          }
          isFilter
        />
        <Row className="row text-bold">
          <Column className="col-md-1">
            <input
              id="select-all"
              type="checkbox"
              onChange={(e) => handleAllSelectedProducts(e)}
              name=""
            />
            {/* <label htmlFor="select-all">Select</label> */}
          </Column>
          <Column className="col-md-1">Images</Column>
          <Column className="col-md-3">Name</Column>
          <Column className="col-md-1">Stock</Column>
          <Column className="col-md-1">Regular Price</Column>
          <Column className="col-md-1">Discount Price</Column>
          <Column className="col-md-1">Status</Column>
          <Column className="col-md-1">Show Home Page</Column>
          <Column className="col-md-2">Action</Column>
        </Row>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {products.map((product, index) => (
              <Row key={index} className="row">
                <Column className="col-md-1">
                  <input
                    checked={selectedProducts.includes(product.id as number)}
                    onClick={() => handleSelectedProducts(product.id as number)}
                    type="checkbox"
                    name=""
                    id=""
                  />
                </Column>
                <Column className="col-md-1">
                  <img
                    src={`${API_ROOT}/images/product/${product.image}`}
                    alt="brand"
                  />
                </Column>
                <Column className="col-md-3">{product.title}</Column>
                <Column className="col-md-1">{product.quantity}</Column>
                <Column className="col-md-1">৳ {product.regular_price}</Column>
                <Column className="col-md-1">৳ {product.discount_price}</Column>
                <Column className="col-md-1">
                  <ToggleButton
                    onClick={() =>
                      handleKeyPoint(product.id as number, {
                        is_visible: product.is_visible == 0 ? 1 : 0,
                      })
                    }
                    isChecked={Boolean(product.is_visible)}
                  />
                </Column>
                <Column className="col-md-1">
                  <ToggleButton
                    onClick={() =>
                      handleKeyPoint(product.id as number, {
                        is_homepage: !product.is_homepage,
                      })
                    }
                    isChecked={product.is_homepage}
                  />
                </Column>
                <Column className="col-md-2">
                  <CustomIconArea>
                    <EditButton editUrl={`/products/edit/${product.id}`} />
                    <DeleteButton
                      onClick={() =>
                        dispatch(deleteProduct([product.id as number]))
                      }
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

export default AllProducts;
