import { CONFIG } from 'src/config-global';

import { AppConfigView } from './AppConfigView';

// ----------------------------------------------------------------------

export default function AppConfigPage() {
  return (
    <>
      <title>{`App Config - ${CONFIG.appName}`}</title>
      <AppConfigView />
    </>
  );
}
