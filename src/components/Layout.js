import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import usePageTitle from "./UsePageTitle";
import "./css/Layout.css";

export default function Layout() {

  usePageTitle();

  return (
    <div className="layout">
      <SideBar />
      <div className="main-content">
        <Header />
        <main className="page-content">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
