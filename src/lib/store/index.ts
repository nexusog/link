import { persisted } from 'svelte-persisted-store'
import * as devalue from 'devalue'
import { derived, get, writable } from 'svelte/store'

type Workspace = {
	name: string
	id: string
	secret: string
}

export const workspaces = persisted<Workspace[]>(
	'workspaces',
	[
		{
			id: 'workspace_d501a7814af88d78',
			name: 'Neon',
			secret: 'secret_b57e8fdff6cfd30dc9953ca8c8c138c82f71dcc331be1a9c20207b64bf7a4cc4',
		},
		{
			id: 'workspace_013efa7211e6a5b9',
			name: 'Anil',
			secret: 'secret_95b7cc88c0b8a24fb3d8a6f8ec41b539c74b0ac8e4e79fad8a185177c8395a74',
		},
	],
	{
		serializer: devalue,
		storage: 'local',
	},
)

export const activeWorkspaceId = persisted<string | null>(
	'activeWorkspaceId',
	'workspace_d501a7814af88d78',
	{
		serializer: devalue,
		storage: 'local',
	},
)

export const activeWorkspace = derived(activeWorkspaceId, (id) => {
	return get(workspaces).find((workspace) => workspace.id === id)
})

export const isStoreHydrating = writable(true)
