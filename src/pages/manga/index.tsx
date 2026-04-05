import { CONFIG } from 'src/config-global';

import MangaView from 'src/sections/manga/MangaView';

// ----------------------------------------------------------------------

export default function MangaPage() {
  return (
    <>
      <title>{`Manga - ${CONFIG.appName}`}</title>
      <MangaView />
    </>
  );
}
