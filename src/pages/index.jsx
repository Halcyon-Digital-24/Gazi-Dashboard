import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import {
  AllOrders,
  AllProducts,
  Attributes,
  BannerPage,
  BlogComment,
  Blogs,
  Canceled,
  Categories,
  CommonPages,
  CouponPage,
  CampaignPage,
  CreateCampaign,
  CreateAttributes,
  CreateBanner,
  CreateBlog,
  CreateCategory,
  CreateCoupon,
  CreateEmi,
  CreateFaq,
  CreateMenu,
  CreateNotification,
  CreatePage,
  CreateProduct,
  CreateProfile,
  CreateService,
  CreateShipping,
  CreateSlider,
  CreateVideo,
  CustomOrder,
  Customers,
  Delivered,
  EmiPage,
  FaqPage,
  Home,
  Menus,
  Notification,
  OrderView,
  PaymentMessage,
  PendingOrders,
  Profile,
  Queries,
  Replay,
  Reviews,
  Services,
  Settings,
  SetupPage,
  Shipping,
  Sliders,
  Staff,
  StockOutProducts,
  Subscriber,
  TicketPage,
  UpdateAttribute,
  UpdateBanner,
  UpdateBlog,
  UpdateCategory,
  UpdateCoupon,
  UpdateEmi,
  UpdateFaq,
  UpdateMenu,
  UpdateOrder,
  UpdatePage,
  UpdateProduct,
  UpdateService,
  UpdateShipping,
  UpdateSlider,
  UpdateVideo,
  UpdateCampaign,
  VideosPage,
  Warranty,
  WarrantyDetails,
  Csv,
  CreateRole,
  Roles,
  UpdateRole,
  UpdateProfile,
  SettingPage,
  HtmlGenerator,
} from "./pages";
import CustomInvoice from "./orders/custom-invoice";
import Forbidden from "./Forbidden/Forbidden";
import NotFound from "./NotFound/NotFound"

function PageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/profile/:slug" element={<Profile />} />
      <Route path="/html-generator" element={<HtmlGenerator />} />
      <Route path="/forbidden" element={<Forbidden />} />

      {/* Forbidden page route */}
      {/* Category Routes */}
      <Route
        path="/category"
        element={
          <ProtectedRoute permission="categories">
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/create"
        element={
          <ProtectedRoute permission="categories">
            <CreateCategory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/edit/:slug"
        element={
          <ProtectedRoute permission="categories">
            <UpdateCategory />
          </ProtectedRoute>
        }
      />
      {/* Products Routes */}
      <Route
        path="/products"
        element={
          <ProtectedRoute permission="products">
            <AllProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/edit/:slug"
        element={
          <ProtectedRoute permission="products">
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/create"
        element={
          <ProtectedRoute permission="products">
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/stockout"
        element={
          <ProtectedRoute permission="products">
            <StockOutProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/reviews"
        element={
          <ProtectedRoute permission="products">
            <Reviews />
          </ProtectedRoute>
        }
      />
      {/* Attributes Routes */}
      <Route
        path="/attributes"
        element={
          <ProtectedRoute permission="products">
            <Attributes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attributes/create"
        element={
          <ProtectedRoute permission="products">
            <CreateAttributes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attributes/edit/:slug"
        element={
          <ProtectedRoute permission="products">
            <UpdateAttribute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/csv"
        element={
          <ProtectedRoute permission="products">
            <Csv />
          </ProtectedRoute>
        }
      />
      {/* Orders Routes */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute permission="orders">
            <AllOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/views/:slug"
        element={
          <ProtectedRoute permission="orders">
            <OrderView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/edit/:slug"
        element={
          <ProtectedRoute permission="orders">
            <UpdateOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/custom"
        element={
          <ProtectedRoute permission="orders">
            <CustomOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/custom-invoice"
        element={
          <ProtectedRoute permission="orders">
            <CustomInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/pending"
        element={
          <ProtectedRoute permission="orders">
            <PendingOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/delivered"
        element={
          <ProtectedRoute permission="orders">
            <Delivered />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/canceled"
        element={
          <ProtectedRoute permission="orders">
            <Canceled />
          </ProtectedRoute>
        }
      />
      {/* Refund Routes */}
      <Route
        path="/refund"
        element={
          <ProtectedRoute permission="refund">
            <Warranty />
          </ProtectedRoute>
        }
      />
      <Route
        path="/refund/:slug"
        element={
          <ProtectedRoute permission="refund">
            <WarrantyDetails />
          </ProtectedRoute>
        }
      />
      {/* Blogs Routes */}
      <Route
        path="/blogs"
        element={
          <ProtectedRoute permission="blogs">
            <Blogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/create"
        element={
          <ProtectedRoute permission="blogs">
            <CreateBlog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/edit/:slug"
        element={
          <ProtectedRoute permission="blogs">
            <UpdateBlog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/comments"
        element={
          <ProtectedRoute permission="blogs">
            <BlogComment />
          </ProtectedRoute>
        }
      />
      {/* Customers Routes */}
      <Route
        path="/customers"
        element={
          <ProtectedRoute permission="customers">
            <Customers />
          </ProtectedRoute>
        }
      />
      {/* Notifications Routes */}
      <Route
        path="/notification"
        element={
          <ProtectedRoute permission="notifications">
            <Notification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notification/create"
        element={
          <ProtectedRoute permission="notifications">
            <CreateNotification />
          </ProtectedRoute>
        }
      />
      {/* Videos Routes */}
      <Route
        path="/videos"
        element={
          <ProtectedRoute permission="videos">
            <VideosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos/create"
        element={
          <ProtectedRoute permission="videos">
            <CreateVideo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos/edit/:slug"
        element={
          <ProtectedRoute permission="videos">
            <UpdateVideo />
          </ProtectedRoute>
        }
      />
      {/* Marketing & Coupons Routes */}
      <Route
        path="/coupons"
        element={
          <ProtectedRoute permission="marketing">
            <CouponPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coupons/create"
        element={
          <ProtectedRoute permission="marketing">
            <CreateCoupon />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coupons/edit/:slug"
        element={
          <ProtectedRoute permission="marketing">
            <UpdateCoupon />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaign"
        element={
          <ProtectedRoute permission="marketing">
            <CampaignPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaign/create"
        element={
          <ProtectedRoute permission="marketing">
            <CreateCampaign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaign/edit/:slug"
        element={
          <ProtectedRoute permission="marketing">
            <UpdateCampaign />
          </ProtectedRoute>
        }
      />
      {/* Ads Routes */}
      <Route
        path="/banner"
        element={
          <ProtectedRoute permission="ads">
            <BannerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banner/edit/:slug"
        element={
          <ProtectedRoute permission="ads">
            <UpdateBanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banner/create"
        element={
          <ProtectedRoute permission="ads">
            <CreateBanner />
          </ProtectedRoute>
        }
      />
      {/* Support Routes */}
      <Route
        path="/support"
        element={
          <ProtectedRoute permission="support">
            <TicketPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support/:slug"
        element={
          <ProtectedRoute permission="support">
            <Replay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/queries"
        element={
          <ProtectedRoute permission="support">
            <Queries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriber"
        element={
          <ProtectedRoute permission="support">
            <Subscriber />
          </ProtectedRoute>
        }
      />
      {/* Payment Routes */}
      <Route
        path="/emi"
        element={
          <ProtectedRoute permission="payment">
            <EmiPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emi/create"
        element={
          <ProtectedRoute permission="payment">
            <CreateEmi />
          </ProtectedRoute>
        }
      />
      <Route
        path="/emi/edit/:slug"
        element={
          <ProtectedRoute permission="payment">
            <UpdateEmi />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-message"
        element={
          <ProtectedRoute permission="payment">
            <PaymentMessage />
          </ProtectedRoute>
        }
      />
      {/* Settings & Setup Routes */}
      <Route
        path="/setup/home-page"
        element={
          <ProtectedRoute permission="setting">
            <SetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/setting"
        element={
          <ProtectedRoute permission="setting">
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/pages"
        element={
          <ProtectedRoute permission="setting">
            <CommonPages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/pages/create"
        element={
          <ProtectedRoute permission="setting">
            <CreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/pages/edit/:slug"
        element={
          <ProtectedRoute permission="setting">
            <UpdatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/menus"
        element={
          <ProtectedRoute permission="setting">
            <Menus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/menus/create"
        element={
          <ProtectedRoute permission="setting">
            <CreateMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/menus/edit/:slug"
        element={
          <ProtectedRoute permission="setting">
            <UpdateMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/services"
        element={
          <ProtectedRoute permission="setting">
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/services/create"
        element={
          <ProtectedRoute permission="setting">
            <CreateService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/services/edit/:slug"
        element={
          <ProtectedRoute permission="setting">
            <UpdateService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/sliders"
        element={
          <ProtectedRoute permission="setting">
            <Sliders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/sliders/create"
        element={
          <ProtectedRoute permission="setting">
            <CreateSlider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup/sliders/edit/:slug"
        element={
          <ProtectedRoute permission="setting">
            <UpdateSlider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipping"
        element={
          <ProtectedRoute permission="setting">
            <Shipping />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipping/create"
        element={
          <ProtectedRoute permission="setting">
            <CreateShipping />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipping/edit/:slug"
        element={
          <ProtectedRoute permission="setting">
            <UpdateShipping />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-settings"
        element={
          <ProtectedRoute permission="setting">
            <SettingPage />
          </ProtectedRoute>
        }
      />
      {/* Staff & Roles Routes */}
      <Route
        path="/staffs"
        element={
          <ProtectedRoute permission="staff">
            <Staff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staffs/create"
        element={
          <ProtectedRoute permission="staff">
            <CreateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staffs/edit/:slug"
        element={
          <ProtectedRoute permission="staff">
            <UpdateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <ProtectedRoute permission="staff">
            <Roles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles/create"
        element={
          <ProtectedRoute permission="staff">
            <CreateRole />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles/edit/:slug"
        element={
          <ProtectedRoute permission="staff">
            <UpdateRole />
          </ProtectedRoute>
        }
      />
      {/* FAQs Routes */}
      <Route
        path="/faqs"
        element={
          <ProtectedRoute permission="faqs">
            <FaqPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faqs/create"
        element={
          <ProtectedRoute permission="faqs">
            <CreateFaq />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faqs/edit/:slug"
        element={
          <ProtectedRoute permission="faqs">
            <UpdateFaq />
          </ProtectedRoute>
        }
      />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PageRoutes;
