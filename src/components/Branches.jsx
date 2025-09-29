// ----------------------------------------------------------------------- imports externos
import "./css/GroupCards.css";
import MiniCard from "./cards/MiniCard";
import { useState } from "react";
import ModalBranch from "./modales/ModalBranch";
const Branches = () => {
  const [modalTorcuatoVisible, setModalTorcuatoVisible] = useState(false);

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
