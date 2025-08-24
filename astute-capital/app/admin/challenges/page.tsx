"use client"

import { useEffect, useState } from "react"
import AuthGuard from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"

interface AdminChallenge {
	id?: string
	firmId: string
	accountSize: number
	status: "active" | "passed" | "failed" | "pending"
	profitTarget: number
	maxDrawdown: number
}

export default function AdminChallengesPage() {
	const [propFirms, setPropFirms] = useState<any[]>([])
	const [challenges, setChallenges] = useState<AdminChallenge[]>([])
	const [form, setForm] = useState<AdminChallenge>({ firmId: "ftmo", accountSize: 100000, status: "pending", profitTarget: 10, maxDrawdown: 10 })
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		apiClient.get("/prop-firms").then((r: any) => setPropFirms(r.propFirms))
		apiClient.get("/prop-challenges").then((r: any) => setChallenges(r.challenges))
	}, [])

	const createChallenge = async () => {
		setLoading(true)
		try {
			const res = await apiClient.post("/prop-challenges", form)
			setChallenges((c) => [res.challenge, ...c])
		} finally {
			setLoading(false)
		}
	}

	const updateStatus = async (id: string, status: AdminChallenge["status"]) => {
		const res = await apiClient.put(`/prop-challenges/${id}`, { status })
		setChallenges((list) => list.map((c) => (c.id === id ? { ...c, status: res.challenge.status } : c)))
	}

	const removeChallenge = async (id: string) => {
		await apiClient.delete(`/prop-challenges/${id}`)
		setChallenges((list) => list.filter((c) => c.id !== id))
	}

	return (
		<AuthGuard requireAdmin>
			<div className="p-4 space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-white">Prop Firm Challenges - Admin Board</h1>
					<Badge className="bg-emerald-600">Admin</Badge>
				</div>

				<Card className="bg-slate-900 border-slate-800">
					<CardHeader>
						<CardTitle className="text-slate-200">Create Challenge</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
							<div>
								<label className="text-xs text-slate-400">Prop Firm</label>
								<Select value={form.firmId} onValueChange={(v) => setForm((f) => ({ ...f, firmId: v }))}>
									<SelectTrigger className="bg-slate-800 border-slate-700 text-white">
										<SelectValue placeholder="Firm" />
									</SelectTrigger>
									<SelectContent>
										{propFirms.map((f) => (
											<SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-xs text-slate-400">Account Size</label>
								<Input
									type="number"
									className="bg-slate-800 border-slate-700 text-white"
									value={form.accountSize}
									onChange={(e) => setForm((f) => ({ ...f, accountSize: Number(e.target.value) }))}
								/>
							</div>
							<div>
								<label className="text-xs text-slate-400">Status</label>
								<Select value={form.status} onValueChange={(v: any) => setForm((f) => ({ ...f, status: v }))}>
									<SelectTrigger className="bg-slate-800 border-slate-700 text-white">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="passed">Passed</SelectItem>
										<SelectItem value="failed">Failed</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-xs text-slate-400">Profit Target (%)</label>
								<Input
									type="number"
									className="bg-slate-800 border-slate-700 text-white"
									value={form.profitTarget}
									onChange={(e) => setForm((f) => ({ ...f, profitTarget: Number(e.target.value) }))}
								/>
							</div>
							<div>
								<label className="text-xs text-slate-400">Max Drawdown (%)</label>
								<Input
									type="number"
									className="bg-slate-800 border-slate-700 text-white"
									value={form.maxDrawdown}
									onChange={(e) => setForm((f) => ({ ...f, maxDrawdown: Number(e.target.value) }))}
								/>
							</div>
						</div>
						<Button onClick={createChallenge} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500">
							Create
						</Button>
					</CardContent>
				</Card>

				<Card className="bg-slate-900 border-slate-800">
					<CardHeader>
						<CardTitle className="text-slate-200">Existing Challenges</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{challenges.length === 0 && <p className="text-slate-400 text-sm">No challenges yet.</p>}
						{challenges.map((c) => (
							<div key={c.id} className="flex items-center justify-between p-3 rounded-md bg-slate-800">
								<div className="text-slate-200">
									<p className="font-medium">{c.firmId.toUpperCase()} - ${c.accountSize.toLocaleString()}</p>
									<p className="text-xs text-slate-400">Target {c.profitTarget}% • Max DD {c.maxDrawdown}%</p>
								</div>
								<div className="flex items-center gap-2">
									<Select value={c.status} onValueChange={(v: any) => updateStatus(c.id as string, v)}>
										<SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pending">Pending</SelectItem>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="passed">Passed</SelectItem>
											<SelectItem value="failed">Failed</SelectItem>
										</SelectContent>
									</Select>
									<Button variant="destructive" className="h-8" onClick={() => removeChallenge(c.id as string)}>
										Delete
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</AuthGuard>
	)
}