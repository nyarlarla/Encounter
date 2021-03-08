<template>
  <div>
    <TopNavi
    :title=changeTitle
    :links="links"
    :tabItems="tabItems"
    @tabs="getTabsValue"
    >
    </TopNavi>
    <v-row no-gutters>
      <SideNavi></SideNavi>
      <div class="d-md-block d-none">
        <Sidebar head="フレンド" :items="friends" :user="user" :linkTo="linkTo"></Sidebar>
      </div>
      <v-col class="overflow-y-auto maxHeight content">
        <v-container>
          <v-tabs-items
          v-model="tabs"
          class="transparent"
          >
            <v-tab-item>
              <v-row>
                <v-col
                cols="12"
                v-for="(party) in myPartys"
                :key="party.id"
                class="my-3"
                >
                  <v-sheet
                  dark
                  hover
                  color="transparent"
                  >
                    <v-row>
                      <v-col
                      cols="12"
                      sm="5"
                      >
                        <v-card>
                          <v-img
                          :src="party.thumbnailUrl"
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
                            <v-card-title
                            class="headline card-title"
                            >
                              {{party.title}}
                            </v-card-title>
                            <v-card-subtitle>
                            ゲーム/{{party.game}}
                            </v-card-subtitle>
                          </v-col>
                          <v-spacer></v-spacer>
                          <v-col cols="2">
                            <v-card-actions>
                              <v-btn
                              color="orange"
                              text
                              @click="linkTo('party',party.id)"
                              >
                              確認する
                              </v-btn>
                            </v-card-actions>
                          </v-col>
                          <v-col cols="12">
                            <v-card-text class="text-truncate">
                              {{party.text}}
                            </v-card-text>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-sheet>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-btn
              icon
              >
              <PartyFilter @filter="getFilterValue"></PartyFilter>
              </v-btn>
              <v-divider></v-divider>
              <v-row>
                <v-col
                cols="12"
                v-for="(party) in fileterdPartys"
                :key="party.id"
                class="my-3"
                >
                  <v-sheet
                  dark
                  hover
                  color="transparent"
                  >
                    <v-row>
                      <v-col
                      cols="12"
                      sm="5"
                      >
                        <v-card>
                          <v-img
                          :src="party.thumbnailUrl"
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
                            <v-card-title
                            class="headline card-title"
                            >
                              {{party.title}}
                            </v-card-title>
                            <v-card-subtitle>
                            ゲーム/{{party.game}}
                            </v-card-subtitle>
                          </v-col>
                          <v-spacer></v-spacer>
                          <v-col cols="2">
                            <v-card-actions>
                              <v-btn
                              color="orange"
                              text
                              @click="linkTo('party',party.id)"
                              >
                              確認する
                              </v-btn>
                            </v-card-actions>
                          </v-col>
                          <v-col cols="12">
                            <v-card-text class="text-truncate">
                              {{party.text}}
                            </v-card-text>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-sheet>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <CreateParty></CreateParty>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
        <BottomNavi></BottomNavi>
      </v-col>
      <div
      v-if="RightAsideIsShow"
      class="d-lg-block d-none">
        <RightAside></RightAside>
      </div>
    </v-row>
  </div>
</template>

