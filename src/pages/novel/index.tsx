import { CONFIG } from 'src/config-global';

import NovelView from './NovelView';

// ----------------------------------------------------------------------

export default function NovelPage() {
  return (
    <>
      <title>{`Novel - ${CONFIG.appName}`}</title>
      <NovelView />
    </>
  );
}
