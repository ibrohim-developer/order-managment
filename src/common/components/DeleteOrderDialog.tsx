import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Order } from "../../types";

interface DeleteOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteOrder: (orderId: string) => void;
}

const DeleteOrderDialog: React.FC<DeleteOrderDialogProps> = (props) => {
  const { order, isOpen, onClose, onDeleteOrder } = props;

  const handleDeleteOrder = () => {
    if (order && order.id) {
      onDeleteOrder(order.id);
      onClose();
    }
  };

  return (
    <Dialog maxWidth="xs" fullWidth open={isOpen} onClose={onClose}>
      <DialogTitle>Delete Order</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the order with number{" "}
          <strong>{order?.orderNumber}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleDeleteOrder} size="small" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteOrderDialog;