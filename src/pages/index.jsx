import { Route, Routes } from "react-router-dom";
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
  Error,
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
  VideosPage,
  Warranty,
  WarrantyDetails,
  Csv,
} from "./pages";

function PageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* categories */}
      <Route path="/category" element={<Categories />} />
      <Route path="/categories/create" element={<CreateCategory />} />
      <Route path="/categories/edit/:slug" element={<UpdateCategory />} />

      {/* Products */}
      <Route path="/products" element={<AllProducts />} />
      <Route path="/products/edit/:slug" element={<UpdateProduct />} />
      <Route path="/products/create" element={<CreateProduct />} />
      <Route path="/products/stockout" element={<StockOutProducts />} />
      <Route path="/products/reviews" element={<Reviews />} />
      <Route path="/attributes" element={<Attributes />} />
      <Route path="/attributes/create" element={<CreateAttributes />} />
      <Route path="/attributes/edit/:slug" element={<UpdateAttribute />} />

      {/* Orders */}
      <Route path="/orders" element={<AllOrders />} />
      <Route path="/csv" element={<Csv />} />
      <Route path="/orders/pending" element={<PendingOrders />} />
      <Route path="/orders/delivered" element={<Delivered />} />
      <Route path="/orders/canceled" element={<Canceled />} />
      <Route path="/orders/custom" element={<CustomOrder />} />
      <Route path="/orders/views/:slug" element={<OrderView />} />
      <Route path="/orders/edit/:slug" element={<UpdateOrder />} />

      {/* Warranty */}
      <Route path="/refund" element={<Warranty />} />
      <Route path="/refund/:slug" element={<WarrantyDetails />} />

      {/* Blog */}
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/create" element={<CreateBlog />} />
      <Route path="/blogs/edit/:slug" element={<UpdateBlog />} />
      <Route path="/blogs/comments" element={<BlogComment />} />

      {/* Customers */}
      <Route path="/customers" element={<Customers />} />
      {/* Videos */}
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/videos/create" element={<CreateVideo />} />
      <Route path="/videos/edit/:slug" element={<UpdateVideo />} />
      {/* Faq */}
      <Route path="/faqs" element={<FaqPage />} />
      <Route path="/faqs/create" element={<CreateFaq />} />
      <Route path="/faqs/edit/:slug" element={<UpdateFaq />} />
      {/* Marketing */}
      <Route path="/coupons" element={<CouponPage />} />
      <Route path="/coupons/create" element={<CreateCoupon />} />
      <Route path="/coupons/edit/:slug" element={<UpdateCoupon />} />
      <Route path="/banner" element={<BannerPage />} />
      <Route path="/banner/edit/:slug" element={<UpdateBanner />} />
      <Route path="/banner/create" element={<CreateBanner />} />

      {/* shipping */}
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/shipping/create" element={<CreateShipping />} />
      <Route path="/shipping/edit/:slug" element={<UpdateShipping />} />

      {/* Support */}
      <Route path="/support" element={<TicketPage />} />
      <Route path="/support/:slug" element={<Replay />} />
      <Route path="/queries" element={<Queries />} />
      <Route path="/subscriber" element={<Subscriber />} />

      {/* Payment */}
      <Route path="/emi" element={<EmiPage />} />
      <Route path="/emi/create" element={<CreateEmi />} />
      <Route path="/emi/edit/:slug" element={<UpdateEmi />} />
      <Route path="/payment-message" element={<PaymentMessage />} />

      {/* Settings */}
      <Route path="/setup/home-page" element={<SetupPage />} />
      <Route path="/setup/setting" element={<Settings />} />
      <Route path="/setup/menus/create" element={<CreateMenu />} />
      <Route path="/setup/menus/edit/:slug" element={<UpdateMenu />} />
      <Route path="/setup/menus" element={<Menus />} />
      <Route path="/setup/sliders" element={<Sliders />} />
      <Route path="/setup/services" element={<Services />} />
      <Route path="/setup/services/create" element={<CreateService />} />
      <Route path="/setup/services/edit/:slug" element={<UpdateService />} />
      <Route path="/setup/sliders/edit/:slug" element={<UpdateSlider />} />
      <Route path="/setup/sliders/create" element={<CreateSlider />} />
      <Route path="/setup/pages" element={<CommonPages />} />
      <Route path="/setup/pages/create" element={<CreatePage />} />
      <Route path="/setup/pages/edit/:slug" element={<UpdatePage />} />

      {/* Notification */}
      <Route path="/notification" element={<Notification />} />
      <Route path="/notification/create" element={<CreateNotification />} />

      {/* Admin */}
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/staffs" element={<Staff />} />
      <Route path="/staffs/create" element={<CreateProfile />} />
      {/* 404 Page */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
export default PageRoutes;