<script>
  import {auth} from "@/plugins/firebase.js";
  import {db} from "@/plugins/firebase.js";
  import {storage} from "@/plugins/firebase.js";
  import Sidebar from "@/components/Layout/Sidebar";
  import TopNavi from "@/components/Layout/TopNavi";
  import SideNavi from "@/components/Layout/SideNavi";
  import RightAside from "@/components/Layout/RightAside";
  import BottomNavi from "@/components/Layout/BottomNavi";
  import PartyFilter from "@/components/Partys/PartyFilter";
  import CreateParty from "@/components/Partys/CreateParty";

  export default{
    name: "",
    components:{
      TopNavi,
      SideNavi,
      Sidebar,
      RightAside,
      BottomNavi,
      PartyFilter,
      CreateParty,
    },
    data: () => {
      return{
        userID: "",
        game:"",
        platform: "",
        voicechat: "",
        title:"",
        user:{},
        links:{
          link1:{
            title:"所属しているパーティ",
            path:'/',
          },
          link2:{
            title:"募集されているパーティ",
            path:'/partys',
          }
        },
        myPartys:[],
        partys:[],
        friends:[],
        tabItems:[
        "所属しているパーティ",
        "募集されているパーティ",
        "パーティを作成する"
        ],
        tabs:0
      }
    },
    created(){
      auth.onAuthStateChanged((user) => {
        if(user){
          this.userID = user.uid
          db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            let user = Object.assign({id:doc.id},doc.data())
            if(user.icon === ""){
              storage
              .ref()
              .child("users/default.png")
              .getDownloadURL()
              .then((url) => {
                user.iconUrl = url
              })
            }else{
              storage
              .ref()
              .child(user.icon)
              .getDownloadURL()
              .then((url) => {
                user.iconUrl = url
              })
            }
            this.user = user
          })

          // 自分が所属しているパーティー情報の取得
          let myPartys = []
          db.collection("partys")
          .where("membersID", "array-contains", user.uid)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              let party = Object.assign({id:doc.id},doc.data())
              if(party.thumbnail === ""){
                storage
                .ref()
                .child("thumbnail/default.png")
                .getDownloadURL()
                .then((url) => {
                  party.thumbnailUrl = url
                  myPartys.push(party)
                })
              }else{
                storage
                .ref()
                .child(party.thumbnail)
                .getDownloadURL()
                .then((url) => {
                  party.thumbnailUrl = url
                  myPartys.push(party)
                })
              }
            })
            this.myPartys = myPartys
          });

          // 募集されているパーティー情報の取得
          let partys = []
          db.collection("partys")
          .where("inviteOnly", "==", false)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              let party = Object.assign({id:doc.id},doc.data())
              if(party.thumbnail === ""){
                storage
                .ref()
                .child("thumbnail/default.png")
                .getDownloadURL()
                .then((url) => {
                  party.thumbnailUrl = url
                  partys.push(party)
                })
              }else{
                storage
                .ref()
                .child(party.thumbnail)
                .getDownloadURL()
                .then((url) => {
                  party.thumbnailUrl = url
                  partys.push(party)
                })
              }
            })
            this.partys = partys
          });

          // フレンドデータの取得
          let friendsID = []
          let friends = []
          db.collection("friends")
          .where("userID", "==", user.uid)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              friendsID.push(doc.data().friendID)
            })
            friendsID.forEach((id) => {
              db.collection("users")
              .doc(id)
              .get()
              .then((doc) => {
                let friend = Object.assign({id:doc.id},doc.data())
                if(friend.icon === ""){
                  storage
                  .ref()
                  .child("users/default.png")
                  .getDownloadURL()
                  .then((url) => {
                    console.log(url)
                    friend.iconUrl = url
                    friends.push(friend)
                  })
                }else{
                  storage
                  .ref()
                  .child(friend.icon)
                  .getDownloadURL()
                  .then((url) => {
                    friend.iconUrl = url
                    friends.push(friend)
                  })
                }
              })
              this.friends = friends
            })
          })
        }else{
          console.log("ログインしていません")
        }
      })
    },
    methods:{
    linkTo:function(path,id){
        if(!id){
          this.$router.push(path)
          .catch(err => {
            console.log(err)
          })
        }else{
          this.$router.push({name: path, params:{id:id}})
          .catch(err => {
            console.log(err)
          })
        }
      },
      getTabsValue:function(value){
      this.tabs = value
      },
      getFilterValue:function(...arg){
        this.game = arg[0]
        this.platform = arg[1]
        this.voicechat = arg[2]
      }
    },
    computed:{
      fileterdPartys:function(){
        let fileterdGames = [];
        let fileterdPlatform = [];
        let fileterdPartys = [];
        for(let i in this.partys){

          let party = this.partys[i]

          if(party.game.indexOf(this.game) !== -1){
            fileterdGames.push(party)
          }
        }
        for(let i in fileterdGames){

          let party = fileterdGames[i]

          if(party.platform.indexOf(this.platform) !== -1){
            fileterdPlatform.push(party)
          }
        }
        for(let i in fileterdPlatform){

          let party = fileterdPlatform[i]

          if(party.platform.indexOf(this.platform) !== -1){
            fileterdPartys.push(party)
          }
        }
        return fileterdPartys
      },
      changeTitle:function(){
        let title = ""
        if(this.tabs === 0){
          title = "フレンド"
        }else if(this.tabs === 1){
          title = "ユーザーを探す"
        }else if(this.tabs ===2){
          title = "プロフィールを編集"
        }
        return title
      },
      RightAsideIsShow:function(){
        if(this.tabs === 1){
          return true
        }else{
          return false
        }
      }
    }
  };
</script>

<style>
.content{
  background-color:#616161;
}

.transparent {
  background-color: transparent !important;
}
</style>