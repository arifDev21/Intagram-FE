import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const ProtectedPage = ({
  children,
  needLogin = false,
  guestOnly = false,
  required = false,
}) => {
  const userSelector = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToLogin = () => navigate("/login");
    const redirectToHome = () => navigate("/home");
    const redirectToRequired = () => navigate("/required");

    if (needLogin) {
      if (!userSelector?.id) return redirectToLogin();
      if (required && !userSelector.username) return redirectToRequired();
    } else if (guestOnly && userSelector.id) {
      return redirectToHome();
    }
  }, [
    guestOnly,
    navigate,
    needLogin,
    required,
    userSelector.id,
    userSelector.username,
  ]);

  return children;
};
