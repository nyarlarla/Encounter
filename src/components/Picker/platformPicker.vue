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
            <v-subheader>{{platform}}</v-subheader>
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
            v-for="(platform) in platforms"
            :key="platform.id"
            class="my-3"
            >
              <v-sheet
              hover
              color="transparent"
              @click="platformPick(platform.title)"
              >
                <v-row>
                  <v-col
                  cols="12"
                  sm="5"
                  >
                    <v-card>
                      <v-img
                      :src="platform.thumbnailUrl"
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
                          {{platform.title}}
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
        platform:"",
        platforms:[],
      }
    },
    created(){
      let platforms = []
      db.collection("platforms")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          let platform = Object.assign({id:doc.id},doc.data())
          if(platform.thumbnail === ""){
            storage
            .ref()
            .child("thumbnail/default.png")
            .getDownloadURL()
            .then((url) => {
              platform.thumbnailUrl = url
              platforms.push(platform)
            })
          }else{
            storage
            .ref()
            .child(platform.thumbnail)
            .getDownloadURL()
            .then((url) => {
              platform.thumbnailUrl = url
              platforms.push(platform)
            })
          }
        })
        this.platforms = platforms
      })
    },
    methods:{
      platformPick:function(platform){
        this.platform = platform
        this.$emit("platformPick",this.platform)
        this.dialog = false
      }
    },
    computed:{
      filterPlatforms:function(){
        let platforms = []
        let filteredPlatforms = []
        for(let i in platforms){
          let platform = platforms[i]

          if(platforms.title.indexOf(this.keyword) !== -1){
            filteredPlatforms.push(platform)
          }
        }
        return filteredPlatforms
      }
    }
  };
</script>