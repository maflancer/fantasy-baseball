import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  Tooltip,
  Card
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import { setFilter, clearFilter } from "../redux/filterSlice";

// Default column configuration
const defaultColumnConfig = {
  formatHeader: (key, isMobile = false) => {
    if (isMobile) {
      if (key === "team_name") return "TEAM";
      if (key === "percentage") return "PCT";
      if (key === "games_back") return "GB";
      if (key === "Expected Rank") return "ER";
      if (key === "Expected Points") return "EP";
      if (key === "wins") return "W";
      if (key === "losses") return "L";
      if (key === "ties") return "T";
      if (key === "rank") return "R";
      if (key === "week") return "WK";
      if (key === "teams") return "TEAM";
      if (key === "val") return "VAL";
      if (key === "stat") return "STAT";
    }
    
    if (key === "team_name") return "TEAM";
    if (key === "games_back") return "GB";
    if (key === "Expected Rank") return "EXP. RANK";
    if (key === "Expected Points") return "EXP. PTS";
    if (key === "percentage") return "PCT";
    if (key === "wins") return "W";
    if (key === "losses") return "L";
    if (key === "ties") return "T";
    if (key === "week") return "WEEK";
    if (key === "teams") return "TEAMS";
    if (key === "val") return "VALUE";
    if (key === "stat") return "STAT";
    
    return key.toUpperCase().replace(/_/g, ' ');
  },
  
  formatCell: (value, column) => {
    if (value === null || value === undefined) return "-";
    
    if (column === "percentage" || column === "AVG" || column === "OBP") {
      const numVal = parseFloat(value);
      return isNaN(numVal) ? value : numVal.toFixed(3).toString().replace(/^0+/, '');
    }
    
    if (column === "ERA" || column === "WHIP") {
      const numVal = parseFloat(value);
      return isNaN(numVal) ? value : numVal.toFixed(2);
    }
    
    return value;
  },
  
  getCellAlign: (column) => {
    if (column === "team_name" || column === "teams") return "left";
    return "center";
  },
  
  getCellStyle: (column, isMobile) => {
    const baseStyle = {};
    
    if (isMobile) {
      if (column === "week" || column === "rank") {
        return {
          ...baseStyle,
          width: "40px",
          minWidth: "40px",
          fontSize: "0.75rem", 
          px: 0.75,
          py: 0.75
        };
      }
      
      if (["R", "HR", "RBI", "SB", "TB", "K", "SV"].includes(column)) {
        return {
          ...baseStyle,
          width: "55px", 
          minWidth: "55px",
          fontSize: "0.75rem",
          px: 0.75,
          py: 0.75
        };
      }
      
      // Give IP more space to prevent overlap with K
      if (column === "IP") {
        return {
          ...baseStyle,
          width: "60px", 
          minWidth: "60px",
          fontSize: "0.75rem",
          px: 0.75,
          py: 0.75
        };
      }
      
      if (["AVG", "OBP", "ERA", "WHIP", "percentage"].includes(column)) {
        return {
          ...baseStyle,
          width: "65px",
          minWidth: "65px",
          fontSize: "0.75rem",
          px: 0.75,
          py: 0.75,
          fontFamily: "monospace"
        };
      }
      
      if (column === "team_name" || column === "teams") {
        return {
          ...baseStyle,
          minWidth: "120px",
          width: "120px",
          fontSize: "0.75rem",
          px: 0.75,
          py: 0.75,
          fontWeight: 500
        };
      }
      
      if (column === "stat") {
        return {
          ...baseStyle,
          width: "65px",
          minWidth: "65px",
          fontSize: "0.75rem",
          px: 0.75,
          py: 0.75
        };
      }
      
      return {
        ...baseStyle,
        fontSize: "0.75rem",
        px: 0.75,
        py: 0.75
      };
    }
    
    if (column === "team_name") {
      return {
        ...baseStyle,
        fontWeight: 500
      };
    }
    
    if (column === "rank") {
      return {
        ...baseStyle,
        fontWeight: 500
      };
    }
    
    if (["percentage", "AVG", "OBP", "ERA", "WHIP"].includes(column)) {
      return {
        ...baseStyle,
        fontFamily: "monospace"
      };
    }
    
    return baseStyle;
  },
  
  defaultSortColumn: "rank",
  defaultSortDirection: "asc",
  filterableColumns: ["team_name", "week", "stat"]
};

