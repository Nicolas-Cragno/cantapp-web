// ----------------------------------------------------------------------- imports externos
import "./css/GroupCards.css";
import { useData } from "../context/DataContext";
import MiniCard from "../components/cards/MiniCard";
import { useEffect, useState } from "react";
import ModalBranch from "../components/modales/ModalBranch";
const Branches = () => {
  const [modalTorcuatoVisible, setModalTorcuatoVisible] = useState(false);
  const { ubicaciones } = useData();

  const cerrarModalTorcuato = () => {
    setModalTorcuatoVisible(false);
  };

  return (
    <div className="container group-card">
      <div className="row">
        <div className="col-md-2 gtitle">
          <h1>SUCURSALES</h1>
        </div>
        <div className="col-auto gcard">
          <MiniCard
            title="Don Torcuato"
            onClick={() => setModalTorcuatoVisible(true)}
          />

          {modalTorcuatoVisible && (
            <div>
              <ModalBranch sucursalId={"01"} onClose={cerrarModalTorcuato} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Branches;
