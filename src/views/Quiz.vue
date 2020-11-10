<template>
    <v-card>
        <v-card-title>
           Quiz: {{CURRENT_QUIZ.title}}
        </v-card-title>
        <v-card-text>
            Sessions
            <v-list>
                <v-list-item v-for="item in CURRENT_QUIZ.sessions" :key="item.id + item.name">
                    {{item.name}}
                </v-list-item>
            </v-list>
            <br>
             <v-text-field
                v-model="newSessionName"
                label="Новая сессия"
              ></v-text-field>
              {{newSessionUrl}}
        </v-card-text>
        <v-card-actions>
            <v-btn @click="generate()">Generate Session</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
    data(){
        return{
            newSessionName: ""
        }
    },
    computed:{
        ...mapGetters(['CURRENT_QUIZ', 'NEW_SESSION']),
        newSessionUrl(){
            return this.NEW_SESSION ? `${this.$route.fullPath}/${this.NEW_SESSION.id}` : '' 
        }
    },
    methods:{
        ...mapActions(['GET_QUIZ', 'GENERATE_SESSION']),
        generate(){
            this.GENERATE_SESSION({quizId: this.CURRENT_QUIZ.id, sessionName: this.newSessionName})
        }
    },
    created(){
        this.GET_QUIZ({id: this.$route.params.id, withSessions: true});
    }
}
</script>