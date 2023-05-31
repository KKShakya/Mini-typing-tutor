
const UPDATE_REPITITION = "Update/repetition"
const UPDATE_COMBINATION = "Update/combination"
const UPDATE_SOURCE = "Update/source"
const UPDATE_TEXT = "Update/text"
const UPDATE_VISUAL_TEXT = "Update/visual/text"
const RESET_START_TIME = "reset/startTime"
const UPDATE_MINUTES = "update/minutes"
const UPDATE_SECONDS = "update/seconds"


// visual text is for User view What to type
// conbination is to derive how many words to be included
// repition is to repeat those  combinations
// next is to set new visualtext once user finishes all the text corretly
//start timer = 300 seconds === 5 minutes
//minutes and seconds are timer related updations

const initialState = {
  n: 2,
  visualText: '',
  combination: 2,
  repetition: 3,
  next: false,
  startTime: 300,
  minutes:"",
  seconds:"",
}



export const updateCombination = (val = 2) => ({
  type: UPDATE_COMBINATION,
  payload: Number(val)
})

export const updateRepetition = (val = 3) => ({
  type: UPDATE_REPITITION,
  payload: Number(val)
})

export const updateSource = (val = 2) => ({
  type: UPDATE_SOURCE,
  payload: Number(val)
})

export const updateNext = (prev) => ({
  type: UPDATE_TEXT,
  payload: !prev,
})

export const updateVisualText = (text = "") => ({
  type: UPDATE_VISUAL_TEXT,
  payload: text,
})


export const updateMinutes = (val)=>({
  type: UPDATE_MINUTES,
  payload:val,
})

export const updateSeconds = (val)=>({
  type: UPDATE_SECONDS,
  payload:val,
})

export const resetStartTime = (val) => ({
  type: RESET_START_TIME,
  payload: val
}
)

export const typingReducer = (state = initialState, { type, payload }) => {

  switch (type) {
    case UPDATE_COMBINATION: {
      return {
        ...state,
        combination: payload
      };
    }


    case UPDATE_REPITITION: {
      return {
        ...state,
        repetition: payload
      };
    }


    case UPDATE_SOURCE: {
      return {
        ...state,
        n: payload
      };
    }


    case UPDATE_TEXT: {
      return {
        ...state,
        next: payload
      };
    }

    case UPDATE_MINUTES: {
      return {
        ...state,
        minutes: payload
      };
    }

    case UPDATE_SECONDS: {
      return {
        ...state,
        seconds: payload
      };
    }

    case UPDATE_VISUAL_TEXT: {
      return {
        ...state,
        visualText: payload
      };
    }



    case RESET_START_TIME: {
      return {
        ...state,
        startTime: payload
      };
    }


    default: {
      return state;
    }
  }
}