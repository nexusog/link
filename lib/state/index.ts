import { WorkspaceInStorage } from '../types'
import { atomWithStorage } from 'jotai/utils'

export const workspaces = atomWithStorage<WorkspaceInStorage[]>(
	'workspaces',
	[],
)
