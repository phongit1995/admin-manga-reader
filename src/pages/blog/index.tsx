import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

/** @deprecated - Route không có trong navigation sidebar */
export default function BlogPage() {
  return (
    <>
      <title>{`Blog - ${CONFIG.appName}`}</title>
      <BlogView posts={_posts} />
    </>
  );
}
