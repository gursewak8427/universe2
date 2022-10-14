import {
  ERROR_MESSAGE,
  LOADER_START,
  LOADER_STOP,
  SET_SUBJECTS,
  SUCCESS_MESSAGE,
  SET_TOTAL_TEST,
  SET_WALLET,
  SET_TOPICS,
  SET_CLASSES,
  SET_CHAPTERS,
  SET_GLOBAL_IMAGE,
} from "../constants/mainConstants";

export const loaderAction = (loader) => async (dispatch) => {
  dispatch({ type: loader ? LOADER_START : LOADER_STOP });
};

export const setSuccessMsg = (msg) => async (dispatch) => {
  dispatch({ type: SUCCESS_MESSAGE, payload: msg });
};

export const setErrorMsg = (msg) => async (dispatch) => {
  dispatch({ type: ERROR_MESSAGE, payload: msg });
};

export const setSubjects = (data) => async (dispatch) => {
  dispatch({ type: SET_SUBJECTS, payload: data });
};

export const setTotalTest = (data) => async (dispatch) => {
  dispatch({ type: SET_TOTAL_TEST, payload: data });
};

export const setWalletData = (data) => async (dispatch) => {
  dispatch({ type: SET_WALLET, payload: data });
};

export const setTopics = (data) => async (dispatch) => {
  dispatch({ type: SET_TOPICS, payload: data });
};

export const setClasses = (data) => async (dispatch) => {
  dispatch({ type: SET_CLASSES, payload: data });
};

export const setChapters = (data) => async (dispatch) => {
  dispatch({ type: SET_CHAPTERS, payload: data });
};

export const setGlobalImage = (data) => async (dispatch) => {
  dispatch({ type: SET_GLOBAL_IMAGE, payload: data });
};
