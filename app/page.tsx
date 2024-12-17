'use client'

import { CreateLinkDialog } from '@/components/CreateLinkDialog'
import { LinkCard } from '@/components/LinkCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { getLinks } from '@/lib/api'
import { activeWorkspaceAtom, defaultActiveApiKeyAtom } from '@/lib/state'
import { Link } from '@/lib/types'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'

export default function Home() {
	const activeWorkspace = useAtomValue(activeWorkspaceAtom)
	const defaultActiveApiKey = useAtomValue(defaultActiveApiKeyAtom)
	const [links, setLinks] = useState<Link[]>([])
	const [isCreateLinkDialogOpen, setCreateLinkDialogOpen] = useState(false)

	const fetchLinks = useCallback(async () => {
		if (!activeWorkspace || !defaultActiveApiKey) {
			return
		}

		const { data: response, error: GetLinksError } = await getLinks(
			activeWorkspace.id,
			defaultActiveApiKey.key,
		)

		if (GetLinksError) {
			toast({
				title: 'Error',
				description:
					GetLinksError?.response?.data.message ||
					'Something went wrong',
				variant: 'destructive',
			})
			return
		}

		setLinks(response.data.data.links)
	}, [activeWorkspace, defaultActiveApiKey])

	useEffect(() => {
		fetchLinks()
	}, [fetchLinks])

	return (
		<>
			<CreateLinkDialog
				open={isCreateLinkDialogOpen}
				setOpen={setCreateLinkDialogOpen}
				fetchLinks={fetchLinks}
			/>

			<div className="min-h-full p-4 md:py-8">
				<div className="max-w-screen-lg mx-auto space-y-4">
					<h1 className="text-2xl font-bold">Links</h1>
					<div className="flex space-x-4 justify-between">
						<Input
							placeholder="Search Links"
							className="max-w-sm"
						/>
						<Button onClick={() => setCreateLinkDialogOpen(true)}>
							Create Link
						</Button>
					</div>
					<div className="space-y-4 w-full">
						{links.map((link) => (
							<div key={link.id}>
								<LinkCard link={link} />
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}
