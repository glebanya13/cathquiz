import Vue from 'vue';

let defaultUserData = {
    clas: null,
    name: null,
    birthday: null,
    surname: null,
    parish: {},
    phone: null
};

export default {
    state: {
        userData: defaultUserData,
        users: {},
        usersForSchedule: [],
        needProfile: false
    },
    mutations: {
    },
    actions: {
        ADD_USER_DATA({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);

            let userDataRef = Vue.$db.collection('userData').doc(getters.userId);

            userDataRef.set({
                birthday: payload.birthday,
                clas: payload.clas,
                name: payload.name,
                surname: payload.surname,
                parishName: payload.parishName,
                userId: getters.userId,
                phone: payload.phone
            }, { merge: true })

                .then(() => {
                    commit('SET_PROCESSING', false);
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    commit('SET_PROCESSING', false);
                    throw e;
                });
        },
    }
};