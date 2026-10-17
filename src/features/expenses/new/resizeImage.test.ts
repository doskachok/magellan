import { fitWithin, ReceiptError, resizeImage } from './resizeImage';

describe('fitWithin', () => {
  it('shrinks the long side to 2000 px and keeps the ratio', () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 2000, height: 1500 });
    expect(fitWithin(1000, 3000)).toEqual({ width: 667, height: 2000 });
  });

  it('leaves small images alone', () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
  });
});

describe('resizeImage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('passes PDFs through unchanged', async () => {
    const pdf = new File(['%PDF'], 'scan.pdf', { type: 'application/pdf' });

    expect(await resizeImage(pdf)).toBe(pdf);
  });

  it('rejects PDFs over 5 MB', async () => {
    const pdf = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'big.pdf', { type: 'application/pdf' });

    await expect(resizeImage(pdf)).rejects.toMatchObject({ reason: 'tooLarge' });
  });

  it('reports a photo the browser cannot decode', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('decode failed')));
    const heic = new File(['x'], 'photo.heic', { type: 'image/heic' });

    const error = await resizeImage(heic).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ReceiptError);
    expect(error).toMatchObject({ reason: 'unreadable' });
  });

  it('rejects other file types', async () => {
    const text = new File(['hi'], 'notes.txt', { type: 'text/plain' });

    await expect(resizeImage(text)).rejects.toMatchObject({ reason: 'unsupported' });
  });
});
