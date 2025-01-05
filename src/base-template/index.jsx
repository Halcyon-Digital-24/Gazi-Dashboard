import { useState } from "react";
import Header from "../components/header";
import SideBar from "../components/sidebar";
import PageRoutes from "../pages";
import Login from "../pages/login";
import "./index.scss";
function BaseTemplate() {
  const [isOpen, setIsOpen] = useState(true);

  const user = localStorage.getItem("user");

  return (
    <div className="container-fluid">
      {user ? (
        <div className="row">
          <div className={isOpen ? "col-md-2" : "sidebar-none"}>
            <SideBar
              handleClose={() => {
                setIsOpen(false);
              }}
            />
          </div>

          <div className={isOpen ? "col-md-10" : "col-md-12"}>
            <Header
              isOpen={isOpen}
              handleOpen={() => {
                setIsOpen(true);
              }}
            />
            <main className="main-area">
              <PageRoutes />
            </main>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}
export default BaseTemplate;
