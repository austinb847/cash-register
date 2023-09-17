interface DenominationRowProps {
  denomination: string;
  quantity: number;
  handleAddMoney: (denomination: string, quantity: number) => void;
  handleRemoveMoney: (denomination: string, quantity: number) => void;
}

const DenominationRow: React.FC<DenominationRowProps> = ({
  denomination,
  quantity,
  handleAddMoney,
  handleRemoveMoney,
}) => {
  return (
    <div className="flex justify-between items-center w-full mb-2">
      <span className="text-xl">${denomination}</span>
      <div className="flex items-center rounded-lg border border-gray-300">
        <button
          onClick={() => handleRemoveMoney(denomination, 1)}
          className={`w-10 h-10 px-2 py-1 bg-blue-500 text-white rounded-l ${
            quantity === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          } text-2xl`}
          disabled={quantity === 0}
          data-testid={`remove-money-${denomination}`}
          aria-label={`Remove ${denomination}`}
          aria-disabled={quantity === 0}
        >
          -
        </button>
        <span className="w-14 px-2 py-1 text-center text-xl">{quantity}</span>
        <button
          onClick={() => handleAddMoney(denomination, 1)}
          className="w-10 h-10 px-2 py-1 bg-blue-500 text-white rounded-r hover:bg-blue-600 text-2xl"
          data-testid={`add-money-${denomination}`}
          aria-label={`Add ${denomination}`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default DenominationRow;
