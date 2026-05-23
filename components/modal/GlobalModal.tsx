"use client";

import { useModalStore } from "@/store/useModalStore";

// Importe seus conteúdos de modais aqui
// import ModalLogin from "./modals/ModalLogin";
// import ModalExcluirUser from "./modals/ModalExcluirUser";
import Modal from "./Modal";
import ModalTransacao from "./FormTransacaoModal";
import CreateContaModal from "./FormContaModal";
import ModalCategoria from "./CreateCategoriaModal";
import TransacaoModal from "./TransacaoModal";
import FormTransacaoModal from "./FormTransacaoModal";
import ContaModal from "./ContaModal";
import FormContaModal from "./FormContaModal";

export default function GlobalModal() {
  const { isOpen, view, closeModal, data } = useModalStore();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {view === "createTransacao" && <FormTransacaoModal />}
      {view === "updateTransacao" && <FormTransacaoModal transacao={data}/>}
      {view === "transacao" && <TransacaoModal transacao={data}/>}
      {view === "conta" && <ContaModal conta={data} />}
      {view === "createConta" && <CreateContaModal />}
      {view === "updateConta" && <FormContaModal conta={data} />}
      {view === "categoria" && <ModalCategoria />}
    </Modal>
  );
}