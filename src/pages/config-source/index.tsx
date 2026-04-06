import { CONFIG } from 'src/config-global';

import { ConfigSourceView } from './ConfigSourceView';

export default function ConfigSourcePage() {
  return (
    <>
      <title>{`Config Source - ${CONFIG.appName}`}</title>
      <ConfigSourceView />
    </>
  );
}
