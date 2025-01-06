import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import SideBar from "../components/sidebar";
import PageRoutes from "../pages";
import Login from "../pages/login";
import "./index.scss";

function BaseTemplate() {
  const [isOpen, setIsOpen] = useState(false); // Sidebar initially closed
  const sidebarRef = useRef(null);

  const user = localStorage.getItem("user");

  // Detect clicks outside of the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target ) &&
        window.innerWidth <= 768 // Apply only on mobile devices
      ) {
        setIsOpen(false); // Close the sidebar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container-fluid">
      {user ? (
        <div className="row">
          <div
            ref={sidebarRef}
            className={isOpen ? "col-md-2 sidebar-open" : "sidebar-none"}
          >
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
