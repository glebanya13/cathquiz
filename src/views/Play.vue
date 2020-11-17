<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="6">
        <v-flex v-if="!isUserAuthenticated">
          <auth></auth>
        </v-flex>
        <v-flex v-if="isUserAuthenticated">
          <v-toolbar color="#8A2BE2" dark flat>
            <v-toolbar-title v-if="playState == 'initial'"
              >Введите данные</v-toolbar-title
            >
            <v-toolbar-title v-if="playState == 'finished'"
              >Результаты</v-toolbar-title
            >
            <v-toolbar-title
              v-if="playState !== 'finished' && playState !== 'initial'"
              >Конкурс</v-toolbar-title
            >
          </v-toolbar>
          <v-card
            ><v-card-title>
              {{ CURRENT_QUIZ.title }}
            </v-card-title>
            <v-card-subtitle>
              {{ CURRENT_SESSION.name }}
            </v-card-subtitle>
            <v-card-text>
              <v-container>
                <v-row v-if="playState == 'initial'">
                  <v-col>
                    <v-text-field
                      v-model="currentUser.name"
                      label="Имя"
                    ></v-text-field>
                    <v-text-field
                      label="Фамилия"
                      v-model="currentUser.surname"
                    ></v-text-field>
                    <v-text-field
                      label="Дата рождения"
                      v-model="currentUser.birthday"
                      type="date"
                    ></v-text-field>
                    <v-text-field
                      label="Номер телефона"
                      :value="phone"
                    ></v-text-field>
                    <v-overflow-btn
                      label="Парафия"
                      :items="parishes"
                      v-model="currentUser.parish"
                    ></v-overflow-btn>
                    <v-overflow-btn
                      label="Класс"
                      :items="classes"
                      v-model="currentUser.clas"
                    ></v-overflow-btn>
                  </v-col>
                </v-row>
                <v-row v-if="playState == 'waiting'">
                  <v-col>
                    <p>
                      Тест скоро начнется. На ответ дается 30 секунд. Только
                      один ответ правильный. Есть вопросы со свободным ответом.
                      На них дается 2 минуты.
                      <b
                        >Выходить из приложения запрещается. За это - исключение
                        из конкурса.</b
                      >
                    </p>
                    <br />
                    <countdown
                      ref="playCountdown"
                      :left-time="3000"
                      :auto-start="false"
                      @finish="ready()"
                    >
                      <template v-slot:process="live">
                        <h4>
                          {{
                            `До начала осталось: ${live.timeObj.ceil.s} секунд`
                          }}
                        </h4>
                      </template>
                      <template v-slot:finish>
                        <h4>Когда будешь готов, жми начать!</h4>
                      </template>
                    </countdown>
                    <br />
                  </v-col>
                </v-row>
                <v-row v-if="playState == 'started'">
                  <v-col>
                    <v-row>
                      <v-col>
                        <countdown
                          ref="qCountdown"
                          :left-time="questionTime"
                        >
                          <template v-slot:process="anyYouWantedScopName">
                            <h4>
                              {{
                                `Время на ответ: ${anyYouWantedScopName.timeObj.ceil.s} секунд`
                              }}
                            </h4>
                          </template>
                        </countdown>
                      </v-col>
                    </v-row>
                    <v-progress-linear
                      v-model="progress"
                      color="blue-grey"
                      height="15"
                    >
                      <template v-slot:default="{ value }">
                        <strong>{{ Math.ceil(value) }}%</strong>
                      </template>
                    </v-progress-linear>
                    <v-card flat>
                      <v-card-title class="h4">{{
                        currentQuestion.question
                      }}</v-card-title>
                      <v-card-text>
                        <v-textarea
                          v-if="currentQuestion.type == 'free'"
                          v-model="textAnswer"
                          label="Напишите ответ"
                        ></v-textarea>
                        <v-radio-group
                          v-if="currentQuestion.type == 'default'"
                          v-model="selectedAnswerIndex"
                        >
                          <v-radio
                            v-for="(a, i) in currentQuestion.answers"
                            :key="a.text + i"
                            :label="a.text"
                            :value="i"
                          ></v-radio>
                        </v-radio-group>
                      </v-card-text>
                      <v-card-actions text>
                        <v-spacer></v-spacer>
                        <v-btn
                          v-if="!lastQuestion"
                          @click="nextQuestion()"
                          color="#8A2BE2"
                          dark
                          >Следующий</v-btn
                        >
                        <v-btn
                          v-if="lastQuestion"
                          @click="finishQuiz()"
                          color="#8A2BE2"
                          dark
                          >Закончить</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row v-if="playState == 'finished'">
                  <v-col>
                    <ul class="black--text" v-if="showResults">
                        <li
                          v-for="(a, i) in answers"
                          :key="a.question + a.answer + i"
                        >
                        <v-chip
                            class="ma-2"
                            :color="a.type == 'free' ? 'warning' : (a.correct ? 'green' : 'red')"
                            text-color="white">
                             {{ a.question }}</v-chip>
                             <br>
                             Выбран ответ: {{a.answer}}
                              <v-chip
                              v-if="!a.correct"
                            class="ma-2"
                            color="primary"
                            text-color="white">
                            Правильный: {{ a.correctAnswer }}</v-chip>
                          <br>
                          <br>
                        </li>
                      </ul>

                    <br />

                    <v-alert bottom light color="green lighten-1">
                      <v-icon>check</v-icon> Результат:
                      {{
                        answers ? answers.filter((a) => a.correct).length : 0
                      }}
                      из {{ questions ? questions.length : 0 }}
            <br>
            Баллы за открытые вопросы пересчитываются.
                    </v-alert>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="playState == 'ready'"
                @click="startQuiz()"
                color="#8A2BE2"
                dark
                >Начать</v-btn
              >
              <v-btn
                v-if="playState == 'initial'"
                @click="register()"
                color="#8A2BE2"
                dark
                >Далее</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import Auth from "../components/Auth.vue";
