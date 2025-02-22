<script lang="ts">
	import '../app.css'
	import DashboardLayout from '$lib/layouts/Dashboard.svelte'
	import { onMount } from 'svelte'
	import { activeWorkspaceId, isStoreHydrating, workspaces } from '$lib/store'
	import { Toaster } from '$lib/components/ui/sonner'

	let { children } = $props()

	onMount(() => {
		setTimeout(() => {
			if ($workspaces.length > 0 && $activeWorkspaceId === null) {
				$activeWorkspaceId = $workspaces[0].id
			}

			$isStoreHydrating = false
		}, 1000)
	})
</script>

<Toaster closeButton={true} richColors={true} />

<main class="flex flex-grow flex-col">
	<DashboardLayout>
		{@render children()}
	</DashboardLayout>
</main>
