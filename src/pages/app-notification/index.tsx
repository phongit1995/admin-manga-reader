import { CONFIG } from 'src/config-global';

import AppNotificationView from 'src/sections/app-notification/AppNotificationView';

// ----------------------------------------------------------------------

export default function AppNotificationPage() {
  return (
    <>
      <title>{`App Notification - ${CONFIG.appName}`}</title>
      <AppNotificationView />
    </>
  );
}
