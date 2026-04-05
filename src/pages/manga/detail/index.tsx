import { CONFIG } from 'src/config-global';

import MangaDetailView from './MangaDetailView';

// ----------------------------------------------------------------------

export default function MangaDetailPage() {
  return (
    <>
      <title>{`Manga Detail - ${CONFIG.appName}`}</title>
      <MangaDetailView />
    </>
  );
}
