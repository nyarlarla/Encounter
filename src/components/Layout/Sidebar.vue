<template>
	<v-navigation-drawer
	permanent
	outlined
	width="300"
	class="maxHeight overflow-y-auto sidebar"
	>
	<v-list
		dark
	>
      <v-list-group
        :value="true"
        prepend-icon="mdi-account-star"
      >
        <template v-slot:activator>
          <v-list-item-title>{{head}}</v-list-item-title>
        </template>
          <v-list-item
            v-for="item in items"
						:key="item.id"
          >
            <v-list-item-avatar>
							<v-img :src="item.iconUrl"></v-img>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title v-text="item.name"></v-list-item-title>
						</v-list-item-content>
						<v-list-item-action>
							<v-btn
							icon
							@click="linkTo('chat',item.id)"
							>
								<v-icon>mdi-message-outline</v-icon>
							</v-btn>
						</v-list-item-action>
						<v-list-item-action>
							<v-icon>mdi-dots-vertical</v-icon>
						</v-list-item-action>
					</v-list-item>
      </v-list-group>
    </v-list>
    <template v-slot:append>
     <v-list-item>
				<v-list-item-avatar>
					<v-img :src="user.iconUrl"></v-img>
				</v-list-item-avatar>

				<v-list-item-content>
					<v-list-item-title v-text="user.name"></v-list-item-title>
				</v-list-item-content>
				<v-list-item-action>
					<v-btn icon>
						<v-icon>mdi-message-outline</v-icon>
					</v-btn>
				</v-list-item-action>
				<v-list-item-action>
					<v-icon>mdi-dots-vertical</v-icon>
				</v-list-item-action>
			</v-list-item>
    </template>
	</v-navigation-drawer>
</template>

<script>
export default {
	props:{
		userID:{
			defaulet:"",
			required:false,
		},
		user:{
			defaulet:"",
			required:false,
		},
		head:{
			defaulet:"",
			required:false,
		},
		items:{
			default:"",
			required:false,
		},
		linkTo:Function,
	},
	data () {
	return {
		}
	},
};
</script>

<style>
.sidebar{
	background-color:#424242!important;
}
</style>