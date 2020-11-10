<template>
  <v-container>
    <v-row>
      <v-col
        ><v-card
          ><v-card-title>
            Current Quiz : {{ CURRENT_QUIZ.title }} | Current Session:
            {{ CURRENT_SESSION.name }}
          </v-card-title>
          <v-card-subtitle>
            Participants Count:
            {{
              CURRENT_SESSION.participants
                ? CURRENT_SESSION.participants.length
                : 0
            }}
          </v-card-subtitle>
          <v-card-text>
            Quiz: {{ CURRENT_QUIZ }} <br /><br />
            Session: {{ CURRENT_SESSION }}
          </v-card-text>
          <v-card-actions>
            <v-btn @click="start()" text>Start</v-btn>
            <v-btn @click="stop()" text>Stop</v-btn>
          </v-card-actions>
        </v-card></v-col
      >
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Participants and Progress</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="p in CURRENT_SESSION.participants"
                :key="p.name"
              >
                {{ p.name }} ответил {{ p.currentQuestion }} вопросов. Из них
                {{ p.score }} правильно
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card></v-col
      >
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["CURRENT_QUIZ", "CURRENT_SESSION"]),
  },
  methods: {
    ...mapActions(["GET_QUIZ", "GET_SESSION", "START_QUIZ", "STOP_QUIZ"]),
    start() {
      this.START_QUIZ({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
      });
    },
    stop() {
      this.STOP_QUIZ({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
      });
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