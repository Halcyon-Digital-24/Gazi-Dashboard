import { ChangeEvent, useEffect, useState } from "react";
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
import Filter from "../../components/filter";
import { DateRangePicker } from "rsuite";
import { formatDateForURL } from "../../utills/formateDate";
import { useDebounce } from "../../utills/debounce";
import { updateProduct } from "../../redux/products/product-slice"; // Import the updateProduct action

const CampaignPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { campaigns, isDelete, totalCount, isUpdate } = useAppSelector(
    (state) => state.campaign
  );
  const { products } = useAppSelector((state) => state.product); // Add this line to get the products state
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [onSearch, setOnSearch] = useState("");
  const [displayItem, setDisplayItem] = useState(25);
  const [orderDate, setOrderDate] = useState<[Date, Date] | null>(null);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };
  const totalPage = Math.ceil(totalCount / displayItem);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce delay

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      // Your search request logic here
      // // console.log('Search query:', debouncedSearchQuery);
      setOnSearch(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery]);

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  const handleDeleteCampaign = async (id: number) => {
    const campaign = campaigns.find(campaign => campaign.id === id);
    if (!campaign) return;

    // console.log('Campaign found:', campaign);

    const productIds: number[] = typeof campaign.product_id === 'string'
      ? JSON.parse(campaign.product_id)
      : campaign.product_id;

    // console.log('Product IDs:', productIds);

  

    productIds.forEach((productId: number) => {
      const product = products.find(product => product.id === productId);
      if (product && product.id !== undefined) {
        // console.log('Updating product:', product);
        const updatedProductData = {
          ...product,
          discount_price: 0,
          camping_name: null,
          camping_id: null,
        };
        dispatch(updateProduct({ id: product.id, productData: updatedProductData }));
        dispatch(deleteCampaign(id));
      }
    });
  };

  useEffect(() => {
    if (isDelete) {
      toast.success("Campaign deleted successfully");
    }
    if (isUpdate) {
      toast.success('Campaign status updated')
    }
    dispatch(getCampaign({
      search: onSearch,
      page: pageNumber,
      limit: displayItem,
      start_date: orderDate ? formatDateForURL(orderDate[0]) : "",
      end_date: orderDate ? formatDateForURL(orderDate[1]) : "",
    }));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, pageNumber, isUpdate, onSearch, displayItem, orderDate]);

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
        <div className="date-area">
          <DateRangePicker
            className={`date-area`}
            value={orderDate}
            onChange={(dateRange) => setOrderDate(dateRange)}
          />
        </div>
        <Filter handleDisplayItem={handleDisplayItem} onSearch={handleOnSearch} isFilter />
      </Display>
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
