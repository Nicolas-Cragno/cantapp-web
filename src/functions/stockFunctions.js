import { doc, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function agregarItem(idDocumento, tipoCampo, valor) {
  const ref = doc(db, "ubicaciones", idDocumento);
  await updateDoc(ref, {
    [tipoCampo]: arrayUnion(valor),
  });
}

export async function quitarItem(idDocumento, tipoCampo, valor) {
  const ref = doc(db, "ubicaciones", idDocumento);
  await updateDoc(ref, {
    [tipoCampo]: arrayRemove(valor),
  });
}

export async function reemplazarItems(idDocumento, tipoCampo, valor) {
  const ref = doc(db, "ubicaciones", idDocumento);
  await setDoc(
    ref,
    {
      [tipoCampo]: valor,
    },
    { merge: true } 
  );
}
