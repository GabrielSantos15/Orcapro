"use client";

import { useModalStore } from "@/store/useModalStore";

// Importe seus conteúdos de modais aqui
// import ModalLogin from "./modals/ModalLogin";
// import ModalExcluirUser from "./modals/ModalExcluirUser";
import Modal from "./Modal";
import ModalTransacao from "./ModalCreateTransacao";
import ModalConta from "./ModalCreateConta";
import ModalCategoria from "./modalCreateCategoria";

export default function GlobalModal() {
  const { isOpen, view, closeModal, data } = useModalStore();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {view === "transacao" && <ModalTransacao />}
      {view === "conta" && <ModalConta />}
      {view === "categoria" && <ModalCategoria />}
    </Modal>
  );
}