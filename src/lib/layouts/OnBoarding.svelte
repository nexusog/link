<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { cn } from '$lib/utils/shadcn'
	import {
		ArrowBigRightDash,
		Braces,
		Check,
		CheckCircle,
		Flame,
		Icon,
		Import,
		Layers,
		Link,
		Loader2,
		Plus,
		Rocket,
		Sparkles,
	} from 'lucide-svelte'
	import { generate as generateRandomWords } from 'random-words'
	import { tick } from 'svelte'
	import { toast } from 'svelte-sonner'
	import { draw, fade, slide } from 'svelte/transition'
	import * as api from '$lib/utils/api'
	import { activeWorkspaceId, isStoreHydrating, workspaces } from '$lib/store'
	import { DEFAULT_API_KEY_LABEL } from '$lib/const'

	let step = $state(0)

	const steps = [Step0, Step1, Step2]

	let workspaceImportMode = $state(false)
	let workspaceName = $state('')
	let workspaceId = $state('')
	let workspaceSecret = $state('')

	let isWorkspaceDataValid = $derived(
		workspaceImportMode
			? workspaceId.trim().length > 0 && workspaceSecret.trim().length > 0
			: workspaceName.trim().length > 0,
	)

	let inspiredWorkspaceName = $state(
		generateRandomWords({
			exactly: 2,
			join: '-',
		}),
	)

	function refetchInspiredWorkspaceName() {
		inspiredWorkspaceName = generateRandomWords({
			exactly: 2,
			join: '-',
		})
	}

	let workspaceInitLoading = $state(true)

	let resultWorkspaceName = $state('')
	let resultWorkspaceId = $state('')
	let resultWorkspaceSecret = $state('')

	function handleGoToDashboard() {
		$isStoreHydrating = true
		$workspaces = [
			...$workspaces,
			{
				name: resultWorkspaceName,
				id: resultWorkspaceId,
				secret: resultWorkspaceSecret,
			},
		]

		$activeWorkspaceId = resultWorkspaceId

		setTimeout(() => {
			$isStoreHydrating = false
		}, 500)
	}

	async function handleWorkspaceImport() {
		if (!workspaceImportMode) return

		const { error, data: response } = await api.getWorkspace(
			workspaceId,
			workspaceSecret,
		)

		if (error || response?.data.error) {
			toast.error(
				response?.data.message ||
					error?.message ||
					'Something went wrong',
			)
			step--
			return
		}

		resultWorkspaceName = response.data.data.name
		resultWorkspaceId = response.data.data.id
		resultWorkspaceSecret = response.data.data.secret

		workspaceInitLoading = false
	}

	async function handleWorkspaceCreate() {
		const { error, data: response } = await api.createWorkspace(
			workspaceName.trim(),
		)

		if (error || response?.data.error) {
			toast.error(
				response?.data.message ||
					error?.message ||
					'Something went wrong',
			)
			step--
			return
		}

		const { id: responseWorkspaceId, secret: responseWorkspaceSecret } =
			response.data.data

		const { error: apiKeyError, data: apiKeyResponse } =
			await api.createApiKey(
				{
					label: DEFAULT_API_KEY_LABEL,
					permissions: ['LINK_READ', 'LINK_WRITE', 'ENGAGEMENT_READ'],
				},
				responseWorkspaceId,
				responseWorkspaceSecret,
			)

		if (apiKeyError || apiKeyResponse?.data.error) {
			toast.error(
				apiKeyResponse?.data.message ||
					apiKeyError?.message ||
					'Something went wrong',
			)
			step--
			return
		}

		resultWorkspaceId = responseWorkspaceId
		resultWorkspaceSecret = responseWorkspaceSecret
		resultWorkspaceName = workspaceName

		workspaceInitLoading = false
	}

	async function handleWorkspaceInit() {
		if (
			workspaceImportMode &&
			(workspaceId.trim().length === 0 ||
				workspaceSecret.trim().length === 0)
		) {
			return
		}

		if (!workspaceImportMode && workspaceName.trim().length === 0) {
			return
		}

		step++

		workspaceInitLoading = true

		await tick()

		workspaceImportMode
			? await handleWorkspaceImport()
			: await handleWorkspaceCreate()

		setTimeout(() => {
			handleGoToDashboard()
		}, 1000)
	}
</script>

{#snippet Step0()}
	{#snippet FeatureCard(
		IconC: typeof Icon,
		title: string,
		description: string,
	)}
		<div
			class="group/card relative flex gap-4 overflow-hidden rounded-lg border p-4 transition-all hover:border-brand-600 hover:shadow"
		>
			<div
				class="absolute -right-6 -top-6 h-12 w-12 rounded-full bg-muted-foreground transition-colors group-hover/card:bg-brand-500"
			></div>
			<div
				class="group-hover/card: flex h-fit w-fit items-center gap-2 rounded border bg-muted p-4 transition-all group-hover/card:bg-brand-500/10 group-hover/card:text-brand-700"
			>
				<IconC size={22} />
			</div>
			<div class="flex flex-col gap-0.5">
				<h2 class="text-xl font-bold">{title}</h2>
				<p class="text-sm text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	{/snippet}

	<div in:slide out:slide class="flex w-full flex-grow flex-col gap-6">
		<div class="space-y-1">
			<h1 class="text-2xl font-bold">
				Welcome to <span class="text-brand-700">Link!</span>
			</h1>
			<p class="text-sm text-muted-foreground">
				Your all-in-one platform for creating and managing shortened
				links.
			</p>
		</div>

		<div class="space-y-4">
			{@render FeatureCard(
				Layers,
				'Organize with Workspaces',
				'Create multiple workspaces to organize your links for different projects, teams, or clients.',
			)}
			{@render FeatureCard(
				Link,
				'Shorten and Track Links',
				'Create shortened links and track their performance with detailed analytics.',
			)}
			{@render FeatureCard(
				Braces,
				'API Access',
				'Generate API keys to integrate link shortening into your applications.',
			)}
		</div>

		<div class="flex w-full justify-end">
			<Button onclick={() => step++}
				>Get Started <ArrowBigRightDash /></Button
			>
		</div>
	</div>
{/snippet}

