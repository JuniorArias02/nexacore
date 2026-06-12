import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import actasEntregaService from '../services/actasEntregaService';

export default function useActasEntregaForm(id) {
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        equipo_id: '',
        funcionario_id: '',
        funcionario_nombre: '',
        fecha_entrega: new Date().toISOString().split('T')[0],
        estado: 'entregado',
        perifericos: [] 
    });
    const [loading, setLoading] = useState(false);

    // Signatures
    const [firmaEntrega, setFirmaEntrega] = useState(null);
    const [firmaRecibe, setFirmaRecibe] = useState(null);
    const [existingFirmaEntrega, setExistingFirmaEntrega] = useState(null);
    const [existingFirmaRecibe, setExistingFirmaRecibe] = useState(null);

    // Peripherals Input
    const [tempPerifericoId, setTempPerifericoId] = useState('');
    const [tempPerifericoCantidad, setTempPerifericoCantidad] = useState(1);
    const [tempPerifericoObs, setTempPerifericoObs] = useState('');

    useEffect(() => {
        if (isEditMode) {
            loadEntrega();
        }
    }, [id]);

    const loadEntrega = async () => {
        try {
            setLoading(true);
            const data = await actasEntregaService.getById(id);
            if (data) {
                setFormData({
                    equipo_id: data.equipo_id,
                    funcionario_id: data.funcionario_id,
                    funcionario_nombre: data.funcionario ? data.funcionario.nombre : '',
                    fecha_entrega: data.fecha_entrega,
                    estado: data.estado,
                    perifericos: [] // Map if available from backend
                });
                setExistingFirmaEntrega(data.firma_entrega);
                setExistingFirmaRecibe(data.firma_recibe);
            }
        } catch (error) {
            console.error('Error loading acta', error);
            Swal.fire('Error', 'No se pudo cargar el acta', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEquipoSelect = (item) => {
        setFormData(prev => ({ ...prev, equipo_id: item ? item.id : '' }));
    };

    const handlePersonalSelect = (item) => {
        setFormData(prev => ({
            ...prev,
            funcionario_id: item ? item.id : '',
            funcionario_nombre: item ? item.nombre : ''
        }));
    };

    const handleAddPeriferico = () => {
        if (!tempPerifericoId) return;
        setFormData(prev => ({
            ...prev,
            perifericos: [
                ...prev.perifericos,
                {
                    inventario_id: parseInt(tempPerifericoId),
                    cantidad: parseInt(tempPerifericoCantidad),
                    observaciones: tempPerifericoObs
                }
            ]
        }));
        setTempPerifericoId('');
        setTempPerifericoCantidad(1);
        setTempPerifericoObs('');
    };

    const handleRemovePeriferico = (index) => {
        setFormData(prev => {
            const newPerifericos = [...prev.perifericos];
            newPerifericos.splice(index, 1);
            return { ...prev, perifericos: newPerifericos };
        });
    };

    const base64ToFile = (dataurl, filename) => {
        if (!dataurl || !dataurl.startsWith('data:')) return dataurl; // It's already a file or null
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.funcionario_id) return Swal.fire('Error', 'Debe seleccionar un funcionario', 'error');
        if (!formData.equipo_id) return Swal.fire('Error', 'Debe seleccionar un equipo', 'error');

        setLoading(true);
        try {
            const payload = new FormData();
            payload.append('equipo_id', formData.equipo_id);
            payload.append('funcionario_id', formData.funcionario_id);
            payload.append('fecha_entrega', formData.fecha_entrega);
            payload.append('estado', formData.estado);
            
            payload.append('perifericos', JSON.stringify(formData.perifericos));

            if (firmaEntrega) payload.append('firma_entrega', base64ToFile(firmaEntrega, 'firma_entrega.png'));
            if (firmaRecibe) payload.append('firma_recibe', base64ToFile(firmaRecibe, 'firma_recibe.png'));

            if (isEditMode) {
                await actasEntregaService.update(id, payload);
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Se ha actualizado el acta de entrega con éxito.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
                navigate('/gestion-sistemas/actas-entrega');
            } else {
                await actasEntregaService.create(payload);
                Swal.fire({
                    title: '¡Registrado!',
                    text: 'Se ha creado el acta de entrega con éxito.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
                navigate('/gestion-sistemas/actas-entrega');
            }

        } catch (error) {
            console.error('Error saving acta:', error);
            Swal.fire('Error', 'No se pudo guardar el acta de entrega', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
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
        navigate
    };
}
