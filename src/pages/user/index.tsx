import { CONFIG } from 'src/config-global';

import { default as UserView } from './UserView';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <title>{`Users - ${CONFIG.appName}`}</title>
      <UserView />
    </>
  );
}
