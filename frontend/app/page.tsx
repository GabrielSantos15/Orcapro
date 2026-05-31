import Link from "next/link";
import { 
  BarChart3, 
  Wallet, 
  Target, 
  Smartphone, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Navbar Minimalista */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-slate-900">Orça</span>
            <span className="text-purple-600">Pro</span>
          </div>
          <div className="flex gap-4 sm:gap-6 items-center">
            <Link
              href="/login"
              className="px-2 py-2 text-base font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-6 py-2.5 text-base font-medium bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Simples e Direto */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          O seu dinheiro, <br className="hidden sm:block" />
          <span className="text-purple-600">sob controle.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Gerencie suas contas, acompanhe transações e defina metas em uma interface limpa e intuitiva. Chega de planilhas confusas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cadastro"
            className="px-8 py-3.5 bg-slate-900 text-white text-lg font-medium rounded-full hover:bg-slate-800 transition-colors"
          >
            Começar gratuitamente
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 bg-white text-slate-700 text-lg font-medium rounded-full border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Features Minimalistas */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mt-2">Visualização clara</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Gráficos em tempo real para entender exatamente para onde vai o seu dinheiro.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mt-2">Gestão de contas</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Registre múltiplas contas bancárias e acompanhe todos os seus saldos em um só lugar.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <Target size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mt-2">Metas financeiras</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Defina objetivos e acompanhe o seu progresso de forma visual e motivadora.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mt-2">Acesso total</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Interface 100% responsiva. Funciona perfeitamente no seu celular, tablet ou computador.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mt-2">Segurança garantida</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Seus dados são protegidos e armazenados de forma segura, garantindo sua privacidade.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mt-2">Velocidade</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Sistema leve e otimizado para que você registre suas transações em segundos.
            </p>
          </div>

        </div>
      </section>

      {/* Footer Simples */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-slate-900">Orça</span>
            <span className="text-purple-600">Pro</span>
          </div>
          <p className="text-base text-slate-500">
            © {new Date().getFullYear()} OrçaPro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
      
    </div>
  );
}