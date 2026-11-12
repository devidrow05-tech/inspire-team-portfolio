export interface MagicByteCheckResult {
  valid: boolean;
  detectedMime?: string;
  error?: string;
}

/**
 * Validates actual binary file headers (magic bytes) to prevent extension spoofing.
 * Allowed types: JPEG, PNG, WEBP, PDF
 */
export async function checkMagicBytes(file: File): Promise<MagicByteCheckResult> {
  const slice = file.slice(0, 16);
  const buffer = await slice.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // JPEG check: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { valid: true, detectedMime: 'image/jpeg' };
  }

  // PNG check: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { valid: true, detectedMime: 'image/png' };
  }

  // WEBP check: RIFF .... WEBP
  // 'RIFF' at 0-3, 'WEBP' at 8-11
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { valid: true, detectedMime: 'image/webp' };
  }

  // PDF check: %PDF- (25 50 44 46 2D)
  if (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  ) {
    return { valid: true, detectedMime: 'application/pdf' };
  }

  return {
    valid: false,
    error: 'File format does not match genuine JPEG, PNG, WEBP, or PDF binary headers.',
  };
}
