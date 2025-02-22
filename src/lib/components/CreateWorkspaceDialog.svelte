<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Input } from '$lib/components/ui/input'
	import {
		activeWorkspaceId,
		isImportWorkspaceDialogOpen,
		workspaces,
	} from '$lib/store'
	import * as api from '$lib/utils/api'
	import { Import } from 'lucide-svelte'
	import { tick } from 'svelte'
	import { toast } from 'svelte-sonner'

	type Props = {
		open: boolean
	}

	let { open = $bindable(false) }: Props = $props()

	let createWorkspaceName = $state('')

	async function handleCreateWorkspace() {
		if (createWorkspaceName.trim().length === 0) {
			return
		}

		const { error, data: response } = await api.createWorkspace(
			createWorkspaceName.trim(),
		)

		if (error || response?.data.error) {
			toast.error(
				response?.data.message ||
					error?.message ||
					'Something went wrong',
			)
			return
		}

		const { id: workspaceId, secret: workspaceSecret } = response.data.data

		const { error: apiKeyError, data: apiKeyResponse } =
			await api.createApiKey(
				{
					label: 'UI_DEFAULT',
					permissions: ['LINK_READ', 'LINK_WRITE', 'ENGAGEMENT_READ'],
				},
				workspaceId,
				workspaceSecret,
			)

		if (apiKeyError || apiKeyResponse?.data.error) {
			toast.error(
				apiKeyResponse?.data.message ||
					apiKeyError?.message ||
					'Something went wrong',
			)
			return
		}

		$workspaces = [
			...$workspaces,
			{
				name: createWorkspaceName.trim(),
				id: workspaceId,
				secret: workspaceSecret,
			},
		]

		$activeWorkspaceId = workspaceId
		tick()

		open = false
		toast.success('Workspace created successfully')
		createWorkspaceName = ''
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header class="space-y-4">
			<Dialog.Title class="flex items-center justify-between pr-4">
				<span>Create Workspace</span>
				<Button
					variant="brand"
					onclick={() => {
						open = false
						$isImportWorkspaceDialogOpen = true
					}}
					class="h-fit p-2 px-4 text-xs"
					><Import size={10} />Import Instead</Button
				>
			</Dialog.Title>
			<Dialog.Description
				>Workspace is where your links and API Keys Live together.</Dialog.Description
			>

			<div class="flex w-full flex-col gap-2 py-2">
				<Input
					placeholder="Workspace Name"
					class="w-full"
					bind:value={createWorkspaceName}
				/>
			</div>

			<div class="flex w-full justify-end">
				<Button size="lg" onclick={handleCreateWorkspace}>Create</Button
				>
			</div>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
