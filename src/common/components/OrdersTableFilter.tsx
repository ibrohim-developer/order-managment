import React from "react";
import {
  Card,
  CardContent,
  Select,
  Grid2,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  InputAdornment,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Dispatch, SetStateAction } from "react";
import CustomDateRangePicker from "./CustomDateRangePicker";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DateTime } from "luxon";

interface OrdersTableFilterProps {
  setStartDate: Dispatch<SetStateAction<DateTime | null>>;
  setEndDate: Dispatch<SetStateAction<DateTime | null>>;
  startDate: DateTime | null;
  endDate: DateTime | null;
  statusFilter: string | null;
  searchTerm: string;
  handleSearchChange: (term: string) => void;
  handleStatusFilter: (status: string) => void;
  handleDateRangeFilter: (start: DateTime | null, end: DateTime | null) => void;
}

const OrdersTableFilter: React.FC<OrdersTableFilterProps> = (props) => {
  const {
    setStartDate,
    setEndDate,
    startDate,
    endDate,
    statusFilter,
    searchTerm,
    handleSearchChange,
    handleStatusFilter,
    handleDateRangeFilter,
  } = props;

  const handleDateRangeChange = (
    start: DateTime | null,
    end: DateTime | null
  ) => {
    if (start && end) {
      handleDateRangeFilter(start, end);
    }
  };

  const handleClearFilters = () => {
    handleStatusFilter("");
    handleDateRangeFilter(null, null);
    handleSearchChange("");
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid2 container spacing={3} sx={{ justifyContent: "center" }}>
          <Grid2 size={{ xs: 12 }}>
            <TextField
             value={searchTerm}
             onChange={(e) => handleSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }
              }} fullWidth size="small" name="search" placeholder="Search" />
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="status-label">Order Status</InputLabel>
              <Select
                size="small"
                labelId="status-label"
                id="status"
                value={statusFilter}
                name="orderStatus"
                label="Order Status"
                onChange={(event: any) =>
                  handleStatusFilter(event.target.value)
                }
              >
                <MenuItem value="awaiting">Awaiting payment</MenuItem>
                <MenuItem value="sent">Sent</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 8 }}>
            <CustomDateRangePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
            />
          </Grid2>
        </Grid2>
        <Box sx={{ mt: 2, textAlign: "end" }}>
          <Button
            onClick={handleClearFilters}
            size="small"
            variant="outlined"
            endIcon={<DeleteForeverIcon />}
          >
            Remove Filters
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrdersTableFilter;
