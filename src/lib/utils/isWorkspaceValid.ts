import { getWorkspace } from './api'

export async function isWorkspaceValid(
	workspaceId: string,
	workspaceSecret: string,
) {
	const { error, data } = await getWorkspace(workspaceId, workspaceSecret)

	return error ? false : data.data.data?.error === true ? false : true
}
