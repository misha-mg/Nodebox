# Element Drawer - React Coding Task

## Task Overview
Create a dynamic form element drawer that takes one or more string inputs and renders form elements in an unbounded, interactive grid.

---

## Requirements

### Input Format
The application accepts **one or more** input strings, one per line, each in the following format:

```
rowNumber;columnNumber;inputLabel;inputType;inputOptions
```

Each component of the input string represents:
- `rowNumber`: (number) — Vertical position in the grid
- `columnNumber`: (number) — Horizontal position in the grid
- `inputLabel`: (string) — Label text for the form element
- `inputType`: (string) — Type of input element to render
  - Valid values: `"SELECT"` or `"TEXT_INPUT"`
- `inputOptions`: (string)
  - For `SELECT`: Comma-separated list of options
  - For `TEXT_INPUT`: Placeholder text

**Example (multiple inputs):**
```
1;1;First Name;TEXT_INPUT;Enter first name
1;2;Country;SELECT;USA,Canada,UK
2;1;Last Name;TEXT_INPUT;Enter last name
2;3;Role;SELECT;Admin,User,Guest
```

---

### Grid Behaviour
- The grid is **unbounded** — it expands in any direction to accommodate any row/column values.
- Grid cells are identified by their `(row, column)` coordinate.
- Empty cells are rendered as blank placeholders.

---

### Drag & Drop
- Every grid element (containing a form input) can be **dragged and dropped** to any other cell in the grid.
- When an element is dropped onto a new cell:
  - Its `rowNumber` and `columnNumber` update to reflect the new position.
  - The corresponding **input string(s) update in real time** to mirror the new coordinates.
  - If a non-empty cell is the drop target, the two elements **swap positions**.

---

### Color Selectors
There are **two color selector inputs** displayed in the UI:
- **Color Selector 1** — defaults to **red** (`#FF0000`)
- **Color Selector 2** — defaults to **blue** (`#0000FF`)

These selectors let the user change the highlight colors used by the adjacency coloring rules below.

---

### Adjacency Coloring Rules

After placing all elements in the grid, apply the following coloring rules to each cell **based on its neighbours' input types**:

| Trigger condition | Affected neighbours | Color used |
|---|---|---|
| A cell contains a `SELECT` element | The **4 diagonal** neighbours (top-left, top-right, bottom-left, bottom-right) | Color Selector 1 (default red) |
| A cell contains a `TEXT_INPUT` element | The **4 orthogonal** neighbours (top, bottom, left, right) | Color Selector 2 (default blue) |

Rules applied to the **background** of the affected neighbour cells.

#### Color Mixing
- A neighbour cell may be influenced by **more than one** adjacent element (e.g. it is diagonal to a `SELECT` and orthogonal to a `TEXT_INPUT`).
- In that case, **mix the two colors** (additive or perceptual blend) and apply the mixed color as the cell background.
- Cells with form elements are **not exempt** from coloring — they follow the same rules as empty cells.

---

### Accessibility & Readability
- All text within grid cells must **always be legible** regardless of the background color applied.
- Automatically compute a contrasting foreground color (label text, input text, option text) for every cell using the **WCAG 2.1 contrast ratio standard** (minimum **4.5 : 1** for normal text).