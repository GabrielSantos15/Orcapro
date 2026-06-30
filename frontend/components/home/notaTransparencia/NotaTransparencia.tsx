import { CheckCircle2 } from "lucide-react";

const items = [
  {
    title: "Projeto Acadêmico",
    description:
      "Criado para demonstrar habilidades em desenvolvimento, UX/UI e arquitetura de software.",
  },
  {
    title: "Privacidade",
    description:
      "Evite inserir dados sensíveis, como documentos, informações bancárias ou senhas pessoais.",
  },
  {
    title: "Hospedagem Gratuita",
    description:
      "O primeiro acesso pode ser mais lento enquanto o servidor é iniciado.",
  },
];


export default function NotaTransparencia() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4 md:py-10 lg:py-15 " id="transparencia">
      <div className="mx-auto flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-center">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-medium leading-tight tracking-tight md:text-3xl lg:text-5xl">
            Acreditamos que a transparência é a melhor interface
          </h2>

          <p className="mt-6 text-[var(--text-secondary)] leading-relaxed">
            Este projeto foi desenvolvido para fins acadêmicos e de portfólio, oferecendo recursos de controle financeiro em um ambiente de demonstração.
          </p>

          <ul className="mt-8 space-y-4">
            {items.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary-color)]" />

                <span className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  <strong className="font-semibold text-[var(--text-primary)]">
                    {item.title}:
                  </strong>{" "}
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-lg lg:text-right">
          <p className="text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
            Inspirado em aplicações financeiras reais, este projeto foi criado para explorar boas práticas de desenvolvimento, experiência do usuário e visualização de dados.
          </p>

          <figure className="mt-6 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"
              alt="Desenvolvimento de software"
              className="h-full w-full object-cover"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}