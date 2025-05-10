"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LogOut, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export function ProfileSection({
  onLogoutClick,
}: {
  onLogoutClick: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (profile) {
        setName(profile.full_name || '')
        setEmail(profile.email || '')
        setCompany(profile.company || '')
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          company: company,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      setIsEditing(false)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-center">
          <h3 className="text-base font-medium">{name || 'No name set'}</h3>
          <p className="text-sm text-muted-foreground">{email || 'No email set'}</p>
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
            <Input id="email" value={email} disabled />
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
            <p className="text-sm">{company || 'Not set'}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Subscription</p>
            <p className="text-sm">Free Plan (4 rewrites remaining)</p>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-2 pt-4">
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
