import { CONFIG } from 'src/config-global';

import CommentMangaView from './CommentMangaView';

export default function CommentMangaPage() {
  return (
    <>
      <title>{`Manga Comments - ${CONFIG.appName}`}</title>
      <CommentMangaView />
    </>
  );
}
