import { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  OutlinedInput,
  Checkbox,
  Paper,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

function GraphStats({ data }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedStat, setSelectedStat] = useState("R");
  const [selectedTeams, setSelectedTeams] = useState(["ALL"]);
  const [plotData, setPlotData] = useState([]);

  // Available statistics to graph
  const stats = [
    "R", "HR", "RBI", "SB", "TB", "AVG", "OBP", "IP", "K", "ERA", "WHIP", "SV",
  ];
  
  // Extract unique team names from data
  const teamNames = [...new Set(data.map((item) => item.team_name))];

  // Update plot data when selections change
  useEffect(() => {
    if (data.length > 0) {
      const filteredTeams = selectedTeams.includes("ALL")
        ? teamNames
        : selectedTeams;
      
      // Create a trace for each selected team
      const traceData = filteredTeams.map((team) => {
        // Filter data for this team
        const teamData = data.filter((item) => item.team_name === team);
        
        // Sort by week to ensure proper line drawing
        teamData.sort((a, b) => parseInt(a.week) - parseInt(b.week));
        
        // Create trace
        return {
          type: "scatter",
          mode: "lines+markers",
          name: team,
          x: teamData.map((item) => item.week),
          y: teamData.map((item) => item[selectedStat]),
          line: { shape: "linear", width: 2 },
          marker: { size: 8 }
        };
      });
      
      setPlotData(traceData);
    }
  }, [data, selectedStat, selectedTeams]);

  const handleStatChange = (event) => {
    setSelectedStat(event.target.value);
  };

  const handleTeamChange = (event) => {
    const {
      target: { value },
    } = event;
    
    // Handle "ALL" selection logic
    if (value[value.length - 1] === "ALL" || value.length === 0) {
      setSelectedTeams(["ALL"]);
    } else if (value.includes("ALL")) {
      setSelectedTeams(value.filter((item) => item !== "ALL"));
    } else {
      setSelectedTeams(value);
    }
  };

  // Get formatted title for the current stat
  const getStatTitle = (stat) => {
    const statTitles = {
      "R": "Runs",
      "HR": "Home Runs",
      "RBI": "Runs Batted In",
      "SB": "Stolen Bases",
      "TB": "Total Bases",
      "AVG": "Batting Average",
      "OBP": "On-Base Percentage",
      "IP": "Innings Pitched",
      "K": "Strikeouts",
      "ERA": "Earned Run Average",
      "WHIP": "Walks + Hits per Inning Pitched",
      "SV": "Saves"
    };
    return statTitles[stat] || stat;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Grid container spacing={isMobile ? 2 : 4} alignItems="center" flexWrap="wrap">
          {/* Stat selector */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="subtitle2" gutterBottom>
              Statistic to Graph:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedStat}
                onChange={handleStatChange}
                displayEmpty
                sx={{ 
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)'
                  }
                }}
              >
                {stats.map((stat) => (
                  <MenuItem key={stat} value={stat}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={500}>{stat}</Typography>
                      <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        - {getStatTitle(stat)}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Team selector */}
          <Grid item xs={12} sm={6} md={8} lg={9}>
            <Typography variant="subtitle2" gutterBottom>
              Teams to Compare:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                multiple
                value={selectedTeams}
                onChange={handleTeamChange}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.includes("ALL") ? (
                      <Chip size="small" label="All Teams" sx={{ backgroundColor: '#e3f2fd' }} />
                    ) : (
                      selected.map((value) => (
                        <Chip key={value} size="small" label={value} sx={{ backgroundColor: '#e3f2fd' }} />
                      ))
                    )}
                  </Box>
                )}
                sx={{ 
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)'
                  }
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox checked={selectedTeams.includes("ALL")} />
                  <Typography variant="body2" fontWeight={500}>All Teams</Typography>
                </MenuItem>
                {teamNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={selectedTeams.includes(name)} />
                    <Typography variant="body2">{name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Plot container */}
      <Paper elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
        <Plot
          data={plotData}
          layout={{
            title: `Weekly ${getStatTitle(selectedStat)} Trends`,
            xaxis: { 
              title: "Week", 
              tickmode: "linear", 
              tick0: 1, 
              dtick: 1,
              gridcolor: 'rgba(0,0,0,0.1)'
            },
            yaxis: { 
              title: getStatTitle(selectedStat),
              gridcolor: 'rgba(0,0,0,0.1)'
            },
            margin: { t: 60, r: 30, l: 60, b: 50 },
            autosize: true,
            hovermode: 'closest',
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            font: {
              family: '"Roboto", "Helvetica", "Arial", sans-serif'
            }
          }}
          useResizeHandler={true}
          style={{ 
            width: "100%", 
            height: isMobile ? "350px" : "500px" 
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d']
          }}
        />
      </Paper>
      
      {/* Mobile help text */}
      {isMobile && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: 'text.secondary' }}>
          Tip: Turn your device to landscape for a better view of the graph.
        </Typography>
      )}
    </Box>
  );
}

export default GraphStats;