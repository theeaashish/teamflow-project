import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';

interface AttachmentChipProps {
  url: string;
  onRemove: () => void;
}

export function AttachmentChip({ url, onRemove }: AttachmentChipProps) {
  return (
    <div className="group relative overflow-hidden rounded-md bg-muted size-12">
      <Image className="object-cover" src={url} alt="Attached Image" fill />

      <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          type="button"
          variant={'destructive'}
          className="size-6 p-0 rounded-full"
          onClick={onRemove}
        >
          <X className="size-3" />
        </Button>
      </div>
    </div>
  );
}
