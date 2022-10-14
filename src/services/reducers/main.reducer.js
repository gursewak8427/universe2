import { ERROR_MESSAGE, LOADER_START, LOADER_STOP, LOGIN_BTN_LOADER_START, LOGIN_BTN_LOADER_STOP, REMOVE_GLOBAL_IMAGE, SET_CHAPTERS, SET_CLASSES, SET_GLOBAL_IMAGE, SET_SUBJECTS, SET_TOPICS, SET_TOTAL_TEST, SET_WALLET, SUCCESS_MESSAGE, UPDATE_EVENT, UPDATE_FAQ, UPDATE_HAPPY_HOUR } from "../constants/mainConstants";

const initialState = {
  loader: false,
  success_msg: "",
  error_msg: "",
  subjects_list: [],
  total_test_list: [],
  walletData: {
    score: 0,
    points: 0
  },
  topicsList: [],
  classesList: [],
  chaptersList: [],
  globalImage: "",
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADER_START:
      return {
        ...state,
        loader: true,
      };

    case LOADER_STOP:
      return {
        ...state,
        loader: false,
      };

    case SUCCESS_MESSAGE:
      return {
        ...state,
        success_msg: action.payload,
      };

    case ERROR_MESSAGE:
      return {
        ...state,
        error_msg: action.payload,
      };

    case SET_SUBJECTS:
      return {
        ...state,
        subjects_list: action.payload,
      };

    case SET_TOTAL_TEST:
      return {
        ...state,
        total_test_list: action.payload,
      };

    case SET_WALLET:
      return {
        ...state,
        walletData: action.payload,
      };

    case SET_TOPICS:
      return {
        ...state,
        topicsList: action.payload,
      };

    case SET_CLASSES:
      return {
        ...state,
        classesList: action.payload,
      };

    case SET_CHAPTERS:
      return {
        ...state,
        chaptersList: action.payload,
      };

    case SET_GLOBAL_IMAGE:
      return {
        ...state,
        globalImage: action.payload,
      };

    default:
      return state;
  }
};
