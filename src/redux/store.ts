import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./products/product-slice";
import blogsReducer from "./blogs/blogSlice";
import videosReducer from "./videos/videoSlice";
import faqsReducer from "./faqs/faqSlice";
import categoryReducer from "./category/categorySlice";
import addBannerReducer from "./add-banner/addBannerSlice";
import subscriberReducer from "./subscribe/subscribeSlice";
import pageReducer from "./pages/pageSlice";
import settingsReducer from "./settings/settingSlice";
import authReducer from "./auth/authSlice";
import emiReducer from "./emi/emiSlice";
import orderReducer from "./order/orderSlice";
import customerReducer from "./customer/customerSlice";
import serviceReducer from "./service/keypointSlice";
import menuReducer from "./menus/menuSlice";
import notificationReducer from "./notification/notificationSlice";
import queryReducer from "./query/querySlice";
import reviewReducer from "./review/reviewSlice";
import cartReducer from "./cart/cartSlice";
import locationReducer from "./location/locationSlice";
import couponReducer from "./coupon/couponSlice";
import campaignReducer from "./campaign/campaignSlice";
import refundReducer from "./refund/refundSlice";
import supportReducer from "./support/supportSlice";
import commentReducer from "./comments/commentSlice";
import roleReducer from "./roles/roleSlice";
import staffReducer from "./staff/staffSlice";
// ...
const store = configureStore({
  reducer: {
    product: productReducer,
    blogs: blogsReducer,
    videos: videosReducer,
    faqs: faqsReducer,
    category: categoryReducer,
    banner: addBannerReducer,
    subscribers: subscriberReducer,
    pages: pageReducer,
    settings: settingsReducer,
    auth: authReducer,
    emi: emiReducer,
    order: orderReducer,
    customer: customerReducer,
    services: serviceReducer,
    menu: menuReducer,
    notification: notificationReducer,
    query: queryReducer,
    review: reviewReducer,
    cart: cartReducer,
    location: locationReducer,
    coupon: couponReducer,
    campaign: campaignReducer,
    refund: refundReducer,
    support: supportReducer,
    comment: commentReducer,
    role: roleReducer,
    staff: staffReducer,
  },
  // devTools: false,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
