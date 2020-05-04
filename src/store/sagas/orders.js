import { put } from "redux-saga/effects";
import axios from "../../axios/axios-orders";
import * as actionCreators from "../actions";

export function* purchaseBurgerSaga(action) {
  yield put(actionCreators.purchaseBurgerStart());
  try {
    const response = yield axios.post(
      "/orders.json?auth=" + action.token,
      action.orderData
    );
    yield put(
      actionCreators.purchaseBurgerSuccess(response.data.name, action.orderData)
    );
  } catch (error) {
    yield put(actionCreators.purchaseBurgerFailed(error));
  }
}

export function* fetchOrdersSaga(action) {
  yield put(actionCreators.fetchOrdersStart());
  try {
    const queryParams =
      "?auth=" +
      action.token +
      '&orderBy="userId"&equalTo="' +
      action.userId +
      '"';
    const response = yield axios.get("/orders.json" + queryParams);
    const fetchedOrders = [];
    for (let key in response.data) {
      fetchedOrders.push({
        ...response.data[key],
        id: key,
      });
    }
    yield put(actionCreators.fetchOrderSuccess(fetchedOrders));
  } catch (error) {
    yield put(actionCreators.fetchOrdersFail(error));
  }
}
