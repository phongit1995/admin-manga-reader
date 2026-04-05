import { CONFIG } from 'src/config-global';

import { PlatformConfigView } from 'src/sections/platform-config/PlatformConfigView';

// ----------------------------------------------------------------------

export default function PlatformConfigPage() {
  return (
    <>
      <title>{`Platform Config - ${CONFIG.appName}`}</title>
      <PlatformConfigView />
    </>
  );
}
