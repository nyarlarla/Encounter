<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        icon
        dark
        v-bind="attrs"
        v-on="on"
        >
          <v-icon>mdi-tune</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar
          dark
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-tune</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-responsive
          class="overflow-y-auto"
          max-height="40vh"
          >
            <v-subheader>{{voiceChat}}</v-subheader>
            <v-text-field
            v-model="keyword"
            color="purple darken-2"
            label="タイトルで検索"
            >
            </v-text-field>
          </v-responsive>

          <v-divider></v-divider>

          <v-row>
            <v-col
            cols="12"
            v-for="(voiceChat) in voiceChats"
            :key="voiceChat.id"
            class="my-3"
            >
              <v-sheet
              hover
              color="transparent"
              @click="voiceChatPick(voiceChat.title)"
              >
                <v-row>
                  <v-col
                  cols="12"
                  sm="5"
                  >
                    <v-card>
                      <v-img
                      :src="voiceChat.thumbnailUrl"
                      >
                      </v-img>
                    </v-card>
                  </v-col>
                  <v-col
                  cols="12"
                  sm="6"
                  >
                    <v-row no-gutters>
                      <v-col cols="auto">
                        <v-card-title>
                          {{voiceChat.title}}
                        </v-card-title>
                        <v-card-subtitle>
                        サブタイトル
                        </v-card-subtitle>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-sheet>
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import {db} from "@/plugins/firebase.js"
  import {storage} from "@/plugins/firebase.js";

  export default {
    data () {
      return {
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        keyword:"",
        voiceChat:"",
        voiceChats:[],
      }
    },
    created(){
      let voiceChats = []
      db.collection("voicechats")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          let voiceChat = Object.assign({id:doc.id},doc.data())
          if(voiceChat.thumbnail === ""){
            storage
            .ref()
            .child("thumbnail/default.png")
            .getDownloadURL()
            .then((url) => {
              voiceChat.thumbnailUrl = url
              voiceChats.push(voiceChat)
            })
          }else{
            storage
            .ref()
            .child(voiceChat.thumbnail)
            .getDownloadURL()
            .then((url) => {
              voiceChat.thumbnailUrl = url
              voiceChats.push(voiceChat)
            })
          }
        })
        this.voiceChats = voiceChats
      })
    },
    methods:{
      voiceChatPick:function(voiceChat){
        this.voiceChat = voiceChat
        this.$emit("voiceChatPick",this.voiceChat)
        this.dialog = false
      }
    },
    computed:{
      filtervoiceChats:function(){
        let voiceChats = []
        let filteredVoiceChats = []
        for(let i in voiceChats){
          let voiceChat = voiceChats[i]

          if(voiceChat.title.indexOf(this.keyword) !== -1){
            filteredVoiceChats.push(voiceChat)
          }
        }
        return filteredVoiceChats
      }
    }
  };
</script>