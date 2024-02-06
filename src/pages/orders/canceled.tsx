import { ChangeEvent, useEffect, useState } from "react";
import Display from "../../components/display";
import OrderTable from "../../components/order-table";
import Pagination from "../../components/pagination";
import Filter from "../../components/filter";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOrders } from "../../redux/order/orderSlice";
import { toast } from "react-toastify";
import { reset } from "../../redux/products/product-slice";

const Canceled: React.FC = () => {
  const dispatch = useAppDispatch();
  const [displayItem, setDisplayItem] = useState(25);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { orders, isDelete, totalCount } = useAppSelector(
    (state) => state.order
  );
  const totalPage = Math.ceil(totalCount / displayItem);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  useEffect(() => {
    dispatch(getOrders({ order_status: "cancel" }));
  }, [dispatch]);

  useEffect(() => {
    if (isDelete) {
      toast.success("Order deleted successfully");
      dispatch(getOrders({ order_status: "delivered" }));
    }
    return () => {
      dispatch(reset());
    };
  }, [isDelete, dispatch]);

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };
  return (
    <Display>
      <Filter handleDisplayItem={handleDisplayItem} />
      <OrderTable orders={orders} />
      <Pagination
        pageCount={pageNumber}
        handlePageClick={handlePageChange}
        totalPage={totalPage}
      />
    </Display>
  );
};

export default Canceled;
