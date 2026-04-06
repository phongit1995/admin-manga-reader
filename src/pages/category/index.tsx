import { CONFIG } from 'src/config-global';

import { CategoryView } from './CategoryView';

export default function CategoryPage() {
  return (
    <>
      <title>{`Category - ${CONFIG.appName}`}</title>
      <CategoryView />
    </>
  );
}
