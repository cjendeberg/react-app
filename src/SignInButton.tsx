import { useMsal } from "@azure/msal-react";

function SignInButton() {
  const { instance } = useMsal();
  function handleSignIn() {
    instance.loginRedirect({
      //scopes: ['User.Read', 'https://management.azure.com/user_impersonation']
      scopes: ['User.Read']
    });
  }

  return (
    <button onClick={handleSignIn} type="button">Sign in</button>
  );
}

export default SignInButton;