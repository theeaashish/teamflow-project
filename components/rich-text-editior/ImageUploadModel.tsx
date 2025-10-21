import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface ImageUploadModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageUploadModel({
  onOpenChange,
  open,
}: ImageUploadModelProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
