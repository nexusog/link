<script lang="ts">
	import '../app.css'
	import DashboardLayout from '$lib/layouts/Dashboard.svelte'
	import { onMount } from 'svelte'
	import {
		activeWorkspace,
		activeWorkspaceId,
		isStoreHydrating,
		workspaces,
	} from '$lib/store'
	import { Toaster } from '$lib/components/ui/sonner'
	import { isWorkspaceValid } from '$lib/utils/isWorkspaceValid'

	let { children } = $props()

	onMount(() => {
		setTimeout(async () => {
			$isStoreHydrating = false
		}, 500)
	})
</script>

<Toaster closeButton={true} richColors={true} />

<main class="flex flex-grow flex-col">
	<DashboardLayout>
		{@render children()}
	</DashboardLayout>
</main>
