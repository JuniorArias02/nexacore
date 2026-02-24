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
            <div className="relative w-full cursor-default overflow-hidden rounded-md border-0 bg-white text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    onChange={(event) => {
                        setQuery(event.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    /* onClick={() => setIsOpen(true)} */
                    placeholder="Buscar por nombre o código..."
                    value={selectedProduct ? (isOpen ? query : selectedProduct.nombre) : query}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
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
        unidad_medida: '',
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
            unidad_medida: '',
            referencia_items: '',
            productos_id: ''
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Items del Pedido</h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mb-4 bg-gray-50 p-4 rounded-md">
                <div className="sm:col-span-2 relative">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        {isFarmacia ? 'Producto (Farmacia) *' : 'Producto (Opcional)'}
                    </label>
                    <SearchableProductSelect
                        options={productos}
                        value={currentItem.productos_id}
                        onChange={handleProductSelect}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Nombre Solicitado *
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={currentItem.nombre}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>

                <div className="sm:col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Cantidad *
                    </label>
                    <input
                        type="number"
                        name="cantidad"
                        value={currentItem.cantidad}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>

                <div className="sm:col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Unidad *
                    </label>
                    <select
                        name="unidad_medida"
                        value={currentItem.unidad_medida}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Unidad">Unidad</option>
                        <option value="Paquete">Paquete</option>
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Referencia / URL
                    </label>
                    <input
                        type="text"
                        name="referencia_items"
                        value={currentItem.referencia_items}
                        onChange={handleChange}
                        placeholder="Pegar URL de referencia"
                        className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>

                <div className="sm:col-span-6 flex justify-end">
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Agregar Item
                    </button>
                </div>
            </div>

            {/* List of added items */}
            {items.length > 0 && (
                <div className="mt-4 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Producto</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cant.</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unidad</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                            <span className="sr-only">Eliminar</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{item.nombre}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.cantidad}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.unidad_medida}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveItem(index)}
                                                    className="text-red-600 hover:text-red-900"
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
                </div>
            )}
        </div>
    );
}
