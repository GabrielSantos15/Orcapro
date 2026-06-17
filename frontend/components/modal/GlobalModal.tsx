"use client";

import { useModalStore } from "@/store/useModalStore";

// Importe seus conteúdos de modais aqui
// import ModalLogin from "./modals/ModalLogin";
// import ModalExcluirUser from "./modals/ModalExcluirUser";
import Modal from "./Modal";
import CreateCategoriaModal from "./categoria/CategoriaFormModal";
import TransacaoViewModal from "./transacao/TransacaoViewModal";
import TransacaoFormModal from "./transacao/TransacaoFormModal";
import ContaViewModal from "./conta/ContaViewModal";
import InvestimentoFormModal from "./investimento/InvestimentoFormModal";
import FormAtualizarSaldoInvestidoModal from "./investimento/InvestimentoSaldoFormModal";
import ContaFormModal from "./conta/ContaFormModal";
import InvestimentoAporteFormModal from "./investimento/InvestimentoAporteFormModal";
import InvestimentoResgateFormModal from "./investimento/InvestimentoResgateFormModal";
import MetaFormModal from "./meta/MetaFormModal";
import MetaProgressoFormModal from "./meta/MetaProgressoFormModal";
import MetaResgateFormModal from "./meta/MetaResgateFormModal";
import InvestimentoSaldoFormModal from "./investimento/InvestimentoSaldoFormModal";
import CategoriaViewModal from "./categoria/CategoriaViewModal";
import OrcamentoFormModal from "./orcamento/OrcamentoFormModal";

export default function GlobalModal() {
  const { isOpen, view, closeModal, data } = useModalStore();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {view === "conta" && <ContaViewModal conta={data} />}
      {view === "createConta" && <ContaFormModal />}
      {view === "updateConta" && <ContaFormModal conta={data} />}
      
      {view === "transacao" && <TransacaoViewModal transacao={data}/>}
      {view === "createTransacao" && <TransacaoFormModal />}
      {view === "updateTransacao" && <TransacaoFormModal transacao={data}/>}

      
      {view === "createInvestimento" && <InvestimentoFormModal />}
      {view === "updateInvestimento" && <InvestimentoFormModal investimento={data} />}

      {view === "aporteInvestimento" && <InvestimentoAporteFormModal  investimento={data}/>}
      {view === "resgateInvestimento" && <InvestimentoResgateFormModal  investimento={data}/>}
      {view === "updateSaldoInvestimento" && <InvestimentoSaldoFormModal  investimento={data}/>}

      {view === "createMeta" && <MetaFormModal />}
      {view === "updateMeta" && <MetaFormModal meta={data}/>}
      {view === "addProgressoMeta" && <MetaProgressoFormModal meta={data}/>}
      {view === "resgateMeta" && <MetaResgateFormModal meta={data}/>}

      {view === "categoria" && <CategoriaViewModal id={data}/>}
      {view === "createCategoria" && <CreateCategoriaModal />}
      {view === "updateCategoria" && <CreateCategoriaModal categoria={data}/>}

      {view === "createOrcamento" && <OrcamentoFormModal />}

    </Modal>
  );
}