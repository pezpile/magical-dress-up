import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const CANVAS_SIZE = 1000;
const MAX_HISTORY = 20;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const DrawingCanvas = forwardRef(function DrawingCanvas({ tool, color, size, maskSrcs }, ref) {
  const canvasRef   = useRef(null);
  const tempRef     = useRef(null); // offscreen stroke buffer
  const maskRef     = useRef(null); // offscreen composited mask
  const isDrawing   = useRef(false);
  const lastPos     = useRef(null);
  const undoStack   = useRef([]);
  const redoStack   = useRef([]);

  // Create temp canvas once
  useEffect(() => {
    const tc = document.createElement('canvas');
    tc.width = CANVAS_SIZE;
    tc.height = CANVAS_SIZE;
    tempRef.current = tc;
  }, []);

  // Rebuild mask canvas when maskSrcs changes
  useEffect(() => {
    if (!maskSrcs || maskSrcs.length === 0) {
      maskRef.current = null;
      return;
    }
    let cancelled = false;
    Promise.all(maskSrcs.map(loadImage)).then(imgs => {
      if (cancelled) return;
      const mc = document.createElement('canvas');
      mc.width  = CANVAS_SIZE;
      mc.height = CANVAS_SIZE;
      const ctx = mc.getContext('2d');
      imgs.forEach(img => ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE));
      maskRef.current = mc;
    }).catch(() => { if (!cancelled) maskRef.current = null; });
    return () => { cancelled = true; };
  }, [maskSrcs]);

  function snapshot() {
    return canvasRef.current.getContext('2d').getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
  function restore(data) {
    canvasRef.current.getContext('2d').putImageData(data, 0, 0);
  }

  useImperativeHandle(ref, () => ({
    undo() {
      if (!undoStack.current.length) return;
      redoStack.current.push(snapshot());
      restore(undoStack.current.pop());
    },
    redo() {
      if (!redoStack.current.length) return;
      undoStack.current.push(snapshot());
      restore(redoStack.current.pop());
    },
    clear() {
      undoStack.current.push(snapshot());
      if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
      redoStack.current = [];
      canvasRef.current.getContext('2d').clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    },
  }));

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (CANVAS_SIZE / rect.width),
      y: (src.clientY - rect.top)  * (CANVAS_SIZE / rect.height),
    };
  }

  function paint(from, to) {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const rect   = canvas.getBoundingClientRect();
    const sw     = size * (CANVAS_SIZE / rect.width);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = sw;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      return;
    }

    // Draw stroke segment into temp buffer
    const temp    = tempRef.current;
    const tempCtx = temp.getContext('2d');
    tempCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    tempCtx.globalCompositeOperation = 'source-over';
    tempCtx.strokeStyle = color;
    tempCtx.lineWidth   = sw;
    tempCtx.lineCap     = 'round';
    tempCtx.lineJoin    = 'round';
    tempCtx.beginPath();
    tempCtx.moveTo(from.x, from.y);
    tempCtx.lineTo(to.x, to.y);
    tempCtx.stroke();

    // Clip to mask if one is loaded
    if (maskRef.current) {
      tempCtx.globalCompositeOperation = 'destination-in';
      tempCtx.drawImage(maskRef.current, 0, 0);
      tempCtx.globalCompositeOperation = 'source-over';
    }

    // Merge clipped segment onto main canvas
    ctx.drawImage(temp, 0, 0);
  }

  function onStart(e) {
    e.preventDefault();
    undoStack.current.push(snapshot());
    if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
    redoStack.current = [];
    isDrawing.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
    paint(pos, pos);
  }

  function onMove(e) {
    if (!isDrawing.current) return;
    e.preventDefault();
    const pos = getPos(e);
    paint(lastPos.current, pos);
    lastPos.current = pos;
  }

  function onEnd() {
    isDrawing.current = false;
    lastPos.current = null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        cursor: tool === 'eraser' ? 'cell' : 'crosshair',
        touchAction: 'none',
        mixBlendMode: 'color',
      }}
      onMouseDown={onStart}
      onMouseMove={onMove}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchStart={onStart}
      onTouchMove={onMove}
      onTouchEnd={onEnd}
    />
  );
});

export default DrawingCanvas;
