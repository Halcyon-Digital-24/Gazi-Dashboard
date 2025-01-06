import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { deleteCoupon, getCoupon, reset } from "../../redux/coupon/couponSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Loader from "../../components/loader";

const CouponPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { coupons, isDelete, totalCount, isLoading } = useAppSelector(
    (state) => state.coupon
  );
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(totalCount / 10);

  const handleDeleteCoupon = (id: number) => {
    dispatch(deleteCoupon(id));
  };

  useEffect(() => {
    if (isDelete) {
      toast.success("Coupon deleted successfully");
    }
    dispatch(getCoupon({ page: pageNumber }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, pageNumber]);

  return (
    <div>
      <CardBody header="Coupon" to="/coupons/create" />
      <Display>
        <div className="table">
          <Row className="row-table xs-table-width text-bold">
            <Column className="col-md-1">#</Column>
            <Column className="col-md-2">Code</Column>
            <Column className="col-md-1">Total</Column>
            <Column className="col-md-2">Type</Column>
            <Column className="col-md-2">Price</Column>
            <Column className="col-md-2">Stock</Column>
            <Column className="col-md-2">Action</Column>
          </Row>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {coupons.map((coupon, index) => (
                <Row className="row-table xs-table-width" key={index}>
                  <Column className="col-md-1">{coupon.id}</Column>
                  <Column className="col-md-2">{coupon.code}</Column>
                  <Column className="col-md-1">{coupon.total_coupons}</Column>
                  <Column className="col-md-2">{coupon.discount_type}</Column>
                  <Column className="col-md-2">{coupon.discount_amount}</Column>
                  <Column className="col-md-2">{coupon.total_coupons}</Column>
                  <Column className="col-md-2">
                    <CustomIconArea>
                      <EditButton editUrl={`/coupons/edit/${coupon.id}`} />
                      <DeleteButton onClick={() => handleDeleteCoupon(coupon.id)} />
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

export default CouponPage;
