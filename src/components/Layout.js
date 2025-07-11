import SideBar from "./SideBar";
import Header from "./Header";
import "./css/Layout.css";

export default function Layout(props) {
  const { children } = props;

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
