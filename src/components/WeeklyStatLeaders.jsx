import { Box } from "@mui/material";
import CustomTable from "./CustomTable";

function WeeklyStatLeaders({ data, tabValue }) {
  const columnOrder = [
    "week",
    "stat",
    "teams",
    "val"
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

export default WeeklyStatLeaders;