import { useParams } from 'react-router-dom';
import PersonalSearchSelect from '../components/PersonalSearchSelect';
import EquipoSearchSelect from '../components/EquipoSearchSelect';
import InventarioSearchSelect from '../components/InventarioSearchSelect';
import SignaturePad from '../../../Firmas/components/SignaturePad';
import {
    TruckIcon,
    ArrowLeftIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    CubeIcon,
    PencilSquareIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import useActasEntregaForm from '../hooks/useActasEntregaForm';
import { getStorageUrl } from '../../../../services/api';

export default function ActasEntregaFormPage() {
    const { id } = useParams();
    
    const {
        isEditMode,
        formData,
        setFormData,
        loading,
        firmaEntrega,
        setFirmaEntrega,
        firmaRecibe,
        setFirmaRecibe,
        existingFirmaEntrega,
        existingFirmaRecibe,
        tempPerifericoId,
        setTempPerifericoId,
        tempPerifericoCantidad,
        setTempPerifericoCantidad,
        tempPerifericoObs,
        setTempPerifericoObs,
        handleEquipoSelect,
        handlePersonalSelect,
        handleAddPeriferico,
        handleRemovePeriferico,
        handleSubmit,
        navigate,
        currentUser,
        useStoredSignature,
        setUseStoredSignature,
        showCurrentSignature,
        setShowCurrentSignature
    } = useActasEntregaForm(id);



    if (loading && isEditMode && !formData.equipo_id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in font-sans">
            {/* Header Card */}
            <div className="bg-white shadow-xl rounded-[2rem] p-6 mb-8 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="p-4 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mr-5 shadow-lg shadow-indigo-200">
                        <TruckIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            {isEditMode ? 'Editar Acta de Entrega' : 'Nueva Acta de Entrega'}
                        </h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Equipo de Computo</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="mb-8 flex items-center justify-between px-2">
                <button
                    onClick={() => navigate('/gestion-sistemas/actas-entrega')}
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm"
                >
                    <div className="h-9 w-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-200 transition-all">
                        <ArrowLeftIcon className="h-4 w-4 stroke-[3]" />
                    </div>
                    Volver al Listado
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-8 md:p-14">
                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Section: Selección de Recursos */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <CubeIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">1. Recursos del Acta</h3>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <EquipoSearchSelect
                                    label="Seleccionar Equipo *"
                                    value={formData.equipo_id}
                                    onChange={handleEquipoSelect}
                                />
                                <PersonalSearchSelect
                                    label="Funcionario que Recibe *"
                                    value={formData.funcionario_id}
                                    onChange={handlePersonalSelect}
                                />
                            </div>
                        </div>

                        {/* Section: Periféricos Adicionales */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <CubeIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">2. Periféricos Adicionales</h3>
                            </div>
                            
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    <div className="md:col-span-4">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Buscar Periférico</label>
                                        <InventarioSearchSelect 
                                            onSelect={(item) => setTempPerifericoId(item ? item.id : '')} 
                                            initialValue={tempPerifericoId}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Cantidad</label>
                                        <input 
                                            type="number" 
                                            value={tempPerifericoCantidad} 
                                            onChange={e => setTempPerifericoCantidad(e.target.value)}
                                            className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Observaciones</label>
                                        <input 
                                            type="text" 
                                            value={tempPerifericoObs} 
                                            onChange={e => setTempPerifericoObs(e.target.value)}
                                            className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                                            placeholder="Ej. Mouse inalámbrico"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button 
                                            type="button" 
                                            onClick={handleAddPeriferico}
                                            className="w-full py-3 bg-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <PlusIcon className="h-5 w-5" /> Agregar
                                        </button>
                                    </div>
                                </div>

                                {formData.perifericos.length > 0 && (
                                    <div className="mt-6 border-t border-slate-200 pt-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Lista de Periféricos</h4>
                                        <div className="space-y-2">
                                            {formData.perifericos.map((p, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
                                                    <span className="text-sm font-bold text-slate-700">ID: {p.inventario_id} | Cantidad: {p.cantidad} | {p.observaciones}</span>
                                                    <button type="button" onClick={() => handleRemovePeriferico(idx)} className="text-red-500 hover:text-red-700">
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section: Logística */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <CalendarDaysIcon className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">3. Detalles de Logística</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Fecha de Entrega</label>
                                    <div className="group relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <ClockIcon className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            type="date"
                                            value={formData.fecha_entrega}
                                            onChange={e => setFormData({...formData, fecha_entrega: e.target.value})}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-900 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Firmas */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <PencilSquareIcon className="h-5 w-5 text-violet-600" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">4. Protocolo de Validación Jurídica</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center">
                                                <UserCircleIcon className="h-4 w-4 mr-2" /> Firma Sistemas (Emite)
                                            </h4>
                                            {!showCurrentSignature && (
                                                <div className="flex items-center gap-3 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-200">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        {useStoredSignature ? 'Usando firma guardada' : 'Dibujar firma'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setUseStoredSignature(!useStoredSignature)}
                                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 shadow-sm ${useStoredSignature ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useStoredSignature ? 'translate-x-5' : 'translate-x-0'}`}
                                                        />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {showCurrentSignature ? (
                                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-white min-h-[160px]">
                                                <div className="text-center">
                                                    <h3 className="text-sm font-bold text-slate-700 mb-3">Firma Actual de Emisión</h3>
                                                    <img 
                                                        src={getStorageUrl(existingFirmaEntrega)} 
                                                        alt="Firma Guardada" 
                                                        className="h-24 object-contain mx-auto mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100 shadow-sm"
                                                        onError={(e) => {
                                                            console.error('Error loading signature:', e.target.src);
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                    <p className="text-xs text-green-600 font-bold uppercase tracking-widest mb-3">Esta firma ya está asociada a esta acta.</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentSignature(false)}
                                                        className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
                                                    >
                                                        Cambiar Firma
                                                    </button>
                                                </div>
                                            </div>
                                        ) : useStoredSignature ? (
                                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-white min-h-[160px]">
                                                {currentUser?.firma_digital ? (
                                                    <div className="text-center">
                                                        <img 
                                                            src={getStorageUrl(currentUser.firma_digital)} 
                                                            alt="Firma Guardada" 
                                                            className="h-24 object-contain mx-auto mb-2 mix-blend-multiply"
                                                            onError={(e) => {
                                                                console.error('Error loading signature:', e.target.src);
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        <p className="text-xs text-green-600 font-black uppercase tracking-widest mt-2">Firma guardada lista para usar</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-gray-500">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        <p className="mt-2 text-xs font-black text-slate-400 uppercase tracking-widest">No tienes una firma guardada</p>
                                                        <p className="mt-1 text-[10px] font-bold text-slate-400">Apaga el botón superior para dibujarla manualmente, o configúrala en tu perfil.</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <SignaturePad onSave={setFirmaEntrega} buttonText={existingFirmaEntrega ? "Actualizar Firma" : "Registrar Firma Emisor"} />
                                        )}
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center">
                                            <UserCircleIcon className="h-4 w-4 mr-2" /> Firma Funcionario (Recibe)
                                        </h4>
                                        {existingFirmaRecibe && !firmaRecibe && (
                                            <div className="mb-6 animate-fade-in group/img">
                                                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-inner">
                                                    <img 
                                                        src={getStorageUrl(existingFirmaRecibe)} 
                                                        alt="Firma Actual" 
                                                        className="h-32 mx-auto grayscale" 
                                                        onError={(e) => {
                                                            console.error('Error loading signature:', e.target.src);
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <SignaturePad onSave={setFirmaRecibe} buttonText={existingFirmaRecibe ? "Actualizar Firma" : "Registrar Firma Receptor"} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-slate-50">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-grow relative overflow-hidden group py-5 bg-indigo-600 text-white rounded-3xl font-black tracking-[0.2em] shadow-2xl hover:shadow-indigo-400 transition-all"
                            >
                                <span className="relative z-10">{loading ? 'Procesando...' : (isEditMode ? 'Sincronizar Acta' : 'Generar Acta de Entrega')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
