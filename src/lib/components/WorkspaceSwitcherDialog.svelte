<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import { cn } from '$lib/utils/shadcn'
	import {
		activeWorkspace,
		activeWorkspaceId,
		isCreateWorkspaceDialogOpen,
		workspacesWithExtras,
	} from '$lib/store'
	import { Plus } from 'lucide-svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'

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
				{#await $workspacesWithExtras}
					<Skeleton class="h-[60px] w-full" />
					<Skeleton class="h-[60px] w-full" />
				{:then workspaces}
					{#each workspaces as workspace}
						{@const isCurrent =
							workspace.id === $activeWorkspace?.id}
						<button
							onclick={() => {
								if (workspace.isValid === false) return
								$activeWorkspaceId = workspace.id
								open = false
							}}
							class={cn(
								'relative flex cursor-pointer flex-col rounded border px-3 py-2 text-start transition hover:bg-gray-100',
								isCurrent &&
									'border border-brand-600 bg-brand-600/30 text-brand-900 hover:bg-brand-600/35',
								workspace.isValid === false &&
									'cursor-not-allowed border border-destructive bg-destructive/10 text-destructive hover:bg-destructive/10',
							)}
						>
							<div class="flex justify-between gap-2">
								<div>
									{workspace.name}
								</div>
								<div class="flex gap-1">
									{#if workspace.isValid === false}
										<div
											class="rounded bg-destructive p-2 py-0.5 text-xs text-destructive-foreground"
										>
											Invalid Workspace
										</div>
									{/if}
									{#if isCurrent}
										<div
											class="rounded bg-brand-800 p-2 py-0.5 text-xs text-white"
										>
											Active
										</div>
									{/if}
								</div>
							</div>
							<div
								class={cn(
									'text-sm',
									isCurrent === false &&
										'text-muted-foreground',
									workspace.isValid === false &&
										'text-destructive',
								)}
							>
								{workspace.id}
							</div>
						</button>
					{/each}
				{/await}
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
