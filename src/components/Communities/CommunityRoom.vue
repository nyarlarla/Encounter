<template>
  <div>
    <TopNavi
    :title="community.communityTitle"
    :links="links"
    >
    </TopNavi>
    <v-row no-gutters>
      <SideNavi></SideNavi>
      <div class="d-md-block d-none">
        <Sidebar
        head="コミュニティのメンバー"
        :items="members"
        :linkTo="linkTo">
        </Sidebar>
      </div>
      <v-col class="overflow-y-auto maxHeight content">
        <v-container class="stickyWrapper">
          <v-list
          three-line
          color="transparent"
          v-for="(message,i) in messages"
          :key="i"
          >
            <v-list-item>
              <v-list-item-avatar>
                <img src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle>
                  {{message.userName}}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{message.message}}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  タイムスタンプを表示
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-container>
        <div class="contentFooter">
          <ChatNavi
          postType="community"
          collection="communityMessages"
          :userID="userID"
          :postedID="roomID"
          :membersID="membersID"
          :title="community.communityTitle"
          ></ChatNavi>
        </div>
      </v-col>
      <div class="d-lg-block d-none">
        <RightAside></RightAside>
      </div>
    </v-row>
  </div>
</template>

<script>
  import {auth} from "@/plugins/firebase.js";
  import {db} from "@/plugins/firebase.js";
  import Sidebar from "@/components/Layout/Sidebar";
  import TopNavi from "@/components/Layout/TopNavi";
  import SideNavi from "@/components/Layout/SideNavi";
  import RightAside from "@/components/Layout/RightAside";
  import ChatNavi from "@/components/Layout/ChatNavi";

  export default{
    name: "",
    components:{
      TopNavi,
      SideNavi,
      Sidebar,
      RightAside,
      ChatNavi,
    },
    data: () => {
      return{
        roomID: "",
        userID: "",
        room: {},
        community: {},
        messages: [],
        membersID: [],
        members:[],
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
      }
    },
    created(){
      auth.onAuthStateChanged((user) => {
        if(user){
          let members = []
          let messages = []
          let messageObj = {}

          this.userID = user.uid
          this.roomID = this.$route.params.id

          db.collection("communityRooms")
          .doc(this.roomID)
          .get()
          .then((doc) =>{
            this.room = Object.assign({id:doc.id},doc.data())
            db.collection("communities")
            .doc(doc.data().communityID)
            .get()
            .then((doc) => {
              this.community = Object.assign({id:doc.id},doc.data())
              this.membersID = this.community.membersID
              this.community.membersID.forEach((id) => {
                db.collection("users")
                .doc(id)
                .get()
                .then((member) => {
                  members.push(
                    Object.assign({id:member.id},member.data())
                  )
                })
                this.members = members
              })
            })
          })

          db.collection("communityMessages")
          .where("roomID", "==", this.roomID)
          .orderBy("createAt","desc")
          .onSnapshot((snap) => {
            snap.forEach((doc) => {
              messageObj = Object.assign({id:doc.id},doc.data())
              messageObj.userName = ""
              messages.push(messageObj)
            })
            messages.forEach((message) => {
              db.collection("users")
              .doc(message.userID)
              .get()
              .then((userDoc) => {
                message.userName = userDoc.data().name
              })
            })
            this.messages = messages
            messages = [];
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
      }
    }
  };
</script>

<style>
.content{
  background-color:#616161;
}
</style>