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
        <div className="min-h-screen p-6 md:p-8 font-sans">
            <div className="mx-auto max-w-7xl space-y-8 animate-fade-in-up">

                {/* 1. Header Section */}
                <ProfileHeader user={user} onUpdateUser={updateUser} />

                {/* 2. Main Layout (Sidebar + Content) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Sidebar / Navigation */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Configuración de Cuenta</h3>
                            </div>
                            <nav className="p-3 space-y-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`group/item relative w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeSection === item.id
                                            ? 'text-indigo-600'
                                            : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        {/* Background active/hover effect */}
                                        <div 
                                            className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
                                                activeSection === item.id 
                                                ? 'bg-white shadow-[0_4px_20px_-4px_rgba(79,70,229,0.15)] border border-indigo-100/50 opacity-100 scale-100' 
                                                : 'opacity-0 scale-[0.98] group-hover/item:opacity-100 group-hover/item:scale-100 bg-slate-50 border border-slate-200/50'
                                            }`}
                                        />

                                        <div className="relative z-10 flex items-center">
                                            <div className={`p-2.5 rounded-xl mr-4 transition-colors duration-300 ${activeSection === item.id ? 'bg-indigo-50 text-indigo-500 shadow-inner' : 'bg-slate-50 text-slate-400 group-hover/item:bg-slate-100 group-hover/item:text-slate-500'}`}>
                                                <item.icon className={`h-5 w-5 ${activeSection === item.id ? 'scale-110' : ''} transition-transform duration-300`} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-sm tracking-tight">{item.label}</p>
                                                <p className={`text-[10px] font-bold mt-0.5 ${activeSection === item.id ? 'text-indigo-400' : 'text-slate-400'}`}>{item.description}</p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className={`relative z-10 h-4 w-4 transition-transform duration-300 ${activeSection === item.id ? 'text-indigo-500 translate-x-1' : 'text-slate-300 group-hover/item:text-slate-400'}`} />
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 space-y-6">
                            {/* Message Display */}
                            {message.text && (
                                <div className={`p-4 rounded-2xl flex items-center shadow-sm border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                    {message.type === 'success' ? <CheckCircleIcon className="h-6 w-6 mr-3 text-emerald-500" /> : <ExclamationTriangleIcon className="h-6 w-6 mr-3 text-rose-500" />}
                                    <p className="text-sm font-bold">{message.text}</p>
                                </div>
                            )}

                            {/* Section Content */}
                            <div className="animate-fade-in-up">
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
