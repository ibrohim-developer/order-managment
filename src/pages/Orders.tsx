import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { debounce } from 'lodash'
import { useFetchOrdersQuery } from "../store/apiSlice";
import OrdersTable from "../common/components/OrdersTable";
import OrdersTableFilter from "../common/components/OrdersTableFilter";
import { DateTime } from "luxon";
import { Order } from "../types";

const Orders: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>("");
  const [startDate, setStartDate] = useState<DateTime | null>(null);
  const [endDate, setEndDate] = useState<DateTime | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    data: orders = [],
    error,
    isLoading,
    refetch,
  } = useFetchOrdersQuery({
    status: statusFilter,
    clientName: debouncedSearchTerm || null,
    orderNumber: !isNaN(Number(debouncedSearchTerm)) ? Number(debouncedSearchTerm) : null,
  });

  useEffect(() => {
    const handler = debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 300);

    handler(searchTerm);

    return () => {
      handler.cancel();
    };
  }, [searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleDateRangeFilter = (
    start: DateTime | null,
    end: DateTime | null
  ) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleChangePage = (event: unknown, newPage: number) =>
    setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


// NOTE: I did not find the 'gte' and 'lte' filters in the mock API.
  const filterOrders = (orders: Order[]) => {
    const hasFilters = startDate && endDate;

    if (!hasFilters) {
      return orders;
    }

    return orders.filter((order) => {
      const orderDate = DateTime.fromISO(order.createdAt);

      const adjustedEndDate = endDate ? endDate.endOf("day") : null;

      const withinDateRange =
        (startDate ? orderDate >= startDate : true) &&
        (adjustedEndDate ? orderDate <= adjustedEndDate : true);

      const matchesStatus = statusFilter ? order.status === statusFilter : true;

      return withinDateRange && matchesStatus;
    });
  };

  const filteredOrders = filterOrders(orders);

  if (isLoading) {
    return <Box />;
  }

  if (error) {
    return <Box />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <OrdersTableFilter
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          startDate={startDate}
          endDate={endDate}
          statusFilter={statusFilter}
          handleStatusFilter={handleStatusFilter}
          handleDateRangeFilter={handleDateRangeFilter}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
        />
        <OrdersTable
          refetchOrders={refetch}
          orders={filteredOrders}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>
    </Box>
  );
};

export default Orders;
