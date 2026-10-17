const MAX_SIDE = 2000;
const JPEG_QUALITY = 0.85;
export const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;
export const MAX_RECEIPTS = 5;
export const RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export type ReceiptErrorReason = 'unreadable' | 'tooLarge' | 'unsupported';

export class ReceiptError extends Error {
  constructor(
    readonly reason: ReceiptErrorReason,
    readonly fileName: string,
  ) {
    super(`${fileName}: ${reason}`);
    this.name = 'ReceiptError';
  }
}

/** Scales a size down so its long side is at most `max`, keeping the aspect ratio. */
export const fitWithin = (width: number, height: number, max = MAX_SIDE) => {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
};

const toJpegName = (name: string) => `${name.replace(/\.[^.]+$/, '') || 'receipt'}.jpg`;

const encode = (bitmap: ImageBitmap) => {
  const { width, height } = fitWithin(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, width, height);
  return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
};

/**
 * Makes a picked file ready to upload: PDFs as they are, photos re-encoded as a JPEG of at most
 * 2000 px so phone pictures stay well under the 5 MB limit.
 */
export const resizeImage = async (file: File): Promise<File> => {
  if (file.type === 'application/pdf') {
    if (file.size > MAX_RECEIPT_BYTES) throw new ReceiptError('tooLarge', file.name);
    return file;
  }
  if (!file.type.startsWith('image/')) throw new ReceiptError('unsupported', file.name);

  let blob: Blob | null;
  try {
    const bitmap = await createImageBitmap(file);
    blob = await encode(bitmap);
    bitmap.close();
  } catch {
    throw new ReceiptError('unreadable', file.name);
  }

  if (!blob) throw new ReceiptError('unreadable', file.name);
  if (blob.size > MAX_RECEIPT_BYTES) throw new ReceiptError('tooLarge', file.name);
  return new File([blob], toJpegName(file.name), { type: 'image/jpeg' });
};
