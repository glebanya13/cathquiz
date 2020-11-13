<template>
  <v-card
    ><v-card-title>
      {{ CURRENT_QUIZ.title }}
    </v-card-title>
    <v-card-subtitle>
      {{ CURRENT_SESSION.name }}
    </v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row v-if="initialState">
          <v-col>
            <v-text-field
              v-model="currentUser.name"
              label="Введи свое имя"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="waitingState">
          <v-col>
            <p>Тест скоро начнется</p>
            <br />
            <countdown
              ref="playCountdown"
              :left-time="3000"
              :auto-start="false"
              @finish="ready()"
            >
              <template v-slot:process="live">
                <span headline>{{
                  `До начала осталось: ${live.timeObj.ceil.s} секунд`
                }}</span>
              </template>
              <template v-slot:finish>
                <span headline>Когда будешь готов, жми начать!</span>
              </template>
            </countdown>
            <br />
          </v-col>
        </v-row>
        <v-row v-if="startedState">
          <v-col>
            <v-row>
              <v-col>
                <countdown
                  ref="qCountdown"
                  :left-time="questionTime"
                  @finish="nextQuestion()"
                >
                  <template v-slot:process="anyYouWantedScopName">
                    <span headline>{{
                      `Время на ответ: ${anyYouWantedScopName.timeObj.ceil.s} секунд`
                    }}</span>
                  </template>
                </countdown>
              </v-col>
            </v-row>
            <v-progress-linear v-model="progress" color="blue-grey" height="15">
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
            <v-card flat>
              <v-card-title class="h4">{{
                currentQuestion.question
              }}</v-card-title>
              <v-card-text>
                <v-radio-group v-model="selectedAnswerIndex">
                  <v-radio
                    v-for="(a, i) in currentQuestion.answers"
                    :key="a.text + i"
                    :label="a.text"
                    :value="i"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
              <v-card-actions text>
                <v-btn v-if="!lastQuestion" @click="nextQuestion()"
                  >Следующий</v-btn
                >
                <v-btn v-if="lastQuestion" @click="finishQuiz()"
                  >Закончить</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="finishState">
          <v-col>
            <p>Результат {{ result }} из {{ questions.length }}</p>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="readyState" @click="startQuiz()">Начать</v-btn>
      <v-btn text v-if="initialState" @click="register()">Далее</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
//import moment from "moment";

export default {
  data() {
    return {
      currentUser: {
        answers: [],
      },
      waitingState: false,
      readyState: false,
      startedState: false,
      initialState: true,
      finishState: false,

      currentQuestion: {},
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      selectedAnswerIndex: null,
      questionTime: 30000,
    };
  },
  computed: {
    ...mapGetters(["CURRENT_QUIZ", "CURRENT_SESSION", "CURRENT_PARTICIPANT"]),
    lastQuestion() {
      return this.currentQuestionIndex + 1 == this.questions.length;
    },
    result() {
      return this.answers ? this.answers.filter((a) => a.correct).length : 0;
    },
    progress() {
      return this.currentQuestionIndex == 0
        ? 0
        : (this.currentQuestionIndex * 100) / this.questions.length;
    },
  },
  watch: {
    CURRENT_SESSION(val) {
      if (this.waitingState && val) {
        console.log("it works");
        if (val.alive)
          this.$refs.playCountdown.startCountdown({ restart: true });
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
      "SAVE_RESULT",
    ]),
    register() {
      this.waitingState = true;
      this.initialState = false;
      this.ADD_PARTICIPANT({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
        participant: this.currentUser,
      });
      this.START_FOLLOW_SESSION({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
      });
    },
    ready() {
      this.readyState = true;
      this.questions = this.CURRENT_QUIZ
        ? [...this.CURRENT_QUIZ.questions]
        : [];
      this.currentQuestion = this.questions[0];
      this.currentQuestionIndex = 0;
    },
    startQuiz() {
      this.startedState = true;
      this.readyState = false;
      this.waitingState = false;
      this.initialState = false;
    },
    nextQuestion() {
      if (this.lastQuestion) {
        this.finishQuiz();
        return;
      }
      this.saveCurrentResult();
      this.resetTimer();
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    },
    finishQuiz() {
      this.saveCurrentResult();
      this.finishState = true;
      this.startedState = false;
      this.EXIT_CURRENT_SESSION();
    },
    resetTimer() {
      this.questionTime = 30000;
      this.$refs.qCountdown.startCountdown({ restart: true });
    },
    saveCurrentResult() {
      let res = this.currentQuestion.answers[this.selectedAnswerIndex];
      if (res) {
        let answer = {
          questionId: this.currentQuestion.id,
          answer: this.currentQuestion.answers[this.selectedAnswerIndex].text,
          correct:
            this.currentQuestion.answers[this.selectedAnswerIndex].correct ==
            true,
        };
        this.answers.push(answer);
        this.SAVE_RESULT({
          quizId: this.$route.params.quizId,
          sessionId: this.$route.params.sessionId,
          participantId: this.CURRENT_PARTICIPANT.id,
          answers: this.answers,
        });
      }
    },
  },
  created() {
    this.GET_QUIZ({ id: this.$route.params.quizId, withQuestions: true });
    this.GET_SESSION({
      quizId: this.$route.params.quizId,
      sessionId: this.$route.params.sessionId,
      withParticipants: true,
    });
  },
};
</script>
<style >
.v-card__text,
.v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>