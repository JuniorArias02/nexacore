import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import actasDevolucionService from '../services/actasDevolucionService';
import actasEntregaService from '../../ActasEntrega/services/actasEntregaService';

export default function useActasDevolucionForm(id) {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = !!id;

    const queryParams = new URLSearchParams(location.search);
    const preselectedEntregaId = queryParams.get('entregaId');

    const [formData, setFormData] = useState({
        entrega_id: '',
        fecha_devolucion: new Date().toISOString().split('T')[0],
        observaciones: '',
    });

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedEntrega, setSelectedEntrega] = useState(null);

    // Signatures
    const [firmaEntrega, setFirmaEntrega] = useState(null);
    const [firmaRecibe, setFirmaRecibe] = useState(null);
    const [existingFirmaEntrega, setExistingFirmaEntrega] = useState(null);
    const [existingFirmaRecibe, setExistingFirmaRecibe] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            loadDevuelto();
        } else if (preselectedEntregaId) {
            handlePreselectedEntrega(preselectedEntregaId);
        }
    }, [id, preselectedEntregaId]);

    const handlePreselectedEntrega = async (entregaId) => {
        try {
            setLoading(true);
            const data = await actasEntregaService.getById(entregaId);
            if (data) {
                setSelectedEntrega(data);
                setFormData(prev => ({ ...prev, entrega_id: data.id }));
            }
        } catch (error) {
            console.error('Error loading preselected entrega:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 2) {
                setIsSearching(true);
                try {
                    const results = await actasEntregaService.search(searchTerm);
                    setSearchResults(results || []);
                } catch (error) {
                    console.error('Error searching:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const loadDevuelto = async () => {
        try {
            setLoading(true);
            const data = await actasDevolucionService.getById(id);
            if (data) {
                setFormData({
                    entrega_id: data.entrega_id,
                    fecha_devolucion: data.fecha_devolucion ? data.fecha_devolucion.split('T')[0] : data.fecha_devolucion,
                    observaciones: data.observaciones || '',
                });
                setExistingFirmaEntrega(data.firma_entrega);
                setExistingFirmaRecibe(data.firma_recibe);

                if (data.entrega_id) {
                    const entregaData = await actasEntregaService.getById(data.entrega_id);
                    setSelectedEntrega(entregaData);
                }
            }
        } catch (error) {
            console.error('Error loading devuelto:', error);
            Swal.fire('Error', 'No se pudo cargar la devolución', 'error');
            navigate('/gestion-sistemas/actas-devolucion');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        if (!formData.entrega_id) {
            Swal.fire('Error', 'Debe seleccionar una entrega', 'error');
            return;
        }

        setLoading(true);
        try {
            const payload = new FormData();
            payload.append('entrega_id', formData.entrega_id);
            payload.append('fecha_devolucion', formData.fecha_devolucion);
            payload.append('observaciones', formData.observaciones);

            if (firmaEntrega) payload.append('firma_entrega', base64ToFile(firmaEntrega, 'firma_entrega.png'));
            if (firmaRecibe) payload.append('firma_recibe', base64ToFile(firmaRecibe, 'firma_recibe.png'));

            if (isEditMode) {
                await actasDevolucionService.update(id, payload);
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Acta de devolución actualizada correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            } else {
                await actasDevolucionService.create(payload);
                Swal.fire({
                    title: '¡Registrado!',
                    text: 'Se ha procesado la devolución con éxito.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-[2rem]' }
                });
            }
            navigate('/gestion-sistemas/actas-devolucion');
        } catch (error) {
            console.error('Error saving devuelto:', error);
            Swal.fire('Error', 'No se pudo guardar la devolución', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        isEditMode,
        formData,
        setFormData,
        loading,
        searchTerm,
        setSearchTerm,
        searchResults,
        setSearchResults,
        isSearching,
        selectedEntrega,
        setSelectedEntrega,
        firmaEntrega,
        setFirmaEntrega,
        firmaRecibe,
        setFirmaRecibe,
        existingFirmaEntrega,
        existingFirmaRecibe,
        handleChange,
        handleSubmit,
        navigate
    };
}
