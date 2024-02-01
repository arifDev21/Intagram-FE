import { useDispatch } from "react-redux";
import { api } from "../api/axios";
import { useEffect, useState } from "react";
import { constant } from "../constant";

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("auth");
      if (!token) throw new Error("token not found in localStorage");

      const response = await api.get(`/auth/token/`);

      dispatch({
        type: constant.USER_LOGIN,
        payload: response.data.user,
      });

      localStorage.setItem("auth", response.data.token);
      console.log(response.data.token, "Updated token after page refresh");
    } catch (err) {
      console.error(err);
      localStorage.removeItem("auth");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return isLoading ? <></> : children;
};
