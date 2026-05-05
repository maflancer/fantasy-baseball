import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TeamStats from "../src/components/TeamStats";

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

describe("TeamStats Component", () => {
  it("renders TeamStats table correctly", () => {
    render(<TeamStats data={mockData} />);
    expect(screen.getByText("WEEK")).toBeInTheDocument();
    expect(screen.getByText("TEAM_NAME")).toBeInTheDocument();
    expect(screen.getByText("R")).toBeInTheDocument();
    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("RBI")).toBeInTheDocument();
    expect(screen.getByText("SB")).toBeInTheDocument();
    expect(screen.getByText("TB")).toBeInTheDocument();
    expect(screen.getByText("AVG")).toBeInTheDocument();
    expect(screen.getByText("OBP")).toBeInTheDocument();
    expect(screen.getByText("IP")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
    expect(screen.getByText("ERA")).toBeInTheDocument();
    expect(screen.getByText("WHIP")).toBeInTheDocument();
    expect(screen.getByText("SV")).toBeInTheDocument();
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.getByText("Team B")).toBeInTheDocument();
    expect(screen.getByText("Team C")).toBeInTheDocument();
  });
});
