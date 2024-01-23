import { useEffect } from "react";
import { useForm } from "react-hook-form";
import CardBody from "../../components/card-body";
import Column from "../../components/table/column";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { reset, updateEmi } from "../../redux/emi/emiSlice";
import { Button } from "../../components/button";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../lib";

const UpdateEmi = () => {
  const { slug } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUpdate, message } = useAppSelector((state) => state.emi);

  const onSubmit = async (data) => {
    dispatch(updateEmi({ id: Number(slug), emiData: data }));
  };

  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);

      navigate("/emi");
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, dispatch, navigate, message]);

  useEffect(() => {
    const fetchEmiData = async () => {
      try {
        const response = await axios.get(`/emis/${slug}`);
        const data = response.data;
        setValue("bank_name", data.data.bank_name);
        setValue("three_months", data.data.three_months);
        setValue("six_months", data.data.six_months);
        setValue("nine_months", data.data.nine_months);
        setValue("twelve_months", data.data.twelve_months);
        setValue("eighteen_months", data.data.eighteen_months);
        setValue("twenty_four_months", data.data.twenty_four_months);
        setValue("thirty_months", data.data.thirty_months);
        setValue("thirty_six_months", data.data.thirty_six_months);
      } catch (error) {
        console.error("Error fetching EMI data:", error);
      }
    };
    fetchEmiData();
  }, [slug]);

  return (
    <div>
      <CardBody header="Available Emi" to="/emi" text="Back" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <Column className="col-md-12">
            <div className="text">
              <label htmlFor="name">Bank Name *</label>
              <input
                type="text"
                placeholder="Bank Name"
                {...register("bank_name", {
                  trim: true,
                  required: "Name is required",
                  pattern: {
                    value: /\S/,
                    message: "Enter a valid bank name",
                  },
                })}
              />
              {errors.bank_name && (
                <p className="validation__error">{errors.bank_name.message}</p>
              )}
            </div>
          </Column>
          <Column className="col-md-6">
            <div className="text">
              <label htmlFor="name">Three Months Rate</label>
              <input
                type="text"
                placeholder="rate"
                {...register("three_months", {
                  trim: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid rate (number only)",
                  },
                })}
              />
              {errors.three_months && (
                <p className="validation__error">
                  {errors.three_months.message}
                </p>
              )}
            </div>
            <div className="text">
              <label htmlFor="name">Nine Months Rate</label>
              <input
                type="text"
                placeholder="rate"
                {...register("nine_months", {
                  trim: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid rate (number only)",
                  },
                })}
              />
              {errors.nine_months && (
                <p className="validation__error">
                  {errors.nine_months.message}
                </p>
              )}
            </div>
            <div className="text">
              <label htmlFor="name">Eighteen Months Rate</label>
              <input
                type="text"
                placeholder="rate"
                {...register("eighteen_months", {
                  trim: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid rate (number only)",
                  },
                })}
              />
              {errors.eighteen_months && (
                <p className="validation__error">
                  {errors.eighteen_months.message}
                </p>
              )}
            </div>
            <div className="text">
              <label htmlFor="name">Thirty Months Rate</label>
              <input
                type="text"
                placeholder="rate"
                {...register("thirty_months", {
                  trim: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid rate (number only)",
                  },
                })}
              />
              {errors.thirty_months && (
                <p className="validation__error">
                  {errors.thirty_months.message}
                </p>
              )}
            </div>
          </Column>
          <Column className="col-md-6">
            <div className="text">
              <label htmlFor="name">Six Months Rate</label>
              <input
                type="text"
                placeholder="rate"
                {...register("six_months", {
                  trim: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid rate (number only)",
                  },
                })}
              />
              {errors.six_months && (
                <p className="validation__error">{errors.six_months.message}</p>
              )}
            </div>
            <div className="text">
              <label htmlFor="name">Twelve Months Rate</label>
              <input
                type="text"
                placeholder="rate"
                {...register("twelve_months", {
                  trim: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid rate (number only)",
                  },
                })}
              />
              {errors.twelve_months && (
                <p className="validation__error">
                  {errors.twelve_months.message}
                </p>
              )}
            </div>
            <div className="text">
              <label htmlFor="name">Twenty Four Months Rate</label>
              <input
                type="text"
                placeholder="rate"
                {...register("twenty_four_months", {
                  trim: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid rate (number only)",
                  },
                })}
              />
              {errors.twenty_four_months && (
                <p className="validation__error">
                  {errors.twenty_four_months.message}
                </p>
              )}
            </div>
            <div className="text">
              <label htmlFor="name">Thirty Six Months Rate</label>
              <input
                type="text"
                placeholder="rate"
                {...register("thirty_six_months", {
                  trim: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Enter a valid rate (number only)",
                  },
                })}
              />
              {errors.thirty_six_months && (
                <p className="validation__error">
                  {errors.thirty_six_months.message}
                </p>
              )}
            </div>
          </Column>
        </div>
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
};

export default UpdateEmi;
