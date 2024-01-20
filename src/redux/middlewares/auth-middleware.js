/* eslint-disable array-callback-return */
import { api } from '../../api/axios';
import { constant } from '../../constant';
import {  signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';

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
export const signInWithGoogle = () => {
  return async (dispatch) => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const idToken = await res.user.getIdToken();
      if (!idToken) {
        throw new Error("Id token is undefined");
      }

      const response = await checkIfUserExist(res.user, 'uid_google');

      dispatch({
        type: constant.USER_LOGIN,
        payload: response,
      });

      localStorage.setItem('auth', idToken);
      console.log(idToken,'idToken');

      return constant.success;
    } catch (err) {
      console.error(err);
      localStorage.removeItem('auth');
      return err.message;
    }
  };
};




export const signInWithFacebook = () => {
  return async (dispatch) => {
    try {
      const provider = new FacebookAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const idToken = await res.user.getIdToken();
      if (!idToken) {
        throw new Error("Id token is undefined");
      }

      const user = await checkIfUserExist(res.user, 'uid_facebook');
     dispatch({
        type: constant.USER_LOGIN,
        payload: user,
      });
      return constant.success;
    } catch (err) {
      console.error(err);
      localStorage.removeItem('auth');
      return err.message;
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
const checkIfUserExist = async (values, provider = "") => {
  try {
    let user = {};
    const isUserExist = await api
      .get("/auth/", {
        params: {
          email: values.email,
        },
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    console.log(isUserExist);

    if (!isUserExist?.id) {
      const newUser = {
        username: values.displayName,
        email: values.email,
        password: "",
        phone_number: "",
        bio: "",
        image_url: values.photoURL,
        fullname: values.displayName,
        uid_google: provider === "uid_google" ? values.uid : "", 
        uid_facebook: provider === "uid_facebook" ? values.uid : "",
      };

      user = await api.post("/auth/v3", newUser).then((res) => res.data).catch((err) => console.log(err));
    } else {
      user = { ...isUserExist };
    }

    return user;
  } catch (err) {
    console.log(err);
  }
};
