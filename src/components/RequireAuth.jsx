import { useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { authed } = true;
  const location = useLocation();

  return authed === true ? children : <a href="/test">test</a>;
}
