<script lang="ts">
	import '../app.css'
	import DashboardLayout from '$lib/layouts/Dashboard.svelte'
	import { onMount } from 'svelte'
	import {
		activeWorkspace,
		activeWorkspaceId,
		hasNoWorkspaces,
		isStoreHydrating,
		workspaces,
	} from '$lib/store'
	import { Toaster } from '$lib/components/ui/sonner'
	import { isWorkspaceValid } from '$lib/utils/isWorkspaceValid'
	import OnBoardingLayout from '$lib/layouts/OnBoarding.svelte'
	import { Loader2 } from 'lucide-svelte'

	let { children } = $props()

	onMount(() => {
		setTimeout(async () => {
			$isStoreHydrating = false
		}, 500)
	})
</script>

<Toaster closeButton={true} richColors={true} />

<main class="flex flex-grow flex-col">
	{#if $isStoreHydrating === true}
		<div class="flex flex-grow flex-col items-center justify-center p-6">
			<div
				class="flex w-full flex-grow flex-col items-center justify-center rounded-xl bg-background text-foreground"
			>
				<Loader2
					class="animate-[spin_500ms_linear_infinite] text-brand-600"
					size={32}
				/>
			</div>
		</div>
	{:else if $hasNoWorkspaces === true}
		<OnBoardingLayout />
	{:else if $hasNoWorkspaces === false}
		<DashboardLayout>
			{@render children()}
		</DashboardLayout>
	{/if}
</main>
