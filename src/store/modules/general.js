export default {
    state: {
        error: null,
    },
    mutations: {
        SET_ERROR(state, payload) {
            state.error = payload;
        },
        CLEAR_ERROR(state) {
            state.error = null;
        },
    },
    getters: {
        GET_ERROR: (state) => state.error,
    },
};