'use client'

import { isHydratedAtom, isNoWorkspaceAtom, loadingAtom } from '@/lib/state'
import { Provider, useAtom, useAtomValue } from 'jotai'
import { CreateWorkspaceCard } from './CreateWorkspaceCard'
import { LoadingScreen } from './LoadingScreen'
import { useEffect } from 'react'

const WorkspaceCheckProvider = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	const isNoWorkspace = useAtomValue(isNoWorkspaceAtom)

	return isNoWorkspace ? (
		<div className="w-full min-h-full flex-grow flex justify-center items-center px-2 md:p-0">
			<CreateWorkspaceCard />
		</div>
	) : (
		children
	)
}

const LoadingProvider = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	const isLoading = useAtomValue(loadingAtom)

	return isLoading ? <LoadingScreen /> : children
}

// used to prevent half-second flash of CreateWorkspaceCard before the atoms are computed
const HydrationProvider = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	const [isHydrated, setHydrated] = useAtom(isHydratedAtom)

	useEffect(() => {
		setHydrated(true)
	}, [setHydrated])

	if (!isHydrated) {
		return null
	}

	return children
}

export const Providers = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	return (
		<Provider>
			<HydrationProvider>
				<LoadingProvider>
					<WorkspaceCheckProvider>{children}</WorkspaceCheckProvider>
				</LoadingProvider>
			</HydrationProvider>
		</Provider>
	)
}
