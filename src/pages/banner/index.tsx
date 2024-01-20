import { useEffect, useState } from "react";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import ToggleButton from "../../components/forms/checkbox";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { API_ROOT, API_URL } from "../../constants";
import { IAdBanner } from "../../interfaces/addBanner";
import axios from "../../lib";
import {
  deleteBanner,
  getAddBanner,
  updateAddBanner,
} from "../../redux/add-banner/addBannerSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import "./banner.scss";

const BannerPage = () => {
  const dispatch = useAppDispatch();
  const { isDelete, isUpdate } = useAppSelector((state) => state.banner);
  const [addBanner, setAddBanner] = useState<IAdBanner[]>([]);
  const handleDelete = (id: number) => {
    dispatch(deleteBanner(id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/banners?not_slider=true`);
        setAddBanner(response?.data?.rows);
      } catch (error) {
        console.log("Banner data fetch error" + error);
      }
    };
    fetchData();
  }, [isUpdate]);
  const handleVisibility = (banner: IAdBanner) => {
    dispatch(
      updateAddBanner({
        id: Number(banner.id),
        bannerData: { is_visible: !banner.is_visible },
      })
    );
    dispatch(getAddBanner());
  };

  useEffect(() => {
    dispatch(getAddBanner());
  }, [dispatch, isDelete, isUpdate]);

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
      </Display>
    </div>
  );
};

export default BannerPage;
