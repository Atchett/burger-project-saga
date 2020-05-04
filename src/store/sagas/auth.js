import { delay } from "redux-saga/effects";
import { put, call } from "redux-saga/effects";
import * as actionCreator from "../actions";
import axios from "../../axios/axios-auth";

// * turns function into a generator
export function* logoutSaga(action) {
  // yield will wait for step to finish before the next step begins
  // using call makes the generator testable
  //same as - yield localStorage.removeItem("token");
  yield call([localStorage, "removeItem"], "token");
  yield call([localStorage, "removeItem"], "expirationDate");
  yield put(actionCreator.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actionCreator.logout());
}

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

export function* authUserSaga(action) {
  yield put(actionCreator.authStart());
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true,
  };
  let url = `/accounts:signUp?key=${API_KEY}`;
  if (!action.isSignup) {
    url = `/accounts:signInWithPassword?key=${API_KEY}`;
  }
  try {
    // will wait for promise to resolve
    // putting the return into the const
    const response = yield axios.post(url, authData);
    const expirationDate = yield new Date(
      new Date().getTime() + response.data.expiresIn * 1000
    );
    yield localStorage.setItem("token", response.data.idToken);
    yield localStorage.setItem("expirationDate", expirationDate);
    yield put(
      actionCreator.authSuccess(response.data.idToken, response.data.localId)
    );
    yield put(actionCreator.checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(actionCreator.authFail(error.response.data.error));
  }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem("token");
  if (!token) {
    yield put(actionCreator.logout());
  } else {
    const expirationDate = yield new Date(
      localStorage.getItem("expirationDate")
    );
    // check in date
    const currDate = new Date();
    if (expirationDate > currDate) {
      try {
        // get the userID based on the token
        const authData = {
          idToken: token,
        };
        const url = `/accounts:lookup?key=${API_KEY}`;
        const response = yield axios.post(url, authData);
        const userId = yield response.data.users[0].localId;
        yield put(actionCreator.authSuccess(token, userId));
        yield put(
          actionCreator.checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      } catch (error) {
        yield put(actionCreator.authFail(error));
        yield put(actionCreator.logout());
      }
    }
  }
}
