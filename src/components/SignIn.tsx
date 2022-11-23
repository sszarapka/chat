import React, { FC } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { GoogleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const SignIn: FC = () => {
  const provider = new GoogleAuthProvider();
  return (
    <Button
      type="primary"
      size="large"
      onClick={() => signInWithPopup(getAuth(), provider)}
    >
      <GoogleOutlined /> Zaloguj się z Google
    </Button>
  );
};

export default SignIn;
