'use client'

import { z } from 'zod'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import { createWorkspace } from '@/lib/api'
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
		const { status, data } = await createWorkspace(values.name)

		if (status !== 200) {
			toast({
				title: 'Error',
				description: data.message,
				variant: 'destructive',
			})
			return
		}

		const workspace: Omit<WorkspaceInStorage, 'name'> = data.data

		setWorkspaces([
			{
				id: workspace.id,
				name: values.name,
				secret: workspace.secret,
			},
		])

		setActiveWorkspaceId(workspace.id)

		toast({
			title: 'Workspace created',
		})
	}

	return (
		<div className="w-full min-h-full flex-grow flex justify-center items-center px-2 md:p-0">
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
							onSubmit={createWorkspaceForm.handleSubmit(
								onSubmit,
							)}
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
											This helps you identify your
											workspace
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Create</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</div>
	)
}
