interface CardResumoProps {
  value: number;
  title: string;
  color?: "green" | "blue" | "red" | "primary";
}

const colorClasses = {
  green: "text-green-600",
  blue: "text-blue-600",
  red: "text-red-600",
  primary: "text-[var(--primary-color)]-600",
};

export default function CardResumo({ value, title, color = "green" }: CardResumoProps) {
  return (
    <article className="flex flex-col bg-[var(--bg-surface)]  rounded-lg shadow-sm transition-colors w-full h-full p-5">
      <h3 className="text-gray-700">{title}</h3>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>
        R${" "}
        {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </p>
    </article>
  );
}