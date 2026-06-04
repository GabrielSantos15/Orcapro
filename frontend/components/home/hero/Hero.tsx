import Link from "next/link";
import Image from "next/image";

function AvatarGroup() {
  const users = [1, 2, 3, 4, 5];

  return (
    <div className="hidden lg:flex items-center gap-4 my-4">
      <div className="flex -space-x-3">
        {users.map((i) => (
          <img
            key={i}
            src={`https://api.dicebear.com/9.x/thumbs/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=OrçaProUser${i}`}
            alt={`Usuário ${i}`}
            className="w-12 h-12 rounded-full border-2 border-slate-50 dark:border-slate-950 object-cover z-10 hover:z-20 hover:scale-110 transition-transform duration-200"
          />
        ))}
      </div>


      <div className="flex flex-col">
        <span className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
          Junte-se
        </span>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-tight">
          aos primeiros membros
        </span>
      </div>
    </div>
  );
}


export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-gray-300 dark:from-gray-800 via-green-50 dark:via-gray-600 to-green-200 dark:to-gray-850 rounded-2xl p-2 lg:p-5 lg:px-10 mx-5 mt-5 flex flex-col lg:flex-row items-center justify-center gap-12">
      <article className="text-[var(--text-primary)] w-full max-w-3xl flex flex-col items-center lg:items-start text-center lg:text-left gap-1">
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-tight">
          Liberdade financeira começa com organização
        </h1>

        <p className="text-xl max-w-xl leading-relaxed">
          Abandone as planilhas complexas. O OrçaPro transforma a gestão do seu
          dinheiro em uma experiência visual, inteligente e sem estresse
        </p>

        <AvatarGroup />

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/cadastro"
            className="px-8 py-3.5 bg-slate-900 text-white text-lg font-medium rounded-[5px] hover:bg-slate-800 transition-colors"
          >
            Começar gratuitamente
          </Link>
        </div>
      </article>

      <figure className="flex items-center justify-center w-full max-w-5xl relative">
        <Image
          src="/heroImage.png"
          alt="Dashboard OrçaPro"
          width={800}
          height={400}
          className="rounded-lg w-full h-auto object-contain"
        />
      </figure>
    </section>
  );
}
