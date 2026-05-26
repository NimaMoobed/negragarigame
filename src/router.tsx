// Router — همه‌ی مسیرهای اپ

import { createHashRouter, Navigate } from 'react-router-dom';
// HashRouter (URLs with #/path) so the app works on GitHub Pages and other static
// hosts that don't support SPA fallback rewrites.
import { SplashScreen }      from './screens/SplashScreen';
import { OnboardingScreen }  from './screens/OnboardingScreen';
import { HomeScreen }        from './screens/HomeScreen';
import { DesignListScreen }  from './screens/DesignListScreen';
import { ColoringScreen }    from './screens/ColoringScreen';
import { ShareScreen }       from './screens/ShareScreen';
import { GalleryScreen }     from './screens/GalleryScreen';
import { SettingsScreen }    from './screens/SettingsScreen';

export const router = createHashRouter([
  { path: '/',                 element: <SplashScreen /> },
  { path: '/onboarding',       element: <OnboardingScreen /> },
  { path: '/home',             element: <HomeScreen /> },
  { path: '/category/:catId',  element: <DesignListScreen /> },
  { path: '/coloring/:designId', element: <ColoringScreen /> },
  { path: '/share/:designId',  element: <ShareScreen /> },
  { path: '/gallery',          element: <GalleryScreen /> },
  { path: '/settings',         element: <SettingsScreen /> },
  { path: '*',                 element: <Navigate to="/" replace /> },
]);