// View-specific configurations
const viewConfigs = {
  // Standings view (tabValue = 0)
  0: {
    defaultSortColumn: "rank",
    defaultSortDirection: "asc",
    filterableColumns: [], // Empty array to disable all filters for the Standings view
    formatCell: (value, column) => {
      if (value === null || value === undefined) return "-";
      
      if (column === "percentage") {
        const numVal = parseFloat(value);
        return isNaN(numVal) ? value : numVal.toFixed(3).toString().replace(/^0+/, '');
      }
      
      return value;
    }
  },
  
  // Weekly Leaders view (tabValue = 1)
  1: {
    defaultSortColumn: "week",
    defaultSortDirection: "asc",
    filterableColumns: ["week", "stat"],
    formatCell: (value, column) => {
      if (value === null || value === undefined) return "-";
      
      if (column === "val") {
        if (column === "val" && ["AVG", "OBP"].some(s => 
          value && value.toString().includes(s))) {
          return parseFloat(value).toFixed(3);
        } else if (column === "val" && ["ERA", "WHIP"].some(s => 
          value && value.toString().includes(s))) {
          return parseFloat(value).toFixed(2);
        }
      }
      
      return value;
    },
    formatHeader: (key, isMobile = false) => {
      if (isMobile) {
        if (key === "week") return "WK";
        if (key === "teams") return "TEAM";
        if (key === "val") return "VALUE";
        if (key === "stat") return "STAT";
      }
      
      if (key === "week") return "WEEK";
      if (key === "teams") return "TEAM";
      if (key === "val") return "VALUE";
      if (key === "stat") return "STAT";
      
      return key.toUpperCase().replace(/_/g, ' ');
    }
  },
  
  // Team Stats view (tabValue = 2)
  2: {
    defaultSortColumn: "week",
    defaultSortDirection: "asc",
    filterableColumns: ["team_name", "week"],
    formatCell: (value, column) => {
      if (value === null || value === undefined) return "-";
      
      if (column === "AVG" || column === "OBP") {
        const numVal = parseFloat(value);
        return isNaN(numVal) ? value : numVal.toFixed(3).toString().replace(/^0+/, '');
      }
      
      if (column === "ERA" || column === "WHIP") {
        const numVal = parseFloat(value);
        return isNaN(numVal) ? value : numVal.toFixed(2);
      }
      
      return value;
    }
  }
};

