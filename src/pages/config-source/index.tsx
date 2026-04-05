import { CONFIG } from 'src/config-global';

import { ConfigSourceView } from 'src/sections/config-source/ConfigSourceView';

// ----------------------------------------------------------------------

export default function ConfigSourcePage() {
  return (
    <>
      <title>{`Config Source - ${CONFIG.appName}`}</title>
      <ConfigSourceView />
    </>
  );
}
