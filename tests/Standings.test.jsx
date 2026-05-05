import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Standings from "../src/components/Standings";

const mockData = [
  {
    team_name: "Team A",
    rank: 1,
    percentage: 0.67,
    "Expected Rank": 1,
    "Expected Points": 95,
    wins: 10,
    losses: 5,
    ties: 0,
    games_back: 0,
  },
  {
    team_name: "Team B",
    rank: 2,
    percentage: 0.53,
    "Expected Rank": 2,
    "Expected Points": 85,
    wins: 8,
    losses: 7,
    ties: 0,
    games_back: 2,
  },
  {
    team_name: "Team C",
    rank: 3,
    percentage: 0.4,
    "Expected Rank": 3,
    "Expected Points": 75,
    wins: 6,
    losses: 9,
    ties: 0,
    games_back: 4,
  },
];

describe("Standings Component", () => {
  it("renders standings table correctly", () => {
    render(<Standings data={mockData} />);
    expect(screen.getByText("TEAM_NAME")).toBeInTheDocument();
    expect(screen.getByText("RANK")).toBeInTheDocument();
    expect(screen.getByText("PERCENTAGE")).toBeInTheDocument();
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.getByText("Team B")).toBeInTheDocument();
    expect(screen.getByText("Team C")).toBeInTheDocument();
  });
});
