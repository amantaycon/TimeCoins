import React, { useEffect, useState } from 'react';

const LoginAlert = ({ message, show }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return <p className="loginmessage">{message}</p>;
};

export default LoginAlert;