function CustomTable({ data, columnOrder, tabValue }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [filteredData, setFilteredData] = useState([]);
  const [orderDirection, setOrderDirection] = useState("asc");
  const [valueToOrderBy, setValueToOrderBy] = useState("");
  const [showFilters, setShowFilters] = useState(!isMobile);
  
  const filters = useSelector((state) => state.filters[tabValue]) || {};

  // Get config for current view
  const viewConfig = viewConfigs[tabValue] || {};
  
  // Merge default config with view-specific config
  const config = {
    ...defaultColumnConfig,
    ...viewConfig
  };
  
  // Get filterable columns for this view
  const filterableColumns = config.filterableColumns || [];

  useEffect(() => {
    filterData(filters);
  }, [data, filters]);

  useEffect(() => {
    if (data.length > 0) {
      setValueToOrderBy(config.defaultSortColumn || "rank");
      setOrderDirection(config.defaultSortDirection || "asc");
    }
  }, [data, config.defaultSortColumn, config.defaultSortDirection]);

  const handleRequestSort = (property) => {
    const isAsc = valueToOrderBy === property && orderDirection === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAsc ? "desc" : "asc");
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilter({ tab: tabValue, name, value }));
  };

  const clearFilterValue = (name) => {
    dispatch(clearFilter({ tab: tabValue, name }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filterData = (filters) => {
    if (!data || data.length === 0) return;
    
    let newData = data.filter((row) =>
      Object.entries(filters).every(([key, value]) =>
        value === "" ? true : row[key]?.toString() === value
      )
    );
    
    setFilteredData(newData);
  };

  const sortData = (array) => {
    if (!valueToOrderBy || array.length === 0) return array;
    
    return [...array].sort((a, b) => {
      let first = a[valueToOrderBy];
      let second = b[valueToOrderBy];
      
      if (first === undefined) first = "";
      if (second === undefined) second = "";
      
      if (!isNaN(first) && !isNaN(second)) {
        first = Number(first);
        second = Number(second);
      }

      if (first < second) {
        return orderDirection === "asc" ? -1 : 1;
      }
      if (first > second) {
        return orderDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Generate filter controls for a specific column
  const getFilterControls = () => {
    const activeFilters = {};
    filterableColumns.forEach(column => {
      if (columnOrder.includes(column)) {
        activeFilters[column] = filters[column] || "";
      }
    });
    
    return activeFilters;
  };
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(val => val !== "").length;

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filter Controls */}
      {filterableColumns.length > 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 0.5,
            mt: -0.5
          }}
        >
          <Tooltip title={showFilters ? "Hide Filters" : "Show Filters"}>
            <IconButton 
              size="small" 
              onClick={toggleFilters}
              color={activeFilterCount > 0 ? "primary" : "default"}
              sx={{ mr: 0.5 }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {activeFilterCount > 0 && (
            <Chip 
              label={`${activeFilterCount}`} 
              size="small"
              color="primary"
              onDelete={() => Object.keys(filters).forEach(clearFilterValue)}
              sx={{ height: 20, '& .MuiChip-label': { px: 1 } }}
            />
          )}
        </Box>
      )}

      {/* Filter Grid */}
      {showFilters && filterableColumns.length > 0 && (
        <Card 
          variant="outlined" 
          sx={{ 
            mb: 1, 
            p: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <Grid container spacing={2} justifyContent="flex-start">
            {Object.keys(getFilterControls()).map((filterName) => (
              <Grid item key={filterName} xs={12} sm={6} md={3} lg={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>
                    {config.formatHeader(filterName)}
                  </InputLabel>
                  <Select
                    value={filters[filterName] || ""}
                    label={config.formatHeader(filterName)}
                    name={filterName}
                    onChange={handleFilterChange}
                    endAdornment={
                      filters[filterName] && (
                        <IconButton 
                          size="small" 
                          onClick={() => clearFilterValue(filterName)}
                          edge="end"
                          sx={{ 
                            mr: 3, // Add margin to the right of the clear button
                            p: 0.2  // Reduce padding to make button smaller
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    <MenuItem value="">All</MenuItem>
                    {Array.from(
                      new Set(data.map((item) => item[filterName]))
                    ).filter(item => item !== undefined && item !== null)
                      .sort((a, b) => {
                        if (!isNaN(a) && !isNaN(b)) return a - b;
                        return a > b ? 1 : -1;
                      }).map((item, index) => (
                      <MenuItem key={index} value={item ? item.toString() : ""}>
                        {item || "-"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {/* Data Table */}
      <TableContainer 
        component={Paper}
        sx={{ 
          boxShadow: 1,
          borderRadius: 1,
          overflow: 'auto',
          maxWidth: '100%'
        }}
      >
        <Table 
          size="small"
          sx={{ 
            minWidth: isMobile ? 
              // Increased minimum width for mobile to ensure proper spacing
              tabValue === 1 ? 400 : tabValue === 2 ? 900 : 650 
              : 800,
            "& .MuiTableCell-root": {
              px: isMobile ? 0.75 : 2,
              py: isMobile ? 0.5 : 1
            },
            tableLayout: "fixed" // Use fixed layout for both mobile and desktop for consistent column widths
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
              {columnOrder.map((key) => {
                const cellStyle = config.getCellStyle(key, isMobile);
                
                return (
                  <TableCell 
                    key={key}
                    sx={{
                      fontWeight: valueToOrderBy === key ? 700 : 500,
                      color: valueToOrderBy === key ? 'primary.main' : 'text.primary',
                      px: isMobile ? 0.75 : 2,
                      py: isMobile ? 0.5 : 1,
                      ...(isMobile && {
                        width: cellStyle.width || "auto",
                        minWidth: cellStyle.minWidth || "auto",
                        fontSize: "0.75rem"
                      })
                    }}
                  >
                    <TableSortLabel
                      active={valueToOrderBy === key}
                      direction={valueToOrderBy === key ? orderDirection : "asc"}
                      onClick={() => handleRequestSort(key)}
                      sx={{
                        color: valueToOrderBy === key ? 'primary.main' : 'text.primary',
                        fontWeight: valueToOrderBy === key ? 700 : 500,
                        '&.MuiTableSortLabel-active': {
                          color: 'primary.main',
                        }
                      }}
                    >
                      {config.formatHeader(key, isMobile)}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortData(filteredData).map((row, index) => (
              <TableRow 
                key={index}
                hover
                sx={{
                  '&:nth-of-type(even)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                {columnOrder.map((col) => (
                  <TableCell 
                    key={col}
                    align={config.getCellAlign(col)}
                    sx={config.getCellStyle(col, isMobile)}
                  >
                    {config.formatCell(row[col], col)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Mobile help text */}
      {isMobile && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: 'text.secondary' }}>
          Swipe horizontally to see all columns. Tap column headers to sort.
        </Typography>
      )}
    </Box>
  );
}

export default CustomTable;