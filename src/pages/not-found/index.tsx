import { CONFIG } from 'src/config-global';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <title>{`404 - Page Not Found | ${CONFIG.appName}`}</title>
      <NotFoundView />
    </>
  );
}
