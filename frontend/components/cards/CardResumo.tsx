interface CardResumoProps {
  value: number;
  title: string;
  color?: "green" | "blue" | "red" | "primary";
  isLoading: boolean;
}

const colorClasses = {
  green: "text-green-600",
  blue: "text-blue-600",
  red: "text-red-600",
  primary: "text-[var(--primary-color)]",
};

export default function CardResumo({
  value,
  title,
  color = "green",
  isLoading = true
}: CardResumoProps) {
  return (
    <article className="flex flex-col bg-[var(--bg-surface)] rounded-lg shadow-sm transition-colors w-full h-full p-5">

      <h3 className="text-[var(--text-secondary)]">{title}</h3>
      {isLoading ? (
        <>
          <div className="skeleton h-8 w-full rounded-md"></div>
        </>
      ) :
        <p className={`text-2xl font-semibold ${colorClasses[color]}`}>
          {value < 0 && "-"}R${" "}
          {Math.abs(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>}
    </article>
  );
}