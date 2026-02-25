import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronDownIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { inventoryService } from '../services/inventoryService';
import { sedeService } from '../../users/services/sedeService';
import { personalService } from '../../personal/services/personalService';
import { useAuth } from '../../../context/AuthContext';
import ContextMenu from '../../../components/common/ContextMenu';
import Swal from 'sweetalert2';

// Internal Component for Searchable Select
const SearchableSelect = ({ label, options, value, onChange, placeholder = "Seleccionar..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [wrapperRef, setWrapperRef] = useState(null);

    // Filter options based on query
    const filteredOptions = query === ''
        ? options
        : options.filter((person) =>
            person.nombre.toLowerCase().includes(query.toLowerCase())
        );

    // Find selected name for display
    const selectedName = options.find(p => String(p.id) === String(value))?.nombre || '';

    // Handle clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef && !wrapperRef.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        if (!isOpen && value) {
            setQuery(selectedName);
        } else if (!isOpen && !value) {
            setQuery('');
        }
    }, [isOpen, value, selectedName]);

    return (
        <div className="relative group" ref={setWrapperRef}>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    className="block w-full rounded-2xl border-0 py-3 pl-4 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all bg-gray-50/50 focus:bg-white"
                    placeholder={placeholder}
                    value={isOpen ? query : (selectedName || query)}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setIsOpen(true);
                        if (event.target.value === '') {
                            onChange('');
                        }
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setQuery('');
                    }}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>

                {/* Dropdown Options */}
                {isOpen && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredOptions.length === 0 ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                No se encontraron resultados.
                            </div>
                        ) : (
                            filteredOptions.map((person) => (
                                <div
                                    key={person.id}
                                    className={`relative cursor-default select-none py-2 pl-4 pr-9 ${String(value) === String(person.id) ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900 hover:bg-gray-100'
                                        }`}
                                    onClick={() => {
                                        onChange(person.id);
                                        setQuery(person.nombre);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className={`block truncate ${String(value) === String(person.id) ? 'font-semibold' : 'font-normal'}`}>
                                        {person.nombre}
                                    </span>
                                    {String(value) === String(person.id) ? (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                            {/* Checkmark icon could go here */}
                                        </span>
                                    ) : null}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function InventoryListPage() {
    const navigate = useNavigate();
    const { hasPermission } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Pagination State
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 100,
        total: 0
    });

    // Context Menu State
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        item: null
    });

    // Filters State
    const [filterSede, setFilterSede] = useState('');
    const [filterResponsable, setFilterResponsable] = useState('');
    const [filterCoordinador, setFilterCoordinador] = useState('');

    // Dropdown Data
    const [sedes, setSedes] = useState([]);
    const [personal, setPersonal] = useState([]);

    useEffect(() => {
        loadInitialData(pagination.current_page);
    }, [pagination.current_page]);

    const loadInitialData = async (page = 1) => {
        setLoading(true);
        try {
            const [invData, sedesData, personalData] = await Promise.all([
                inventoryService.getAllInventario({ page, per_page: pagination.per_page, search: searchTerm }),
                sedeService.getAll(),
                personalService.getAll()
            ]);

            const paginatedData = invData.objeto;
            setInventory(paginatedData.data || []);
            setPagination({
                current_page: paginatedData.current_page,
                last_page: paginatedData.last_page,
                per_page: paginatedData.per_page,
                total: paginatedData.total
            });
            setSedes(Array.isArray(sedesData) ? sedesData : (sedesData.objeto || []));
            setPersonal(Array.isArray(personalData) ? personalData : (personalData.objeto || []));

        } catch (err) {
            console.error("Error loading data:", err);
            setError("No se pudo cargar la información del inventario.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: "No podrá revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await inventoryService.deleteInventario(id);
                setInventory(prev => prev.filter(item => item.id !== id));
                Swal.fire(
                    'Eliminado',
                    'El item ha sido eliminado.',
                    'success'
                );
            } catch (err) {
                console.error("Error deleting item:", err);
                Swal.fire('Error', 'No se pudo eliminar el item.', 'error');
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setPagination(prev => ({ ...prev, current_page: newPage }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleContextMenu = (e, item) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            item
        });
    };

    const closeContextMenu = () => {
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    const menuItems = [
        {
            label: 'Ver detalle',
            icon: EyeIcon,
            onClick: () => navigate(`/inventario/detalle/${contextMenu.item?.id}`),
        },
        {
            label: 'Editar registro',
            icon: PencilSquareIcon,
            onClick: () => navigate(`/inventario/editar/${contextMenu.item?.id}`),
            permission: 'inventario.actualizar'
        },
        {
            label: 'Eliminar ítem',
            icon: TrashIcon,
            onClick: () => handleDelete(contextMenu.item?.id),
            permission: 'inventario.eliminar',
            className: 'text-red-600 hover:bg-red-50'
        },
    ];

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Reset to first page when searching
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== undefined) {
                loadInitialData(1);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const filteredInventory = useMemo(() => {
        // Backend handles filtering and pagination
        return inventory;
    }, [inventory]);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            {/* Hero Section - Nexa Purple Theme */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl mb-8">
                <div className="relative z-10">
                    <span className="inline-flex items-center rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/30 mb-2 backdrop-blur-sm">
                        GESTIÓN DE ACTIVOS
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                        Inventario General
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg">
                        Listado completo de activos, equipos y perifericos de la organización.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/inventario/nuevo"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all transform hover:-translate-y-1"
                        >
                            <PlusIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                            Nuevo Registro
                        </Link>
                    </div>
                </div>
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Filters & Search Card */}
            <div className="mb-8 bg-white p-6 rounded-3xl shadow-lg ring-1 ring-gray-900/5 transition-all hover:shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <FunnelIcon className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Sede Filter */}
                    <div className="relative group">
                        <label htmlFor="filterSede" className="block text-xs font-medium text-gray-500 mb-1 ml-1">Sede</label>
                        <div className="relative">
                            <select
                                id="filterSede"
                                value={filterSede}
                                onChange={(e) => setFilterSede(e.target.value)}
                                className="block w-full rounded-2xl border-0 py-3 pl-4 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all bg-gray-50/50 focus:bg-white appearance-none"
                            >
                                <option value="">Todas las Sedes</option>
                                {sedes.map(sede => (
                                    <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    {/* Responsable Filter - Searchable */}
                    <SearchableSelect
                        label="Responsable"
                        options={personal}
                        value={filterResponsable}
                        onChange={setFilterResponsable}
                        placeholder="Buscar responsable..."
                    />

                    {/* Coordinador Filter - Searchable */}
                    <SearchableSelect
                        label="Coordinador"
                        options={personal}
                        value={filterCoordinador}
                        onChange={setFilterCoordinador}
                        placeholder="Buscar coordinador..."
                    />

                    {/* Search Input */}
                    <div className="relative group">
                        <label htmlFor="searchTerm" className="block text-xs font-medium text-gray-500 mb-1 ml-1">Búsqueda General</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" aria-hidden="true" />
                            </div>
                            <input
                                id="searchTerm"
                                type="text"
                                className="block w-full rounded-2xl border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="Código, Nombre, Serial..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-gray-900/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:pl-6">Codigo</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Marca / Modelo</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Serial</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicación</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-sm text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-sm text-gray-500">No se encontraron registros.</td>
                                </tr>
                            ) : (
                                filteredInventory.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors cursor-context-menu"
                                        onContextMenu={(e) => handleContextMenu(e, item)}
                                    >
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {item.codigo}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.nombre}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.marca} <span className="text-gray-300">|</span> {item.modelo}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.serial}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.ubicacion || 'N/A'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.estado === 'Nuevo' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                item.estado === 'Malo' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                    'bg-blue-50 text-blue-700 ring-blue-600/20'
                                                }`}>
                                                {item.estado}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/inventario/detalle/${item.id}`}
                                                    className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                                                    title="Ver detalles"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </Link>
                                                <Link to={`/inventario/editar/${item.id}`} className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="Editar">
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {!loading && inventory.length > 0 && (
                <div className="mt-8 flex items-center justify-between bg-white px-6 py-4 rounded-[2rem] shadow-lg border border-slate-100">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                            className={`relative inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold tracking-tight uppercase transition-all ${pagination.current_page === 1
                                ? 'bg-slate-50 text-slate-300'
                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
                                }`}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                            className={`relative ml-3 inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold tracking-tight uppercase transition-all ${pagination.current_page === pagination.last_page
                                ? 'bg-slate-50 text-slate-300'
                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
                                }`}
                        >
                            Siguiente
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                                Mostrando <span className="font-black text-indigo-600">{(pagination.current_page - 1) * pagination.per_page + 1}</span> a <span className="font-black text-indigo-600">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> de <span className="font-black text-indigo-600">{pagination.total}</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className={`relative inline-flex items-center rounded-l-xl px-3 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 transition-all ${pagination.current_page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Anterior</span>
                                    <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                                </button>

                                <div className="relative inline-flex items-center px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-600 ring-1 ring-inset ring-slate-200 bg-indigo-50/50">
                                    Página {pagination.current_page} de {pagination.last_page}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className={`relative inline-flex items-center rounded-r-xl px-3 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 transition-all ${pagination.current_page === pagination.last_page ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Siguiente</span>
                                    <ArrowLeftIcon className="h-5 w-5 rotate-180" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Context Menu */}
            {contextMenu.visible && (
                <ContextMenu
                    items={menuItems}
                    position={{ x: contextMenu.x, y: contextMenu.y }}
                    onClose={closeContextMenu}
                />
            )}
        </div>
    );
}
