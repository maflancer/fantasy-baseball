import { Box } from "@mui/material";
import CustomTable from "./CustomTable";

function TeamStats({ data, tabValue }) {
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

  return (
    <Box sx={{ width: '100%' }}>
      <CustomTable 
        data={data} 
        tabValue={tabValue} 
        columnOrder={columnOrder} 
      />
    </Box>
  );
}

export default TeamStats;