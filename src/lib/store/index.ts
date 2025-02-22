import { persisted } from 'svelte-persisted-store'
import * as devalue from 'devalue'
import { derived, get, writable } from 'svelte/store'
import { getApiKeys } from '$lib/utils/api'

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
	return get(workspaces).find((workspace) => workspace.id === id)
})

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
		return (await apiKeys).find((apiKey) => apiKey.label === 'UI_DEFAULT')
	},
)
