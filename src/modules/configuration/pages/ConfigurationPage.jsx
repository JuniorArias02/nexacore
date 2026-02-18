import { Link } from 'react-router-dom';
import {
    UserIcon,
    BellIcon,
    SwatchIcon,
    LanguageIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

const ConfigurationPage = () => {
    const settingsOptions = [
        {
            title: 'Mi Cuenta',
            description: 'Gestiona tu información personal, contraseña y firma digital.',
            icon: UserIcon,
            link: '/profile',
            color: 'bg-indigo-100 text-indigo-600'
        },
        // Placeholders for future settings
        {
            title: 'Notificaciones',
            description: 'Configura cómo quieres recibir las alertas del sistema.',
            icon: BellIcon,
            link: '#',
            color: 'bg-yellow-100 text-yellow-600',
            disabled: true
        },
        {
            title: 'Apariencia',
            description: 'Personaliza el tema y los colores de la aplicación.',
            icon: SwatchIcon,
            link: '#',
            color: 'bg-pink-100 text-pink-600',
            disabled: true
        },
        {
            title: 'Seguridad y Privacidad',
            description: 'Revisa los inicios de sesión y permisos.',
            icon: ShieldCheckIcon,
            link: '#',
            color: 'bg-green-100 text-green-600',
            disabled: true
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuración</h1>
            <p className="text-gray-500 mb-8">Administra las preferencias y ajustes de tu cuenta y la aplicación.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingsOptions.map((option, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all ${option.disabled
                                ? 'opacity-60 cursor-not-allowed'
                                : 'hover:shadow-md hover:border-indigo-100 cursor-pointer transform hover:-translate-y-1'
                            }`}
                    >
                        {option.disabled ? (
                            <div className="block h-full">
                                <Content option={option} />
                            </div>
                        ) : (
                            <Link to={option.link} className="block h-full">
                                <Content option={option} />
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-2">Información del Sistema</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-indigo-700">
                    <div>
                        <span className="font-medium">Versión:</span> 2.0.0 (NexaCore)
                    </div>
                    <div>
                        <span className="font-medium">Entorno:</span> Producción
                    </div>
                    <div>
                        <span className="font-medium">Última Actualización:</span> 2026-02-14
                    </div>
                </div>
            </div>
        </div>
    );
};

const Content = ({ option }) => (
    <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${option.color}`}>
                <option.icon className="h-6 w-6" />
            </div>
            {option.disabled && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    Próximamente
                </span>
            )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
        <p className="text-sm text-gray-500 flex-grow">{option.description}</p>
    </div>
);

export default ConfigurationPage;
