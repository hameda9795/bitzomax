"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Clock, Activity, TrendingUp, ListMusic, UserPlus } from "lucide-react";
import Link from "next/link";
import { useUsers } from "@/hooks/use-users";
import { useSongs } from "@/hooks/use-songs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const { users, loading: usersLoading } = useUsers();
  const { songs, loading: songsLoading } = useSongs();
  const [premiumCount, setPremiumCount] = useState(0);
  const [recentActive, setRecentActive] = useState(0);
  
  useEffect(() => {
    // Count premium users
    if (users.length > 0) {
      const premium = users.filter(user => 
        user.subscriptionType.toLowerCase().includes('premium')
      ).length;
      setPremiumCount(premium);
      
      // Count recently active users (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recent = users.filter(user => {
        if (!user.lastLogin) return false;
        const loginDate = new Date(user.lastLogin);
        return loginDate > oneWeekAgo;
      }).length;
      setRecentActive(recent);
    }
  }, [users]);
  
  // Check if a song is premium (assuming "premium" in genre tag)
  const isPremium = (genre: string | null) => {
    return genre?.toLowerCase().includes('premium') || false;
  };
  
  // Calculate premium songs count
  const premiumSongsCount = songs.filter(song => isPremium(song.genre)).length;
  
  // Calculate recent songs (last 30 days)
  const recentSongs = songs.filter(song => {
    if (!song.createdAt) return false;
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const uploadDate = new Date(song.createdAt);
    return uploadDate > oneMonthAgo;
  }).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage users, music and platform settings
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  {recentActive} active in the last 7 days
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Premium Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Premium Users
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{premiumCount}</div>
                <p className="text-xs text-muted-foreground">
                  {users.length > 0 
                    ? `${Math.round((premiumCount / users.length) * 100)}% of users`
                    : "No users yet"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Total Songs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Songs
            </CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {songsLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{songs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {recentSongs} added in the last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Premium Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Premium Content
            </CardTitle>
            <ListMusic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {songsLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{premiumSongsCount}</div>
                <p className="text-xs text-muted-foreground">
                  {songs.length > 0 
                    ? `${Math.round((premiumSongsCount / songs.length) * 100)}% of content`
                    : "No songs yet"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Access */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Perform common admin tasks quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/users">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/songs">
                <Button variant="outline" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Manage Songs
                </Button>
              </Link>
              <Link href="/admin/songs">
                <Button variant="outline" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add New User
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Scheduled Tasks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}