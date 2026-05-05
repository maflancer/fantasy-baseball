import { Box } from "@mui/material";
import CustomTable from "./CustomTable";

function Standings({ data, tabValue }) {
  const columnOrder = [
    "team_name",     
    "rank",          
    "percentage",    
    "Expected Rank", 
    "Expected Points", 
    "wins",          
    "losses",        
    "ties",          
    "games_back",    
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

export default Standings;