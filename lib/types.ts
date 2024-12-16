export type WorkspaceInStorage = {
	id: string
	secret: string
	name: string
}

export type LinkCore = {
	title: string
	id: string
	shortName?: string
	url: string
}

export type Link = LinkCore & {
	createdAt: string
	updatedAt: string
}

export type ApiKey = {
	id: string
	key: string
	label: string
	permissions: string[]
	createdAt: string
}
