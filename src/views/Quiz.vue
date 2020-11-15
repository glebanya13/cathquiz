<template>
  <v-card>
    <v-card-title> Quiz: {{ CURRENT_QUIZ.title }} </v-card-title>
    <v-card-text>
      Sessions
      <v-list>
        <v-list-item
          v-for="item in CURRENT_QUIZ.sessions"
          :key="item.id + item.name"
        >
          {{ item.name }} <v-btn @click="select(item)">Select</v-btn>
        </v-list-item>
      </v-list>
      <br />
      <v-text-field
        v-model="newSessionName"
        label="Имя сессии - обязательно"
      ></v-text-field>
      <router-link
        :to="sessionParticipantUrl"
        tag="span"
        style="cursor: pointer"
      >
        для Участника {{ sessionParticipantUrl }}
      </router-link>
      <br />
      <br>
      <router-link :to="sessionModeratorUrl"  tag="span" style="cursor: pointer" >
        Для модератора {{ sessionModeratorUrl }}
      </router-link>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="generate()">Generate Session</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      newSessionName: "",
    };
  },
  computed: {
    ...mapGetters(["CURRENT_QUIZ", "NEW_SESSION"]),
    sessionModeratorUrl() {
      return this.NEW_SESSION && this.NEW_SESSION.id
        ? `${this.$route.params.id}/session/${this.NEW_SESSION.id}`
        : "";
    },
    sessionParticipantUrl() {
      return this.NEW_SESSION && this.NEW_SESSION.id
        ? `${this.$route.params.id}/play/${this.NEW_SESSION.id}`
        : "";
    },
  },
  methods: {
    ...mapActions(["GET_QUIZ", "GENERATE_SESSION"]),
    ...mapMutations(["SET_NEW_SESSION"]),
    select(item){
        this.SET_NEW_SESSION(item)
    },
    generate() {
      this.GENERATE_SESSION({
        quizId: this.CURRENT_QUIZ.id,
        sessionName: this.newSessionName,
      });
    },
  },
  created() {
    this.GET_QUIZ({ id: this.$route.params.id, withSessions: true });
  },
};
</script>