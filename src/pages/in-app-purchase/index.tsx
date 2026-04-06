import { CONFIG } from 'src/config-global';

import InAppPurchaseView from './InAppPurchaseView';

export default function InAppPurchasePage() {
  return (
    <>
      <title>{`In-App Purchase - ${CONFIG.appName}`}</title>
      <InAppPurchaseView />
    </>
  );
}
