import SideBar from "./SideBar";
import Header from "./Header";
import usePageTitle from "./UsePageTitle";
import "./css/Layout.css";
import { Outlet } from "react-router-dom";

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
