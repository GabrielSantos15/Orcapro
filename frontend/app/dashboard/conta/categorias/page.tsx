'use client'
import Button from "@/components/button/Button";
import HeaderDashboard from "@/components/headerDashboard/HeaderDashboard";
import ListaCategorias from "@/components/widgets/ListaCategorias";
import WidgetContainer from "@/components/widgets/WidgetContainer";
import { useCategorias } from "@/hooks/useCategorias";
import { useModalStore } from "@/store/useModalStore";

export default function CategoriasPage() {
    const { openModal } = useModalStore();
    const { categorias } = useCategorias();
    return (
        <>

            <HeaderDashboard
                title="Categorias"
                subTitle="Organize e classifique suas movimentações financeiras."
            />
            <WidgetContainer
                titulo="Gestão de Categorias"
                subtitulo="Adicione, edite ou desative as fontes de suas receitas e despesas."
                headerAction={
                    <Button onClick={() => openModal("createCategoria")}>
                        + Adicionar
                    </Button>
                }
            >
                <div className=" overflow-y-auto pr-2">
                    <ListaCategorias />
                </div>
            </WidgetContainer>
        </>
    )
}