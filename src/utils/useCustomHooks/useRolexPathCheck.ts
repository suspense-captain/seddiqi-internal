import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const useRolexPathCheck = () => {
  const router = useRouter();
  const [isRolexPage, setIsRolexPage] = useState(false);
  
  useEffect(() => {
    setIsRolexPage(router.pathname.includes("rolex") || router.pathname.includes("rolex/cpo"))
  }, [isRolexPage, router.pathname]);

  return isRolexPage;
};

export default useRolexPathCheck;
