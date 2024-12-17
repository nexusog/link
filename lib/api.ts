import axios, { AxiosError, type AxiosResponse } from 'axios'
import { env } from './env'
import { until } from '@open-draft/until'

const client = axios.create({
	baseURL: env.NEXT_PUBLIC_API_BASE_URL,
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

export function getLinks(workspaceId: string, apiKey: string) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.get(`/links`, {
			headers: {
				'x-workspace-id': workspaceId,
				'x-api-key': apiKey,
			},
		}),
	)
}

export function createLink(
	data: {
		title: string
		url: string
		shortName?: string
	},
	workspaceId: string,
	apiKey: string,
) {
	return until<AxiosError<Response>, AxiosResponse<Response>>(() =>
		client.post(
			`/links`,
			{
				title: data.title,
				url: data.url,
				shortName: data.shortName,
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
