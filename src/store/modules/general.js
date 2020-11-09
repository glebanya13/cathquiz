export default {
    state: {
        processing: false,
        error: null,
    },
    mutations: {
        SET_PROCESSING(state, payload) {
            state.proccesing = payload;
        },
        SET_ERROR(state, payload) {
            state.error = payload;
        },
        CLEAR_ERROR(state) {
            state.error = null;
        },
    },
    getters: {
        getProcessing: (state) => state.processing,
        getError: (state) => state.error,
    },
};