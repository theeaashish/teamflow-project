'use client';

import { useCallback, useMemo, useState } from 'react';

export function useAttachmentUpload() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [stagedUrl, setStagedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onUploaded = useCallback((url: string) => {
    setStagedUrl(url);
    setIsUploading(false);
    setIsOpen(false);
  }, []);

  const clear = useCallback(() => {
    setStagedUrl(null);
    setIsUploading(false);
  }, []);

  return useMemo(() => {
    return {
      isOpen,
      setIsOpen,
      onUploaded,
      stagedUrl,
      isUploading,
      clear,
    };
  }, [isOpen, setIsOpen, onUploaded, stagedUrl, isUploading, clear]);
}

export type UseAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