{#snippet Step1()}
	{@const ModeChangerIcon = workspaceImportMode ? Plus : Import}

	<div in:slide out:slide class="flex w-full flex-grow flex-col gap-6">
		<div class="space-y-1">
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-bold">
					{workspaceImportMode ? 'Import' : 'Name'} your workspace
				</h1>
				<Button
					onclick={() => (workspaceImportMode = !workspaceImportMode)}
					variant="brand"
					class="h-fit p-1.5 px-2 text-xs"
					size="sm"
					><ModeChangerIcon />
					{workspaceImportMode ? 'Create' : 'Import'} Instead</Button
				>
			</div>
			<p class="text-sm text-muted-foreground">
				Workspaces help you organize your links and API keys.
			</p>
		</div>

		{#if workspaceImportMode}
			<div class="flex w-full flex-col gap-1.5">
				<Label class="font-semibold" for="worksapceId"
					>Workspace ID</Label
				>
				<Input
					type="text"
					id="worksapceId"
					placeholder="workspace_abc123"
					bind:value={workspaceId}
				/>
			</div>
			<div class="flex w-full flex-col gap-1.5">
				<Label class="font-semibold" for="workspaceSecret"
					>Workspace Secret</Label
				>
				<Input
					type="text"
					id="workspaceSecret"
					placeholder="secret_abc123"
					bind:value={workspaceSecret}
				/>
			</div>
		{:else}
			<div class="flex w-full flex-col gap-1.5">
				<Label class="font-semibold" for="workspaceName"
					>Workspace Name</Label
				>
				<Input
					type="text"
					id="workspaceName"
					placeholder={inspiredWorkspaceName}
					bind:value={workspaceName}
				/>
				<Label class="text-muted-foreground" for="workspaceName">
					This will be the name of your first workspace. You can
					create more later.
				</Label>
				<Label>
					Need inspiration? How about
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<span
						onclick={() => {
							workspaceName = inspiredWorkspaceName
							refetchInspiredWorkspaceName()
						}}
						class="cursor-pointer text-base font-semibold text-brand-600"
						>{inspiredWorkspaceName}</span
					>
				</Label>
			</div>

			<div
				class="space-y-1 rounded border border-brand-600 bg-brand-600/10 p-4 text-brand-800"
			>
				<div class="flex items-center gap-1 font-semibold">
					<Sparkles size={18} />
					<span>Pro Tip</span>
				</div>
				<div class="text-sm">
					Choose a descriptive name that helps you identify the
					purpose of this workspace.
				</div>
			</div>
		{/if}

		<div class="flex w-full justify-between">
			<Button variant="ghost" onclick={() => step--}>Back</Button>
			<Button
				disabled={!isWorkspaceDataValid}
				onclick={() => {
					handleWorkspaceInit()
				}}
				>{workspaceImportMode ? 'Import' : 'Create'} Workspace
				<Rocket /></Button
			>
		</div>
	</div>
{/snippet}

{#snippet Step2()}
	<div in:slide class="flex w-full flex-grow flex-col gap-6">
		<div class=""></div>
		<div class="flex w-full flex-col items-center justify-center gap-2">
			{#if workspaceInitLoading}
				<div>
					<Loader2
						size={64}
						class="animate-[spin_500ms_ease-in-out_infinite] text-brand-600"
					/>
				</div>
			{:else}
				<div>
					<CheckCircle size={64} class="text-lime-600" />
				</div>
			{/if}
			<div>
				{#if workspaceInitLoading}
					{workspaceImportMode ? 'Importing' : 'Creating'} Workspace
				{:else}
					Workspace {workspaceImportMode ? 'Imported' : 'Created'}
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<div class="flex flex-grow flex-col items-center justify-center p-6" in:fade>
	<div
		in:slide
		class="flex h-fit w-[500px] flex-col gap-4 rounded-xl border-2 bg-background p-8 text-foreground shadow-xl transition-all"
	>
		<div class="flex items-center justify-between">
			<h1
				class="flex w-fit items-center justify-center gap-2 text-xl font-bold"
			>
				<Link />
				<span>NexusOG's Link</span>
			</h1>
			<div class="flex gap-2">
				{#each steps as _, i}
					{@const isDone = step >= i}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						aria-label="Step {i + 1}"
						class={cn(
							'h-2 w-8 rounded-full bg-muted-foreground',
							isDone && 'bg-brand-600',
						)}
					></div>
				{/each}
			</div>
		</div>
		{@render steps[step]()}
	</div>
</div>
