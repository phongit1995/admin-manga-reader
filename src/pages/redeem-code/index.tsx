import { CONFIG } from 'src/config-global';

import { RedeemCodeView } from './RedeemCodeView';

// ----------------------------------------------------------------------

export default function RedeemCodePage() {
  return (
    <>
      <title>{`Redeem Code - ${CONFIG.appName}`}</title>
      <RedeemCodeView />
    </>
  );
}
