'use client'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { WorkspaceSwitcher } from './workspace-switcher'
import React from 'react'
import Link from 'next/link'
import { LinkIcon } from 'lucide-react/'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const sidebarItems = [
	{
		title: 'Links',
		url: '/',
		icon: LinkIcon,
	},
	// {
	// 	title: 'Analytics',
	// 	url: '/analytics',
	// 	icon: ChartColumnIcon,
	// },
	// {
	// 	title: 'API Keys',
	// 	url: '/api-keys',
	// 	icon: KeyIcon,
	// },
]

export function AppSidebar() {
	const pathname = usePathname()

	return (
		<Sidebar>
			<SidebarHeader className="px-4 py-4">
				<h1 className="font-extrabold text-2xl text-black">Link</h1>
				<WorkspaceSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu className="px-2">
					{sidebarItems.map((item) => (
						<SidebarMenuItem
							key={item.title}
							className={cn(
								'rounded',
								pathname === item.url &&
									'bg-brand-100 text-brand-600',
							)}
						>
							<SidebarMenuButton asChild>
								<Link href={item.url}>
									<item.icon />
									<span className="text-sm ">
										{item.title}
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	)
}
