import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
    name: "location",
    initialState: {
        location: { lat: null, lng: null },
        error: null,
        loading: false
    },
    reducers: {
        setLocation(state, action) {
            state.location = action.payload; // Fixed to properly update the state
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

export const { setLocation, setError, setLoading } = locationSlice.actions;
export default locationSlice.reducer;
