<template>
  <v-card :loading="this.CURRENT_QUIZ.id == 'undefined'">
    <v-card-title> Конкурс: {{ CURRENT_QUIZ.title }} </v-card-title>
    <v-card-text>
      Сессия:
      <v-list>
        <v-list-item
          v-for="(item, index) in CURRENT_QUIZ.sessions"
          :key="item.id + item.name + index"
        >
          {{ item.name }}
          <v-btn @click="select(item)" small class="ml-2">Выбрать</v-btn>
          <v-btn @click="remove(item, index)" small class="ml-2">Удалить</v-btn>
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
  
        Для участника: {{ sessionParticipantUrl }}
      </router-link>
      <a @click="copyLinkForParticipant()" v-if="sessionParticipantUrl">Копировать</a>
      <br />
      <br />
      <router-link :to="sessionModeratorUrl" tag="span" style="cursor: pointer">
        Для модератора: {{ sessionModeratorUrl }}
      </router-link>
      <a @click="copyLinkForModerator()" v-if="sessionModeratorUrl">Копировать</a>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="generate()" color="#8A2BE2" dark>Generate Session</v-btn>
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
    fullSessionModeratorUrl() {
      return this.NEW_SESSION && this.NEW_SESSION.id
        ? `${window.location.href}/session/${this.NEW_SESSION.id}`
        : "";
    },
    fullSessionParticipantUrl() {
      return this.NEW_SESSION && this.NEW_SESSION.id
        ? `${window.location.href}/play/${this.NEW_SESSION.id}`
        : "";
    },
  },
  methods: {
    ...mapActions(["GET_QUIZ", "GENERATE_SESSION", "ARCHIVE_SESSION"]),
    ...mapMutations(["SET_NEW_SESSION"]),
    select(item) {
      this.SET_NEW_SESSION(item);
    },
    remove(item, index){
      this.ARCHIVE_SESSION({quizId: this.CURRENT_QUIZ.id, sessionId: item.id})
      this.CURRENT_QUIZ.sessions.splice(index, 1)
    },
    generate() {
      this.GENERATE_SESSION({
        quizId: this.CURRENT_QUIZ.id,
        sessionName: this.newSessionName,
      });
    },
    copyLinkForParticipant() {
      this.$copyText(`${this.fullSessionParticipantUrl}`); // место url наше название сайта
    },
    copyLinkForModerator() {
      this.$copyText(`${this.fullSessionModeratorUrl}`);
    },
  },
  created() {
    this.GET_QUIZ({ id: this.$route.params.id, withSessions: true });
  },
};
</script>