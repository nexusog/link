<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import { cn } from '$lib/utils/shadcn'
	import {
		activeWorkspace,
		activeWorkspaceId,
		isCreateWorkspaceDialogOpen,
		isImportWorkspaceDialogOpen,
		workspaces,
	} from '$lib/store'
	import { Import, Plus } from 'lucide-svelte'

	type Props = {
		open: boolean
	}

	let { open = $bindable(false) }: Props = $props()
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header class="space-y-4">
			<Dialog.Title>Select Workspace</Dialog.Title>

			<div class="flex w-full flex-col gap-2">
				{#each $workspaces as workspace}
					{@const isCurrent = workspace.id === $activeWorkspace?.id}
					<button
						onclick={() => {
							$activeWorkspaceId = workspace.id
							open = false
						}}
						class={cn(
							'flex cursor-pointer flex-col rounded border px-3 py-2 text-start transition hover:bg-gray-100',
							isCurrent &&
								'border border-brand-600 bg-brand-600/30 text-brand-900 hover:bg-brand-600/35',
						)}
					>
						<div>{workspace.name}</div>
						<div
							class={cn(
								'text-sm',
								isCurrent === false && 'text-muted-foreground',
							)}
						>
							{workspace.id}
						</div>
					</button>
				{/each}
			</div>
			<Button
				onclick={() => {
					open = false
					$isCreateWorkspaceDialogOpen = true
				}}
			>
				<Plus />
				Create New Workspace
			</Button>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
