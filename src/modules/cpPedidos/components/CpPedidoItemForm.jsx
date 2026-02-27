import { useState, useEffect } from 'react';
import { cpProductoService } from '../../cpProducto/services/cpProductoService';
import Swal from 'sweetalert2';
import { PlusIcon, TrashIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'; // Asegúrate de importar esto

const SearchableProductSelect = ({ options, value, onChange }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Filter options based on query (name or code)
    const filteredOptions = query === ''
        ? options
        : options.filter((product) => {
            const nameMatch = product.nombre.toLowerCase().includes(query.toLowerCase());
            const codeMatch = product.codigo ? product.codigo.toLowerCase().includes(query.toLowerCase()) : false;
            return nameMatch || codeMatch;
        });

    const selectedProduct = options.find(p => p.id == value);

    return (
        <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-2xl border-slate-200 bg-white text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 sm:text-sm transition-all">
                <input
                    className="w-full border-slate-200 rounded-2xl py-2.5 pl-4 pr-10 text-sm leading-5 text-slate-800 font-medium focus:border-indigo-500 focus:ring-0"
                    onChange={(event) => {
                        setQuery(event.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    /* onClick={() => setIsOpen(true)} */
                    placeholder="Buscar por nombre o código..."
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    translate="no"
                    value={selectedProduct ? (isOpen ? query : selectedProduct.nombre) : query}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronUpDownIcon
                        className="h-5 w-5 text-slate-400"
                        aria-hidden="true"
                    />
                </div>
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredOptions.length === 0 ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            No se encontraron productos.
                        </div>
                    ) : (
                        filteredOptions.map((product) => (
                            <li
                                key={product.id}
                                className={`relative cursor-default select-none py-2 pl-10 pr-4 ${product.id == value ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900 hover:bg-gray-100'
                                    }`}
                                onClick={() => {
                                    onChange(product);
                                    setQuery('');
                                    setIsOpen(false);
                                }}
                            >
                                <span className={`block truncate ${product.id == value ? 'font-medium' : 'font-normal'}`}>
                                    {product.codigo ? <span className="text-gray-500 mr-2 text-xs">[{product.codigo}]</span> : null}
                                    {product.nombre}
                                </span>
                                {product.id == value ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                ) : null}
                            </li>
                        ))
                    )}
                </ul>
            )}
            {/* Backdrop to close */}
            {isOpen && (
                <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
};

export default function CpPedidoItemForm({ items, onAddItem, onRemoveItem, isFarmacia }) {
    const [productos, setProductos] = useState([]);
    const [currentItem, setCurrentItem] = useState({
        nombre: '',
        cantidad: '',
        unidad_medida: 'Unidad',
        referencia_items: '',
        productos_id: ''
    });

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            const data = await cpProductoService.getAll();
            if (data && data.objeto) {
                setProductos(data.objeto);
            } else if (Array.isArray(data)) {
                setProductos(data);
            }
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductSelect = (product) => {
        if (!product) return;

        setCurrentItem(prev => ({
            ...prev,
            productos_id: product.id,
            nombre: product.nombre || ''
        }));
    };

    const handleAdd = () => {
        if ((isFarmacia && !currentItem.productos_id) || !currentItem.nombre || !currentItem.cantidad || !currentItem.unidad_medida) {
            Swal.fire('Error', 'Complete los campos obligatorios del ítem', 'warning');
            return;
        }

        onAddItem({ ...currentItem });
        setCurrentItem({
            nombre: '',
            cantidad: '',
            unidad_medida: 'Unidad',
            referencia_items: '',
            productos_id: ''
        });
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mt-6">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-6 flex items-center">
                <span className="bg-indigo-50 text-indigo-600 p-2 rounded-xl mr-3">
                    <PlusIcon className="h-5 w-5" />
                </span>
                Items del Pedido
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="sm:col-span-2 relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        {isFarmacia ? 'Producto (Farmacia) *' : 'Producto (Opcional)'}
                    </label>
                    <SearchableProductSelect
                        options={productos}
                        value={currentItem.productos_id}
                        onChange={handleProductSelect}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Nombre Solicitado *
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={currentItem.nombre}
                        onChange={handleChange}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        translate="no"
                        className="mt-1 block w-full rounded-2xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 sm:text-sm transition-all"
                    />
                </div>

                <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Cantidad *
                    </label>
                    <input
                        type="number"
                        name="cantidad"
                        value={currentItem.cantidad}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-2xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 sm:text-sm transition-all"
                    />
                </div>

                <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Unidad *
                    </label>
                    <select
                        name="unidad_medida"
                        value={currentItem.unidad_medida}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-2xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 sm:text-sm transition-all"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Unidad">Unidad</option>
                        <option value="Paquete">Paquete</option>
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Referencia / URL
                    </label>
                    <input
                        type="text"
                        name="referencia_items"
                        value={currentItem.referencia_items}
                        onChange={handleChange}
                        placeholder="Pegar URL de referencia"
                        className="mt-1 block w-full rounded-2xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 sm:text-sm transition-all"
                    />
                </div>

                <div className="sm:col-span-6 flex justify-end mt-2">
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="inline-flex items-center rounded-2xl bg-indigo-50 px-5 py-2.5 text-sm font-black tracking-widest uppercase text-indigo-700 shadow-sm hover:bg-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all border border-indigo-200/50"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5 stroke-2" aria-hidden="true" />
                        Agregar Item
                    </button>
                </div>
            </div>

            {/* List of added items */}
            {items.length > 0 && (
                <div className="mt-8">
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="py-4 pl-6 pr-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Producto</th>
                                    <th scope="col" className="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cant.</th>
                                    <th scope="col" className="px-4 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Unidad</th>
                                    <th scope="col" className="relative py-4 pl-3 pr-6">
                                        <span className="sr-only">Eliminar</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {items.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-slate-800">{item.nombre}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 font-medium">{item.cantidad}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                                                {item.unidad_medida}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                            <button
                                                type="button"
                                                onClick={() => onRemoveItem(index)}
                                                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-xl transition-colors"
                                                title="Eliminar Item"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
