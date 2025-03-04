<script lang="ts">
	import type { Snippet } from 'svelte'
	import Switch from '$lib/components/ui/switch/switch.svelte'

	type Props = {
		title: Snippet
		description: Snippet
		checked: boolean
	}

	let { title, description, checked = $bindable(false) }: Props = $props()
</script>

<div class="flex justify-center gap-3 rounded border px-4 py-2">
	<Switch class="mt-1" bind:checked />
	<div class="flex grow flex-col gap-0">
		<div class="space-x-0.5 text-base">
			{@render title()}
		</div>
		<div class="text-sm text-muted-foreground">
			{@render description()}
		</div>
	</div>
</div>
