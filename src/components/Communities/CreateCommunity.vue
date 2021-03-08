<template>
  <v-sheet
  color="transparent"
  >
    <v-card-title>
      <span class="headline">コミュニティ募集</span>
    </v-card-title>
      <v-container>
        <v-card dark>
        <v-row
        justify="center"
        align-content="center"
        >
          <v-col
            cols="6"
            class="pa-10"
          >
            <v-card>
              <v-img
              :src="thumbnail"
              >
              </v-img>
            </v-card>
          </v-col>
          <v-col
            cols="6"
            class="pt-11"
          >
            <v-btn
            dark
            >
              サムネイルをアップロード
            </v-btn>
          </v-col>
        </v-row>
        <v-card class="ma-10">
          <v-row>
            <v-col
              cols="10"
            >
              <v-card-subtitle>タイトル</v-card-subtitle>
              <v-card-text>{{title}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <CreateCommunityDialog
              title="このコミュニティの名前を設定"
              subtitle="募集するコミュニティの名前を設定してください"
              label="コミュニティの名前"
              data="title"
              @getValue="getValue">
              </CreateCommunityDialog>
            </v-col>
            <v-col
              cols="10"
            >
              <v-card-subtitle>本文</v-card-subtitle>
              <v-card-text>{{text}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <CreateCommunityDialog
              title="このコミュニティの募集文を設定"
              subtitle="募集するコミュニティの募集文を設定してください"
              label="募集文"
              data="text"
              @getValue="getValue">
              </CreateCommunityDialog>
            </v-col>
            <v-col
              cols="6"
            >
              <v-checkbox
                v-model="inviteOnly"
                label="このコミュニティを公開する"
                append-icon
              >
              </v-checkbox>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            >
              キャンセル
            </v-btn>
            <v-btn
              @click="createCommunity"
            >
              コミュニティを作成する
           </v-btn>
        </v-card-actions>
        </v-card>
      </v-card>
    </v-container>
  </v-sheet>
</template>

<script>
import {db} from "@/plugins/firebase";
import {auth} from "@/plugins/firebase";
import {storage} from "@/plugins/firebase.js";
import CreateCommunityDialog from "@/components/Communities/CreateCommunityDialog"

  export default {
    data () {
      return {
        userID: "",
        thumbnail: "",
        title: "",
        text: "",
        inviteOnly:false,
        dialog: false,
      }
    },
    components:{
      CreateCommunityDialog,
    },
    created(){
      auth.onAuthStateChanged((user) => {
        if(user){
          this.userID = user.uid
        }else{
          console.log("ログインしていません")
        }
      })
      storage
      .ref()
      .child("thumbnail/default.png")
      .getDownloadURL()
      .then((url) => {
        this.thumbnail = url
      })
    },
    methods:{
      createCommunity:function(){
      db.collection("communities")
      .add({
        title: this.title,
        ownerID: this.userID,
        membersID: [this.userID],
      })
      .then((doc) =>{
          db.collection("communityRooms")
          .add({
            communitiyID: doc.id,
            roomTitle: "デフォルトルーム",
          })
        })
      this.dialog = false
      },
      getValue:function(...values){
        let data = values[0]
        this.[data] = values[1]
      },
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