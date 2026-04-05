import { CONFIG } from 'src/config-global';

import { RedeemCodeView } from 'src/sections/redeem-code/RedeemCodeView';

// ----------------------------------------------------------------------

export default function RedeemCodePage() {
  return (
    <>
      <title>{`Redeem Code - ${CONFIG.appName}`}</title>
      <RedeemCodeView />
    </>
  );
}
