<template>
  <v-sheet
  color="transparent"
  >
    <v-card-title>
      <span class="headline">パーティ募集</span>
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
              <v-card-subtitle>パーティのタイトル</v-card-subtitle>
              <v-card-text>{{title}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <CreatePartyDialog
              title="このパーティの名前を設定"
              subtitle="募集するパーティのタイトルを設定してください"
              label="パーティの名前"
              data="title"
              @getValue="getValue">
              </CreatePartyDialog>
            </v-col>
            <v-col
              cols="10"
            >
              <v-card-subtitle>募集文</v-card-subtitle>
              <v-card-text>{{text}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <CreatePartyDialog
              title="このパーティの募集文を設定してください"
              subtitle="募集するパーティの募集文を設定してください"
              label="募集文"
              data="text"
              @getValue="getValue">
              </CreatePartyDialog>
            </v-col>
            <v-col
              cols="10"
            >
              <v-card-subtitle>プラットフォーム</v-card-subtitle>
              <v-card-text>{{platform}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <PlatformPicker @platformPick="getPlatformValue"></PlatformPicker>
            </v-col>
            <v-col
              cols="10"
            >
              <v-card-subtitle>ゲーム</v-card-subtitle>
              <v-card-text>{{game}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <GamePicker @gamePick="getGameValue"></GamePicker>
            </v-col>
            <v-col
              cols="10"
            >
              <v-card-subtitle>ボイスチャット</v-card-subtitle>
              <v-card-text>{{voicechat}}</v-card-text>
            </v-col>
            <v-col
              cols="2"
            >
              <VoiceChatPicker @voiceChatPick="getVoiceChatValue"></VoiceChatPicker>
            </v-col>
            <v-col
              cols="6"
            >
              <v-checkbox
                v-model="inviteOnly"
                label="このパーティを公開する"
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
              @click="createParty"
            >
              パーティを作成する
           </v-btn>
        </v-card-actions>
        </v-card>
      </v-card>
    </v-container>
  </v-sheet>
</template>

<script>
import {db} from "@/plugins/firebase";
import {storage} from "@/plugins/firebase.js";
import CreatePartyDialog from "@/components/Partys/CreatePartyDialog"
import GamePicker from "@/components/Picker/gamePicker"
import PlatformPicker from "@/components/Picker/platformPicker"
import VoiceChatPicker from "@/components/Picker/voiceChatPicker"

  export default {
    components:{
      GamePicker,
      PlatformPicker,
      VoiceChatPicker,
      CreatePartyDialog,
    },
    data () {
      return {
        thumbnail: "",
        title: "",
        game: "",
        platform: "",
        voicechat: "",
        text: "",
        memberLimit: "",
        value:"",
        inviteOnly: false,
        dialog: false,
      }
    },
    created(){
      storage
      .ref()
      .child("thumbnail/default.png")
      .getDownloadURL()
      .then((url) => {
        this.thumbnail = url
      })
    },
    methods:{
      createParty:function(){
      db.collection("partys")
      .add({
        title: this.title,
        game: this.game,
        platform: this.platform,
        voicechat: this.voicechat,
        text: this.text,
        memberLimit: this.memberLimit,
        inviteOnly: this.inviteOnly,
      })
      .then(console.log("成功"))
      },
      getGameValue:function(game){
        this.game = game
      },
      getPlatformValue:function(platform){
        this.platform = platform
      },
      getVoiceChatValue:function(voicechat){
        this.voicechat = voicechat
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