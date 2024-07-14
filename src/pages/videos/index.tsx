import { ChangeEvent, useEffect, useState } from "react";
import DeleteButton from "../../components/button/delete";
import EditButton from "../../components/button/edit";
import CardBody from "../../components/card-body";
import CustomIconArea from "../../components/custom-icon-area";
import Display from "../../components/display";
import Filter from "../../components/filter";
import ToggleButton from "../../components/forms/checkbox";
import Pagination from "../../components/pagination";
import Column from "../../components/table/column";
import Row from "../../components/table/row";
import { IVideo } from "../../interfaces/video";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteVideo,
  getVideos,
  updateVideo,
  reset
} from "../../redux/videos/videoSlice";
import { toast } from "react-toastify";

const VideosPage: React.FC = () => {
  const [displayItem, setDisplayItem] = useState(25);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const dispatch = useAppDispatch();

  const { totalCount, videos , isUpdate, isDelete, message} = useAppSelector((state) => state.videos);

  const totalPage = Math.ceil(totalCount / displayItem);

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleStatusChange = (video: IVideo) => {
    dispatch(updateVideo({ id: video.id, is_visible: !video.is_visible }));
    setTimeout(
      () => dispatch(getVideos({ page: pageNumber, limit: displayItem })),
      500
    );
  };

  const handleDeleteVideo = (video: number | string) => {
    dispatch(deleteVideo(video));
    setTimeout(
      () => dispatch(getVideos({ page: pageNumber, limit: displayItem })),
      500
    );
  };

  useEffect(() => {
    dispatch(getVideos({ page: pageNumber, limit: displayItem }));
    window.scrollTo(0, 0);
  }, [dispatch, pageNumber, displayItem]);

  useEffect(() => {
    if (isUpdate) {
      toast.success(`Video is updated successfully`);
    }
    if (isDelete) {
      toast.success(`Video is deleted successfully`);
    }

    return () => {
      dispatch(reset());
    };
  }, [isUpdate, dispatch, message, isDelete]);
  
  return (
    <div>
      <CardBody header="Videos" to="/videos/create" />
      <Display>
        <Filter handleDisplayItem={handleDisplayItem} />
        <Row className="row text-bold">
          <Column className="col-md-1">SI No.</Column>
          <Column className="col-md-4">Title</Column>
          <Column className="col-md-4">Link</Column>
          <Column className="col-md-1">Status</Column>
          <Column className="col-md-2">Options</Column>
        </Row>
        {videos.map((video: IVideo) => (
          <Row key={video.id} className="row">
            <Column className="col-md-1">{video.id}</Column>
            <Column className="col-md-4">{video.title}</Column>
            <Column className="col-md-4">{video.url}</Column>
            <Column className="col-md-1">
              <ToggleButton
                isChecked={video.is_visible}
                onClick={() => handleStatusChange(video)}
              />
            </Column>
            <Column className="col-md-2">
              <CustomIconArea>
                <EditButton editUrl={`/videos/edit/${video.id}`} />
                <DeleteButton
                  onClick={() => handleDeleteVideo(video.id as number)}
                />
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

export default VideosPage;
