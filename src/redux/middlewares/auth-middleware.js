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
      const result = await signInWithPopup(auth, provider);
      const user = await checkIfUserExist(result.user, 'uid_google');

      console.log('User Data:', user);

      localStorage.setItem('auth', user.id);
      console.log('Token Set to localStorage:', user.id);

      dispatch({
        type: constant.USER_LOGIN,
        payload: user,
      });

    } catch (err) {
      localStorage.removeItem('auth');
      console.error('Error:', err);
      return err.message || constant.error;
    }
  };
};

export const signInWithFacebook = () => {
  return async (dispatch) => {
    try {
      // Authenticate with Firebase using FacebookAuthProvider
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = await checkIfUserExist(result.user, 'uid_facebook');
      
      console.log(user);
      localStorage.setItem('auth', user.id);
      dispatch({
        type: constant.USER_LOGIN,
        payload: user,
      });

      return constant.success;
    } catch (err) {
      localStorage.removeItem('auth');
      console.error(err);
      return err.message || constant.error;
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
const checkIfUserExist = async (values, provider = '') => {
  try {
    let user = {};
    const isUserExist = await api
      .get('/users/', {
        params: {
          email: values.email,
        },
      })
      .then((res) => res.data[0])
      .catch((err) => console.log(err));

    console.log(isUserExist,'userexit');

    if (isUserExist?.id && !isUserExist[provider]) {
      isUserExist[provider] = values.uid_google || values.uid_facebook;

      user = await api
        .patch(`/users/${isUserExist.id}`, isUserExist) // Sesuaikan dengan data yang sesuai dari Google atau Facebook
        .then((res) => res.data)
        .catch((err) => console.log(err));
    } else if (!isUserExist?.id) {
      user = await api
        .post('/users', new User(values.displayName, values.email, values.photoURL, values.uid_google || values.facebook_uid))
        .then((res) => res.data)
        .catch((err) => console.log(err));
    } else {
      user = { ...isUserExist };
    }
    return user;
  } catch (err) {
    console.log(err);
  }
};
class User {
  constructor(
    fullname = '',
    email = '',
    image_url = '',
    uid_google = '',
    uid_facebook ='',
    username = '',
    password = '',
    gender = '',
    bio = ''
  ) {
    this.username = username;
    this.email = email;
    this.gender = gender;
    this.password = password;
    this.bio = bio;
    this.image_url = image_url;
    this.fullname = fullname;
    this.uid_google = uid_google;
    this.uid_facebook = uid_facebook
  }
}
