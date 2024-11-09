import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Footer from "@/components/footer"

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
})
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
})

export const metadata: Metadata = {
	title: "Age Counter",
	description: "A simple age counter that shows your age in real time.",
	keywords: "age counter, real-time age, age calculator",
	openGraph: {
		title: "Age Counter",
		description: "A simple age counter that shows your age in real time.",
		url: "https://realtime-age-counter.vercel.app",
		type: "website",
		images: [
			{
				url: "https://realtime-age-counter.vercel.app/og-image.jpg",
				width: 800,
				height: 600,
				alt: "Age Counter",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Age Counter",
		description: "A simple age counter that shows your age in real time.",
		images: [
			{
				url: "https://realtime-age-counter.vercel.app/twitter-image.jpg",
				alt: "Age Counter",
			},
		],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`h-screen flex flex-col items-center justify-between ${geistSans.className} ${geistMono.variable} antialiased`}
			>
				{children}
				<Footer />
			</body>
		</html>
	)
}
