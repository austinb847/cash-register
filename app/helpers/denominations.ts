import { Denomination, AvailableMoney } from "../types/cash-register";

export const denominationMap: Record<string, Denomination> = {
  "20": 20,
  "10": 10,
  "5": 5,
  "2": 2,
  "1": 1,
};

/**
 * Calculate the minimum denominations needed to make change for the given amount
 */
export function calculateMinimumDenominations(
  availableMoney: Record<Denomination, number>,
  amount: number
): Denomination[] | null {
  const sortedDenominations = Object.keys(availableMoney)
    .map(Number)
    .sort((a, b) => b - a); // Sort denominations in descending order

  const usedDenominations: Denomination[] = [];

  const findChange = (targetAmount: number, startIndex: number): boolean => {
    if (targetAmount === 0) {
      return true; // Change can be made
    }

    for (let i = startIndex; i < sortedDenominations.length; i++) {
      const denomination = sortedDenominations[i];

      if (
        availableMoney[denomination as Denomination] > 0 &&
        denomination <= targetAmount
      ) {
        usedDenominations.push(denomination as Denomination);
        availableMoney[denomination as Denomination]--;

        if (findChange(targetAmount - denomination, i)) {
          return true;
        }

        usedDenominations.pop(); // Backtrack
        availableMoney[denomination as Denomination]++;
      }
    }

    return false; // Change cannot be made
  };

  if (findChange(amount, 0)) {
    return usedDenominations;
  }

  return null; // Cannot make change
}
/**
 * Calculates the total amount of money in the cash register based on the denominations and their quantities
 */
export function calculateTotalAmount(money: AvailableMoney): number {
  return Object.entries(money)
    .map(([denomination, quantity]) => Number(denomination) * quantity)
    .reduce((acc, value) => acc + value, 0);
}
