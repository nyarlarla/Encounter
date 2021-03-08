<template>
  <v-sheet
  color="transparent"
  >
    <v-card-title>
      <span class="headline">プロフィール編集</span>
    </v-card-title>
    <v-container>
      <v-card dark>
        <v-row
        justify="center"
        align-content="center"
        >
          <v-col
            cols="3"
            sm="2"
            class="pl-5"
          >
            <v-avatar color="orange" size="100">
              <img :src="currentUser.iconUrl">
            </v-avatar>
          </v-col>
          <v-col
            cols="5"
            class="pt-7"
          >
            <v-card-title>{{currentUser.name}}</v-card-title>
          </v-col>
          <v-col
            cols="4"
            class="pt-11"
          >
            <v-btn
            dark
            >
              アイコンをアップロード
            </v-btn>
          </v-col>
        </v-row>
        <v-card class="ma-10">
          <v-row>
            <v-col
              cols="10"
            >
              <v-card-subtitle>ユーザー名</v-card-subtitle>
              <v-card-text>{{currentUser.name}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <EditDialog
              title="ユーザー名を編集"
              subtitle="新しいユーザー名を入力してください"
              label="新しいユーザー名"
              field="name"
              :value="currentUser.name"
              :userID="currentUser.id">
              </EditDialog>
            </v-col>
            <v-col
              cols="10"
            >
              <v-card-subtitle>フリースペース</v-card-subtitle>
              <v-card-text>{{currentUser.introduce}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <EditDialog
              title="自己紹介文を編集"
              subtitle="新しい自己紹介文を入力してください"
              label="新しい自己紹介文"
              field="name"
              :value="currentUser.introduce"
              :userID="currentUser.id">
              </EditDialog>
            </v-col>
            <v-col
              cols="10"
            >
              <v-card-subtitle>よく遊ぶ時間帯</v-card-subtitle>
              <v-card-text>{{currentUser.playTime}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <EditDialog
              title="普段はいつ頃ゲームをしていますか？"
              subtitle="普段プレイする時間帯"
              label="新しい普段プレイする時間帯"
              field="name"
              :value="currentUser.playTime"
              :userID="currentUser.id">
              </EditDialog>
            </v-col>
            <v-col
              cols="10"
            >
              <v-card-subtitle>よく遊ぶゲーム</v-card-subtitle>
              <v-card-text>{{currentUser.games}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <EditDialog
              title="どんなゲームをプレイしますか？"
              subtitle="普段プレイしているゲーム"
              label="普段プレイしているゲーム"
              field="name"
              :value="currentUser.games"
              :userID="currentUser.id">
              </EditDialog>
            </v-col>
            <v-col
              cols="6"
            >
              <v-checkbox
                v-model="currentUser.request"
                label="フレンドを募集"
                append-icon
              >
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </v-container>
  </v-sheet>
</template>

<script>
import {auth} from "@/plugins/firebase.js";
import {db} from "@/plugins/firebase.js";
import {storage} from "@/plugins/firebase.js";
import EditDialog from "@/components/Users/EditDialog";

  export default {

    data () {
      return {
        currentUser: {},
      }
    },
    components:{
      EditDialog,
    },
    created(){
      auth.onAuthStateChanged((user) => {
        if(user){

          db.collection("users")
          .doc(user.uid)
          .onSnapshot((doc) => {
            let currentUser = Object.assign({id:doc.id},doc.data())
            if(currentUser.icon === ""){
              storage
              .ref()
              .child("users/default.png")
              .getDownloadURL()
              .then((url) => {
                currentUser.iconUrl = url
              })
            }else{
              storage
              .ref()
              .child(currentUser.icon)
              .getDownloadURL()
              .then((url) => {
                currentUser.iconUrl = url
              })
            }
            this.currentUser = currentUser
          })

        }else{
          console.log("ログインしていません")
        }
      })
    },
    methods:{
    }
  };
</script>

<style>
.typewriterBox {
  width: 100%;
  margin: 0 auto;
  color: #FFF;
  border: 2px solid #000;
  border-radius: 5px;
  box-shadow: 0 0 0 4px #FFF inset;
  background-color: rgba(0,0,0,0.9);
}

@keyframes typing { from { width: 0; } }
@keyframes blink-car { 50% { border-color: transparent; } }
.typewriterText{
  border-right: 5px solid;
  width: 20em;
  margin: 2%;
  white-space: nowrap;
  overflow: hidden;
  animation: typing 2s steps(32, end),
    blink-car 1s infinite ease;
}
</style>