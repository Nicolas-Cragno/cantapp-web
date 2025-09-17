import { doc, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function agregarItem(idDocumento, tipoCampo, valor) {
  const ref = doc(db, "ubicaciones", idDocumento);
  const valores = Array.isArray(valor) ? valor : [valor];
  await updateDoc(ref, {
    [tipoCampo]: arrayUnion(...valores),
  });
}

export async function quitarItem(idDocumento, tipoCampo, valor) {
  const ref = doc(db, "ubicaciones", idDocumento);
  const valores = Array.isArray(valor) ? valor : [valor];
  await updateDoc(ref, {
    [tipoCampo]: arrayRemove(...valores),
  });
}

export async function reemplazarItems(idDocumento, tipoCampo, valor) {
  const ref = doc(db, "ubicaciones", idDocumento);
  await setDoc(
    ref,
    {
      [tipoCampo]: Array.isArray(valor) ? valor : [valor],
    },
    { merge: true }
  );
}
