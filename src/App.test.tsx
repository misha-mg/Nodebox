import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

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

  it("allows interacting with inputs rendered inside grid cells", async () => {
    const user = userEvent.setup();

    render(<App />);

    const textInput = screen.getByPlaceholderText("Enter first name");
    await user.click(textInput);
    await user.type(textInput, "Alice");
    expect(textInput).toHaveValue("Alice");

    const selectCell = screen.getByTestId("cell-1-2");
    const selectInput = within(selectCell).getByRole("combobox");
    await user.click(selectInput);
    await user.click(screen.getByRole("option", { name: "Canada" }));
    expect(selectInput).toHaveTextContent("Canada");
  });

  it("restores the saved schema draft after remounting", () => {
    window.localStorage.setItem(
      "nodebox.elementDrawer.schemaDraft",
      "4;2;Email;TEXT_INPUT;Enter email"
    );
    window.localStorage.setItem(
      "nodebox.elementDrawer.schemaLastValid",
      "4;2;Email;TEXT_INPUT;Enter email"
    );

    render(<App />);

    expect(screen.getByLabelText("Schema")).toHaveValue(
      "4;2;Email;TEXT_INPUT;Enter email"
    );
    expect(screen.getByTestId("cell-4-2")).toBeInTheDocument();
  });
});
