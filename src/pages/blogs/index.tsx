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
import { BlogData } from "../../interfaces/blog";
import {
  deleteBlog,
  getBlogs,
  reset,
  updateBlog,
} from "../../redux/blogs/blogSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import Loader from "../../components/loader";

const Blogs: React.FC = () => {
  const [displayItem, setDisplayItem] = useState(25);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const dispatch = useAppDispatch();
  const {
    blogs,
    totalCount,
    isUpdate,
    isDelete,
    errorMessage,
    isError,
    message,
    isLoading,
  } = useAppSelector((state) => state.blogs);

  const totalPage = Math.ceil(totalCount / displayItem);

  const handleStatusChange = (blog: BlogData) => {
    dispatch(
      updateBlog({
        id: blog.id as number,
        blogData: { is_visible: !blog.is_visible },
      })
    );
  };

  const handleDeleteBlog = (blogId: number) => {
    dispatch(deleteBlog(blogId));
  };
  useEffect(() => {
    if (isDelete) {
      toast.success(`${message}`);
    }
    if (isError) {
      toast.error(`${errorMessage}`);
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isDelete, errorMessage]);

  useEffect(() => {
    dispatch(getBlogs({ page: pageNumber, limit: displayItem }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, pageNumber, displayItem, isUpdate, isDelete]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleDisplayItem = (e: ChangeEvent<HTMLSelectElement>) => {
    setDisplayItem(Number(e.target.value));
  };

  return (
    <div>
      <CardBody header="All Blogs" to="/blogs/create" />
      <Display>
        <Filter handleDisplayItem={handleDisplayItem} />
        <div className="table">
          <Row className="row-table sm-table-width text-bold">
            <Column className="col-md-1">SI No.</Column>
            <Column className="col-md-2">Title</Column>
            <Column className="col-md-6">Sort Description</Column>
            <Column className="col-md-1">Status</Column>
            <Column className="col-md-2">Options</Column>
          </Row>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {blogs.map((blog, index) => (
                <Row className="row-table sm-table-width" key={index}>
                  {/*  <Column className="col-md-1">
                <input
                  type="checkbox"
                  onClick={() => handleSelectedBlog(blog.id)}
                />
              </Column> */}
                  <Column className="col-md-1">{blog.id}</Column>
                  <Column className="col-md-2">{blog.title}</Column>
                  <Column className="col-md-6">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: blog.description?.substring(0, 100) ?? "",
                      }}
                    ></div>
                  </Column>
                  <Column className="col-md-1">
                    <ToggleButton
                      isChecked={blog.is_visible}
                      onClick={() => handleStatusChange(blog)}
                    />
                  </Column>
                  <Column className="col-md-2">
                    <CustomIconArea>
                      <EditButton editUrl={`/blogs/edit/${blog.id}`} />
                      <DeleteButton
                        onClick={() => handleDeleteBlog(blog.id as number)}
                      />
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

export default Blogs;
