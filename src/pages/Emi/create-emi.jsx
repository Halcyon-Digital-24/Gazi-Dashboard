import { useEffect } from "react";
import { useForm } from "react-hook-form";
import CardBody from "../../components/card-body";
import Column from "../../components/table/column";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createEmi, reset } from "../../redux/emi/emiSlice";
import { Button } from "../../components/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateEmi = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isCreate, message } = useAppSelector((state) => state.emi);

  const onSubmit = async (data) => {
    dispatch(createEmi(data));
  };

  useEffect(() => {
    if (isCreate) {
      toast.success(`${message}`);
      navigate("/emi");
    }
    return () => {
      dispatch(reset());
    };
  }, [isCreate, dispatch, navigate, message]);

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
                    message: "Enter a valid rate (numeric only)",
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
                    message: "Enter a valid rate (numeric only)",
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
                    message: "Enter a valid rate (numeric only)",
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
                    message: "Enter a valid rate (numeric only)",
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
                    message: "Enter a valid rate (numeric only)",
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
                    message: "Enter a valid rate (numeric only)",
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
                    message: "Enter a valid rate (numeric only)",
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
                    message: "Enter a valid rate (numeric only)",
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
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default CreateEmi;
