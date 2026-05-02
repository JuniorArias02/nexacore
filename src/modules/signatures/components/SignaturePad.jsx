import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import SignatureCanvas from 'react-signature-canvas';
import Swal from 'sweetalert2';

/**
 * SignaturePad - Componente premium para captura de firmas.
 * Optimizado para móviles con canvas responsivo y UX mejorada.
 * Utiliza Portals para evitar conflictos de z-index.
 */
export default function SignaturePad({ 
    onSave, 
    buttonText = "Firmar", 
    title = "Firmar Documento",
    defaultValue = null,
    embedded = false 
}) {
    const sigPadRef = useRef(null);
    const containerRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [signatureData, setSignatureData] = useState(defaultValue);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // Sincronizar con defaultValue si cambia externamente
    useEffect(() => {
        if (defaultValue !== signatureData) {
            setSignatureData(defaultValue);
        }
    }, [defaultValue]);

    // Función para ajustar el tamaño del canvas al contenedor
    const resizeCanvas = useCallback(() => {
        const targetContainer = containerRef.current;
        if ((isModalOpen || embedded) && targetContainer && sigPadRef.current) {
            const canvas = sigPadRef.current.getCanvas();
            const { offsetWidth, offsetHeight } = targetContainer;
            
            if (canvas.width !== offsetWidth || canvas.height !== offsetHeight) {
                setCanvasSize({ width: offsetWidth, height: offsetHeight });
                sigPadRef.current.clear();
            }
        }
    }, [isModalOpen, embedded]);

    // Efecto para manejar el cambio de tamaño y orientación
    useEffect(() => {
        if (isModalOpen || embedded) {
            const timer = setTimeout(resizeCanvas, 100);
            window.addEventListener('resize', resizeCanvas);
            
            if (isModalOpen) document.body.style.overflow = 'hidden';
            
            return () => {
                window.removeEventListener('resize', resizeCanvas);
                clearTimeout(timer);
                if (isModalOpen) document.body.style.overflow = 'unset';
            };
        }
    }, [isModalOpen, embedded, resizeCanvas]);

    // Función manual para recortar el canvas (evita bug de la librería con trim-canvas en algunos entornos)
    const getTrimmedCanvasManual = (originalCanvas) => {
        const copy = document.createElement('canvas');
        copy.width = originalCanvas.width;
        copy.height = originalCanvas.height;
        const ctx = copy.getContext('2d');
        ctx.drawImage(originalCanvas, 0, 0);

        const imgData = ctx.getImageData(0, 0, copy.width, copy.height).data;
        let lW = copy.width, lH = copy.height, rW = 0, rH = 0;

        for (let i = 0; i < copy.height; i++) {
            for (let j = 0; j < copy.width; j++) {
                const alpha = imgData[(i * copy.width + j) * 4 + 3];
                if (alpha > 0) {
                    lW = Math.min(lW, j);
                    lH = Math.min(lH, i);
                    rW = Math.max(rW, j);
                    rH = Math.max(rH, i);
                }
            }
        }

        const width = rW - lW + 1;
        const height = rH - lH + 1;

        if (width <= 0 || height <= 0) return originalCanvas;

        const trimmed = document.createElement('canvas');
        trimmed.width = width;
        trimmed.height = height;
        trimmed.getContext('2d').drawImage(copy, lW, lH, width, height, 0, 0, width, height);
        return trimmed;
    };

    const handleClear = () => {
        if (sigPadRef.current) {
            sigPadRef.current.clear();
        }
    };

    const handleSave = () => {
        if (sigPadRef.current && sigPadRef.current.isEmpty()) {
            Swal.fire({
                title: 'No hay firma',
                text: 'Por favor, realice su firma en el panel antes de continuar.',
                icon: 'warning',
                confirmButtonColor: '#6366f1',
                customClass: { popup: 'rounded-3xl' }
            });
            return;
        }

        try {
            // Intentamos usar el de la librería, si falla usamos el manual
            const canvas = sigPadRef.current.getCanvas();
            let finalCanvas;
            try {
                finalCanvas = sigPadRef.current.getTrimmedCanvas();
            } catch (e) {
                console.warn("getTrimmedCanvas falló, usando recorte manual:", e);
                finalCanvas = getTrimmedCanvasManual(canvas);
            }
            
            const dataURL = finalCanvas.toDataURL('image/png');
            setSignatureData(dataURL);
            setIsModalOpen(false);
            if (onSave) onSave(dataURL);
        } catch (error) {
            console.error("Error al guardar la firma:", error);
            // Último recurso: guardar el canvas completo sin recortar
            const dataURL = sigPadRef.current.getCanvas().toDataURL('image/png');
            setSignatureData(dataURL);
            setIsModalOpen(false);
            if (onSave) onSave(dataURL);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleRemoveSignature = () => {
        setSignatureData(null);
        if (onSave) onSave(null);
    };

    // Renderizado del área de dibujo (Canvas + Controles básicos)
    const renderDrawingArea = () => (
        <div className="flex-grow flex flex-col space-y-4 h-full">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Por favor, firme abajo</span>
                <div className="flex items-center gap-2 text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    <span>Optimizado para modo táctil</span>
                </div>
            </div>

            <div 
                ref={containerRef}
                className="relative flex-grow min-h-[250px] bg-slate-50 rounded-3xl border-2 border-slate-100 shadow-inner overflow-hidden cursor-crosshair touch-none"
            >
                <SignatureCanvas
                    ref={sigPadRef}
                    penColor="#1e293b"
                    backgroundColor="transparent"
                    canvasProps={{
                        width: canvasSize.width,
                        height: canvasSize.height,
                        className: 'signature-canvas w-full h-full'
                    }}
                    onEnd={() => {
                        if (embedded && onSave) {
                            try {
                                const canvas = sigPadRef.current.getCanvas();
                                let finalCanvas;
                                try {
                                    finalCanvas = sigPadRef.current.getTrimmedCanvas();
                                } catch (e) {
                                    finalCanvas = getTrimmedCanvasManual(canvas);
                                }
                                onSave(finalCanvas.toDataURL('image/png'));
                            } catch (err) {
                                console.error("Error en autosave:", err);
                                onSave(sigPadRef.current.getCanvas().toDataURL('image/png'));
                            }
                        }
                    }}
                />
            </div>

            <div className="flex justify-between items-center pt-2">
                <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Limpiar Lienzo
                </button>
                <span className="text-[10px] font-bold text-slate-300 italic">Captura digital activa</span>
            </div>
        </div>
    );

    if (embedded) {
        return <div className="signature-pad-embedded h-full">{renderDrawingArea()}</div>;
    }

    return (
        <div className="signature-pad-container">
            {/* Gatillo o Previsualización */}
            {!signatureData ? (
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-4 bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl transition-all hover:bg-indigo-50/30"
                >
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-50 group-hover:bg-indigo-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-indigo-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-700 uppercase tracking-widest">{buttonText}</span>
                </button>
            ) : (
                <div className="relative group/captured flex flex-col items-center gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={handleRemoveSignature}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <img 
                            src={signatureData} 
                            alt="Firma capturada" 
                            className="h-32 object-contain bg-slate-50/50 rounded-2xl p-4 border border-slate-50 shadow-inner" 
                        />
                        <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Validado</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Firma con Portal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100000] flex items-center justify-center animate-in fade-in duration-300">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={handleCancel}></div>
                    <div className="relative w-full h-[100dvh] sm:h-auto sm:max-w-2xl bg-white sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-50">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase tracking-[0.1em]">{title}</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                                    Panel de Firma Digital
                                </p>
                            </div>
                            <button type="button" onClick={handleCancel} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Drawing Area */}
                        <div className="p-6 sm:p-8 flex-grow">
                            {renderDrawingArea()}
                        </div>

                        {/* Footer */}
                        <div className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-50 flex gap-4">
                            <button type="button" onClick={handleCancel} className="flex-1 py-4 bg-white text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-100 hover:bg-slate-100 transition-all active:scale-95">
                                Cancelar
                            </button>
                            <button type="button" onClick={handleSave} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Confirmar Firma
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
