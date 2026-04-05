import { CONFIG } from 'src/config-global';

import NovelView from 'src/sections/novel/NovelView';

// ----------------------------------------------------------------------

export default function NovelPage() {
  return (
    <>
      <title>{`Novel - ${CONFIG.appName}`}</title>
      <NovelView />
    </>
  );
}
