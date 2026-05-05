import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WeeklyStatLeaders from "../src/components/WeeklyStatLeaders";

const mockData = [
  {
    week: 1,
    teams: "Team A",
    val: 5,
    stat: "HR",
  },
  {
    week: 2,
    teams: "Team B",
    val: 3,
    stat: "RBI",
  },
  {
    week: 3,
    teams: "Team C",
    val: 7,
    stat: "SB",
  },
];

describe("WeeklyStatLeaders Component", () => {
  it("renders WeeklyStatLeaders table correctly", () => {
    render(<WeeklyStatLeaders data={mockData} />);
    expect(screen.getByText("WEEK")).toBeInTheDocument();
    expect(screen.getByText("TEAMS")).toBeInTheDocument();
    expect(screen.getByText("VAL")).toBeInTheDocument();
    expect(screen.getByText("STAT")).toBeInTheDocument();
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.getByText("Team B")).toBeInTheDocument();
    expect(screen.getByText("Team C")).toBeInTheDocument();
  });
});
