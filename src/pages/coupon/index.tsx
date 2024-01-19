import { useEffect } from "react";
import { toast } from "react-toastify";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { deleteCoupon, getCoupon, reset } from "../../redux/coupon/couponSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const CouponPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { coupons, isDelete } = useAppSelector((state) => state.coupon);

  const handleDeleteCoupon = (id: number) => {
    dispatch(deleteCoupon(id));
  };

  useEffect(() => {
    if (isDelete) {
      toast.success("Coupon deleted successfully");
    }
    dispatch(getCoupon({}));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete]);

  return (
    <div>
      <CardBody header="Coupon" to="/coupons/create" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-1">#</Column>
          <Column className="col-md-2">Code</Column>
          <Column className="col-md-1">Total</Column>
          <Column className="col-md-2">Type</Column>
          <Column className="col-md-2">Price</Column>
          <Column className="col-md-2">Stock</Column>
          <Column className="col-md-2">Action</Column>
        </Row>
        {coupons.map((coupon, index) => (
          <Row className="row" key={index}>
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
      </Display>
    </div>
  );
};

export default CouponPage;
