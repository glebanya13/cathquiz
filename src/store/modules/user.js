import firebase from 'firebase';

export default {
    state: {
        user: {
            isAuthenticated: false,
            uid: null,
        },
    },
    mutations: {
        SET_USER(state, payload) {
            state.user.isAuthenticated = true;
            state.user.uid = payload.uid;
        },
        UNSET_USER(state) {
            state.user = {
                isAuthenticated: false,
                uid: null
            };
        },
    },
    actions: {
        SIGNUP({ commit }, payload) {
            commit('SET_PROCESSING', true);
            commit('CLEAR_ERROR');
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    commit('SET_PROCESSING', false);
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false);
                    commit('SET_ERROR', error);
                    throw error;
                });
        },
        SIGNIN({ commit }, payload) {
            commit('SET_PROCESSING', true);
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    commit('SET_PROCESSING', false);
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false);
                    commit('SET_ERROR', error);
                    throw error;
                });
        },
        STATE_CHANGED({ commit }, firebaseUser) {
            if (firebaseUser) {
                firebaseUser.getIdTokenResult()
                    .then(() => {
                        commit('SET_USER', {
                            uid: firebaseUser.uid,
                        });
                    });


            } else {
                commit('UNSET_USER');
            }
        },
        SIGNOUT() {
            firebase.auth().signOut();
        },
    },
    getters: {
        isUserAuthenticated: (state) => state.user.isAuthenticated,
        userId: (state) => state.user.uid,
    }
};