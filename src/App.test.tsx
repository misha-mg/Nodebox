import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders the initial grid and keeps the last valid layout on textarea errors", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText("Grid preview")).toBeInTheDocument();
    expect(screen.getByTestId("cell-1-1")).toBeInTheDocument();

    const field = screen.getByLabelText("Schema");

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

  it("renders shared section headers for schema and color controls", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /drawer schema/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /adjacency colors/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset colors/i })).toBeInTheDocument();
  });
});
