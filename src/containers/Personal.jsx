import './css/Personal.css';
import Card from "../components/Card";

const Personal = () => {
    return (
        <section className="personal-container">
            <div className="personal-cards">
                <Card title="Mecánicos" value="25 activos" route="/mecanicos"/>
                {/*
                <Card title="Choferes" value="25 activos" />
                <Card title="Administrativos" value="25 activos" />
                */}
            </div>
        </section>
    );
};

export default Personal;
