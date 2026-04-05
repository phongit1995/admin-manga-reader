import { CONFIG } from 'src/config-global';

import InAppPurchaseView from 'src/sections/in-app-purchase/InAppPurchaseView';

// ----------------------------------------------------------------------

export default function InAppPurchasePage() {
  return (
    <>
      <title>{`In-App Purchase - ${CONFIG.appName}`}</title>
      <InAppPurchaseView />
    </>
  );
}
