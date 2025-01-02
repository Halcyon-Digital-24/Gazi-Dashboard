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
import { API_ROOT, API_URL } from "../../constants";
import { IAdBanner } from "../../interfaces/addBanner";
import axios from "../../lib";
import {
  deleteBanner,
  getAddBanner,
  updateAddBanner,
  reset
} from "../../redux/add-banner/addBannerSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import "./index.scss";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

const BannerPage = () => {
  const dispatch = useAppDispatch();
  const { isDelete, isUpdate, isLoading } = useAppSelector((state) => state.banner);
  const [addBanner, setAddBanner] = useState<IAdBanner[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [count, setCount] = useState(0);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(count / 10);
  const handleDelete = (id: number) => {
    dispatch(deleteBanner(id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/banners?not_slider=true&page=${pageNumber}`
        );
        setAddBanner(response?.data?.rows);
        setCount(response?.data?.count);
      } catch (error) {
        console.log("Banner data fetch error" + error);
      }
    };
    fetchData();
  }, [isUpdate, pageNumber]);
  const handleVisibility = (banner: IAdBanner) => {
    dispatch(
      updateAddBanner({
        id: Number(banner.id),
        bannerData: { is_visible: !banner.is_visible },
      })
    );
  };

  useEffect(() => {
    dispatch(getAddBanner({ page: pageNumber, not_slider: true }));
  }, [dispatch, isDelete, isUpdate, pageNumber]);
  useEffect(() => {
    if (isUpdate) {
      toast.success(`Banner status updated successfully`);
    }
    if (isDelete) {
      toast.success('Banner deleted successfully');
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, isDelete, dispatch]);

  return (
    <div>
      <CardBody header="Banner" to="/banner/create" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-3">Image</Column>
          <Column className="col-md-4">Url</Column>
          <Column className="col-md-2">Position</Column>
          <Column className="col-md-1">Status</Column>
          <Column className="col-md-2">Action</Column>
        </Row>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {addBanner?.map((banner, index) => (
              <Row key={index} className="row banner">
                <Column className="col-md-3">
                  <img
                    src={`${API_ROOT}/images/banner/${banner.image}`}
                    alt="banner"
                  />
                </Column>
                <Column className="col-md-4">{banner.url}</Column>
                <Column className="col-md-2">{banner.group_by}</Column>
                <Column className="col-md-1">
                  <ToggleButton
                    onClick={() => handleVisibility(banner)}
                    isChecked={banner.is_visible}
                  />
                </Column>
                <Column className="col-md-2">
                  <CustomIconArea>
                    <EditButton editUrl={`/banner/edit/${banner.id}`} />
                    <DeleteButton
                      onClick={() => handleDelete(banner.id as number)}
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

export default BannerPage;
