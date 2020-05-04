import { put } from "redux-saga/effects";
import axios from "../../axios/axios-orders";
import * as actionCreator from "../actions";

export function* initIngredientsSaga(action) {
  try {
    const response = yield axios.get("/ingredients.json");
    yield put(actionCreator.setIngredients(response.data));
  } catch (error) {
    yield put(actionCreator.fetchIngredientsFailed());
  }
}
