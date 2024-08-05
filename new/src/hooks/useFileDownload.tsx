// useFileDownload.ts

import { useCallback } from 'react';

interface UseFileDownloadOptions {
  filePath: string;
}

const useFileDownload = () => {
  const downloadLink = useCallback(
    ({ filePath }: UseFileDownloadOptions) => {
      const handleDownload = () => {
        const anchor = document.createElement('a');
        anchor.href = `${process.env.NEXT_PUBLIC_BASE_URL || ''}${filePath}`;
        anchor.download = filePath.split('/').pop() || 'downloaded-file';
        anchor.click();
      };

      return { handleDownload };
    },
    []
  );

  return { downloadLink };
};

export default useFileDownload;
