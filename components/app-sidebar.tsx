import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/components/ui/sidebar'
import { WorkspaceSwitcher } from './workspace-switcher'

// TODO: fake data
const data = {
	workspaces: [
		{
			name: 'My Workspace',
			id: '1234567890',
			secret: '1234567890',
		},
		{
			name: 'Other Workspace',
			id: '234567890',
			secret: '234567890',
		},
	],
}

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader className="px-4 py-4">
				<h1 className="font-extrabold text-2xl text-black">Link</h1>
				<WorkspaceSwitcher workspaces={data.workspaces} />
			</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter />
		</Sidebar>
	)
}
