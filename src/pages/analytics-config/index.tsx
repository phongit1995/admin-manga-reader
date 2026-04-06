import { CONFIG } from 'src/config-global';

import AnalyticsConfigView from './AnalyticsConfigView';

export default function AnalyticsConfigPage() {
  return (
    <>
      <title>{`Analytics Config - ${CONFIG.appName}`}</title>
      <AnalyticsConfigView />
    </>
  );
}
