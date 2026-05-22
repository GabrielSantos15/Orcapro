"use client";

import { useModalStore } from "@/store/useModalStore";

// Importe seus conteúdos de modais aqui
// import ModalLogin from "./modals/ModalLogin";
// import ModalExcluirUser from "./modals/ModalExcluirUser";
import Modal from "./Modal";
import ModalTransacao from "./CreateTransacaoModal";
import ModalConta from "./CreateContaModal";
import ModalCategoria from "./CreateCategoriaModal";
import TransacaoModal from "./TransacaoModal";

export default function GlobalModal() {
  const { isOpen, view, closeModal, data } = useModalStore();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {view === "createTransacao" && <ModalTransacao />}
      {view === "transacao" && <TransacaoModal transacao={data}/>}
      {view === "conta" && <ModalConta />}
      {view === "categoria" && <ModalCategoria />}
    </Modal>
  );
}