import { CONFIG } from 'src/config-global';

import { ProductsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

/** @deprecated - Route không có trong navigation sidebar */
export default function ProductsPage() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>
      <ProductsView />
    </>
  );
}
