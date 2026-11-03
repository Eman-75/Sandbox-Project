import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

function useInvestorMasterNda() {
  const { axios, authUser } = useContext(AuthContext);
  const [isSigned, setIsSigned] = useState(authUser?.role !== 'investor');
  const [loading, setLoading] = useState(authUser?.role === 'investor');

  const refreshStatus = useCallback(async () => {
    if (authUser?.role !== 'investor') {
      setIsSigned(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/nda/status/${authUser._id}`);
      setIsSigned(Boolean(data?.isSigned));
    } catch (error) {
      setIsSigned(false);
    } finally {
      setLoading(false);
    }
  }, [authUser?._id, authUser?.role, axios]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return {
    isInvestor: authUser?.role === 'investor',
    isSigned,
    loading,
    isRestricted: authUser?.role === 'investor' && (loading || !isSigned),
    handleSignComplete: () => setIsSigned(true),
    refreshStatus,
  };
}

export default useInvestorMasterNda;
