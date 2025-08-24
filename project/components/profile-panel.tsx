"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, X, Mail, Phone, MapPin, Calendar, Building, Shield, Edit, Camera, Key, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfilePanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })
  const router = useRouter()

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setEditForm({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        address: parsedUser.address || "",
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/auth/login")
  }

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...editForm }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setIsEditing(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-6">
            {user && (
              <>
                {/* Profile Header */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src="/placeholder.svg?height=80&width=80" />
                          <AvatarFallback className="text-lg bg-emerald-600">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-slate-800 border-slate-600"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-slate-400">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className="bg-emerald-600">Active Trader</Badge>
                          <Badge variant="outline">Premium</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-white">
                        <User className="h-5 w-5 mr-2" />
                        Personal Information
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        <Edit className="h-4 w-4 mr-1" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-300">First Name</Label>
                            <Input
                              value={editForm.firstName}
                              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Last Name</Label>
                            <Input
                              value={editForm.lastName}
                              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-slate-300">Email</Label>
                          <Input
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Phone</Label>
                          <Input
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Address</Label>
                          <Input
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            placeholder="123 Main St, City, State"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <Button onClick={handleSaveProfile} className="w-full bg-emerald-600 hover:bg-emerald-700">
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-400">Email</p>
                            <p className="text-white">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-400">Phone</p>
                            <p className="text-white">{user.phone || "Not provided"}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-400">Address</p>
                            <p className="text-white">{user.address || "Not provided"}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-400">Member Since</p>
                            <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Broker Accounts */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Building className="h-5 w-5 mr-2" />
                      Connected Brokers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {user.brokers?.map((broker: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Building className="h-8 w-8 text-emerald-500" />
                          <div>
                            <p className="font-medium text-white">{broker.name}</p>
                            <p className="text-sm text-slate-400">Account: {broker.accountId}</p>
                            <p className="text-sm text-emerald-400">Balance: ${broker.balance?.toLocaleString()}</p>
                          </div>
                        </div>
                        <Badge variant={broker.status === "connected" ? "default" : "secondary"}>{broker.status}</Badge>
                      </div>
                    )) || (
                      <div className="text-center py-6">
                        <Building className="h-12 w-12 mx-auto text-slate-600 mb-2" />
                        <p className="text-slate-400">No brokers connected</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Connect Broker
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Security */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Shield className="h-5 w-5 mr-2" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Shield className="h-4 w-4 mr-2" />
                      Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Preferences
                    </Button>
                  </CardContent>
                </Card>

                <Separator className="bg-slate-700" />

                {/* Logout */}
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
