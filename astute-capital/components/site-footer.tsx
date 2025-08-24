"use client"

import Link from "next/link"

export default function SiteFooter() {
	const year = new Date().getFullYear()
	return (
		<footer className="mt-12 border-t border-slate-800 bg-slate-950/50">
			<div className="mx-auto max-w-7xl px-4 py-6 text-slate-400">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold">AC</span>
						</div>
						<div>
							<p className="text-white font-semibold">Astute Capital</p>
							<p className="text-xs text-slate-400">AI-Powered Trading Platform</p>
						</div>
					</div>
					<nav className="flex items-center gap-4 text-sm">
						<Link href="#" className="hover:text-white">Terms</Link>
						<Link href="#" className="hover:text-white">Privacy</Link>
						<Link href="#" className="hover:text-white">Contact</Link>
					</nav>
				</div>
				<p className="mt-4 text-xs">© {year} Astute Capital. All rights reserved.</p>
			</div>
		</footer>
	)
}