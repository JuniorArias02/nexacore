import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { profileService } from '../services/profileService';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfoForm from '../components/ProfileInfoForm';
import ProfileSecurity from '../components/ProfileSecurity';
import ProfileSignature from '../components/ProfileSignature';
import ProfilePhoto from '../components/ProfilePhoto'; // New Import
import {
    UserCircleIcon,
    ShieldCheckIcon,
    PencilSquareIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ChevronRightIcon,
    CameraIcon // Add CameraIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [activeSection, setActiveSection] = useState('info');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    // --- Handlers ---

    const handleInfoSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await profileService.updateProfile(data);
            updateUser(response.objeto);
            showMessage('success', 'Información actualizada correctamente.');
        } catch (error) {
            console.error(error);
            showMessage('error', error.response?.data?.mensaje || 'Error al actualizar perfil.');
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async (data, resetForm) => {
        setLoading(true);
        try {
            await profileService.changePassword(data.current_password, data.new_password, data.new_password_confirmation);
            showMessage('success', 'Contraseña actualizada correctamente.');
            if (resetForm) resetForm();
        } catch (error) {
            console.error(error);
            showMessage('error', error.response?.data?.mensaje || 'Error al cambiar contraseña.');
        }
        setLoading(false);
    };

    const handleSignatureSubmit = async (file, resetForm) => {
        setLoading(true);
        try {
            const response = await profileService.uploadSignature(file);
            if (response.objeto && response.objeto.firma_url) {
                updateUser({ firma: response.objeto.firma_url, firma_digital: response.objeto.firma_url });
            }
            // Force refresh user from server if needed, or assume response logic is correct
            // Ideally we refetch user profile here to be safe
            // await refreshUserProfile(); 

            showMessage('success', 'Firma actualizada correctamente.');
            if (resetForm) resetForm();
        } catch (error) {
            console.error(error);
            showMessage('error', error.response?.data?.mensaje || 'Error al subir firma.');
        }
        setLoading(false);
    };

    // --- Navigation Config ---
    const navItems = [
        { id: 'info', label: 'Información Personal', icon: UserCircleIcon, description: 'Gestiona tus datos personales' },
        { id: 'photo', label: 'Foto de Perfil', icon: CameraIcon, description: 'Actualiza tu imagen' }, // New Item
        { id: 'security', label: 'Seguridad y Contraseña', icon: ShieldCheckIcon, description: 'Protege tu cuenta' },
        { id: 'signature', label: 'Firma Digital', icon: PencilSquareIcon, description: 'Gestiona tu firma para documentos' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">
            <div className="mx-auto max-w-7xl space-y-8 animate-fade-in-up">

                {/* 1. Header Section */}
                <ProfileHeader user={user} onUpdateUser={updateUser} />

                {/* 2. Main Layout (Sidebar + Content) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Sidebar / Navigation */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="font-semibold text-gray-900">Configuración de Cuenta</h3>
                            </div>
                            <nav className="p-2 space-y-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${activeSection === item.id
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className={`h-6 w-6 mr-3 ${activeSection === item.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <ChevronRightIcon className={`h-5 w-5 ${activeSection === item.id ? 'text-indigo-400' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                            {/* Message Display */}
                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.type === 'success' ? <CheckCircleIcon className="h-6 w-6 mr-3" /> : <ExclamationTriangleIcon className="h-6 w-6 mr-3" />}
                                    <p className="text-sm font-medium">{message.text}</p>
                                </div>
                            )}

                            {/* Section Content */}
                            <div className="animate-fade-in">
                                {activeSection === 'info' && (
                                    <ProfileInfoForm user={user} onSubmit={handleInfoSubmit} loading={loading} />
                                )}
                                {activeSection === 'photo' && (
                                    <ProfilePhoto user={user} onUpdateUser={updateUser} showMessage={showMessage} />
                                )}
                                {activeSection === 'security' && (
                                    <ProfileSecurity onSubmit={handlePasswordSubmit} loading={loading} />
                                )}
                                {activeSection === 'signature' && (
                                    <ProfileSignature user={user} onSubmit={handleSignatureSubmit} loading={loading} />
                                )}
                            </div>
                        </div >
                    </div >
                </div >
            </div >
        </div >
    );
};

export default ProfilePage;
