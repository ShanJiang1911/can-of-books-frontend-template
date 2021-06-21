// this code came from then Auto0 documentation, https://auth0.com/docs/quickstart/spa/react?download=true#install-the-auth0-react-sdk

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;
