interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  isActive?: boolean;
}

function ToolbarButton({ icon, title, onClick, isActive }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        p-2 rounded-lg transition-all duration-150
        hover:bg-gray-100 dark:hover:bg-gray-700
        active:scale-95
        ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}
      `}
    >
      {icon}
    </button>
  );
}

export default ToolbarButton;
