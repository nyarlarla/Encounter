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
          <v-toolbar-title>フィルタ</v-toolbar-title>
          <v-btn
          dark
          @click="filterValue"
          >
          適応
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-responsive
          class="overflow-y-auto"
          max-height="40vh"
          >
            <v-row>
              <v-subheader>{{platform}}</v-subheader>

                <v-overflow-btn
                dense
                filled
                overflow
                v-model="platform"
                :items="platforms"
                ></v-overflow-btn>

              <v-subheader>{{voicechat}}</v-subheader>

              <v-overflow-btn
              dense
              filled
              overflow
              v-model="voicechat"
              :items="voicechats"
              ></v-overflow-btn>

            </v-row>

            <v-subheader>{{genre}}</v-subheader>

            <v-overflow-btn
            dense
            filled
            overflow
            v-model="genre"
            :items="genres"
            ></v-overflow-btn>

            <v-divider></v-divider>

            <v-subheader>{{game}}</v-subheader>
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
            v-for="(game) in filterGames"
            :key="game.id"
            class="my-3"
            >
              <v-sheet
              hover
              color="transparent"
              @click="gamePick(game.game)"
              >
                <v-row>
                  <v-col
                  cols="12"
                  sm="5"
                  >
                    <v-card>
                      <v-img
                      :src="game.thumbnailUrl"
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
                          {{game.game}}
                        </v-card-title>
                        <v-card-subtitle>
                        ゲーム/{{game.genre}}
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
        game: "",
        games:[],
        genre: "",
        genres: [],
        platform: "",
        platforms: [],
        voicechat: "",
        voicechats: [],
      }
    },
    created(){
      db.collection("categories")
      .doc("M1GJmriCszYUWrGQy3Qg")
      .get()
      .then((doc) => {
        this.genres = doc.data().genre
        this.platforms = doc.data().platform
        this.voicechats = doc.data().voicechat
      })

      let games = []
      db.collection("games")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          let game = Object.assign({id:doc.id},doc.data())
          if(game.thumbnail === ""){
            storage
            .ref()
            .child("thumbnail/default.png")
            .getDownloadURL()
            .then((url) => {
              game.thumbnailUrl = url
              games.push(game)
            })
          }else{
            storage
            .ref()
            .child(game.thumbnail)
            .getDownloadURL()
            .then((url) => {
              game.thumbnailUrl = url
              games.push(game)
            })
          }
        })
        this.games = games
      })
    },
    methods:{
      selectGame:function(game){
        this.game = game
      },
      filterValue:function(){
        this.$emit("filter",this.game,this.platform,this.voicechat)
        this.dialog = false
      }
    },
    computed:{
      filterGames:function(){
        let games = []
        for(let i in this.games){
          let game = this.games[i]

          if(game.game.indexOf(this.keyword) !== -1){
            games.push(game)
          }
        }
        return games
      }
    }
  };
</script>