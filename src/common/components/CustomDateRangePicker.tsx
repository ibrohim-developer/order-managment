import React from "react";
import { TextField, Grid2, TextFieldProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction } from "react";

interface CustomDateRangePickerProps {
  onDateRangeChange: (start: DateTime | null, end: DateTime | null) => void;
  setStartDate: Dispatch<SetStateAction<DateTime | null>>;
  setEndDate: Dispatch<SetStateAction<DateTime | null>>;
  startDate: DateTime | null;
  endDate: DateTime | null;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = (props) => {
  const { onDateRangeChange, setStartDate, setEndDate, startDate, endDate } = props;

  const handleStartDateChange = (newValue: DateTime | null) => { 
    setStartDate(newValue);
    onDateRangeChange(newValue, endDate); 
  };

  const handleEndDateChange = (newValue: DateTime | null) => { 
    setEndDate(newValue);
    onDateRangeChange(startDate, newValue);
  };

  return (
    <Grid2 container sx={{ alignItems: 'center' }} spacing={3}>
      <Grid2 size={{ xs: 5 }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          slots={{
            textField: (params: TextFieldProps) => <TextField size="small" {...params} />,
          }}
        />
      </Grid2>
      <Grid2 size={{ xs: 1 }}>
        <hr />
      </Grid2>
      <Grid2 size={{ xs: 5 }}>
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          slots={{
            textField: (params: TextFieldProps) => <TextField size="small" {...params} />,
          }}
        />
      </Grid2>
    </Grid2>
  );
};

export default CustomDateRangePicker;
