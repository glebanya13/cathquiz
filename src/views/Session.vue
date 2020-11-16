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
            <v-list>
              <v-list-item v-for="p in SESSION_PARTICIPANTS" :key="p.id">
                {{ p.name }} {{ p.surname }} ответил
                {{ p.answers ? p.answers.length : 0 }} вопросов. Из них
                {{
                  p.answers ? p.answers.filter((a) => a.correct).length : 0
                }}
                правильно
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="start()" text>Start</v-btn>
            <v-btn @click="stop()" text>Stop</v-btn>
          </v-card-actions>
        </v-card></v-col
      >
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["CURRENT_QUIZ", "CURRENT_SESSION", "SESSION_PARTICIPANTS"]),
    participants() {
      let ps = this.SESSION_PARTICIPANTS || [];
      return ps.length == 0
        ? []
        : ps.sort(
            (a, b) =>
              a.answers.filter((an) => an.correct).length >
              b.answers.filter((ba) => ba.correct).length
          );
    },
  },
  methods: {
    ...mapMutations(["EXIT_PARTICIPANTS_FOLLOWING"]),
    ...mapActions([
      "GET_QUIZ",
      "GET_SESSION",
      "START_QUIZ",
      "STOP_QUIZ",
      "START_FOLLOW_PARTICIPANTS",
    ]),
    start() {
      this.START_QUIZ({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
      });
      this.START_FOLLOW_PARTICIPANTS({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
      });
    },
    stop() {
      this.STOP_QUIZ({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
      });
      this.EXIT_PARTICIPANTS_FOLLOWING();
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