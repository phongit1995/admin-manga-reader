import { useEffect } from 'react';

import { usePathname } from './use-pathname';

/**
 * Tự động scroll về đầu trang mỗi khi route thay đổi.
 * Usage: đặt trong App.tsx hoặc layout root.
 */
export function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
