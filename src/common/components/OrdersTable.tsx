import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  AlertColor,
  Collapse,
  Box,
  TablePagination,
} from "@mui/material";
import { DateTime } from "luxon";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useCallback, useState } from "react";
import {
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} from "../../store/apiSlice";
import DeleteOrderDialog from "./DeleteOrderDialog";
import EditOrderDialog from "./EditOrderDialog";
import { Order } from "../../types";

interface OrdersTableProps {
  orders: Order[];
  refetchOrders: () => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface RowItemProps {
  order: Order;
  setEditOrderDialog: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; order: Order | null }>
  >;
  setDeleteOrderDialog: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; order: Order | null }>
  >;
  deleteOrderDialog: { isOpen: boolean; order: Order | null };
  editOrderDialog: { isOpen: boolean; order: Order | null };
  onSelect: (id: string) => void;
  isSelected: boolean;
  columnCount: number;
}

interface RowDetailedItemProps {
  order: Order;
}

interface DialogState {
  isOpen: boolean;
  order: Order | null;
}

const OrdersTable: React.FC<OrdersTableProps> = (props) => {
  const {
    orders,
    page,
    rowsPerPage,
    onPageChange,
    refetchOrders,
    onRowsPerPageChange,
  } = props;

  const displayedOrders = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const [selected, setSelected] = useState<string[]>([]);
  const [editOrderDialog, setEditOrderDialog] = useState<DialogState>({
    isOpen: false,
    order: null,
  });
  
  const [deleteOrderDialog, setDeleteOrderDialog] = useState<DialogState>({
    isOpen: false,
    order: null,
  });
  const [snackbarOpen, setSnackbarOpen] = useState<{
    isOpen: boolean;
    severity: AlertColor;
  }>({
    isOpen: false,
    severity: "success",
  });
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const toggleSelected = useCallback(
    (id: string) => {
      if (selected.includes(id)) {
        setSelected(selected.filter((s) => s !== id));
      } else {
        setSelected([...selected, id]);
      }
    },
    [selected, setSelected]
  );

  const handleCloseDialog = () => {
    setEditOrderDialog({ ...editOrderDialog, isOpen: false });
    setDeleteOrderDialog({ ...deleteOrderDialog, isOpen: false });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen({ ...snackbarOpen, isOpen: false });
  };

  const handleEditOrder = async (values: Order) => {
    try {
      await updateOrder(values).unwrap();
      handleCloseDialog();
      setSnackbarOpen({ isOpen: true, severity: "success" });
      setSnackbarMessage("Order updated successfully");
      refetchOrders();
    } catch (error: any) {
      setSnackbarMessage("Failed to update order: " + error.message);
      setSnackbarOpen({ isOpen: true, severity: "error" });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId).unwrap();
      handleCloseDialog();
      setSnackbarOpen({ isOpen: true, severity: "success" });
      setSnackbarMessage("Order deleted");
      refetchOrders();
    } catch (error: any) {
      setSnackbarMessage("Failed to delete order: " + error.message);
      setSnackbarOpen({ isOpen: true, severity: "error" });
    }
  };

  const columns = [
    <TableCell key="orderNumber">Order Number</TableCell>,
    <TableCell key="status">Status</TableCell>,
    <TableCell key="client">Client</TableCell>,
    <TableCell key="orderedTime">Ordered Time</TableCell>,
    <TableCell />,
  ];

  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>{columns}</TableRow>
        </TableHead>
        <TableBody>
          {displayedOrders.map((order: Order) => (
            <RowItem
              key={order.id}
              order={order}
              columnCount={columns.length}
              isSelected={selected.includes(order.id)}
              onSelect={toggleSelected}
              setEditOrderDialog={setEditOrderDialog}
              editOrderDialog={editOrderDialog}
              setDeleteOrderDialog={setDeleteOrderDialog}
              deleteOrderDialog={deleteOrderDialog}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <EditOrderDialog
        handleEditOrder={handleEditOrder}
        order={editOrderDialog?.order}
        isOpen={editOrderDialog.isOpen}
        onClose={handleCloseDialog}
      />
      <DeleteOrderDialog
        onDeleteOrder={handleDeleteOrder}
        order={deleteOrderDialog?.order}
        isOpen={deleteOrderDialog.isOpen}
        onClose={handleCloseDialog}
      />
      <Snackbar
        open={snackbarOpen.isOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarOpen.severity}
          sx={{ width: "100%", display: "flex", alignItems: "center" }}
        >
          <Typography component="span" sx={{ fontSize: "1.1rem", mt: 2 }}>
            {snackbarMessage}
          </Typography>
        </Alert>
      </Snackbar>
    </Card>
  );
};

const RowItem: React.FC<RowItemProps> = (props) => {
  const {
    order,
    setEditOrderDialog,
    setDeleteOrderDialog,
    deleteOrderDialog,
    editOrderDialog,
    onSelect,
    isSelected,
    columnCount,
  } = props;

  const handleSelect = () => onSelect(order.id);

  return (
    <>
      <TableRow selected={isSelected}>
        <TableCell sx={{ width: "150px" }}>{order.orderNumber}</TableCell>
        <TableCell>{order.status}</TableCell>
        <TableCell>{order.clientName}</TableCell>
        <TableCell>
          {DateTime.fromISO(order.createdAt).toFormat("dd.MM.yyyy")}
        </TableCell>
        <TableCell>
          <IconButton onClick={handleSelect}>
            <KeyboardArrowDownIcon />
          </IconButton>
          <IconButton
            color="default"
            onClick={() =>
              setEditOrderDialog({ ...editOrderDialog, isOpen: true, order })
            }
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() =>
              setDeleteOrderDialog({
                ...deleteOrderDialog,
                isOpen: true,
                order,
              })
            }
          >
            <DeleteForeverIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow selected>
        <TableCell colSpan={columnCount} sx={{ p: 0, border: "none" }}>
          <Collapse in={isSelected}>
            <Box sx={{ p: 2 }}>
              <Card>
                <RowDetailedItem order={order} />
              </Card>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const RowDetailedItem: React.FC<RowDetailedItemProps> = (props) => {
  const { order } = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Quantity</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Total Price</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{order.quantities}</TableCell>
          <TableCell>{order.price}</TableCell>
          <TableCell>{order.price}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default OrdersTable;
