import Vue from 'vue';
export default {
    state: {
        quizList: [],
        currentQuiz: {},
        newSession: {}
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
    },
    actions: {
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
                question: [],
                sessions: []
            }
            console.log(quiz)
            if (withQuestions) {
                let questions = await ref.collection('questions').get()
                questions.forEach(docQuestion => {
                    let question = docQuestion.data()
                    question.id = docQuestion.id
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
            // let qref = ref.collection('questions')
            // console.log(qref)
            ref.set({
                title: quiz.title,
                time: quiz.time,
                questionTime: quiz.questionTime
            }, { merge: true })
            // qref.set({

            // })
                .then((res) => {
                    console.log(res)

                    // TODO добавить вопросы в коллекцию
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
        NEW_SESSION: (state) => state.newSession
    },
}