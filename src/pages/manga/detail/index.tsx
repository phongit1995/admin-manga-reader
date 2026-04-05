import { CONFIG } from 'src/config-global';

import MangaDetailView from 'src/sections/manga-detail/MangaDetailView';

// ----------------------------------------------------------------------

export default function MangaDetailPage() {
  return (
    <>
      <title>{`Manga Detail - ${CONFIG.appName}`}</title>
      <MangaDetailView />
    </>
  );
}
