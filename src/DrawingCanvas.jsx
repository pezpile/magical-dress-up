import { useRef, forwardRef, useImperativeHandle } from 'react';

const CANVAS_SIZE = 1000;
const MAX_HISTORY = 20;

const DrawingCanvas = forwardRef(function DrawingCanvas({ tool, color, size }, ref) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

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
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (CANVAS_SIZE / rect.width),
      y: (src.clientY - rect.top) * (CANVAS_SIZE / rect.height),
    };
  }

  function paint(from, to) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaledSize = size * (CANVAS_SIZE / rect.width);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }

    ctx.lineWidth = scaledSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
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
