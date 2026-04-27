import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';

export const AppRouterProvider = () => <RouterProvider router={router} />;
