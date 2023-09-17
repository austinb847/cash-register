"use client";
import { useCallback, useMemo, useState } from "react";
import { Denomination, AvailableMoney } from "../types/cash-register";
import {
  calculateMinimumDenominations,
  calculateTotalAmount,
  denominationMap,
} from "../helpers/denominations";
import DenominationRow from "./DenominationRow";

const defaultMoney: AvailableMoney = {
  20: 0,
  10: 0,
  5: 0,
  2: 0,
  1: 0,
};

interface CashRegisterProps {
  initialMoney?: AvailableMoney;
}

const CashRegister: React.FC<CashRegisterProps> = ({
  initialMoney = defaultMoney,
}) => {
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [money, setMoney] = useState<AvailableMoney>(initialMoney);

  const updateMoney = useCallback(
    (denomination: Denomination, quantity: number) => {
      setMoney((prevMoney) => ({
        ...prevMoney,
        [denomination]: prevMoney[denomination] + quantity,
      }));
    },
    []
  );

  const handleAddMoney = useCallback(
    (denomination: string, quantity: number) => {
      const numericDenomination = denominationMap[denomination];
      if (numericDenomination !== undefined) {
        updateMoney(numericDenomination, quantity);
      }
    },
    [updateMoney]
  );

  const handleRemoveMoney = useCallback(
    (denomination: string, quantity: number) => {
      const numericDenomination = denominationMap[denomination];
      if (
        numericDenomination !== undefined &&
        money[numericDenomination] >= quantity
      ) {
        updateMoney(numericDenomination, -quantity);
      }
    },
    [money, updateMoney]
  );

  const handleChange = useCallback(
    (amount: number) => {
      const usedDenominations = calculateMinimumDenominations(
        { ...money },
        amount
      );

      if (usedDenominations === null) {
        alert("Sorry, change cannot be made.");
        return;
      }

      const changeToDispense: AvailableMoney = usedDenominations.reduce(
        (change, denomination) => {
          change[denomination] = (change[denomination] || 0) + 1;
          return change;
        },
        {} as AvailableMoney
      );

      // Deduct the used denominations from available money
      const updatedMoney: AvailableMoney = { ...money };
      for (const denomination of usedDenominations) {
        updatedMoney[denomination] -= 1; // Deduct one from each denomination used
      }

      // update the money state with the new values
      setMoney(updatedMoney);

      const totalAmount = calculateTotalAmount(updatedMoney);

      alert(
        `Change dispensed: ${Object.entries(changeToDispense)
          .map(([d, q]) => `${q}x$${d}`)
          .join(" ")}\nNew Total Amount: $${totalAmount}`
      );
    },
    [money]
  );

  const totalMoney = useMemo(() => {
    return calculateTotalAmount(money);
  }, [money]);

  return (
    <div className="bg-gray-100 px-6 py-6 rounded-lg border-2 border-gray-300">
      <header className="flex flex-col items-center mb-6 md:flex-row md:justify-between md:items-center">
        <h1 className="text-3xl font-semibold">Cash Register</h1>
        <section
          aria-labelledby="total-amount"
          data-testid="total-amount-text"
          className="mt-2 md:mt-0"
        >
          <h2 id="total-amount" className="text-1xl font-semibold">
            Total Amount: <span aria-live="polite">${totalMoney}</span>
          </h2>
        </section>
      </header>
      <section>
        {Object.entries(money).map(([denomination, quantity]) => (
          <DenominationRow
            key={denomination.toString()}
            denomination={denomination.toString()}
            quantity={quantity}
            handleAddMoney={handleAddMoney}
            handleRemoveMoney={handleRemoveMoney}
          />
        ))}
      </section>
      <section className="mt-4">
        <label htmlFor="changeAmount" className="font-semibold text-lg">
          Change Amount:
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="changeAmount"
            value={inputAmount === 0 ? "" : inputAmount}
            onChange={(e) => {
              const inputValue = parseInt(e.target.value, 10);
              setInputAmount(
                Number.isNaN(inputValue) ? 0 : Math.max(0, inputValue)
              );
            }}
            className="border rounded px-2 py-1 text-xl w-40 text-center"
          />
          <button
            onClick={() => handleChange(inputAmount)}
            className={`ml-2 px-2 py-1 bg-blue-500 text-white rounded focus:outline-none sm:px-2 sm:py-1 ${
              inputAmount === 0
                ? "disabled:opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
            disabled={inputAmount === 0}
          >
            Calculate Change
          </button>
        </div>
      </section>
    </div>
  );
};

export default CashRegister;
