<template>
  <v-card>
    <v-card-title>Создание квиза</v-card-title>
    <v-card-text>
      <!-- dialog with data -->
      <v-icon @click="addQuestions()">add</v-icon>
      <div v-for="question in questions" :key="question.id">
        <h2>{{ question }}</h2>
        <v-icon @click="deleteQuestion(question)">delete</v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    deleteQuestion(question) {
      this.questions.splice(question.id);
      //   надо доработать мне удаление
    },
    addQuestions() {
      this.questions.push({
        id: 1 + Math.max(0, ...this.questions.map((n) => n.id)),
        data: {
          type: "default",
          question: "Вопрос",
        },
      });
    },
  },
};
</script>

<style>
</style>