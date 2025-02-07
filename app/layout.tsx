import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import PlausibleProvider from 'next-plausible'
import { env } from '@/lib/env'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Link',
	description: 'Short links with analytics',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<PlausibleProvider
					domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
					customDomain={env.NEXT_PUBLIC_PLAUSIBLE_HOST_URL}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<SidebarProvider>
						<AppSidebar />
						<main className="w-full h-full">
							<SidebarTrigger />
							{children}
						</main>
					</SidebarProvider>
				</Providers>
				<Toaster />
			</body>
		</html>
	)
}
