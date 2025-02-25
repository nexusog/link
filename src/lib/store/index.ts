import { persisted } from 'svelte-persisted-store'
import * as devalue from 'devalue'
import { derived, get, writable } from 'svelte/store'
import { getApiKeys, getLinks, getWorkspaceStats } from '$lib/utils/api'
import { DEFAULT_API_KEY_LABEL } from '$lib/const'
import { isWorkspaceValid } from '$lib/utils/isWorkspaceValid'

type StoreWorkspace = {
	name: string
	id: string
	secret: string
}

export type ApiKey = {
	id: string
	key: string
	label: string
	permissions: string[]
}

export const workspaces = persisted<StoreWorkspace[]>('workspaces', [], {
	serializer: devalue,
	storage: 'local',
	syncTabs: true,
})

export const workspacesWithExtras = derived(workspaces, async (workspaces) => {
	return await Promise.all(
		workspaces.map(async (workspace) => {
			return {
				...workspace,
				isValid: await isWorkspaceValid(workspace.id, workspace.secret),
			}
		}),
	)
})

export const activeWorkspaceId = persisted<string | null>(
	'activeWorkspaceId',
	null,
	{
		serializer: devalue,
		storage: 'local',
		syncTabs: true,
	},
)

export const activeWorkspace = derived(activeWorkspaceId, (id) => {
	return get(workspaces).find((workspace) => workspace.id === id) || null
})

export const isActiveWorkspaceValid = derived(
	activeWorkspace,
	async (workspace) => {
		if (!workspace) return false

		return await isWorkspaceValid(workspace?.id, workspace?.secret)
	},
)

export const hasNoWorkspaces = derived(workspaces, (workspaces) => {
	return workspaces.length === 0
})

export const isStoreHydrating = writable(true)

export const isCreateWorkspaceDialogOpen = writable(false)
export const isImportWorkspaceDialogOpen = writable(false)

export const activeWorkspaceApiKeys = derived(
	activeWorkspace,
	async (workspace): Promise<ApiKey[]> => {
		if (!workspace) return []

		const { data: response } = await getApiKeys(
			workspace.id,
			workspace.secret,
		)

		if (!response) return []

		return response.data?.data?.apiKeys || []
	},
)

export const activeWorkspaceDefaultApiKey = derived(
	activeWorkspaceApiKeys,
	async (apiKeys) => {
		return (await apiKeys).find(
			(apiKey) => apiKey.label === DEFAULT_API_KEY_LABEL,
		)
	},
)

export const activeWorkspaceStats = derived(
	activeWorkspace,
	async (workspace) => {
		if (!workspace) return null

		const { data: response } = await getWorkspaceStats(
			workspace.id,
			workspace.secret,
		)

		if (!response) return null

		return response.data.data
	},
)

export const isCreateLinkDialogOpen = writable(false)

export const activeWorkspaceLinks = derived(
	activeWorkspace,
	async (workspace) => {
		if (!workspace) return { error: true }

		const { data: response } = await getLinks(
			workspace.id,
			(await get(activeWorkspaceDefaultApiKey))!.key,
		)

		if (!response) return { error: true }

		return { data: response.data.data, error: false }
	},
)
