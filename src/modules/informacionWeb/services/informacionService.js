/**
 * Service for the Information Module.
 * Currently provides static information about the system transition.
 */
const informacionService = {
    getSystemInfo: () => {
        return {
            version: 'NexaCore 2.0 (2026)',
            status: 'Operational',
            transitionContext: 'Evolución del Departamento de Sistemas IPS',
            previousSystem: 'https://departamento-sistemasips.vercel.app/',
            newSystem: 'https://nexacores.vercel.app/',
            contactChannel: 'Reportar fallas vía sistemas@ips.com'
        };
    }
};

export default informacionService;
