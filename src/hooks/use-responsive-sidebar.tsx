
import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

export const useResponsiveSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  // Auto-hide sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile]);
  
  return {
    showSidebar,
    toggleSidebar,
    setShowSidebar
  };
};
