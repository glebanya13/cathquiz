<template>
  <v-container>
    <v-row>
      <v-col
        ><v-card
          ><v-card-title>
            Конкурс : {{ CURRENT_QUIZ.title }} | Сессия:
            {{ CURRENT_SESSION.name }}
          </v-card-title>
          <v-card-subtitle>
            Колличество участников:
            {{
              CURRENT_SESSION.participants
                ? CURRENT_SESSION.participants.length
                : 0
            }}
          </v-card-subtitle>
          <v-card-text>

            <v-data-table
      :headers="headers"
      :items="SESSION_PARTICIPANTS"
      item-key="name"
      class="elevation-1"
      :loading="loading"
      :loading-text="loadingText"
    >
    <template v-slot:item.name="{ item }">
            {{ item.name}} {{ item.surname }}
          </template>
          <template v-slot:item.birthday="{ item }">
            {{ showYears(item) }} 
          </template>
          <template v-slot:item.result="{ item }">
            {{ showResult(item) }} 
          </template>
    </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="startRegistration()" text>Начать регистрацию (заново) </v-btn>
            <v-btn v-if="CURRENT_SESSION.state == 'registration'" @click="start()" text>Начать конкурс </v-btn>
            <v-btn v-if="CURRENT_SESSION.state == 'alive'" @click="stop()" text>Закончить конкурс</v-btn>
          </v-card-actions>
        </v-card></v-col
      >
    </v-row>

    <v-row>
      <v-col>
        
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Имя</th>
                    <th class="text-left">Ответы</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in SESSION_PARTICIPANTS" :key="p.id">
                    <td>{{ p.name }} {{ p.surname }}</td>
                    <td>
                      {{
                        p.answers
                          ? p.answers.filter((a) => a.correct).length
                          : 0
                      }}
                      из {{ p.answers ? p.answers.length : 0 }}
                      <v-icon @click.stop="show = !show"
                        >mdi-chevron-down</v-icon
                      >
                      <ul class="black--text" >
                        <li
                          v-for="(a, i) in p.answers"
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
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import moment from 'moment'
export default {
  data() {
    return {
      headers: [
        {text: "Имя", value: "name", sortable: true},
        {text: "Возраст", value: "birthday", sortable: true},
        {text: "Результат", value: "result", sortable: true}
      ],
      loading: true,
      loadingText: "Начните регистрацию",
      show: true,
    };
  },
  computed: {
    ...mapGetters(["CURRENT_QUIZ", "CURRENT_SESSION", "SESSION_PARTICIPANTS"]),
    participants() {
      let ps = this.SESSION_PARTICIPANTS || [];
      ps.forEach(p => {
        p.result = (p.answers || []).filter((an) => an.correct).length
      });

      return ps.length == 0
        ? []
        : ps.sort(
            (a, b) =>
              a.result >
              b.result
          );
    },
  },
  methods: {
    ...mapMutations(["EXIT_PARTICIPANTS_FOLLOWING"]),
    ...mapActions([
      "GET_QUIZ",
      "GET_SESSION",
      "CHANGE_QUIZ_STATE",
      "START_FOLLOW_PARTICIPANTS",
    ]),
    showYears(participant){
      return participant.birthday ? moment().diff(participant.birthday, 'years',false) : 0
    },
    showResult(participant){
      return `${(participant.answers && participant.answers.length) ? participant.answers.filter(a => a.correct).length : 0} \\ ${(participant.answers && participant.answers.length)  ? participant.answers.length : 0} \\ ${this.CURRENT_QUIZ.questions.length}`
    },
    startRegistration(){
      this.loadingText = "Идет регистрация"
      this.CHANGE_QUIZ_STATE({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
        state: 'registration'
      });
      this.START_FOLLOW_PARTICIPANTS({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
      });
    },
    start() {
      this.CHANGE_QUIZ_STATE({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
        state: 'alive'
      });
    },
    stop() {
      this.loading = false
      this.CHANGE_QUIZ_STATE({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
        state: 'completed'
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
    this.START_FOLLOW_PARTICIPANTS({
        quizId: this.$route.params.quizId,
        sessionId: this.$route.params.sessionId,
      });
  },
};
</script>
<style scoped>
</style>