import { PUBLIC_API_BASE_URL } from '$env/static/public'
import { until } from '@open-draft/until'
import axios, { AxiosError, type AxiosResponse } from 'axios'

const client = axios.create({
	baseURL: PUBLIC_API_BASE_URL,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response<T = any> = {
	error: boolean
	message: string
	data: T
}

export function createWorkspace(name: string) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.post('/workspaces', {
			name,
		}),
	)
}

export function getWorkspace(workspaceId: string, workspaceSecret: string) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.get(`/workspaces/${workspaceId}`, {
			headers: {
				'x-workspace-secret': workspaceSecret,
			},
		}),
	)
}

export function getWorkspaceStats(
	workspaceId: string,
	workspaceSecret: string,
) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.get(`/workspaces/${workspaceId}/stats`, {
			headers: {
				'x-workspace-secret': workspaceSecret,
			},
		}),
	)
}

export function createApiKey(
	data: {
		label: string
		permissions: string[]
	},
	workspaceId: string,
	workspaceSecret: string,
) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.post(
			`/api-keys`,
			{
				label: data.label,
				permissions: data.permissions,
			},
			{
				headers: {
					'x-workspace-id': workspaceId,
					'x-workspace-secret': workspaceSecret,
				},
			},
		),
	)
}

export function getApiKeys(workspaceId: string, workspaceSecret: string) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.get(`/api-keys`, {
			headers: {
				'x-workspace-id': workspaceId,
				'x-workspace-secret': workspaceSecret,
			},
		}),
	)
}

export function getLinkById(id: string, workspaceId: string, apiKey: string) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.get(`/links/${id}`, {
			headers: {
				'x-workspace-id': workspaceId,
				'x-api-key': apiKey,
			},
		}),
	)
}

export function getLinks(
	workspaceId: string,
	apiKey: string,
	options?: {
		page?: string
		pageSize?: string
		sortBy?: 'createdAt' | 'totalRedirects'
		search?: string
	},
) {
	const queryParams = new URLSearchParams()

	if (options?.page) {
		queryParams.append('page', options.page)
	}

	if (options?.pageSize) {
		queryParams.append('limit', options.pageSize)
	}

	if (options?.sortBy) {
		queryParams.append('sortBy', options.sortBy)
	}

	if (options?.search) {
		queryParams.append('search', options.search)
	}

	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.get(`/links?${queryParams.toString()}`, {
			headers: {
				'x-workspace-id': workspaceId,
				'x-api-key': apiKey,
			},
		}),
	)
}

export function getLinkStatsCount(
	linkId: string,
	workspaceId: string,
	apiKey: string,
) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.get(`/links/${linkId}/stats/count`, {
			headers: {
				'x-workspace-id': workspaceId,
				'x-api-key': apiKey,
			},
		}),
	)
}

export function getLinkStats(
	linkId: string,
	workspaceId: string,
	apiKey: string,
) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.get(`/links/${linkId}/stats`, {
			headers: {
				'x-workspace-id': workspaceId,
				'x-api-key': apiKey,
			},
		}),
	)
}

export function createLink(
	workspaceId: string,
	apiKey: string,
	data: {
		url: string
		title: string
		shortName?: string
	},
) {
	console.log('data?', data)
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.post(
			'/links',
			{
				url: data.url,
				shortName: data.shortName ? data.shortName : undefined,
				title: data.title,
			},
			{
				headers: {
					'x-workspace-id': workspaceId,
					'x-api-key': apiKey,
				},
			},
		),
	)
}
