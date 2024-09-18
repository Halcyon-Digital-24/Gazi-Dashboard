import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../components/button";
import CardBody from "../../components/card-body";
import Display from "../../components/display";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getSettings,
  reset,
  updateSettings,
} from "../../redux/settings/settingSlice";

const PaymentMessage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useAppDispatch();
  const { setting, isSuccess, isUpdate, message } = useAppSelector(
    (state) => state.settings
  );

  const onSubmit = (data) => {
    dispatch(updateSettings(data));
  };

  useEffect(() => {
    if (isUpdate) {
      toast.success(`${message}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [isUpdate, dispatch]);

  useEffect(() => {
    dispatch(getSettings());
    setValue("cash_on_message", setting.cash_on_message);
    setValue("online_payment_message", setting.online_payment_message);
  }, [dispatch, isSuccess, isUpdate]);

  return (
    <div>
      <CardBody header="Payment Message" to="/" text="back" />
      <Display>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="textarea">
            <label htmlFor="textarea">Cash on message</label>
            <textarea
              {...register("cash_on_message", {
                required: "Cash on payment message is required",
                trim: true,
                pattern: {
                  value: /\S/,
                  message: "Enter Valid Meta Description",
                },
              })}
              id="textarea"
              placeholder="Cash on payment message"
            />
            {errors.cash_on_message && (
              <p className="validation__error">
                {errors.cash_on_message.message}
              </p>
            )}
          </div>
          <div className="textarea">
            <label htmlFor="textarea">online payment message</label>
            <textarea
              {...register("online_payment_message", {
                required: "Online payment message is required",
                trim: true,
                pattern: {
                  value: /\S/,
                  message: "Enter Valid Meta Description",
                },
              })}
              id="textarea"
              placeholder="Online payment message"
            />
            {errors.online_payment_message && (
              <p className="validation__error">
                {errors.online_payment_message.message}
              </p>
            )}
          </div>

          <div>
            <Button type="submit">Update </Button>
          </div>
        </form>
      </Display>
    </div>
  );
};

export default PaymentMessage;
