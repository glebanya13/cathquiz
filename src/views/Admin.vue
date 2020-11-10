<template>
  <v-container fluid>
    <v-layout column>
      <v-btn to="/quizlist">Создать квиз</v-btn>
      <v-card>
        <v-list>
          <v-list-item v-for="item in QUIZ_LIST" :key="item.title + item.id">
            <v-row>
              <v-col cols="8">{{item.title}}</v-col>
              <v-col cols="2"><v-btn @click="select(item)">Select</v-btn></v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  computed:{
    ...mapGetters(['QUIZ_LIST'])
  },
  methods:{
    ...mapActions(['LOAD_QUIZZES']),
    select(item){
      if(item && item.id){

        this.$router.push(`/quiz/${item.id}`);
      }
    }
  },
  created(){
    this.LOAD_QUIZZES()
  }
};
</script>

<style>
</style>