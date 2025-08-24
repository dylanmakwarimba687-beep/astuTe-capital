"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, ShieldCheck, CheckCircle2, XCircle } from "lucide-react"
import AdminGuard from "@/components/admin-guard"

interface PropFirm {
  id: string
  name: string
  accountSize: number
  profitTarget: number
  maxDrawdown: number
  profitSplit: number
  evaluationFee: number
  newsTrading: boolean
  weekendHolding: boolean
  eaAllowed: boolean
}

interface ChallengeApplication {
  id: string
  trader: string
  firmId: string
  firmName: string
  accountSize: number
  status: "pending" | "approved" | "rejected"
}

export default function AdminChallengesPage() {
  const [firms, setFirms] = useState<PropFirm[]>([
    {
      id: "ftmo",
      name: "FTMO",
      accountSize: 100000,
      profitTarget: 10,
      maxDrawdown: 10,
      profitSplit: 80,
      evaluationFee: 540,
      newsTrading: false,
      weekendHolding: true,
      eaAllowed: true,
    },
  ])
  const [applications, setApplications] = useState<ChallengeApplication[]>([
    { id: "1", trader: "Jane Doe", firmId: "ftmo", firmName: "FTMO", accountSize: 100000, status: "pending" },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newFirm, setNewFirm] = useState<PropFirm>({
    id: "",
    name: "",
    accountSize: 50000,
    profitTarget: 8,
    maxDrawdown: 8,
    profitSplit: 80,
    evaluationFee: 299,
    newsTrading: true,
    weekendHolding: true,
    eaAllowed: true,
  })

  const addFirm = () => {
    if (!newFirm.id || !newFirm.name) return
    setFirms((prev) => [...prev, newFirm])
    setIsDialogOpen(false)
    setNewFirm({
      id: "",
      name: "",
      accountSize: 50000,
      profitTarget: 8,
      maxDrawdown: 8,
      profitSplit: 80,
      evaluationFee: 299,
      newsTrading: true,
      weekendHolding: true,
      eaAllowed: true,
    })
  }

  const removeFirm = (id: string) => setFirms((prev) => prev.filter((f) => f.id !== id))

  const approveApplication = (id: string) =>
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a)))
  const rejectApplication = (id: string) =>
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)))

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
            <ShieldCheck className="h-8 w-8 mr-3 text-emerald-500" /> Admin: Prop Firm Challenges
          </h1>
          <Button className="bg-emerald-600" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Firm
          </Button>
        </div>

        <Tabs defaultValue="firms" className="space-y-6">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="firms" className="data-[state=active]:bg-emerald-600">
              Firms
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-emerald-600">
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="firms">
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-white">Registered Prop Firms</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-400">ID</TableHead>
                      <TableHead className="text-slate-400">Name</TableHead>
                      <TableHead className="text-slate-400">Acct Size</TableHead>
                      <TableHead className="text-slate-400">Profit Target</TableHead>
                      <TableHead className="text-slate-400">Max DD</TableHead>
                      <TableHead className="text-slate-400">Split</TableHead>
                      <TableHead className="text-slate-400">Eval Fee</TableHead>
                      <TableHead className="text-slate-400">Rules</TableHead>
                      <TableHead className="text-right text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {firms.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-mono text-slate-300">{f.id}</TableCell>
                        <TableCell className="text-white">{f.name}</TableCell>
                        <TableCell className="text-slate-300">${f.accountSize.toLocaleString()}</TableCell>
                        <TableCell className="text-slate-300">{f.profitTarget}%</TableCell>
                        <TableCell className="text-slate-300">{f.maxDrawdown}%</TableCell>
                        <TableCell className="text-slate-300">{f.profitSplit}%</TableCell>
                        <TableCell className="text-slate-300">${f.evaluationFee}</TableCell>
                        <TableCell className="text-slate-300 space-x-2">
                          <Badge className={f.newsTrading ? "bg-emerald-700" : "bg-slate-700"}>News</Badge>
                          <Badge className={f.weekendHolding ? "bg-emerald-700" : "bg-slate-700"}>Weekend</Badge>
                          <Badge className={f.eaAllowed ? "bg-emerald-700" : "bg-slate-700"}>EA</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-slate-300">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-400" onClick={() => removeFirm(f.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-white">Challenge Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-slate-400">Trader</TableHead>
                      <TableHead className="text-slate-400">Firm</TableHead>
                      <TableHead className="text-slate-400">Account</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-right text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="text-white">{a.trader}</TableCell>
                        <TableCell className="text-slate-300">{a.firmName}</TableCell>
                        <TableCell className="text-slate-300">${a.accountSize.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={
                            a.status === "approved"
                              ? "bg-green-700"
                              : a.status === "rejected"
                              ? "bg-red-700"
                              : "bg-yellow-700"
                          }>
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" className="text-green-400" onClick={() => approveApplication(a.id)}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-400" onClick={() => rejectApplication(a.id)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add Prop Firm</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400">ID</Label>
                <Input value={newFirm.id} onChange={(e) => setNewFirm({ ...newFirm, id: e.target.value })} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-400">Name</Label>
                <Input value={newFirm.name} onChange={(e) => setNewFirm({ ...newFirm, name: e.target.value })} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-400">Account Size</Label>
                <Input type="number" value={newFirm.accountSize} onChange={(e) => setNewFirm({ ...newFirm, accountSize: Number(e.target.value) })} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-400">Profit Target %</Label>
                <Input type="number" value={newFirm.profitTarget} onChange={(e) => setNewFirm({ ...newFirm, profitTarget: Number(e.target.value) })} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-400">Max Drawdown %</Label>
                <Input type="number" value={newFirm.maxDrawdown} onChange={(e) => setNewFirm({ ...newFirm, maxDrawdown: Number(e.target.value) })} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-400">Profit Split %</Label>
                <Input type="number" value={newFirm.profitSplit} onChange={(e) => setNewFirm({ ...newFirm, profitSplit: Number(e.target.value) })} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div>
                <Label className="text-slate-400">Evaluation Fee $</Label>
                <Input type="number" value={newFirm.evaluationFee} onChange={(e) => setNewFirm({ ...newFirm, evaluationFee: Number(e.target.value) })} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 text-slate-300">
                  <Checkbox checked={newFirm.newsTrading} onCheckedChange={(v) => setNewFirm({ ...newFirm, newsTrading: Boolean(v) })} />
                  <span>News Trading</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-300">
                  <Checkbox checked={newFirm.weekendHolding} onCheckedChange={(v) => setNewFirm({ ...newFirm, weekendHolding: Boolean(v) })} />
                  <span>Weekend Holding</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-300">
                  <Checkbox checked={newFirm.eaAllowed} onCheckedChange={(v) => setNewFirm({ ...newFirm, eaAllowed: Boolean(v) })} />
                  <span>EA Allowed</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600" onClick={addFirm}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
}