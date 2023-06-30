import * as TYPE from "../../type/trip";

const initialState = {
  findTripLoading: false,
  findTripResult: false,
  findTripError: false,

  getTripLoading: false,
  getTripResult: false,
  getTripError: false,
};

const trip = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case TYPE.FIND_TRIP:
      return {
        ...state,
        findTripLoading: payload.loading,
        findTripResult: payload.data,
        findTripError: payload.error,
      };

    case TYPE.GET_TRIP:
      return {
        ...state,
        getTripLoading: payload.loading,
        getTripResult: payload.data,
        getTripError: payload.error,
      };
    default:
      return state;
  }
};

export default trip;
