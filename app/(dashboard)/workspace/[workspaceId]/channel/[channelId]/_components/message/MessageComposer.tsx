import { RichTextEditior } from '@/components/rich-text-editior/Editior';
import { ImageUploadModel } from '@/components/rich-text-editior/ImageUploadModel';
import { Button } from '@/components/ui/button';
import { UseAttachmentUploadType } from '@/hooks/use-attachment-upload';
import { ImageIcon, Send } from 'lucide-react';
import { AttachmentChip } from './AttachmentChip';

interface MessageComposerProps {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  upload: UseAttachmentUploadType;
}

export function MessageComposer({
  onChange,
  value,
  onSubmit,
  isSubmitting,
  upload,
}: MessageComposerProps) {
  return (
    <>
      <RichTextEditior
        field={{ value, onChange }}
        sendButton={
          <Button
            disabled={isSubmitting}
            type="button"
            size={'sm'}
            onClick={onSubmit}
          >
            <Send className="size-4 mr-1" />
            Send
          </Button>
        }
        footerLeft={
          upload.stagedUrl ? (
            <AttachmentChip onRemove={upload.clear} url={upload.stagedUrl} />
          ) : (
            <Button
              onClick={() => upload.setIsOpen(true)}
              type="button"
              size={'sm'}
              variant={'outline'}
            >
              <ImageIcon className="size-4 mr-1" />
              Attach
            </Button>
          )
        }
      />
      <ImageUploadModel
        onUploaded={(url) => upload.onUploaded(url)}
        open={upload.isOpen}
        onOpenChange={upload.setIsOpen}
      />
    </>
  );
}
