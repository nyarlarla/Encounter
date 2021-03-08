<template>
	<div class="d-none d-md-block maxHeight">
		<v-navigation-drawer
		permanent
		dark
		mini-variant
		class="sideNavi"
		>
			<v-list-item class="px-2">
				<v-list-item-avatar>
					<v-img src='../../assets/logo.svg'></v-img>
				</v-list-item-avatar>
			</v-list-item>

			<v-divider></v-divider>
			<v-list-item class="px-2">
				<v-btn
				@click="linkTo('friends')"
        color="warning"
        fab
        dark
        small
				>
					<v-icon>mdi-account-heart</v-icon>
				</v-btn>
			</v-list-item>
			<v-list-item class="px-2">
				<v-btn
				@click="linkTo('/')"
        color="warning"
        fab
        dark
        small
				>
					<v-icon>mdi-account-multiple</v-icon>
				</v-btn>
			</v-list-item>
			<v-list-item class="px-2">
				<v-btn
				@click="linkTo('/communities')"
        color="warning"
        fab
        dark
        small
				>
					<v-icon>mdi-earth</v-icon>
				</v-btn>
			</v-list-item>
		</v-navigation-drawer>
	</div>
</template>

<script>

export default {
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
.sideNavi{
	background-color:#212121!important;
}
</style>
