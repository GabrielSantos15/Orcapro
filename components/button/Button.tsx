interface ButtonProps {
  children: React.ReactNode;
  color?: "green" | "blue" | "red" | "primary";
  onClick: () => void;
}

const colorClasses = {
  green: "bg-green-600 hover:bg-green-700",
  blue: "bg-blue-600 hover:bg-blue-700",
  red: "bg-red-600 hover:bg-red-700",
  primary: "bg-[var(--primary-color)] hover:opacity-90",
};

export default function Button({ children, color = "primary", onClick }: ButtonProps) {
  return (
    <button
      className={`${colorClasses[color]} text-white p-3 font-bold rounded-lg transition-opacity`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}