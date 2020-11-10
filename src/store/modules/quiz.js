import Vue from 'vue';
export default {
    state: {
        quizList: [],
        currentQuiz: {}
    },
    mutations: {
        SET_QUIZ_LIST(state, quizList) {
            state.quizList = quizList
        },
        SET_CURRENT_QUIZ(state, currentQuiz) {
            state.quizList = currentQuiz
        },
    },
    actions: {
        ADD_QUIZ({ commit }, quiz) {
            let ref = quiz.id ? Vue.$db.collection('quizzes').doc(quiz.id) : Vue.$db.collection('quizzes').doc()
            ref.set({
                title: quiz.title,
                time: quiz.time,
                questionTime: quiz.questionTime
            }, { merge: true })
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
    },
}