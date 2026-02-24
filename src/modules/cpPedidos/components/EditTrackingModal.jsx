import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EditTrackingModal = ({ isOpen, onClose, pedido, onSave, saving }) => {
    const [form, setForm] = useState({
        fecha_solicitud_cotizacion: '',
        fecha_respuesta_cotizacion: '',
        firma_aprobacion_orden: '',
        fecha_envio_proveedor: '',
        observaciones_pedidos: '',
    });

    useEffect(() => {
        if (pedido) {
            setForm({
                fecha_solicitud_cotizacion: pedido.fecha_solicitud_cotizacion || '',
                fecha_respuesta_cotizacion: pedido.fecha_respuesta_cotizacion || '',
                firma_aprobacion_orden: pedido.firma_aprobacion_orden || '',
                fecha_envio_proveedor: pedido.fecha_envio_proveedor || '',
                observaciones_pedidos: pedido.observaciones_pedidos || '',
            });
        }
    }, [pedido]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Map empty strings to null for better backend compatibility (especially for dates)
        const cleanedForm = Object.keys(form).reduce((acc, key) => {
            acc[key] = form[key] === '' ? null : form[key];
            return acc;
        }, {});

        onSave(pedido.id, cleanedForm);
    };

    if (!isOpen || !pedido) return null;

    const fields = [
        { key: 'fecha_solicitud_cotizacion', label: 'Fecha Solicitud Cotización', type: 'text', placeholder: 'Ej: 15/02/2026 o Pendiente' },
        { key: 'fecha_respuesta_cotizacion', label: 'Fecha Respuesta Cotización', type: 'text', placeholder: 'Ej: 18/02/2026 o En espera' },
        { key: 'firma_aprobacion_orden', label: 'Firma Aprobación Orden', type: 'date' },
        { key: 'fecha_envio_proveedor', label: 'Fecha Envío Proveedor', type: 'text', placeholder: 'Ej: 20/02/2026' },
    ];

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-lg transform rounded-2xl bg-white shadow-2xl transition-all">
                    {/* Header */}
                    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
                        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">Editar Seguimiento</h3>
                                <p className="mt-0.5 text-sm text-indigo-100">
                                    Pedido #{pedido.consecutivo} — {pedido.solicitante?.nombre || 'N/A'}
                                </p>
                            </div>
                            <button onClick={onClose} className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors">
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {fields.map(({ key, label, type, placeholder }) => (
                            <div key={key}>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                                <input
                                    type={type}
                                    value={form[key]}
                                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                                    placeholder={placeholder || ''}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Observaciones del Pedido</label>
                            <textarea
                                value={form.observaciones_pedidos}
                                onChange={e => setForm(prev => ({ ...prev, observaciones_pedidos: e.target.value }))}
                                rows={3}
                                placeholder="Observaciones adicionales..."
                                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        Guardando...
                                    </span>
                                ) : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTrackingModal;
