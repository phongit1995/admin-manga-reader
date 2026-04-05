import { CONFIG } from 'src/config-global';

import { AppConfigView } from 'src/sections/app-config/AppConfigView';

// ----------------------------------------------------------------------

export default function AppConfigPage() {
  return (
    <>
      <title>{`App Config - ${CONFIG.appName}`}</title>
      <AppConfigView />
    </>
  );
}
