export type { Auth, User } from './auth';

export type {
    BreadcrumbItem,
    NavItem,
} from './navigation';

export type {
    AppLayoutProps,
    AppVariant,
    AuthLayoutProps,
    FlashToast,
} from './ui';

export type AppPageProps = {
    auth: import('./auth').Auth;
    name: string;
    sidebarOpen: boolean;
    flash: {
        success?: string;
    };
};
