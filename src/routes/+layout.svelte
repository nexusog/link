<script lang="ts">
	import '../app.css'
	import DashboardLayout from '$lib/layouts/Dashboard.svelte'
	import { onMount } from 'svelte'
	import { isStoreHydrating } from '$lib/store'

	let { children } = $props()

	onMount(() => {
		setTimeout(() => {
			$isStoreHydrating = false
		}, 500)
	})
</script>

<main class="flex flex-grow flex-col">
	<DashboardLayout>
		{@render children()}
	</DashboardLayout>
</main>
