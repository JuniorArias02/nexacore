import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {user?.nombre_completo}</h1>
                        <p className="text-gray-600">{user?.usuario}</p>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Tarjeta de Ejemplo */}
                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
                        <p className="mt-2 text-gray-600">Resumen de actividad reciente.</p>
                    </div>

                    {/* Módulo de Inventario */}
                    <Link to="/inventario" className="block rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Crear Inventario</h3>
                            <span className="text-indigo-500 bg-indigo-50 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </span>
                        </div>
                        <p className="mt-2 text-gray-600">Registrar nuevos activos y equipos.</p>
                    </Link>

                    {/* Módulo de Dependencias */}
                    <Link to="/dependencias-sedes" className="block rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Dependencias</h3>
                            <span className="text-green-500 bg-green-50 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                </svg>
                            </span>
                        </div>
                        <p className="mt-2 text-gray-600">Gestionar dependencias por sede.</p>
                    </Link>

                    {/* Módulo de CP Dependencias */}
                    <Link to="/cp-dependencias" className="block rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">CP Dependencias</h3>
                            <span className="text-blue-500 bg-blue-50 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                </svg>
                            </span>
                        </div>
                        <p className="mt-2 text-gray-600">Gestionar CP dependencias y códigos.</p>
                    </Link>

                    {/* Módulo de CP Centro Costos */}
                    <Link to="/cp-centro-costos" className="block rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Centro Costos</h3>
                            <span className="text-purple-500 bg-purple-50 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="mt-2 text-gray-600">Gestionar centros de costo.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
