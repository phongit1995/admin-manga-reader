import { CONFIG } from 'src/config-global';

import NotificationSourceView from './NotificationSourceView';

// ----------------------------------------------------------------------

export default function NotificationSourcePage() {
  return (
    <>
      <title>{`Notification Source - ${CONFIG.appName}`}</title>
      <NotificationSourceView />
    </>
  );
}
