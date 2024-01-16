import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Display from "../../components/display";
import FileInput from "../../components/forms/file-input";
import { Button } from "../../components/button";
import "./csv.scss";
import { BsDownload } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  csvProduct,
  reset,
  uploadCsvProduct,
} from "../../redux/products/product-slice";
import { toast } from "react-toastify";

const Csv: React.FC = () => {
  const dispatch = useAppDispatch();
  const { csvFile, isError, errorMessage, isCsvUpload, message } =
    useAppSelector((state) => state.product);
  const [csv, setCsv] = useState<File | null>(null);

  useEffect(() => {
    dispatch(csvProduct());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(`${errorMessage}`);
    }
    if (isCsvUpload) {
      toast.success(`${message}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isCsvUpload, dispatch, errorMessage, message]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setCsv(file);
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (csv !== null) {
      formData.append("csv", csv);
    }
    dispatch(uploadCsvProduct(formData));
  };

  return (
    <div className="csv-area">
      <Display>
        <div className="download">
          <a
            href={`data:text/csv;charset=utf-8,${escape(csvFile)}`}
            download="products.csv"
            className="download d-block"
          >
            <BsDownload title="Export Csv" />
          </a>
        </div>
        <h6>Step 1:</h6>
        <p>1. Download the skeleton file and fill it with proper data.</p>
        <p>
          2. You can download the example file to understand how the data must
          be filled.
        </p>
        <p>
          3. Once you have downloaded and filled the skeleton file, upload it in
          the form below and submit.
        </p>
        <p className="last">
          4. After uploading products you need to edit them and set product's
          images and choices.
        </p>
        <Button>Download Demo</Button>
      </Display>
      <Display>
        <form onSubmit={handleSubmit}>
          <FileInput onChange={handleFileChange} required />
          <Button type="submit">Upload CSV</Button>
        </form>
      </Display>
    </div>
  );
};

export default Csv;
