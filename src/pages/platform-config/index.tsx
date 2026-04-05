import { CONFIG } from 'src/config-global';

import { PlatformConfigView } from './PlatformConfigView';

// ----------------------------------------------------------------------

export default function PlatformConfigPage() {
  return (
    <>
      <title>{`Platform Config - ${CONFIG.appName}`}</title>
      <PlatformConfigView />
    </>
  );
}
