import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders the initial grid and keeps the last valid layout on textarea errors", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText("Grid preview")).toBeInTheDocument();
    expect(screen.getByTestId("cell-1-1")).toBeInTheDocument();

    const field = screen.getByLabelText("Element drawer schema");

    await user.type(field, "\n1;4;Broken;RADIO;a,b");

    expect(screen.getByText(/Input type must be/)).toBeInTheDocument();
    expect(screen.getByText(/last valid layout/i)).toBeInTheDocument();
    expect(screen.getByTestId("cell-1-1")).toBeInTheDocument();
  });

  it("lets the user clear the canvas and restore the demo layout", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /^clear$/i }));
    expect(screen.getByText(/Grid preview will appear here/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /load demo/i }));
    expect(screen.getByTestId("cell-1-1")).toBeInTheDocument();
  });

  it("shows the adjacency legend and status chips", () => {
    render(<App />);

    expect(screen.getByText("Legend")).toBeInTheDocument();
    expect(screen.getAllByText("SELECT diagonal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TEXT_INPUT orthogonal").length).toBeGreaterThan(0);
    expect(screen.getByText(/Preview in sync/i)).toBeInTheDocument();
  });

  it("lets the user extend the visible grid to reveal distant drop targets", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.queryByTestId("cell-10-10")).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Max visible row"), "10");
    await user.type(screen.getByLabelText("Max visible column"), "10");

    expect(screen.getByTestId("cell-10-10")).toBeInTheDocument();
    expect(screen.getByText(/Extended range/i)).toBeInTheDocument();
  });
});
