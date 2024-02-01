/* eslint-disable array-callback-return */
import { api } from '../../api/axios';
import { constant } from '../../constant';

export const userLogin = (values) => {

  return async (dispatch) => {
    try {
      const res = await api.post('/auth/v2', {
        ...values,
      });
      const user = res.data.user;
      localStorage.setItem('auth', res.data.token);
      dispatch({
        type: constant.USER_LOGIN,
        payload: user,
      });

      return constant.success;
    } catch (err) {
      localStorage.removeItem('auth');
      return err.response.data;
    }
  };

};

export const userLogout = () => {
  return async (dispatch) => {
    localStorage.removeItem('auth');
    dispatch({
      type: constant.USER_LOGOUT,
    });
  };
};

export const userUpdate = (selector, values) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      Object.entries(values).map((value) => {
        formData.append(value[0], value[1]);
      });
      const user = await api.patch(`/auth/${selector.id}`, formData);
      console.log(user);
      dispatch({
        type: constant.USER_LOGIN,
        payload: user.data,
      });
      return constant.success;
    } catch (err) {
      return err?.response?.data;
    }
  };
};
