"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, Users, UserPlus, Settings, Activity, Plus, Mail, Landmark } from "lucide-react";

export default function AdminConsole() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [userList, setUserList] = useState([]);
  const [rolesMap, setRolesMap] = useState({}); // Stores role per user

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";
  const autherizedUser = userID && role === "Admin";

  // Update URL with userID
  useEffect(() => {
    if (!userID) return;

    const params = new URLSearchParams(searchParams);
    if (params.get("userID") === userID) return;

    params.set("userID", userID);
    router.replace(`${pathname}?${params.toString()}`);
  }, [userID, pathname, router, searchParams]);

  // Fetch user list after authentication
  useEffect(() => {
    if (status !== "authenticated" || !autherizedUser) return;

    const getUserList = async () => {
      try {
        const resp = await fetch("/api/user/userList", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search }),
        });

        if (!resp.ok) throw new Error("Failed to fetch users");
        const data = await resp.json();
        setUserList(data.data || {});

        // Initialize rolesMap
        const map = {};
        (data.data || []).forEach((u) => {
          map[u.id] = u.role;
        });
        setRolesMap(map);
      } catch (err) {
        console.error(err);
      }
    };

    getUserList();
  }, [status, session, search, autherizedUser]);

  if (!session || status === "unauthenticated") return <div>Bitte anmelden</div>;

  // Filter users based on search and role
  const filtered = userList.filter((u) => (filter === "all" || u.role === filter) && u.name.toLowerCase().includes(search.toLowerCase()));

  const handleRoleChange = (userId, newRole) => {
    setRolesMap((prev) => ({ ...prev, [userId]: newRole }));
    // Optional: send PATCH/POST request to update role in DB
  };

  return (
    <div className="min-h-screen grid grid-cols-12 bg-slate-50">
      {/* Sidebar */}
      <aside className="col-span-2 hidden md:flex flex-col gap-4 p-4 border-r bg-white">
        <div className="text-xl font-semibold flex items-center gap-2">
          <Menu className="w-5 h-5" /> Admin
        </div>
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-2">
            <Users className="w-4 h-4" /> Users
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <Settings className="w-4 h-4" /> Settings
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <UserPlus className="w-4 h-4" /> Anfragen
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <Mail className="w-4 h-4" /> Nachrichten
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <Landmark className="w-4 h-4" /> Finanzen
          </Button>
        </nav>
      </aside>

      {/* Main */}
      <main className="col-span-12 md:col-span-10 p-4 space-y-6">
        <h1 className="text-2xl font-bold">Admin Konsole</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Insgesamt", value: userList.length },
            { label: "Admins", value: userList.filter((u) => u.role === "Admin").length },
            { label: "Owner", value: userList.filter((u) => u.role === "Owner").length },
            { label: "Benutzer", value: userList.filter((u) => u.role === "User").length },
          ].map((s) => (
            <Card key={s.label} className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">{s.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{s.value}</CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Users</CardTitle>
            <div className="flex flex-col md:flex-row gap-3">
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-64" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> New
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="list">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Select value={rolesMap[u.id]} onValueChange={(val) => handleRoleChange(u.id, val)}>
                            <SelectTrigger className="w-full md:w-40">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="User">User</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Owner">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.status === "active" ? "default" : u.status === "pending" ? "secondary" : "destructive"}>{u.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="activity">
                <div className="text-sm text-slate-500">Recent admin activity will appear here…</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
