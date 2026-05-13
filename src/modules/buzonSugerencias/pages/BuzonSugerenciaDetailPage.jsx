import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon, PaperClipIcon, CheckCircleIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { buzonSugerenciasService } from '../services/buzonSugerenciasService';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';

import echo from '../../../services/echo';

export default function BuzonSugerenciaDetailPage() {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const { user, hasPermission } = useAuth();
    
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    
    const isAgente = hasPermission('buzon.agente');

    const fetchTicket = async () => {
        try {
            const data = await buzonSugerenciasService.getByCodigo(codigo);
            setTicket(data);
        } catch (error) {
            console.error("Error al cargar ticket:", error);
            Swal.fire('Error', 'No se pudo cargar el ticket', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();

        // Suscripción a WebSockets con Laravel Echo
        const channel = echo.private(`buzon.ticket.${codigo}`);
        
        channel.listen('.App\\Modules\\BuzonSugerencias\\Domain\\Events\\NuevoComentarioPublicado', (e) => {
            setTicket(prevTicket => {
                if (!prevTicket) return prevTicket;
                // Evitar duplicados
                const exists = prevTicket.comentarios?.find(c => c.id === e.id);
                if (exists) return prevTicket;
                
                return {
                    ...prevTicket,
                    comentarios: [...(prevTicket.comentarios || []), {
                        id: e.id,
                        usuario_id: e.usuario_id,
                        mensaje: e.mensaje,
                        fecha_comentario: e.fecha_comentario,
                        usuario: e.usuario,
                        leido: false
                    }]
                };
            });
        });

        channel.listen('.App\\Modules\\BuzonSugerencias\\Domain\\Events\\ComentariosLeidos', (e) => {
            setTicket(prevTicket => {
                if (!prevTicket) return prevTicket;
                
                return {
                    ...prevTicket,
                    comentarios: prevTicket.comentarios?.map(c => {
                        if (c.usuario_id !== e.leido_por_usuario_id) {
                            return { ...c, leido: true };
                        }
                        return c;
                    })
                };
            });
        });

        channel.listen('.App\\Modules\\BuzonSugerencias\\Domain\\Events\\EstadoTicketActualizado', (e) => {
            setTicket(prevTicket => {
                if (!prevTicket) return prevTicket;
                return {
                    ...prevTicket,
                    estado: e.estado,
                    estado_id: e.estado.id
                };
            });
        });

        channel.listen('.App\\Modules\\BuzonSugerencias\\Domain\\Events\\NuevaEvidenciaAdjunta', (e) => {
            setTicket(prevTicket => {
                if (!prevTicket) return prevTicket;
                
                // Mezclar adjuntos nuevos con los existentes, evitando duplicados
                const currentAdjuntos = prevTicket.adjuntos || [];
                const newAdjuntos = e.adjuntos.filter(newAdj => !currentAdjuntos.some(c => c.id === newAdj.id));
                
                return {
                    ...prevTicket,
                    adjuntos: [...currentAdjuntos, ...newAdjuntos]
                };
            });
        });

        return () => {
            echo.leaveChannel(`buzon.ticket.${codigo}`);
        };
        // eslint-disable-next-line
    }, [codigo]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        
        // Si hay comentarios, y asumiendo que al estar en la página los vemos todos,
        // marcamos como leídos los que no son nuestros
        if (ticket && ticket.id) {
            buzonSugerenciasService.marcarComentariosLeidos(ticket.id).catch(err => console.error("Error marcando leídos:", err));
        }
    }, [ticket?.comentarios, ticket?.id]);

    const handleSendMensaje = async (e) => {
        e.preventDefault();
        if (!mensaje.trim()) return;
        
        setEnviando(true);
        try {
            await buzonSugerenciasService.addComentario(ticket.id, mensaje);
            setMensaje('');
            // Se actualiza vía WebSocket, pero recargamos por si acaso
            await fetchTicket(); 
        } catch (error) {
            Swal.fire('Error', 'No se pudo enviar el mensaje', 'error');
        } finally {
            setEnviando(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSubiendoImagen(true);
        try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);
            await buzonSugerenciasService.uploadAdjuntos(ticket.id, [compressedFile]);
            // El WebSocket se encargará de agregar la imagen a la interfaz, no necesitamos recargar
        } catch (error) {
            console.error("Error al subir imagen:", error);
            Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        } finally {
            setSubiendoImagen(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCambiarEstado = async (nuevoEstadoId) => {
        try {
            await buzonSugerenciasService.updateEstado(ticket.id, nuevoEstadoId);
            Swal.fire('Éxito', 'Estado actualizado correctamente', 'success');
            await fetchTicket();
        } catch (error) {
            Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
        }
    };

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Abierto': return 'bg-emerald-100 text-emerald-800 ring-emerald-600/20';
            case 'En Proceso': return 'bg-amber-100 text-amber-800 ring-amber-600/20';
            case 'Resuelto': return 'bg-blue-100 text-blue-800 ring-blue-600/20';
            case 'Cerrado': return 'bg-slate-100 text-slate-800 ring-slate-600/20';
            default: return 'bg-gray-100 text-gray-800 ring-gray-600/20';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );
    
    if (!ticket) return <div className="p-8 text-center text-red-500 font-bold">Ticket no encontrado</div>;

    const isClosed = ticket.estado?.nombre === 'Resuelto' || ticket.estado?.nombre === 'Cerrado';

    return (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                VOLVER A LA LISTA
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Detalles del Ticket */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset mb-3 ${getStatusColor(ticket.estado?.nombre)}`}>
                                {ticket.estado?.nombre}
                            </span>
                            <h1 className="text-xl font-extrabold text-slate-900 leading-tight mb-2">{ticket.asunto}</h1>
                            <p className="text-xs font-black text-slate-400 tracking-widest">{ticket.codigo_ticket}</p>
                        </div>
                        
                        <div className="px-6 py-6 space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Descripción original</h3>
                                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {ticket.observaciones}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Prioridad</h3>
                                    <span className="text-sm font-bold text-slate-900">{ticket.prioridad}</span>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Creado el</h3>
                                    <span className="text-sm font-bold text-slate-900">{new Date(ticket.fecha_creacion).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Reportado por</h3>
                                    <span className="text-sm font-bold text-slate-900">{ticket.creador?.nombre_completo}</span>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Asignado a</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900">
                                            {ticket.asignado?.nombre_completo || 'Sin asignar'}
                                        </span>
                                        {isAgente && !ticket.asignado_a && !isClosed && (
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        await buzonSugerenciasService.asignarResponsable(ticket.id, user.id);
                                                        Swal.fire('Éxito', 'Te has asignado este ticket', 'success');
                                                        fetchTicket();
                                                    } catch (error) {
                                                        Swal.fire('Error', 'No se pudo asignar el ticket', 'error');
                                                    }
                                                }}
                                                className="text-[10px] font-black tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                                            >
                                                ASIGNARME
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Evidencias Visuales */}
                            {ticket.adjuntos && ticket.adjuntos.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-1">
                                        <PaperClipIcon className="w-3 h-3" /> Evidencias Adjuntas
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {ticket.adjuntos.map(adj => (
                                            <button key={adj.id} type="button" onClick={() => setSelectedImage(`${import.meta.env.VITE_API_URL.replace('/api', '')}/${adj.url_imagen}`)}
                                               className="block overflow-hidden rounded-xl border border-slate-200 hover:border-indigo-500 transition-colors group">
                                                <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                                                    <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${adj.url_imagen}`} alt="Adjunto" className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Acciones de Agente */}
                            {isAgente && !isClosed && (
                                <div className="pt-6 border-t border-slate-100">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-3">Acciones de Soporte</h3>
                                    <select 
                                        onChange={(e) => handleCambiarEstado(e.target.value)}
                                        value={ticket.estado_id}
                                        className="w-full rounded-2xl border-slate-200 bg-slate-50 py-2 px-3 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                                    >
                                        <option value="1">Abierto</option>
                                        <option value="2">En Proceso</option>
                                        <option value="3">Resuelto</option>
                                        <option value="4">Cerrado</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Hilo de Chat */}
                <div className="lg:col-span-2 flex flex-col h-[800px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
                            Hilo de Conversación
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                        {ticket.comentarios?.length === 0 ? (
                            <div className="text-center text-sm text-slate-400 py-10 font-medium">
                                Aún no hay mensajes en este ticket.
                            </div>
                        ) : (
                            ticket.comentarios?.map((comentario) => {
                                const esMio = comentario.usuario_id === user?.id;
                                return (
                                    <div key={comentario.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-3xl px-5 py-4 ${
                                            esMio 
                                                ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-200' 
                                                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-black tracking-wider ${esMio ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                    {esMio ? 'TÚ' : comentario.usuario?.nombre_completo?.toUpperCase()}
                                                </span>
                                                <span className={`text-[10px] flex items-center gap-1 ${esMio ? 'text-indigo-300' : 'text-slate-400'}`}>
                                                    {new Date(comentario.fecha_comentario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {esMio && (
                                                        <span className="flex -space-x-1.5 ml-1">
                                                            <CheckIcon className={`w-3 h-3 ${comentario.leido ? 'text-sky-300' : 'text-indigo-400/50'}`} />
                                                            <CheckIcon className={`w-3 h-3 ${comentario.leido ? 'text-sky-300' : 'text-indigo-400/50'}`} />
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{comentario.mensaje}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-white p-4 border-t border-slate-100">
                        {isClosed ? (
                            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-500 flex items-center justify-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                                Este ticket ha sido cerrado y ya no admite nuevos mensajes.
                            </div>
                        ) : (
                            <form onSubmit={handleSendMensaje} className="flex gap-3 items-center">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={subiendoImagen}
                                    className="p-3 text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0"
                                >
                                    {subiendoImagen ? (
                                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <PaperClipIcon className="w-6 h-6" />
                                    )}
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                                <input
                                    type="text"
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    placeholder="Escribe tu mensaje o respuesta..."
                                    className="flex-1 rounded-full border-slate-200 bg-slate-50 py-3 px-6 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={enviando || !mensaje.trim()}
                                    className="flex items-center justify-center rounded-full bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para ver imagen */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
                    <button type="button" className="absolute top-6 right-6 text-white hover:text-red-400 transition-colors p-2" onClick={() => setSelectedImage(null)}>
                        <XMarkIcon className="w-8 h-8" />
                    </button>
                    <img src={selectedImage} alt="Ampliación" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain" onClick={e => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}
