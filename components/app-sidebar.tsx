'use client'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/components/ui/sidebar'
import { WorkspaceSwitcher } from './workspace-switcher'
import { useAtom } from 'jotai'
import { workspacesAtom } from '@/lib/state'
import React from 'react'

export function AppSidebar() {
	const [workspacesInStorage] = useAtom(workspacesAtom)

	return (
		<Sidebar>
			<SidebarHeader className="px-4 py-4">
				<h1 className="font-extrabold text-2xl text-black">Link</h1>
				<WorkspaceSwitcher workspaces={workspacesInStorage} />
			</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter />
		</Sidebar>
	)
}
