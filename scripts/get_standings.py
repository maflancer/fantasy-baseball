#!/usr/bin/env python3
"""
Calculate fantasy baseball standings with expected points.
"""

from yahoo_oauth import OAuth2
import yahoo_fantasy_api as yfa
import pandas as pd
import logging
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

CURRENT_YEAR = datetime.now().year
INPUT_FILE = f"public/data/stats_{CURRENT_YEAR}.csv"
OUTPUT_FILE = f"public/data/standings_{CURRENT_YEAR}.csv"

# stat name to sort (1 for large to small, 0 for small to large)
STAT_DICT = {
    "R": 1,
    "HR": 1,
    "RBI": 1,
    "SB": 1,
    "TB": 1,
    "AVG": 1,
    "OBP": 1,
    "IP": 1,
    "K": 1,
    "ERA": 0,
    "WHIP": 0,
    "SV": 1,
}

def get_league_standings(oauth):
    """Get current league standings from Yahoo API"""
    try:
        # get the Yahoo fantasy game
        game = yfa.Game(oauth, "mlb")

        # get the league ids for the current year that the current user has played in
        league_id = game.league_ids(year=CURRENT_YEAR)

        # get the league object for the current league
        league = game.to_league(league_id[0])

        standings = []
        # this flattens the team_dict from {"key1": {"key2": value}, "key3": value} to
        #  {"key2": value, "key3": value}
        for team_dict in league.standings():
            team = {}
            for key, value in team_dict.items():
                if isinstance(value, dict):
                    team.update(value)
                else:
                    team[key] = value

            standings.append(team)

        logger.info(f"Retrieved standings for {len(standings)} teams")
        standings_df = pd.DataFrame(standings)
        standings_df = standings_df.drop("name", axis=1)  # drop customized team name column
        return standings_df, league

    except Exception as e:
        logger.error(f"Error getting league standings: {e}")
        raise

def calculate_expected_points(stats, league):
    """Calculate expected points based on weekly performance"""
    try:
        unique_teams = stats.drop_duplicates(subset=["team_key", "team_name"])

        teams = unique_teams[["team_key", "team_name"]].copy(deep=True)
        teams.loc[:, "Expected Points"] = 0.0
        for stat in STAT_DICT:
            teams.loc[:, stat] = 0.0

        current_week = league.current_week()
        logger.info(f"Calculating expected points through week {current_week - 1}")

        for week in range(1, current_week):
            for stat, order in STAT_DICT.items():
                sorted_stats = stats[stats["week"] == week].sort_values(
                    stat, ascending=not bool(order), ignore_index=True
                )
                sorted_stats["rank"] = sorted_stats[stat].rank()

                for i, row in sorted_stats.iterrows():
                    teams.loc[
                        teams["team_key"] == row["team_key"], "Expected Points"
                    ] += row["rank"]
                    teams.loc[teams["team_key"] == row["team_key"], stat] += row["rank"]

        teams["Expected Rank"] = (
            teams["Expected Points"].rank(method="dense", ascending=False).astype(int)
        )

        logger.info("Calculated expected points for all teams")
        return teams
    
    except Exception as e:
        logger.error(f"Error calculating expected points: {e}")
        raise

def main():
    try:
        # create oauth object to pass into yfa functions
        oauth = OAuth2(None, None, from_file="oauth2.json")
        logger.info("Created OAuth object")
        
        try:
            stats = pd.read_csv(INPUT_FILE, encoding="utf-8")
        except UnicodeDecodeError:
            stats = pd.read_csv(INPUT_FILE, encoding="mac_roman")
        except FileNotFoundError:
            logger.error(f"Input file {INPUT_FILE} not found.")
            return
        
        logger.info(f"Loaded {len(stats)} stat records")

        # Get current standings from Yahoo API
        standings_df, league = get_league_standings(oauth)
        
        # Calculate expected points
        teams = calculate_expected_points(stats, league)

        # Merge standings with expected points
        final_standings = pd.merge(
            teams, standings_df, how="left", left_on="team_key", right_on="team_key"
        )

        final_standings["rank"] = final_standings["rank"].astype(int)

        # Ensure output directory exists
        Path("public/data").mkdir(parents=True, exist_ok=True)

        # Export sorted standings
        final_standings.sort_values("rank", ascending=True).to_csv(
            OUTPUT_FILE, index=False
        )
        
        logger.info(f"Exported final standings to {OUTPUT_FILE}")

    except Exception as e:
        logger.error(f"Script failed: {e}")
        raise

if __name__ == "__main__":
    main()