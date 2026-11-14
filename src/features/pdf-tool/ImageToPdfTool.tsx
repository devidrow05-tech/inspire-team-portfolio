import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  RotateCw,
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Settings2,
  GripVertical,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { checkMagicBytes } from '../../lib/magicBytes';
import { formatBytes } from '../../lib/format';
import {
  AnimatedButton,
  AnimatedCard,
  RevealSection,
  showAnimatedToast,
} from '../../components/ui/MotionPrimitives';
import { EASINGS } from '../../frontend/lib/animations';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  rotation: number;
  name: string;
  size: number;
}

export const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Auto'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [quality, setQuality] = useState<'high' | 'balanced' | 'small'>('balanced');
  const [marginMm] = useState<number>(10);
  const [customFilename, setCustomFilename] = useState('inspire-portfolio-export.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [attachedToProjectSuccess, setAttachedToProjectSuccess] = useState(false);

  const handleFilesChosen = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setValidationErrors([]);
    const newItems: ImageItem[] = [];
    const errors: string[] = [];

    if (images.length + files.length > 40) {
      errors.push('Maximum 40 images allowed per PDF compilation (PRD PDF-009).');
      setValidationErrors(errors);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`File "${file.name}" exceeds 10 MB limit.`);
        continue;
      }

      const magicCheck = await checkMagicBytes(file);
      if (!magicCheck.valid) {
        errors.push(`File "${file.name}": ${magicCheck.error || 'Invalid image header'}`);
        continue;
      }

      newItems.push({
        id: `img-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        rotation: 0,
        name: file.name,
        size: file.size,
      });
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
      showAnimatedToast(`Added ${newItems.length} image(s) to PDF queue`, 'info');
    }
  };

  const rotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const newArr = [...images];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    setImages(newArr);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setProgressText('Initializing PDF document...');
    setGeneratedPdfBlob(null);
    setGeneratedPdfUrl(null);
    setAttachedToProjectSuccess(false);

    try {
      const pdfDoc = await PDFDocument.create();

      let baseW = pageSize === 'Letter' ? 612 : 595.28;
      let baseH = pageSize === 'Letter' ? 792 : 841.89;

      if (orientation === 'landscape') {
        const temp = baseW;
        baseW = baseH;
        baseH = temp;
      }

      const qualityScale = quality === 'small' ? 0.6 : quality === 'high' ? 0.92 : 0.78;
      const maxDimension = quality === 'small' ? 1600 : quality === 'high' ? 3200 : 2200;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setProgressText(`Processing image ${i + 1} of ${images.length}: ${item.name}`);

        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        let srcW = img.width;
        let srcH = img.height;
        const swapDimensions = item.rotation === 90 || item.rotation === 270;
        if (swapDimensions) {
          srcW = img.height;
          srcH = img.width;
        }

        let targetW = srcW;
        let targetH = srcH;
        if (Math.max(targetW, targetH) > maxDimension) {
          const ratio = maxDimension / Math.max(targetW, targetH);
          targetW = Math.round(targetW * ratio);
          targetH = Math.round(targetH * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context failed');

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((item.rotation * Math.PI) / 180);
        if (swapDimensions) {
          ctx.drawImage(img, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width);
        } else {
          ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        }
        ctx.restore();

        const jpegBlob: Blob = await new Promise((res) =>
          canvas.toBlob((b) => res(b!), 'image/jpeg', qualityScale)
        );
        const jpegBytes = await jpegBlob.arrayBuffer();
        const embeddedImg = await pdfDoc.embedJpg(jpegBytes);

        let pageW = baseW;
        let pageH = baseH;

        if (pageSize === 'Auto') {
          pageW = targetW * 0.75;
          pageH = targetH * 0.75;
        }

        const marginPts = pageSize === 'Auto' ? 0 : (marginMm / 25.4) * 72;
        const availW = pageW - marginPts * 2;
        const availH = pageH - marginPts * 2;

        let drawW = availW;
        let drawH = (targetH / targetW) * availW;

        if (drawH > availH) {
          drawH = availH;
          drawW = (targetW / targetH) * availH;
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        const posX = marginPts + (availW - drawW) / 2;
        const posY = marginPts + (availH - drawH) / 2;

        page.drawImage(embeddedImg, {
          x: posX,
          y: posY,
          width: drawW,
          height: drawH,
        });
      }

      setProgressText('Finalizing and encoding PDF structure...');
      const pdfBytes = await pdfDoc.save();
      const finalBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const finalUrl = URL.createObjectURL(finalBlob);

      setGeneratedPdfBlob(finalBlob);
      setGeneratedPdfUrl(finalUrl);
      showAnimatedToast('PDF compiled cleanly and ready for export!', 'success');
    } catch (err: any) {
      setValidationErrors([`PDF compilation failed: ${err.message || 'Memory error'}`]);
      showAnimatedToast('PDF compilation failed', 'error');
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };

  const handleDownload = () => {
    if (!generatedPdfUrl) return;
    const a = document.createElement('a');
    a.href = generatedPdfUrl;
    a.download = customFilename.endsWith('.pdf') ? customFilename : `${customFilename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAttachToDraft = () => {
    setAttachedToProjectSuccess(true);
    showAnimatedToast('Attached PDF to current project draft!', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <RevealSection className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Client-Side Image-to-PDF Engine
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Drag to reorder, rotate, downscale and compile high-resolution images into lightweight A4/Letter PDFs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 font-medium">
            Strict 10MB Cap Enforced
          </span>
        </div>
      </RevealSection>

      {validationErrors.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 rounded-xl text-rose-700 dark:text-rose-300 text-sm space-y-1">
          <div className="font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Notice during image ingestion:
          </div>
          <ul className="list-disc ps-6 space-y-0.5 text-xs">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image Dropzone & Drag-Reorderable List */}
        <div className="lg:col-span-2 space-y-4">
          <label className="border-2 border-dashed border-[var(--border)] hover:border-teal-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[var(--surface)] hover:bg-[var(--surface-2)] transition group">
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              transition={EASINGS.spring}
              className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-3"
            >
              <Upload className="w-6 h-6" />
            </motion.div>
            <span className="text-sm font-semibold text-[var(--text)]">
              Drop project screenshots or click to browse
            </span>
            <span className="text-xs text-[var(--text-muted)] mt-1">
              Supports JPG, PNG, and WEBP. Up to 40 images, max 10MB each.
            </span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFilesChosen(e.target.files)}
              className="hidden"
            />
          </label>

          {/* Drag-Reorderable Image List */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
                <span>Selected Images ({images.length}) · Drag rows to reorder</span>
                <AnimatedButton
                  type="button"
                  onClick={() => setImages([])}
                  className="text-rose-500 hover:underline px-2 py-1"
                >
                  Clear All
                </AnimatedButton>
              </div>

              <Reorder.Group
                axis="y"
                values={images}
                onReorder={setImages}
                className="space-y-2.5"
              >
                <AnimatePresence>
                  {images.map((img, idx) => (
                    <Reorder.Item
                      key={img.id}
                      value={img}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={EASINGS.spring}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 flex items-center gap-3 group shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center shrink-0">
                        <motion.img
                          animate={{ rotate: img.rotation }}
                          transition={EASINGS.spring}
                          src={img.previewUrl}
                          alt={img.name}
                          className="max-h-full max-w-full object-contain"
                        />
                        <span className="absolute top-0.5 start-0.5 bg-slate-950/80 text-white text-[9px] font-bold px-1 rounded">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate text-[var(--text)]">
                          {img.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {formatBytes(img.size)} · {img.rotation}°
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <AnimatedButton
                          type="button"
                          onClick={() => moveImage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text-muted)] disabled:opacity-30"
                          title="Move earlier"
                          aria-label={`Move ${img.name} up`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </AnimatedButton>
                        <AnimatedButton
                          type="button"
                          onClick={() => moveImage(idx, 'down')}
                          disabled={idx === images.length - 1}
                          className="p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text-muted)] disabled:opacity-30"
                          title="Move later"
                          aria-label={`Move ${img.name} down`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </AnimatedButton>
                        <AnimatedButton
                          type="button"
                          onClick={() => rotateImage(img.id)}
                          className="p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
                          title="Rotate 90° clockwise"
                          aria-label={`Rotate ${img.name}`}
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </AnimatedButton>
                        <AnimatedButton
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
                          title="Remove image"
                          aria-label={`Remove ${img.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </AnimatedButton>
                      </div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>
          )}
        </div>

        {/* Right Column: PDF Settings */}
        <div className="space-y-6">
          <AnimatedCard className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-teal-500" />
              Document Configuration
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)]">Page Size</label>
              <div className="grid grid-cols-3 gap-2">
                {(['A4', 'Letter', 'Auto'] as const).map((sz) => (
                  <AnimatedButton
                    key={sz}
                    type="button"
                    onClick={() => setPageSize(sz)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition ${
                      pageSize === sz
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text-muted)]'
                    }`}
                  >
                    {sz}
                  </AnimatedButton>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)]">Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                {(['portrait', 'landscape'] as const).map((ori) => (
                  <AnimatedButton
                    key={ori}
                    type="button"
                    onClick={() => setOrientation(ori)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border capitalize transition ${
                      orientation === ori
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text-muted)]'
                    }`}
                  >
                    {ori}
                  </AnimatedButton>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)]">Quality & Compression</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Small', desc: '1600px' },
                  { id: 'balanced', label: 'Balanced', desc: '2200px' },
                  { id: 'high', label: 'High', desc: '3200px' },
                ].map((q) => (
                  <AnimatedButton
                    key={q.id}
                    type="button"
                    onClick={() => setQuality(q.id as 'small' | 'balanced' | 'high')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                      quality === q.id
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text-muted)]'
                    }`}
                  >
                    <div>{q.label}</div>
                    <div className="text-[10px] opacity-75">{q.desc}</div>
                  </AnimatedButton>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pdf-filename" className="text-xs font-semibold text-[var(--text)]">
                Output Filename
              </label>
              <input
                id="pdf-filename"
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <AnimatedButton
              type="button"
              onClick={generatePdf}
              disabled={images.length === 0 || isProcessing}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Combined PDF</span>
                </>
              )}
            </AnimatedButton>

            {progressText && (
              <p className="text-[11px] text-teal-600 dark:text-teal-400 text-center">
                {progressText}
              </p>
            )}
          </AnimatedCard>

          <AnimatePresence>
            {generatedPdfBlob && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={EASINGS.spring}
                className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/30 p-5 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-teal-900 dark:text-teal-200">
                      PDF Ready for Use
                    </div>
                    <div className="text-xs text-teal-700 dark:text-teal-400 mt-0.5">
                      Total Size: {formatBytes(generatedPdfBlob.size)} ({images.length} pages)
                    </div>
                  </div>
                </div>

                {generatedPdfBlob.size > 10 * 1024 * 1024 ? (
                  <div className="bg-amber-100 dark:bg-amber-950/60 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>File is &gt; 10MB limit. Switch to "Small" preset.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <AnimatedButton
                      type="button"
                      onClick={handleDownload}
                      className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download to Device</span>
                    </AnimatedButton>

                    <AnimatedButton
                      type="button"
                      onClick={handleAttachToDraft}
                      className="w-full py-2 px-3 rounded-lg border border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-950/60 font-semibold text-xs transition"
                    >
                      Attach Directly to Current Project Draft
                    </AnimatedButton>

                    {attachedToProjectSuccess && (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 text-center font-medium flex items-center justify-center gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Attached to draft project files successfully!</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
