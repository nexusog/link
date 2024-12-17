import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { activeWorkspaceAtom, defaultActiveApiKeyAtom } from '@/lib/state'
import { useAtomValue } from 'jotai'
import { z } from 'zod'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createLink } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

const createLinkFormSchema = z.object({
	title: z
		.string()
		.min(2)
		.max(50)
		.transform((value) => value.trim()),
	url: z.string().url().min(2).startsWith('https://'),
	shortName: z.string().min(1).optional(),
})

export function CreateLinkDialog({
	open,
	setOpen,
	fetchLinks,
}: {
	open: boolean
	setOpen: (open: boolean) => void
	fetchLinks: () => void
}) {
	const activeWorkspace = useAtomValue(activeWorkspaceAtom)
	const defaultActiveApiKey = useAtomValue(defaultActiveApiKeyAtom)

	const createLinkForm = useForm<z.infer<typeof createLinkFormSchema>>({
		resolver: zodResolver(createLinkFormSchema),
		defaultValues: {
			title: '',
			url: '',
			shortName: '',
		},
	})

	async function onSubmit(values: z.infer<typeof createLinkFormSchema>) {
		if (!activeWorkspace || !defaultActiveApiKey) {
			return
		}

		const { data: response, error: CreateLinkError } = await createLink(
			values,
			activeWorkspace.id,
			defaultActiveApiKey.key,
		)

		if (CreateLinkError || response?.data.error === true) {
			toast({
				title: 'Error',
				description:
					CreateLinkError?.response?.data.message ||
					response?.data.message ||
					'Something went wrong',
				variant: 'destructive',
			})
			return
		}

		fetchLinks()
		setOpen(false)
		createLinkForm.reset()

		toast({
			title: 'Link created',
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Link</DialogTitle>
				</DialogHeader>

				<Form {...createLinkForm}>
					<form
						onSubmit={createLinkForm.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={createLinkForm.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Cool Link"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This helps you identify the links.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={createLinkForm.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={createLinkForm.control}
							name="shortName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Shortname{' '}
										<span className="text-muted-foreground">
											(Optional)
										</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="cool-link"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										A short name for your link
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" type="submit" size="lg">
							Create Link
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
