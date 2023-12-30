import { useMsal } from "@azure/msal-react";

function SignOutButton() {
  const { instance } = useMsal();
  function handleSignOut() {
    instance.logoutRedirect();
  }

  return (
    <button onClick={handleSignOut} type="button">Sign out</button>
  );
}

export default SignOutButton;