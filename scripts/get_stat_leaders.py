#!/usr/bin/env python3
"""
Calculate weekly stat leaders.
"""

import pandas as pd
import csv
import logging
from datetime import datetime
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

CURRENT_YEAR = datetime.now().year
INPUT_FILE = f"public/data/stats_{CURRENT_YEAR}.csv"
OUTPUT_FILE = f"public/data/leaders_{CURRENT_YEAR}.csv"

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

def get_stat_leaders(stats, week: int) -> list:
    """
    Get the stat leaders for a given week.
    Args:
        week (int): The week number for which to calculate stat leaders. 
    """
    temp_stats = stats[stats["week"] == week]

    stat_leaders = []
    for stat in STAT_DICT.keys():
        teams = []
        val = -1
        for i, team in temp_stats.iterrows():
            if STAT_DICT[stat] == 1:
                if team[stat] > val:
                    teams = []
                    teams.append(team["team_name"])
                    val = float(team[stat])
                elif team[stat] == val:
                    teams.append(team["team_name"])
            if STAT_DICT[stat] == 0:
                if len(teams) == 0:
                    val = 10000
                if team[stat] < val:
                    teams = []
                    teams.append(team["team_name"])
                    val = float(team[stat])
                elif team[stat] == val:
                    teams.append(team["team_name"])
        stat_leaders.append(
            {"week": week, "stat": stat, "teams": ",".join(teams), "val": val}
        )

    return stat_leaders

def main():
    logger.info("=== STARTING STAT LEADERS SCRIPT ===")
    logger.info(f"Looking for input file: {INPUT_FILE}")
    logger.info(f"Will output to: {OUTPUT_FILE}")
    
    # Check if input file exists
    if not Path(INPUT_FILE).exists():
        logger.error(f"Input file {INPUT_FILE} does not exist!")
        return
        
    try:
        stats = pd.read_csv(INPUT_FILE, encoding="utf-8")
    except UnicodeDecodeError:
        stats = pd.read_csv(INPUT_FILE, encoding="mac_roman")
    except FileNotFoundError:
        logger.error(f"Input file {INPUT_FILE} not found.")
        return
    
    num_weeks = len(stats["week"].unique())
    logger.info(f"Found {num_weeks} weeks of stats in the input file.")
    leaders = []
    for week in range(1, num_weeks + 1):
        logger.info(f"Calculating leaders for week {week}...")
        leaders.extend(get_stat_leaders(stats, week))

    # Ensure output directory exists
    Path("public/data").mkdir(parents=True, exist_ok=True)
    
    # Export to CSV
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        dict_writer = csv.DictWriter(f, leaders[0].keys())
        dict_writer.writeheader()
        dict_writer.writerows(leaders)
    
    logger.info(f"Exported {len(leaders)} leader records to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()