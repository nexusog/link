<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Input } from '$lib/components/ui/input'
	import { DEFAULT_API_KEY_LABEL } from '$lib/const'
	import {
		activeWorkspaceDefaultApiKey,
		activeWorkspaceId,
		activeWorkspaceLinks,
		activeWorkspaceLinksCreatedRefCounter,
		isImportWorkspaceDialogOpen,
		workspaces,
	} from '$lib/store'
	import * as api from '$lib/utils/api'
	import { Label } from '$lib/components/ui/label'
	import { cn } from '$lib/utils/shadcn'
	import { debounce } from 'lodash-es'
	import { LoaderCircle } from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import InformativeSwitch from './InformativeSwitch.svelte'

	type Props = {
		open: boolean
	}

	let { open = $bindable(false) }: Props = $props()

	let isLoading = $state(false)

	let values = $state({
		url: '',
		shortName: '',
		smartEngagementCounting: false,
	})

	async function handleCreateLink(event: SubmitEvent) {
		event.preventDefault()

		if (values.url.trim().length === 0) {
			toast.error('Please enter a valid URL')
			return
		}

		isLoading = true

		try {
			const { data: response, error } = await api.createLink(
				$activeWorkspaceId!,
				(await $activeWorkspaceDefaultApiKey)!.key,
				Object.assign({}, values),
			)

			if (error || response?.data.error) {
				toast.error(
					error?.response?.data.message ||
						error?.message ||
						'Something went wrong',
				)
				return
			}

			$activeWorkspaceLinksCreatedRefCounter++

			open = false
			values.url = ''
			values.shortName = ''
			values.smartEngagementCounting = false
		} catch (error) {
			toast.error('Something went wrong')
		} finally {
			isLoading = false
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header class="space-y-4">
			<Dialog.Title class="flex items-center justify-between pr-4">
				<span>Create Link</span>
			</Dialog.Title>

			<div class="my-6"></div>

			<form onsubmit={handleCreateLink} class="space-y-6">
				<div class="flex w-full flex-col gap-1.5">
					<Label for="url">Destination URL</Label>
					<Input
						disabled={isLoading}
						type="url"
						id="url"
						bind:value={values.url}
						placeholder="https://example.com"
						required
					/>
				</div>

				<div class="flex w-full flex-col gap-1.5">
					<Label for="shortname">Shortname</Label>
					<Input
						disabled={isLoading}
						type="text"
						id="shortname"
						bind:value={values.shortName}
						placeholder="my-expl-site"
						pattern="[a-zA-Z0-9-]+"
						maxlength={50}
					/>
					<div
						class={cn(
							'text-sm text-muted-foreground',
							values.shortName && 'text-brand-600',
						)}
					>
						{#if values.shortName.length > 0}
							{location.origin}/{values.shortName}
						{:else}
							Leave empty for random
						{/if}
					</div>
				</div>

				<InformativeSwitch
					bind:checked={values.smartEngagementCounting}
				>
					{#snippet title()}
						<span>Smart Engagement Counting</span>
						<span class="text-xs font-semibold text-brand-700"
							>(BETA)</span
						>
					{/snippet}

					{#snippet description()}
						Tries to prevents accidental or repeated clicks from
						being counted multiple times.
					{/snippet}
				</InformativeSwitch>

				<div class="flex w-full justify-end">
					<Button disabled={isLoading} type="submit" size="sm">
						{#if isLoading}
							<LoaderCircle
								size={12}
								class="animate-[spin_800ms_ease-in_infinite]"
							/>
						{/if}
						Create
					</Button>
				</div>
			</form>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
