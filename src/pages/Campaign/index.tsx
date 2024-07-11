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
import { deleteCampaign, getCampaign, reset, updateCampaign } from "../../redux/campaign/campaignSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { API_ROOT } from "../../constants";
import ToggleButton from "../../components/forms/checkbox";
import { ICampaign } from "../../interfaces/campaign";

const CampaignPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { campaigns, isDelete, totalCount, isUpdate } = useAppSelector(
    (state) => state.campaign
  );
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(totalCount / 10);

  const handleDeleteCampaign = (id: number) => {
    dispatch(deleteCampaign(id));
  };

  useEffect(() => {
    if (isDelete) {
      toast.success("Campaign deleted successfully");
    }
    if(isUpdate){
      toast.success('Campaign status updated')
    }
    dispatch(getCampaign({ page: pageNumber }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, pageNumber, isUpdate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const getProductCount = (productIdString: string | number) => {
    return String(productIdString).split(",").length;
  };

  const handleVisibility = (campaign: ICampaign) => {
    dispatch(
      updateCampaign({
        slug: Number(campaign.id),
        campaigndata: { is_visible: !campaign.is_visible },
      })
    );
  };

  return (
    <div>
      <CardBody header="Campaign" to="/campaign/create" />
      <Display>
        <Row className="row text-bold">
          <Column className="col-md-1">#</Column>
          <Column className="col-md-2">Banner</Column>
          <Column className="col-md-2">Campaign Name</Column>
          <Column className="col-md-1">Start Date</Column>
          <Column className="col-md-2">Expire Date</Column>
          <Column className="col-md-1">No. of Product</Column>
          <Column className="col-md-1">Status</Column>
          <Column className="col-md-2">Action</Column>
        </Row>
        {campaigns?.map((campaign, index) => (
          <Row className="row" key={index}>
            <Column className="col-md-1">{index + 1}</Column>
            <Column className="col-md-2">
              <img
                src={`${API_ROOT}/images/camping/${campaign.image}`}
                alt="brand"
                style={{ width: "100%", height: "auto" }}
              />
            </Column>
            <Column className="col-md-2">{campaign.name}</Column>
            <Column className="col-md-1">{formatDate(campaign.start_date)}</Column>
            <Column className="col-md-2">{formatDate(campaign.end_date)}</Column>
            <Column className="col-md-1">{getProductCount(campaign.product_id)}</Column>
            <Column className="col-md-1">
                    <ToggleButton
                    onClick={() => handleVisibility(campaign)}
                    isChecked={campaign.is_visible}
                  />
                  </Column>
            <Column className="col-md-2">
              <CustomIconArea>
                <EditButton editUrl={`/campaign/edit/${campaign.id}`} />
                <DeleteButton onClick={() => handleDeleteCampaign(campaign.id)} />
              </CustomIconArea>
            </Column>
          </Row>
        ))}
        <Pagination
          pageCount={pageNumber}
          handlePageClick={handlePageChange}
          totalPage={totalPage}
        />
      </Display>
    </div>
  );
};

export default CampaignPage;
