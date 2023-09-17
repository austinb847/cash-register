import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CashRegister from "../../components/CashRegister";

// Mock the window.alert function to test when it is called
jest.spyOn(window, "alert").mockImplementation(() => {});

describe("[Component]: CashRegister", () => {
  it("updates the total amount when adding money", () => {
    const { getByTestId } = render(<CashRegister />);

    fireEvent.click(getByTestId("add-money-20"));
    fireEvent.click(getByTestId("add-money-20"));

    // Check if the total amount is updated correctly
    expect(getByTestId("total-amount-text")).toHaveTextContent("$40");
  });

  it("dispenses change correctly", () => {
    const { getByRole, getByLabelText, getByTestId } = render(<CashRegister />);

    // Add some money
    fireEvent.click(getByTestId("add-money-20"));
    fireEvent.click(getByTestId("add-money-10"));
    fireEvent.click(getByTestId("add-money-5"));

    // Enter a change amount
    const inputElement = getByLabelText("Change Amount:");
    fireEvent.change(inputElement, { target: { value: "25" } });

    // Check if the "Change" button is enabled
    const changeButton = getByRole("button", { name: /Change/i });
    expect(changeButton).toBeEnabled();

    // Dispense change
    fireEvent.click(changeButton);

    const expectedMessagePattern =
      /Change dispensed:\s*1x\$5\s*1x\$20\s*New Total Amount:\s*\$10/;

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(expectedMessagePattern)
    );
  });

  it("shows an error when change cannot be made", () => {
    const { getByTestId, getByRole, getByLabelText } = render(<CashRegister />);

    // Add some money
    fireEvent.click(getByTestId("add-money-20"));
    fireEvent.click(getByTestId("add-money-10"));
    fireEvent.click(getByTestId("add-money-5"));

    // Enter a change amount that cannot be made
    const inputElement = getByLabelText("Change Amount:");
    fireEvent.change(inputElement, { target: { value: "50" } });

    // Check if the "Change" button is enabled
    const changeButton = getByRole("button", { name: /Change/i });
    expect(changeButton).toBeEnabled();

    // Dispense change (which should raise an error)
    fireEvent.click(changeButton);

    expect(window.alert).toHaveBeenCalledWith("Sorry, change cannot be made.");
  });

  it("updates the total amount when removing money", () => {
    const { getByTestId } = render(<CashRegister />);

    // Add some money
    fireEvent.click(getByTestId("add-money-20"));

    // Remove some money
    fireEvent.click(getByTestId("remove-money-20"));

    // Check if the total amount is updated correctly
    expect(getByTestId("total-amount-text")).toHaveTextContent("$0");
  });
});
