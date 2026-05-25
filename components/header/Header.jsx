// components/Header.jsx
"use client";
import { useAuth } from "@/app/context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

export default function Header({ showWelcome = false, title = "Página" }) {
  const { user } = useAuth();
  const firstName = user?.nome?.split(" ")[0] ?? "Usuário";
  const imgUrl = "https://api.dicebear.com/9.x/lorelei/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=a";

  return (
    <div>
      <header className="hidden md:flex justify-between items-center mb-6 pb-4">
        <div>
          {showWelcome ? (
            <h1
              className="text-2xl font-medium
              text-gray-900"
            >
              Bem-vindo de volta,{" "}
              <span className="text-purple-600">{firstName}!</span>
            </h1>
          ) : (
            <h1 className="text-2xl font-medium text-gray-900">{title}</h1>
          )}
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-4 border-1 rounded-full p-1 pr-3">
          <img
            src={imgUrl + user?.nome}
            width={70}
            height={70}
            alt={user?.nome || "Avatar"}
            className="rounded-full object-cover border-1"
          />
          <div>
            <h2 className="text-lg font-medium leading-tight text-gray-900">
              {user?.nome ?? "Usuário"}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.email ?? "email@email.com"}
            </p>
          </div>
        </div>
      </header>

      {/* mobile */}
      <header className="relative flex justify-between items-center mb-6 gap-3 pb-4  md:hidden">
        <img
          src={imgUrl + user?.nome}
          width={70}
          height={70}
          alt={user?.nome || "Avatar"}
          className="rounded-full object-cover border-1"
        />
        {showWelcome ? (
          <h1
            className="text-2xl font-medium
                text-white w-full"
          >
            Bem-vindo,
            <br />
            <span className="text-white-600">{firstName}!</span>
          </h1>
        ) : (
          <h1 className="text-4xl font-bold mb-8 text-center">
            <span className="text-purple-600">Orça</span>
            <span className="text-purple-400">Pro</span>
          </h1>
        )}
        {/* {!showWelcome && (
          <div className="w-full" >{title}</div>
        )} */}
        {/* mancha do fundo */}
        {showWelcome && (
          <div className="absolute top-0 left-0 right-0 h-[250px] bg-gradient-to-r from-purple-600 to-[#a855f7] rounded-b-[2.5rem] -z-10 transition-all duration-200 ease-out -ml-8 -mr-8 -mt-8"></div>
        )}
      </header>
    </div>
  );
}
