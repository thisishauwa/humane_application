"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, LogOut, Edit } from "lucide-react"
import { useState } from "react"

export function ProfileSection({
  onSettingsClick,
  onLogoutClick,
}: {
  onSettingsClick: () => void
  onLogoutClick: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [company, setCompany] = useState("Acme Corp")

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-base font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <Separator />

      {isEditing ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="flex space-x-2 pt-2">
            <button
              className="flex-1 px-4 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium">Profile Information</h4>
              <p className="text-sm text-muted-foreground">Update your account details</p>
            </div>
            <button
              className="p-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Company</p>
            <p className="text-sm">{company}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Subscription</p>
            <p className="text-sm">Free Plan (4 rewrites remaining)</p>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-2 pt-4">
        <button
          className="w-full px-4 py-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200 flex items-center justify-center"
          onClick={onSettingsClick}
        >
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </button>
        <button
          className="w-full px-4 py-2 rounded-full bg-gradient-to-b from-red-400 to-red-500 text-white focus:ring-2 focus:ring-red-300 hover:shadow-lg transition duration-200 flex items-center justify-center"
          onClick={onLogoutClick}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  )
}
