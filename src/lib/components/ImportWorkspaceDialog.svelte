<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { activeWorkspaceId, workspaces } from '$lib/store'
	import * as api from '$lib/utils/api'
	import { tick } from 'svelte'
	import { toast } from 'svelte-sonner'

	type Props = {
		open: boolean
	}

	let { open = $bindable(false) }: Props = $props()

	let workspaceIdValue = $state('')
	let workspaceSecretValue = $state('')

	async function handleImportWorkspace() {
		if (!workspaceIdValue.trim() || !workspaceSecretValue.trim()) {
			toast.error('Please fill out all fields')
			return
		}

		const { error, data: response } = await api.getWorkspace(
			workspaceIdValue,
			workspaceSecretValue,
		)

		if (error || response?.data.error) {
			toast.error(
				response?.data.message ||
					error?.message ||
					'Something went wrong',
			)
			return
		}

		const {
			name: workspaceName,
			id: workspaceId,
			secret: workspaceSecret,
		} = response.data.data

		$workspaces = [
			...$workspaces,
			{
				name: workspaceName,
				id: workspaceId,
				secret: workspaceSecret,
			},
		]

		workspaceIdValue = ''
		workspaceSecretValue = ''

		if ($activeWorkspaceId === null) {
			$activeWorkspaceId = workspaceId
		}
		tick()

		open = false
		toast.success(`Workspace "${workspaceName}" imported successfully`)
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header class="space-y-2">
			<Dialog.Title>Import Workspace</Dialog.Title>
			<Dialog.Description
				>Import a workspace from another device or person.</Dialog.Description
			>

			<div class="flex w-full flex-col gap-4 py-2">
				<div class="flex w-full flex-col gap-1.5">
					<Label for="id">Id</Label>
					<Input
						type="text"
						id="id"
						placeholder="abcd123"
						bind:value={workspaceIdValue}
					/>
				</div>
				<div class="flex w-full flex-col gap-1.5">
					<Label for="secret">Secret</Label>
					<Input
						type="text"
						id="secret"
						placeholder="secret_yoyo"
						bind:value={workspaceSecretValue}
					/>
				</div>
			</div>

			<div class="flex w-full justify-end">
				<Button size="lg" onclick={handleImportWorkspace}>Import</Button
				>
			</div>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
