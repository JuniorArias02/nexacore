import React, { useRef, useState, useEffect } from 'react';
import { TrashIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const SignaturePad = ({ onSave, onClear }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawing, setHasDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Settings
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';

        // High DPI support
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        ctx.scale(ratio, ratio);

    }, []);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.closePath();
            setIsDrawing(false);

            // Pass the blob to parent
            canvas.toBlob((blob) => {
                if (onSave) onSave(blob);
            }, 'image/png');
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Use actual width/height (scaled)
        // Reset context state after clear if needed, but simple clear is usually enough

        /* 
           Note: clearRect clears the pixels but keeps the state (strokeStyle, etc).
           However, scaling might need to be re-applied if we reset dimensions, but we don't here.
           Just clearing the pixels is fine.
        */

        setHasDrawing(false);
        if (onClear) onClear();
        if (onSave) onSave(null); // Clear parent state
    };

    return (
        <div className="space-y-4">
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm touch-none">
                <canvas
                    ref={canvasRef}
                    className="w-full h-48 bg-white cursor-crosshair block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{ width: '100%', height: '192px' }}
                />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <p>Dibuja tu firma dentro del recuadro.</p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={clearCanvas}
                        disabled={!hasDrawing}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Borrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignaturePad;