import firebase from "firebase";
//import moment from "moment";
import Vue from "vue";

export default {
  data() {
    return {
      currentUser: {
        answers: [],
      },
      show: false,
      snackbar: false,
      classes: [
        "Школу не начинал",
        "Первый",
        "Второй",
        "Третий",
        "Четвертый",
        "Пятый",
        "Шестой",
        "Седьмой",
        "Восьмой",
        "Девятый",
        "Десятый",
        "Одиннадцатый",
        "Школу закончил",
      ],
      parishes: ["Святой Троицы, г. Глубокое"],
      playState: "initial",

      currentQuestion: {},
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      selectedAnswerIndex: null,
      textAnswer: null,
      participantId: null,
      showResults: false,
    };
  },
  computed: {
    ...mapGetters([
      "CURRENT_QUIZ",
      "CURRENT_SESSION",
      "CURRENT_PARTICIPANT",
      "SESSION_PARTICIPANTS",
    ]),
    lastQuestion() {
      return this.currentQuestionIndex + 1 >= this.questions.length;
    },
    result() {
      return this.answers ? this.answers.filter((a) => a.correct).length : 0;
    },
    progress() {
      return this.currentQuestionIndex == 0 || this.questions.length == 0
        ? 0
        : (this.currentQuestionIndex * 100) / this.questions.length;
    },
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
    phone() {
      let phone = firebase.auth().currentUser.phoneNumber;
      return phone;
    },
  },
  watch: {
    CURRENT_SESSION(val) {
      if (val) {
        if (val.state == "alive") {
          if (this.playState == "waiting") {
            this.$refs.playCountdown.startCountdown({ restart: true });
          }
        }
        if (
          val.state == "registration" &&
          (this.playState == "finished" || this.playState == "started")
        ) {
          this.playState = "initial";
          this.clean();
          // something
        }
        if (val.state == "completed") {
          this.finishQuiz();
          this.showResults = true;
          this.EXIT_CURRENT_SESSION();
        }
      }
    },
  },
  methods: {
    ...mapMutations(["EXIT_CURRENT_SESSION"]),
    ...mapActions([
      "GET_QUIZ",
      "GET_SESSION",
      "ADD_PARTICIPANT",
      "START_FOLLOW_SESSION",
      "START_FOLLOW_PARTICIPANTS",
      "SAVE_RESULT",
    ]),
    register() {
      this.playState = "waiting";
      this.ADD_PARTICIPANT({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
        participant: this.currentUser,
        phone: this.phone,
      });
      this.START_FOLLOW_SESSION({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
      });
      this.saveLocal();
    },
    ready() {
      this.playState = "ready";
      this.questions = shuffle(
        this.CURRENT_QUIZ ? [...this.CURRENT_QUIZ.questions] : []
      );
      this.currentQuestion = this.questions[0];
      if (this.currentQuestion) {
        this.currentQuestion.answers = shuffle(this.currentQuestion.answers);
      }
      this.currentQuestionIndex = 0;
      this.saveLocal();
    },
    startQuiz() {
      this.playState = "started";
      this.saveLocal();
    },
    nextQuestion() {
      if (this.lastQuestion) {
        this.finishQuiz();
        this.saveLocal();
        return;
      }
      this.saveCurrentResult();
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.resetTimer();
      this.saveLocal();
    },
    finishQuiz() {
      this.saveCurrentResult();
      this.playState = "finished";
      this.saveLocal();
    },
    resetTimer() {
      if(this.currentQuestion && this.currentQuestion.type == 'free'){
        this.questionTime = 120000
      }else{
        this.questionTime = 30000;
      }
      this.$refs.qCountdown.startCountdown({ restart: true });
      this.snackbar = true;
    },
    saveCurrentResult() {
      if (this.currentQuestion.type == "free") {
        if (this.textAnswer) {
          let answer = {
            type: 'free',
            questionId: this.currentQuestion.id,
            answer: this.textAnswer,
            question: this.currentQuestion.question,
            correctAnswer: (this.currentQuestion.answers.find(q => q.correct) || {}).text
          };
          this.answers.push(answer);
          this.SAVE_RESULT({
            quizId: this.$route.params.quizId,
            sessionId: this.$route.params.sessionId,
            participantId: this.CURRENT_PARTICIPANT.id,
            answers: this.answers || [],
          });
          this.textAnswer = ""
          this.saveLocal();
        }
      } else {
        let res = this.currentQuestion.answers[this.selectedAnswerIndex] || {};

        if (res) {
          let answer = {
            questionId: this.currentQuestion.id,
            answer: res.text || '',
            correctAnswer: (this.currentQuestion.answers.find(f => f.correct) || {}).text,
            question: this.currentQuestion.question,
            correct:
              res.correct ==
              true,
          };
          this.answers.push(answer);
          this.SAVE_RESULT({
            quizId: this.$route.params.quizId,
            sessionId: this.$route.params.sessionId,
            participantId: this.CURRENT_PARTICIPANT.id,
            answers: this.answers || [],
          });
          this.selectedAnswerIndex = null
          this.saveLocal();
        }
      }
    },
    clean() {
      this.answers = [];
      this.currentQuestionIndex = null;
      this.saveLocal();
      //clean state
    },
    fullClean() {
      this.answers = [];
      this.currentQuestionIndex = null;
      this.selectedAnswerIndex = null;
      this.participantId = null;
      this.playState = "initial";
      this.saveLocal();
      //clean state
    },
    saveLocal() {
      Vue.localStorage.set("currentQuestionIndex", this.currentQuestionIndex);
      Vue.localStorage.set("selectedAnswerIndex", this.selectedAnswerIndex);
      Vue.localStorage.set("participantId", this.CURRENT_PARTICIPANT.id);
      Vue.localStorage.set("answers", JSON.stringify(this.answers));
      Vue.localStorage.set("questions", JSON.stringify(this.questions));
      Vue.localStorage.set("playState", this.playState);
      Vue.localStorage.set("sessionId", this.CURRENT_SESSION.id);
    },
    loadLocal() {
      this.currentQuestionIndex =
        Vue.localStorage.get("currentQuestionIndex") || null;
      this.selectedAnswerIndex =
        Vue.localStorage.get("selectedAnswerIndex") || null;
      this.participantId = Vue.localStorage.get("participantId");
      this.sessionId = Vue.localStorage.get("sessionId");
      this.answers = JSON.parse(Vue.localStorage.get("answers")) || [];
      this.playState = Vue.localStorage.get("playState") || "initial";
      this.questions = JSON.parse(Vue.localStorage.get("questions")) || [];
      this.currentQuestion =
        this.currentQuestionIndex &&
        this.questions &&
        this.questions.length > this.currentQuestionIndex
          ? this.questions[this.currentQuestionIndex]
          : {};
      if (this.currentQuestion) {
        this.currentQuestion.answers = shuffle(this.currentQuestion.answers);
      }
    },
  },
  components: {
    Auth,
  },
  created() {
    this.loadLocal();
    if (this.sessionId != this.$route.params.sessionId) {
      this.fullClean();
    }
    this.GET_QUIZ({ id: this.$route.params.quizId, withQuestions: true });
    this.GET_SESSION({
      quizId: this.$route.params.quizId,
      sessionId: this.$route.params.sessionId,
      withParticipants: true,
      currentParticipantId: this.participantId,
    });

      if(this.currentQuestion && this.currentQuestion.type == 'free'){
        this.questionTime = 120000
      }else{
        this.questionTime = 30000
      }
  },
};

function shuffle(array) {
  if (!array) return [];

  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
</script>
<style >
.v-card__text,
.v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>