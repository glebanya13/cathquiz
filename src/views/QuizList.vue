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
            <v-stepper-step :complete="step > 1" step="1">
              Имя и время
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 2" step="2">
              Вопросы
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3"> Проверить </v-stepper-step>
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
              <v-btn color="primary" @click="step = 2"> Continue </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="step = 3"> Continue </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn color="primary" @click="step = 1"> Continue </v-btn>

              <v-btn text> Cancel </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="addOrUpdate()">Добавить</v-btn>
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
      currentQuiz: {}
    };
  },
  computed: {
    ...mapGetters(["QUIZ_LIST"]),
  },
  methods: {
    ...mapActions(["LOAD_QUIZZES"]),
    addOrUpdate(item) {
      console.log(item);
      this.currentQuiz = item ? item : {}
      this.editMode = true;
    },
  },
  created() {
    this.LOAD_QUIZZES();
  },
};
</script>

<style scoped>
</style>