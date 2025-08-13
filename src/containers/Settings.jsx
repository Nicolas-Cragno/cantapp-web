import { useState, useEffect } from "react";
import FichaPerfil from "../components/fichas/FichaPerfil";
import "./css/Settings.css";

export default function Settings() {
  return (
    <div className="fb-profile-wrapper">
      <FichaPerfil></FichaPerfil>
    </div>
  );
}
