import React from 'react';
import { 
    ShieldCheckIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const LicCard = ({ name, value, color }) => {
    const hasLicense = value && value !== 'N/A' && value !== 'No';
    return (
        <div className={`group relative rounded-[2rem] p-8 border-2 transition-all duration-300 ${hasLicense
            ? `border-${color}-100 bg-white hover:shadow-xl hover:shadow-${color}-900/5`
            : 'border-slate-100 bg-slate-50/30'
            }`}>
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h4 className={`text-xl font-black tracking-tight ${hasLicense ? `text-slate-900` : 'text-slate-400'}`}>{name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Software License</p>
                </div>
                {hasLicense ? (
                    <div className={`p-3 bg-${color}-50 rounded-2xl`}>
                        <CheckCircleIcon className={`h-6 w-6 text-${color}-500`} />
                    </div>
                ) : (
                    <div className="p-3 bg-slate-100 rounded-2xl">
                        <ExclamationTriangleIcon className="h-6 w-6 text-slate-300" />
                    </div>
                )}
            </div>
            <div className={`px-4 py-3 rounded-xl font-bold text-sm ${hasLicense ? `bg-${color}-50 text-${color}-700` : 'bg-slate-100 text-slate-400'}`}>
                {hasLicense ? value : 'No Sincronizada'}
            </div>
        </div>
    );
};

export default function TabLicencias({ licencias }) {
    if (!licencias) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                <ShieldCheckIcon className="h-16 w-16 text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin registros de licenciamiento</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LicCard name="Windows OS" value={licencias.windows} color="blue" />
            <LicCard name="Microsoft Office" value={licencias.office} color="indigo" />
            <LicCard name="Nitro PDF Pro" value={licencias.nitro} color="violet" />
        </div>
    );
}
