import "./css/Dashboard.css";
import Logo from "../assets/logos/logo.svg";

const Dashboard = () => {
  return (
      <div className="dashboard">
        <img src={Logo} alt="" className="dashboard-logo"></img>
      </div>
  );
};

export default Dashboard;
