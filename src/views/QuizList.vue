<template>
  <v-card>
    <v-card-text>
      <v-list>
        <v-list-item v-for="item in QUIZ_LIST" :key="item.title">
          {{ JSON.stringify(item) }}
          <v-btn @click="addOrUpdate(item)">Edit</v-btn>
        </v-list-item>
      </v-list>

      <div v-if="true">
        <v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1" color="#8A2BE2">
              Имя и время
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 2" step="2" color="#8A2BE2">
              Вопросы
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3" color="#8A2BE2">
              Проверить
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-text-field
                v-model="currentQuiz.title"
                label="Название"
              ></v-text-field>
              <v-text-field
                v-model="currentQuiz.time"
                label="Время прохождения"
              ></v-text-field>
              <v-text-field
                v-model="currentQuiz.questionTime"
                label="Время на вопрос"
              ></v-text-field>
              <v-btn color="#8A2BE2" dark @click="addQuiz()"> Continue </v-btn>

              <v-btn text @click="step = 2"> Cancel </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <h2>
                Добавление вопросов:
                <v-icon @click="addQuestions()">add</v-icon>
              </h2>

              <br />
              <div v-for="question in questions" :key="question.qid">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      :placeholder="`Вопрос ${question.qid}`"
                      v-model="question.question"
                      >{{ question.question }}</v-text-field
                    >
                    <v-icon @click="addQuestions()">add</v-icon>
                  </v-col>
                  <v-col sm="6" class="mt-6">
                    <v-icon @click="addAnswers(question)">add</v-icon>
                  </v-col>

                  <div v-for="answer in answers" :key="answer.aid">
                    <v-card
                      v-if="answer.questionId == question.qid"
                      class="ml-2"
                    >
                      <v-card-text>
                        <v-text-field placeholder="Ответ">{{
                          answer.text
                        }}</v-text-field>
                        <v-text-field placeholder="Correct">{{
                          answer.correct
                        }}</v-text-field>
                        <v-icon @click="deleteAnswer(answer)">delete</v-icon>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-row>

                <v-icon @click="deleteQuestion(question)">delete</v-icon>
              </div>

              <v-btn color="#8A2BE2" dark @click="addQuiz()"> Continue </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="#8A2BE2" dark @click="step = 1"> Continue </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="questionsCollection()">Добавить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      editMode: false,
      step: 1,
      currentQuiz: {},
      questions: [],
      answers: [],
    };
  },
  computed: {
    ...mapGetters(["QUIZ_LIST"]),
  },
  methods: {
    ...mapActions(["LOAD_QUIZZES", "ADD_QUIZ", "ADD_QUESTIONS"]),
    addOrUpdate(item) {
      console.log(item.quantity);
      this.currentQuiz = item ? item : {};
      this.editMode = true;
    },
    addQuiz() {
      this.ADD_QUIZ({
        title: this.currentQuiz.title,
        time: this.currentQuiz.time,
        questionTime: this.currentQuiz.questionTime,
        questions: this.questions
      });
      this.step = 2;
    },
    deleteQuestion(question) {
      console.log(question.qid);
      let a = this.answers.filter((a) => a.questionId == question.qid);
      this.answers.splice(this.answers.indexOf(a), a.length);
      this.questions.splice(this.questions.indexOf(question), 1);
    },
    deleteAnswer(parametr) {
      this.answers.splice(this.answers.indexOf(parametr), 1);
    },
    addQuestions() {
      this.questions.push({
        qid: 1 + Math.max(0, ...this.questions.map((n) => n.qid)),
        question: "",
        type: "default",
      });
    },
    addAnswers(question) {
      this.answers.push({
        questionId: question.qid,
        text: "",
        correct: null,
      });
    },
    dada() {
      console.log(this.currentQuiz.id);
    },
  },
  created() {
    this.LOAD_QUIZZES();
    this.addQuestions();
  },
};
</script>