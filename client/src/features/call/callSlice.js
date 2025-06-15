import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle", // idle | calling | incoming | in-call
  type: null, // "audio" | "video"
  callId: null,
  chatId: null,
  peerId: null,
  isGroupCall: false,
  isFloating: true,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCallState: (state, action) => {
      state.chatId = action.payload.chatId
      state.status = action.payload.status
      state.type = action.payload.type
      state.isGroupCall = action.payload.isGroupCall
      state.callId = action.payload.callId

    },
    setCallStatus: (state, action) => {
      state.status = action.payload;
    },
    toggleCallUI: (state) => {
      state.isFloating = !state.isFloating;
    },
    setCallId:(state,action) => {
      state.callId = action.payload
    },
    resetCallState: () => {
      return { ...initialState };
    },
  },
});

export const {
  setCallState,
  setCallStatus,
  toggleCallUI,
  resetCallState,
  setCallId
} = callSlice.actions;

export default callSlice.reducer;
