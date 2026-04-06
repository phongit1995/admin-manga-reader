import { CONFIG } from 'src/config-global';

import { SignInView } from './SignInView';

export default function SignInPage() {
  return (
    <>
      <title>{`Sign In - ${CONFIG.appName}`}</title>
      <SignInView />
    </>
  );
}
