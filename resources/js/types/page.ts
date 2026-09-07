import type { Auth } from './auth';

export type AppPageProps = {
    auth: Auth;
    name: string;
    sidebarOpen: boolean;
    flash: {
        success?: string;
    };
};
