import { CONFIG } from 'src/config-global';

import AppNotificationView from './AppNotificationView';

export default function AppNotificationPage() {
  return (
    <>
      <title>{`App Notification - ${CONFIG.appName}`}</title>
      <AppNotificationView />
    </>
  );
}
