import { message } from 'antd'

export default function ErrorCatcher(error, { auth, setLogout }) {
  const logout = () => {
    auth.remove().then(resp => {
      setLogout();
      console.log(resp);
      console.log('object')
      message.warning('Sesi login Anda sudah habis. Silakan login kembali');
    }).catch(e => message.error(e.toString()));
  }

  if (typeof error.errors !== 'undefined') {
    if (error.response?.status === 401) {
      logout();
    } else {
      if (typeof error.errors.errors !== 'undefined') {
        (error.errors.errors).forEach(error => {
          message.error(error.msg)
        });
      } else {
        if ((error.errors)[0].msg === "Tidak ada hak akses") {
          logout();
        } else {
          (error.errors).forEach((error) => {
            message.error(error.msg)
          });
        }
      }
    }
  } else {
    message.error(error.toString());
  }
}