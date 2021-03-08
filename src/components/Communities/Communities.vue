<template>
  <div>
    <TopNavi
    :title="changeTitle"
    :links="links"
    :tabItems="tabItems"
    @tabs="getTabsValue"
    >
    </TopNavi>
    <v-row no-gutters>
      <SideNavi></SideNavi>
      <div class="d-md-block d-none">
        <Sidebar
        head="フレンド"
        :items="friends"
        :user="user"
        :linkTo="linkTo"
        >
        </Sidebar>
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
                v-for="(community) in myCommunities"
                :key="community.id"
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
                          :src="community.thumbnailUrl"
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
                              {{community.title}}
                            </v-card-title>
                            <v-card-subtitle>
                            サブタイトル
                            </v-card-subtitle>
                          </v-col>
                          <v-spacer></v-spacer>
                          <v-col cols="2">
                            <v-card-actions>
                              <v-btn
                              color="orange"
                              text
                              @click="linkTo('community',community.id)"
                              >
                              確認する
                              </v-btn>
                            </v-card-actions>
                          </v-col>
                          <v-col cols="12">
                            <v-card-text class="text-truncate">
                              {{community.text}}
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
              <v-row>
                <v-col
                cols="12"
                v-for="(community) in communities"
                :key="community.id"
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
                          :src="community.thumbnailUrl"
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
                              {{community.title}}
                            </v-card-title>
                            <v-card-subtitle>
                            ゲーム/{{community.game}}
                            </v-card-subtitle>
                          </v-col>
                          <v-spacer></v-spacer>
                          <v-col cols="2">
                            <v-card-actions>
                              <v-btn
                              color="orange"
                              text
                              @click="linkTo('community',community.id)"
                              >
                              確認する
                              </v-btn>
                            </v-card-actions>
                          </v-col>
                          <v-col cols="12">
                            <v-card-text class="text-truncate">
                              {{community.text}}
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
              <CreateCommunity></CreateCommunity>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
        <BottomNavi></BottomNavi>
      </v-col>
      <div
      v-if="RightAsideIsShow"
      class="d-lg-block d-none"
      >
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
  import CreateCommunity from "@/components/Communities/CreateCommunity";

  export default{
    name: "",
    components:{
      TopNavi,
      SideNavi,
      Sidebar,
      RightAside,
      BottomNavi,
      CreateCommunity,
    },
    data: () => {
      return{
        userID: "",
        title:"コミュニティ一覧",
        links:{
          link1:{
            title:"所属しているコミュニティ",
            path:'/myCommunities',
          },
          link2:{
            title:"募集されているコミュニティ",
            path:'/communities',
          }
        },
        user:{},
        myCommunities:[],
        communities:[],
        friends: [],
        tabItems:[
        "所属しているコミュニティ",
        "募集されているコミュニティ",
        "コミュニティを作成する"
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

          let myCommunities = []
          db.collection("communities")
          .where("inviteOnly", "==", false)
          .get()
          .then((snap) =>{
            snap.forEach((doc) =>{
              let community = Object.assign({id:doc.id},doc.data())
              if(community.thumbnail === ""){
                storage
                .ref()
                .child("thumbnail/default.png")
                .getDownloadURL()
                .then((url) => {
                  community.thumbnailUrl = url
                  myCommunities.push(community)
                })
              }else{
                storage
                .ref()
                .child(community.thumbnail)
                .getDownloadURL()
                .then((url) => {
                  community.thumbnailUrl = url
                  myCommunities.push(community)
                })
              }
            })
            this.myCommunities = myCommunities
          })

          let communities = []
          db.collection("communities")
          .where("membersID","array-contains",user.uid)
          .get()
          .then((snap) =>{
            snap.forEach((doc) =>{
              let community = Object.assign({id:doc.id},doc.data())
              if(community.thumbnail === ""){
                storage
                .ref()
                .child("thumbnail/default.png")
                .getDownloadURL()
                .then((url) => {
                  community.thumbnailUrl = url
                  communities.push(community)
                })
              }else{
                storage
                .ref()
                .child(community.thumbnail)
                .getDownloadURL()
                .then((url) => {
                  community.thumbnailUrl = url
                  communities.push(community)
                })
              }
            })
            this.communities = communities
          })

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
      openCommunity:function(roomID){
        this.$router.push({name:'community', params:{id:roomID}})
      },
      getTabsValue:function(value){
      this.tabs = value
      },
    },
    computed:{
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
</style>