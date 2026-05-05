import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CustomTable from "../src/components/CustomTable";

const mockData = [
  {
    week: 1,
    team_name: "Team A",
    R: 10,
    HR: 2,
    RBI: 5,
    SB: 1,
    TB: 15,
    AVG: 0.3,
    OBP: 0.4,
    IP: 12,
    K: 10,
    ERA: 3.0,
    WHIP: 1.2,
    SV: 2,
  },
  {
    week: 2,
    team_name: "Team B",
    R: 8,
    HR: 3,
    RBI: 7,
    SB: 2,
    TB: 18,
    AVG: 0.25,
    OBP: 0.35,
    IP: 15,
    K: 12,
    ERA: 2.5,
    WHIP: 1.1,
    SV: 3,
  },
  {
    week: 3,
    team_name: "Team C",
    R: 12,
    HR: 4,
    RBI: 9,
    SB: 3,
    TB: 20,
    AVG: 0.35,
    OBP: 0.45,
    IP: 10,
    K: 8,
    ERA: 2.0,
    WHIP: 1.0,
    SV: 1,
  },
];

const columnOrder = [
  "week",
  "team_name",
  "R",
  "HR",
  "RBI",
  "SB",
  "TB",
  "AVG",
  "OBP",
  "IP",
  "K",
  "ERA",
  "WHIP",
  "SV",
];

const filters = {
  week: "",
  team_name: "",
};

describe("CustomTable Component", () => {
  it("renders CustomTable with correct columns and data", () => {
    render(
      <CustomTable
        data={mockData}
        filters={filters}
        columnOrder={columnOrder}
      />
    );

    columnOrder.forEach((column) => {
      expect(screen.getByText(column.toUpperCase())).toBeInTheDocument();
    });

    mockData.forEach((row) => {
      Object.values(row).forEach((value) => {
        expect(screen.getAllByText(value.toString()).length).toBeGreaterThan(0);
      });
    });
  });

  it("sorts data correctly when column header is clicked", () => {
    render(
      <CustomTable
        data={mockData}
        filters={filters}
        columnOrder={columnOrder}
      />
    );
    fireEvent.click(screen.getByText("WEEK"));
    const rows = screen.getAllByRole("row");
    expect(rows[1].textContent).toContain("1");
    fireEvent.click(screen.getByText("WEEK"));
    expect(rows[1].textContent).toContain("3");
  });
});
