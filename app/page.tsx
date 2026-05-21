import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-purple-600">Orça</span>
            <span className="text-purple-400">Pro</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition"
            >
              Login
            </Link>
            <Link
              href="/cadastro"
              className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
            >
              Cadastro
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Controle suas <span className="text-purple-600">finanças</span> com facilidade
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            OrcaPro é a plataforma mais intuitiva para gerenciar suas contas, transações e metas financeiras em um único lugar.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <Link
            href="/cadastro"
            className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition text-lg"
          >
            Começar Agora
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border-2 border-purple-600 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition text-lg"
          >
            Já tenho conta
          </Link>
        </div>

        {/* Hero Image/Illustration */}
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-purple-600 font-bold text-lg">Dashboard Preview</p>
            <p className="text-gray-600">Seu painel de controle financeiro</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Por que escolher OrcaPro?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Visualização clara</h3>
            <p className="text-gray-600">
              Gráficos e relatórios em tempo real para entender melhor seus gastos
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestão de contas</h3>
            <p className="text-gray-600">
              Registre múltiplas contas bancárias e acompanhe todos seus saldos
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Metas financeiras</h3>
            <p className="text-gray-600">
              Defina e acompanhe suas metas para alcançar objetivos financeiros
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Responsivo</h3>
            <p className="text-gray-600">
              Acesse de qualquer dispositivo, smartphone, tablet ou computador
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Seguro</h3>
            <p className="text-gray-600">
              Seus dados são protegidos com as melhores práticas de segurança
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Rápido</h3>
            <p className="text-gray-600">
              Interface ágil e responsiva para melhor experiência de uso
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Comece a controlar suas finanças agora</h2>
          <p className="text-lg mb-8 opacity-90">
            Junte-se a milhares de usuários que já melhoraram sua vida financeira
          </p>
          <Link
            href="/cadastro"
            className="inline-block px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition"
          >
            Criar conta gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4">
            <span className="text-purple-400">Orça</span>
            <span className="text-purple-300">Pro</span>
          </div>
          <p className="text-gray-400">© 2026 OrcaPro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
