import { useCallback, useEffect, useState, useMemo } from 'react'
import useAuth from './useAuth';
import useModels from './useModels';

export const useConnectServer = (Connect) => {
  const [localModels, setLocalModels] = useState({});
  const [ready, toggleReady] = useState(false);
  const [error, toggleError] = useState(false);
  const { setAuth, setLogin, setLogout, auth } = useAuth();
  const { setModels } = useModels();

  const connect = useCallback(() => {
    toggleReady(false);
    Connect.connect().then(models => {
      setLocalModels(models);
      toggleError(false);
      console.log('connect')
    }).catch(e => {
      console.log(e);
      toggleError(true);
      document.title = "Oops... terjadi kesalahan. Silakan coba lagi"
    })
    // eslint-disable-next-line
  }, [toggleError, setLocalModels, Connect]);

  useEffect(() => {
    connect();
  }, [connect]);


  useEffect(() => {
    if (typeof auth !== 'undefined') {
      Connect.getAuthProvider().get().then((user) => {
        setLogin(user)
        toggleReady(true);
      }).catch(e => {
        console.log(e)
        setLogout();
        toggleReady(true);
      })
    }
    // eslint-disable-next-line
  }, [auth, Connect]);

  useEffect(() => {
    if (Object.keys(localModels).length > 0) {
      setModels(localModels);
      const auth = Connect.getAuthProvider();
      setAuth(auth);
    }

    // eslint-disable-next-line
  }, [localModels, Connect]);

  return useMemo(() => ({ error, ready }), [ready, error]);
}