<template>
	<v-navigation-drawer
	d-md-none
	permanent
	outlined
	width="250"
	class="rightAside overflow-y-auto"
	>
	</v-navigation-drawer>
</template>

<script>
export default {
	data () {
	return {
			items: [
				{ icon: 'mdi-view-dashboard' },
				{ icon: 'mdi-forum' }
			],
		}
	},
};
</script>

<style>
.rightAside{
	background-color:#424242!important;
}
</style>