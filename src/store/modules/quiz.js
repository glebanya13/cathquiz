import Vue from 'vue';
export default {
    state: {
        quizList: [],
        currentQuiz: {},
        newSession: {},
        currentSession: {},
        currentParticipant: {},
        sessionParticipants: [],

        stopFollowSession: null,
        stopFollowParticipants: null
    },
    mutations: {
        SET_QUIZ_LIST(state, quizList) {
            state.quizList = quizList
        },
        SET_CURRENT_QUIZ(state, currentQuiz) {
            state.currentQuiz = currentQuiz
        },
        SET_NEW_SESSION(state, newSession) {
            state.newSession = newSession
        },
        SET_CURRENT_SESSION(state, currentSession) {
            state.currentSession = currentSession
        },
        SET_CURRENT_PARTICIPANT(state, currentParticipant) {
            state.currentParticipant = currentParticipant
        }
        , SET_SESSION_PARTICIPANTS(state, sessionParticipants) {
            state.sessionParticipants = sessionParticipants
        },
        UPDATE_ANSWERS(state, participant) {
            let fi = state.sessionParticipants.findIndex(p => p.id == participant.id)
            if (state.sessionParticipants[fi]) {
                state.sessionParticipants[fi].answers = participant.answers
            }
        },
        SET_EXIT_FOR_SESSION(state, exit) {
            state.stopFollowSession = exit
        },
        SET_EXIT_FOR_PARTICIPANTS(state, exit) {
            state.stopFollowParticipants = exit
        },
        EXIT_CURRENT_SESSION(state) {
            if (state.stopFollowSession)
                state.stopFollowSession()
        },
        EXIT_PARTICIPANTS_FOLLOWING(state) {
            if (state.stopFollowParticipants)
                state.stopFollowParticipants()
        }
    },
    actions: {
        START_FOLLOW_PARTICIPANTS({ commit }, { quizId, sessionId }) {
            let stop = Vue.$db.collection(`quizzes/${quizId}/sessions/${sessionId}/participants`)
                .onSnapshot(function (querySnapshot) {
                    var ps = [];
                    querySnapshot.forEach(function (doc) {
                        console.log('START_FOLLOW_PARTICIPANTS', doc.data())
                        ps.push({
                            id: doc.id,
                            ...doc.data()
                        });
                        console.log(doc.data())
                        // Vue.$db.doc(`quizzes/${quizId}/sessions/${sessionId}/participants/${doc.id}`)
                        // .onSnapshot(function (doc) {
                        //     commit('UPDATE_ANSWERS', {id: doc.id, ...doc.data()})
                        // });
                        commit('SET_SESSION_PARTICIPANTS', ps)
                    });
                });
            commit('SET_EXIT_FOR_PARTICIPANTS', stop)
        },
        SAVE_RESULT(ctx, { quizId, sessionId, participantId, answers }) {
            
            Vue.$db.doc(`quizzes/${quizId}/sessions/${sessionId}/participants/${participantId}`)
                .update({ 'answers': answers || [] })
        },
        START_FOLLOW_SESSION({ commit }, { quizId, sessionId }) {
            let stop = Vue.$db.doc(`quizzes/${quizId}/sessions/${sessionId}`)
                .onSnapshot(function (doc) {
                    console.log("Current CHANGES IN session: ", doc.data());
                    let session = { ...doc.data(), id: doc.id, participants: [] }
                    commit('SET_CURRENT_SESSION', session)
                });
            commit('SET_EXIT_FOR_SESSION', stop)
        },
        ADD_PARTICIPANT({ commit, getters }, { quizId, sessionId, participant, phone }) {
            if (!quizId || !sessionId) {
                console.log('ADD_PARTICIPANT id:', quizId)
                return
            }

            let ref = Vue.$db.collection(`quizzes/${quizId}/sessions/${sessionId}/participants`).doc(getters.userId);
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId);

            userDataRef.set({
                birthday: participant.birthday || '',
                clas: participant.clas || '',
                name: participant.name || '',
                surname: participant.surname || '',
                parish: participant.parish || '',
                phone: phone || '',
                userId: getters.userId,
            }, { merge: true })

            console.log(ref.id)

            ref.set({
                birthday: participant.birthday || '',
                clas: participant.clas || '',
                name: participant.name || '',
                surname: participant.surname || '',
                parish: participant.parish || '',
                phone: phone || '',
            }, { merge: true })

                .then(function () {
                    console.log("Participant written with ID: ", ref.id)
                    let p = {
                        id: ref.id,
                        name: participant.name,
                        surname: participant.surname,
                        birthday: participant.birthday,
                        clas: participant.clas,
                        parish: participant.parish,
                        phone: phone,
                        answers: []
                    }
                    commit('SET_CURRENT_PARTICIPANT', p)
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    throw e;
                });
        },
        CHANGE_QUIZ_STATE({ commit, getters }, { quizId, sessionId, state }) {
            if (!quizId || !sessionId) {
                console.log('CHANGE_QUIZ_STATE id:', quizId)
                return
            }

            let ref = Vue.$db.doc(`quizzes/${quizId}/sessions/${sessionId}`)
            ref.update({ 'state': state })

            let item = { ...getters.CURRENT_SESSION }
            item.state = state
            commit('SET_CURRENT_SESSION', item)
        },
        async GET_SESSION({ commit }, { quizId, sessionId, withParticipants, currentParticipantId }) {
            if (!quizId || !sessionId) {
                console.log('GET_SESSION id:', quizId)
                return
            }

            let ref = Vue.$db.collection("quizzes").doc(quizId).collection('sessions').doc(sessionId)
            let sessionDoc = await ref.get()
            let session = {
                id: sessionDoc.id,
                ...sessionDoc.data(),
                participants: []
            }
            if (withParticipants) {
                let participants = await ref.collection('participants').get()
                participants.forEach(docP => {
                    let p = docP.data()
                    p.id = docP.id
                    session.participants.push(p)
                });
                if(currentParticipantId){
                    let p = session.participants.find(pt => pt.id == currentParticipantId)
                    if(p){
                        commit('SET_CURRENT_PARTICIPANT', p)
                    }
                }
            }
            commit('SET_CURRENT_SESSION', session)
        },
        ARCHIVE_SESSION(ctx, { quizId, sessionId }) {
            
            Vue.$db.doc(`quizzes/${quizId}/sessions/${sessionId}`).update({
                "archived": true
            })
        },
        GENERATE_SESSION({ commit }, { quizId, sessionName }) {

            Vue.$db.collection(`quizzes/${quizId}/sessions`).add({
                name: sessionName,
                archived: false
            })
                .then(function (sessionRef) {
                    console.log("Session written with ID: ", sessionRef.id);
                    let session = {
                        id: sessionRef.id,
                        name: sessionName
                    }
                    commit('SET_NEW_SESSION', session)
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    throw e;
                });
        },
        async GET_QUIZ({ commit }, { id, withQuestions, withSessions }) {
            if (!id) {
                console.log('get_quiz id:', id)
                return
            }
            let ref = Vue.$db.collection("quizzes").doc(id)
            let qDoc = await ref.get()
            let quiz = {
                ...qDoc.data(),
                id: qDoc.id,
                questions: [],
                sessions: []
            }
            console.log(quiz)
            if (withQuestions) {
                let questions = await ref.collection('questions').get()

                questions.forEach(docQuestion => {
                    let question = {
                        ...docQuestion.data(),
                        id: docQuestion.id
                    }
                    quiz.questions.push(question)
                });

            }
            if (withSessions) {
                let sessions = await ref.collection('sessions').
                where("archived", "==", false).get()
                sessions.forEach(docSession => {
                    let session = docSession.data()
                    session.id = docSession.id
                    quiz.sessions.push(session)
                });
            }
            commit('SET_CURRENT_QUIZ', quiz)
        },
        ADD_QUIZ({ commit }, quiz) {
            let ref = quiz.id ? Vue.$db.collection('quizzes').doc(quiz.id) : Vue.$db.collection('quizzes').doc()

            ref.set({
                title: quiz.title,
                questionTime: quiz.questionTime
            }, { merge: true })


                .then(() => {
                    let key = ref.id
                    let qref = Vue.$db.collection(`quizzes/${key}/questions`)

                    let questions = quiz.questions
                    questions.forEach((q) => {
                        qref.add({
                            question: q.question,
                            type: q.type,
                            answers: q.answers
                        }, { merge: true })
                    })
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    throw e;
                });
        },
        async LOAD_QUIZZES({ commit }) {

            let quizList = []
            let ref = Vue.$db.collection("quizzes")
            let quizzes = await ref.get();

            quizzes.forEach(async docQuiz => {

                console.log("Parent Document ID: ", docQuiz.id);
                let quiz = docQuiz.data()
                quiz.id = docQuiz.id
                quiz.questions = []
                let questions = await ref.doc(docQuiz.id).collection("questions").get()
                questions.forEach(docQuestion => {
                    let question = docQuestion.data()
                    question.id = docQuestion.id
                    quiz.questions.push(question)
                });
                quizList.push(quiz)
            });
            commit('SET_QUIZ_LIST', quizList)
        }
    },
    getters: {
        QUIZ_LIST: (state) => state.quizList,
        CURRENT_QUIZ: (state) => state.currentQuiz,
        NEW_SESSION: (state) => state.newSession,
        CURRENT_SESSION: (state) => state.currentSession,
        CURRENT_PARTICIPANT: (state) => state.currentParticipant,

        SESSION_PARTICIPANTS: (state) => state.sessionParticipants
    },
}