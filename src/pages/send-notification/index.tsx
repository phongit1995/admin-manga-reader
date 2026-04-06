import { CONFIG } from 'src/config-global';

import { SendNotificationView } from './SendNotificationView';

export default function SendNotificationPage() {
  return (
    <>
      <title>{`Send Notification - ${CONFIG.appName}`}</title>
      <SendNotificationView />
    </>
  );
}
