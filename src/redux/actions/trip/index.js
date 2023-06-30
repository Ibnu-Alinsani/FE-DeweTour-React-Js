import { API } from "../../../config/api";
import * as TYPE from "../../type/trip";

export const getTrip = () => {
  return async (dispatch) => {
    dispatch({
      type: TYPE.FIND_TRIP,
      payload: {
        loading: true,
        data: false,
        error: false,
      },
    });

    try {
      const response = await API.get("/trips");

      dispatch({
        type: TYPE.FIND_TRIP,
        payload: {
          loading: false,
          data: response.data.data,
          error: false,
        },
      });
    } catch (error) {
      dispatch({
        type: TYPE.FIND_TRIP,
        payload: {
          loading: false,
          data: false,
          error: error.message,
        },
      });
    }
  };
};

export const getTripById = (id) => {
  return async (dispatch) => {
    dispatch({
      type: TYPE.GET_TRIP,
      payload: {
        loading: true,
        data: false,
        error: false,
      },
    });

    try {
      const response = await API.get(`/trip/${id}`);
      dispatch({
        type: TYPE.GET_TRIP,
        payload: {
          loading: false,
          data: response.data.data,
          error: false,
        },
      });
    } catch (error) {
      dispatch({
        type: TYPE.GET_TRIP,
        payload: {
          loading: false,
          data: false,
          error: error.message,
        },
      });
    }
  };
};
