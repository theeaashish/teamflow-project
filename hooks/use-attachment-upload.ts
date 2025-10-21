'use client';

import { useMemo, useState } from 'react';

export function useAttachmentUpload() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return useMemo(() => {
    return {
      isOpen,
      setIsOpen,
    };
  }, [isOpen, setIsOpen]);
}

export type UseAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
