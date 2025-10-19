import { RichTextEditior } from '@/components/rich-text-editior/Editior';
import { Button } from '@/components/ui/button';
import { ImageIcon, Send } from 'lucide-react';

interface MessageComposerProps {
  value: string;
  onChange: (next: string) => void;
}

export function MessageComposer({ onChange, value }: MessageComposerProps) {
  return (
    <>
      <RichTextEditior
        field={{ value, onChange }}
        sendButton={
          <Button type="button" size={'sm'}>
            <Send className="size-4 mr-1" />
            Send
          </Button>
        }
        footerLeft={
          <Button type="button" size={'sm'} variant={'outline'}>
            <ImageIcon className="size-4 mr-1" />
            Attach
          </Button>
        }
      />
    </>
  );
}
