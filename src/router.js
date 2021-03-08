import Vue from 'vue';
import VueRouter from 'vue-router';
import Signup from "@/components/Auth/Signup.vue";
import Signin from "@/components/Auth/Signin.vue";
import Party from "@/components/Partys/PartyChat.vue";
import Partys from "@/components/Partys/Partys.vue";
import CreateParty from "@/components/Partys/CreateParty.vue";
import Communities from "@/components/Communities/Communities.vue";
import MyCommunities from "@/components/Communities/MyCommunities.vue";
import CommunityRoom from "@/components/Communities/CommunityRoom.vue";
import ChatRoom from "@/components/Users/ChatRoom.vue";
import Friends from "@/components/Users/Friends.vue";
Vue.use(VueRouter)

const routes = [
	{ path: '/signup', name:"signup", component: Signup},
    { path: '/signin', name:"signin", component: Signin},
    { path: '/', name:"partys", component: Partys },
    { path: '/party/:id', name:"party", component: Party},
    { path: '/partys', name:"partys", component: Partys},
    { path: '/createParty', name:"createParty", component: CreateParty},
    { path: '/communities', name:'communities', component: Communities},
    { path: '/myCommunities', name:'myCommunities', component: MyCommunities},
    { path: '/community/:id', name:'community', component: CommunityRoom},
    { path: '/chatRoom/:id', name:'chat', component: ChatRoom},
    { path: '/friends', name:'friends', component: Friends},
]

const router = new VueRouter({
    routes: routes
})

export default router