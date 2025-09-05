import SideBar from "./SideBar";
import Header from "./Header";
import usePageTitle from "./UsePageTitle";
import "./css/Layout.css";

export default function Layout(props) {
  const { children } = props;

  usePageTitle();

  return (
    <div className="layout">
      <SideBar />
      <div className="main-content">
        <Header />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
