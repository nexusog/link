'use client'

import { z } from 'zod'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createApiKey, createWorkspace } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { activeWorkspaceIdAtom, workspacesAtom } from '@/lib/state'
import { useSetAtom } from 'jotai'
import { WorkspaceInStorage } from '@/lib/types'

const createWorkspaceFormSchema = z.object({
	name: z
		.string()
		.min(2)
		.max(50)
		.transform((value) => value.trim()),
})

export const CreateWorkspaceCard = () => {
	const { toast } = useToast()
	const setWorkspaces = useSetAtom(workspacesAtom)
	const setActiveWorkspaceId = useSetAtom(activeWorkspaceIdAtom)

	const createWorkspaceForm = useForm<
		z.infer<typeof createWorkspaceFormSchema>
	>({
		resolver: zodResolver(createWorkspaceFormSchema),
		defaultValues: {
			name: '',
		},
	})

	async function onSubmit(values: z.infer<typeof createWorkspaceFormSchema>) {
		const { data: response, error: CreateWorkspaceAPIError } =
			await createWorkspace(values.name)

		if (CreateWorkspaceAPIError || response?.data.error === true) {
			toast({
				title: 'Error',
				description:
					CreateWorkspaceAPIError?.response?.data.message ||
					response?.data.message ||
					'Something went wrong',
				variant: 'destructive',
			})
			return
		}

		const workspace: Omit<WorkspaceInStorage, 'name'> = response.data.data

		setWorkspaces([
			{
				id: workspace.id,
				name: values.name,
				secret: workspace.secret,
			},
		])

		setActiveWorkspaceId(workspace.id)

		// create Default API Key
		const { data: apiKeyResponse, error: CreateApiKeyError } =
			await createApiKey(
				{
					label: 'Default',
					permissions: ['LINK_READ', 'LINK_WRITE', 'ENGAGEMENT_READ'],
				},
				workspace.id,
				workspace.secret,
			)

		if (CreateApiKeyError || apiKeyResponse?.data.error === true) {
			toast({
				title: 'Error',
				description:
					CreateApiKeyError?.response?.data.message ||
					apiKeyResponse?.data.message ||
					'Something went wrong',
				variant: 'destructive',
			})
			return
		}

		toast({
			title: 'Workspace created',
		})
	}

	return (
		<Card className="w-full max-w-lg">
			<CardHeader>
				<CardTitle>Create Workspace</CardTitle>
				<CardDescription>
					Workspaces are collection of Links & API Keys
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...createWorkspaceForm}>
					<form
						onSubmit={createWorkspaceForm.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<FormField
							control={createWorkspaceForm.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Cool Workspace"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This helps you identify your workspace
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Create</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
