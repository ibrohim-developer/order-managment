import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Order } from "../../types";

interface EditOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  handleEditOrder: (values: Order) => void;
  onClose: () => void;
}

interface UpdateOrderFields {
  id: string;
  orderStatus: string;
  quantities: number;
  price: number;
  totalPrice: number;
}

interface FormProps {
  control: any;
  onSubmit: (values: UpdateOrderFields) => void;
  handleSubmit: (callback: (values: UpdateOrderFields) => void) => (event?: React.BaseSyntheticEvent) => Promise<void>;
}


const EditOrderDialog: React.FC<EditOrderDialogProps> = (props) => {
  const { order, isOpen, onClose, handleEditOrder } = props;

  const { control, handleSubmit, reset } = useForm<UpdateOrderFields>({
    defaultValues: {
      id: order?.id,
      orderStatus: order?.status ?? "",
      quantities: order?.quantities ?? 0,
      price: order?.price ?? 0,
      totalPrice: order?.totalPrice ?? 0
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        id: order?.id,
        orderStatus: order?.status ?? "",
        quantities: order?.quantities ?? 0,
        price: order?.price ?? 0,
        totalPrice: order?.totalPrice ?? 0,
      });
    }
  }, [order, isOpen, reset]);


  const onSubmit = (values: UpdateOrderFields) => {
    const updatedOrder: Order = {
      id: values.id,
      clientName: order?.clientName ?? null,
      status: values.orderStatus,
      orderNumber: order?.orderNumber ?? null,
      quantities: values.quantities ?? order?.quantities ?? 0, 
      price: values.price ?? order?.price ?? 0,
      totalPrice: values.totalPrice ?? order?.totalPrice ?? 0, 
      createdAt: order?.createdAt ?? new Date().toISOString(),
    };
  
    handleEditOrder(updatedOrder);
    onClose();
  };
  return (
    <Dialog maxWidth="xs" fullWidth open={isOpen} onClose={onClose}>
        <Form control={control} onSubmit={onSubmit} handleSubmit={handleSubmit}  />
      <DialogActions>
        <Button onClick={onClose} size="small" variant="outlined">
          Cancel
        </Button>
        <Button form="edit-order-form" type="submit" size="small" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Form: React.FC<FormProps> = (props) => {
  const { control, onSubmit, handleSubmit } = props;

  return (
    <form id="edit-order-form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>Edit Order</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={3} sx={{ mt: 3 }}>
        <Grid2 size={{ xs: 12 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="status-label">Order Status</InputLabel>
              <Controller
                name="orderStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="status-label"
                    id="status"
                    label="Order Status"
                  >
                    <MenuItem value="awaiting">Awaiting payment</MenuItem>
                    <MenuItem value="sent">Sent</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Controller
              name="quantities"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Quantities"
                  variant="outlined"
                  size="small"
                  fullWidth
                  type="number"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  variant="outlined"
                  size="small"
                  fullWidth
                  type="number"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Controller
              name="totalPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Total Price"
                  variant="outlined"
                  size="small"
                  fullWidth
                  type="number"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      readOnly: true,
                    }
                  }}
                />
              )}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
    </form>
  );
}

export default EditOrderDialog;