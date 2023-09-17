import { AvailableMoney } from "@/app/types/cash-register";
import {
  calculateMinimumDenominations,
  calculateTotalAmount,
} from "../../helpers/denominations";

describe("denominations helper functions", () => {
  describe("calculateMinimumDenominations", () => {
    const availableMoney = {
      20: 2,
      10: 4,
      5: 6,
      2: 4,
      1: 10,
    };
    it("should return the minimum denominations needed to make change for $11", () => {
      expect(calculateMinimumDenominations(availableMoney, 11)).toEqual([
        10, 1,
      ]);
    });

    it("should return the minimum denominations needed to make change for $23", () => {
      expect(calculateMinimumDenominations(availableMoney, 23)).toEqual([
        20, 2, 1,
      ]);
    });

    it("should return null if change cannot be made", () => {
      const availableMoney = {
        20: 1,
        10: 0,
        5: 0,
        2: 0,
        1: 0,
      };

      expect(calculateMinimumDenominations(availableMoney, 11)).toBeNull();

      expect(calculateMinimumDenominations(availableMoney, 23)).toBeNull();
    });
  });

  describe("calculateTotalAmount", () => {
    it("should calculate the total amount correctly", () => {
      const money = {
        20: 2,
        10: 4,
        5: 6,
        2: 4,
        1: 10,
      };

      // Total amount should be 2x20 + 4x10 + 6x5 + 4x2 + 10x1 = 128
      expect(calculateTotalAmount(money)).toEqual(128);

      // Test with an empty money object
      expect(calculateTotalAmount({} as AvailableMoney)).toEqual(0);
    });
  });
});
