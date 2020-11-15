import Vue from 'vue';
export default {
    state: {
        quizList: [],
        currentQuiz: {},
        newSession: {},
        currentSession: {},
        currentParticipant: {},

        stopFollowSession: null
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
        },
        SET_EXIT_FOR_SESSION(state, exit) {
            state.stopFollowSession = exit
        },
        EXIT_CURRENT_SESSION(state) {
            if (state.stopFollowSession)
                state.stopFollowSession()
        }
    },
    actions: {
        START_FOLLOW_SESSION({ commit }, { quizId, sessionId }) {
            console.log('hello')
            let stop = Vue.$db.doc(`quizzes/${quizId}/sessions/${sessionId}`)
                .onSnapshot(function (doc) {
                    console.log("Current CHANGES IN session: ", doc.data());
                    let session = { ...doc.data(), id: doc.id, participants: [] }
                    commit('SET_CURRENT_SESSION', session)
                });
            commit('SET_EXIT_FOR_SESSION', stop)
        },
        ADD_PARTICIPANT({ commit }, { quizId, sessionId, participant }) {
            if (!quizId || !sessionId) {
                console.log('ADD_PARTICIPANT id:', quizId)
                return
            }

            Vue.$db.collection(`quizzes/${quizId}/sessions/${sessionId}/participants`).add({
                name: participant.name
            })
                .then(function (participantRef) {
                    console.log("Participant written with ID: ", participantRef.id);
                    let p = {
                        id: participantRef.id,
                        name: participant.name
                    }
                    commit('SET_CURRENT_PARTICIPANT', p)
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    throw e;
                });
        },
        START_QUIZ({ commit, getters }, { quizId, sessionId }) {
            if (!quizId || !sessionId) {
                console.log('START_QUIZ id:', quizId)
                return
            }

            let ref = Vue.$db.doc(`quizzes/${quizId}/sessions/${sessionId}`)
            ref.update({ 'alive': true })

            let item = { ...getters.CURRENT_SESSION }
            item.alive = true
            commit('SET_CURRENT_SESSION', item)
        },
        STOP_QUIZ({ commit, getters }, { quizId, sessionId }) {
            if (!quizId || !sessionId) {
                console.log('STOP_QUIZ id:', quizId)
                return
            }
            let ref = Vue.$db.doc(`quizzes/${quizId}/sessions/${sessionId}`)
            ref.update({ alive: false })
            let item = { ...getters.CURRENT_SESSION }
            item.alive = false
            commit('SET_CURRENT_SESSION', item)
        },
        async GET_SESSION({ commit }, { quizId, sessionId, withParticipants }) {
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
            }
            commit('SET_CURRENT_SESSION', session)
        },
        GENERATE_SESSION({ commit }, { quizId, sessionName }) {

            Vue.$db.collection(`quizzes/${quizId}/sessions`).add({
                name: sessionName
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
                    console.log('q', question)
                    quiz.questions.push(question)
                });

            }
            if (withSessions) {
                let sessions = await ref.collection('sessions').get()
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
                time: quiz.time,
                questionTime: quiz.questionTime
            }, { merge: true })


                .then(() => {
                    let key = ref.id
                    let qref = Vue.$db.collection(`quizzes/${key}/questions`)

                    let questions = quiz.questions
                    questions.forEach((q) => {
                        console.log(q)
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
        CURRENT_PARTICIPANT: (state) => state.currentParticipant
    },
}