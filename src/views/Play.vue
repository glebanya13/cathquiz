<template>
  <v-container>
    <v-row v-if="!waitingState">
      <v-col>
        <v-card
          ><v-card-title>Register</v-card-title>
          <v-card-text>
            <v-text-field v-model="currentUser.name" label="Имя"></v-text-field>
            todo: other fields
          </v-card-text>
          <v-card-actions>
            <v-btn @click="register()">Далее</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="waitingState">
      <v-col>
        <v-card height="200"
          ><v-card-title>
            Quiz {{ CURRENT_QUIZ.title }}. Session: {{ CURRENT_SESSION.name }}
          </v-card-title>
          <v-card-subtitle>
            Comment: {{ JSON.stringify(CURRENT_QUIZ.comment) }} Participant:
            {{ JSON.stringify(CURRENT_PARTICIPANT) }} Session:
            {{ CURRENT_SESSION.alive }}
          </v-card-subtitle>
          <v-card-text>
            <p>Тест скоро начнется</p>
            <countdown :left-time="5000" @finish="startQuiz()">
              <template v-slot:process="anyYouWantedScopName">
                <span>{{
                  `Lefttime: ${anyYouWantedScopName.timeObj.ceil.s}`
                }}</span>
              </template>
              <template v-slot:finish>
                <span>Done!</span>
              </template>
            </countdown>
            <v-btn :disabled="CURRENT_SESSION.alive">Начать</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//import moment from "moment";

export default {
  data() {
    return {
      currentUser: {},
      waitingState: false,
    };
  },
  computed: {
    ...mapGetters(["CURRENT_QUIZ", "CURRENT_SESSION", "CURRENT_PARTICIPANT"]),
  },
  watch: {
    CURRENT_SESSION(val) {
      console.log(val);
    },
  },
  methods: {
    ...mapActions([
      "GET_QUIZ",
      "GET_SESSION",
      "ADD_PARTICIPANT",
      "START_FOLLOW_SESSION",
    ]),
    register() {
      this.waitingState = true;
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
    startQuiz() {
      console.log("finsish");
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
<style scoped>
</style>