'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	useSidebar,
} from '@/components/ui/sidebar'
import { WorkspaceInStorage } from '@/lib/types'

import { Button } from './ui/button'

function WorkspaceAvatar({ workspaceName }: { workspaceName: string }) {
	return (
		<div className="flex items-center justify-center border-none rounded-full font-mono border bg-brand-700 text-brand-50 w-8 h-8 ">
			{workspaceName.split(' ')[0].slice(0, 2).toUpperCase()}
		</div>
	)
}

export function WorkspaceSwitcher({
	workspaces,
}: {
	workspaces: WorkspaceInStorage[]
}) {
	const { isMobile } = useSidebar()
	const [activeWorkspace, setActiveWorkspace] =
		React.useState<WorkspaceInStorage | null>(workspaces[0] || null)

	return (
		<SidebarMenu className="flex flex-col gap-3 ">
			<SidebarMenuItem>
				{activeWorkspace ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<WorkspaceAvatar
									workspaceName={activeWorkspace.name}
								/>

								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{activeWorkspace.name}
									</span>
									<span className="truncate text-xs">
										{activeWorkspace.id}
									</span>
								</div>
								<ChevronsUpDown className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							align="start"
							side={isMobile ? 'bottom' : 'right'}
							sideOffset={4}
						>
							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Workspaces
							</DropdownMenuLabel>
							{workspaces.map((workspace) => (
								<DropdownMenuItem
									key={workspace.id}
									onClick={() =>
										setActiveWorkspace(workspace)
									}
									className="gap-2 p-2"
								>
									<WorkspaceAvatar
										workspaceName={workspace.name}
									/>
									{workspace.name}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />

							<DropdownMenuItem className="gap-2 p-2 items-center">
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<Plus className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									Create Workspace
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Button className="w-full">
						<Plus />
						Create Workspace
					</Button>
				)}
			</SidebarMenuItem>
			<SidebarSeparator />
			<SidebarMenuItem>
				<div className="flex rounded hover:shadow-sm items-center justify-center w-full h-8   bg-gray-300 text-brand-50">
					<span className="ml-2 cursor-pointer hover:text-muted-foreground text-black font-mono">
						first tab
					</span>
				</div>
			</SidebarMenuItem>
			<SidebarSeparator />
			<SidebarMenuItem>
				<div className="flex hover:shadow-sm rounded items-center justify-center w-full h-8   bg-gray-300 text-brand-50">
					<span className="ml-2 cursor-pointer hover:text-muted-foreground text-black font-mono">
						second tab
					</span>
				</div>
			</SidebarMenuItem>
			<SidebarSeparator />
			<SidebarMenuItem>
				<div className="flex hover:shadow-sm rounded items-center justify-center w-full h-8   bg-gray-300 text-brand-50">
					<span className="ml-2 cursor-pointer hover:text-muted-foreground text-black font-mono">
						third tab
					</span>
				</div>
			</SidebarMenuItem>
			<SidebarSeparator />

			<SidebarMenuItem>
				<div className="flex hover:shadow-sm rounded items-center justify-center w-full h-8   bg-gray-300 text-brand-50">
					<span className="ml-2 cursor-pointer hover:text-muted-foreground text-black font-mono">
						forth tab
					</span>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
