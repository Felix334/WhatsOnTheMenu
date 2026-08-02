"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation"; // Removed useSearchParams

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Menu, Users, UserPlus, Settings, Mail, Landmark, Plus, Calendar, Phone, MapPin, User, Store, HandCoinsIcon } from "lucide-react";

export default function AdminConsole() {
  /* ---------------- State ---------------- */

  const [search, setSearch ] = useState("");
  const [filter, setFilter] = useState("all");
  const [userList, setUserList] = useState([]);

  const [requestList, setRequestList] = useState([]);
  const [activePage, setActivePage] = useState("users");

  const { data: session, status } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  /* ---------------- Auth ---------------- */

  const userID = session?.user?.id || "";
  const role = session?.user?.role || "";

  const authorizedUser = userID && role === "Admin";

  /* ---------------- URL Sync ---------------- */

  useEffect(() => {
    if (!userID) return;

    const params = new URLSearchParams(window.location.search);

    if (params.get("userID") !== userID) {
      params.set("userID", userID);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [userID, pathname, router]);

  /* ---------------- Fetch Users ---------------- */

  useEffect(() => {
    if (status !== "authenticated" || !authorizedUser) return;

    const fetchUsers = async () => {
      try {
        const resp = await fetch("/api/Admin/getData/getUserList", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search }),
        });

        if (!resp.ok) throw new Error("Fetch failed");

        const json = await resp.json();

        setUserList(json.data || []);

        const map = {};

        (json.data || []).forEach((u) => {
          map[u.id] = u.role;
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [status, search, authorizedUser]);

  /* ---------------- Guards ---------------- */

  if (status === "loading") return <div>Lade...</div>;
  if (!session) return <div>Bitte anmelden</div>;
  if (!authorizedUser) return <div>Keine Berechtigung</div>;

  /* ---------------- Helpers ---------------- */

  const filtered = userList.filter((u) => (filter === "all" || u.role === filter) && u.name?.toLowerCase().includes(search.toLowerCase()));


  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen grid grid-cols-12 bg-slate-50">
      {/* Sidebar */}
      <aside className="col-span-2 hidden md:flex flex-col gap-4 p-4 border-r bg-white">
        <div className="text-xl font-semibold flex items-center gap-2">
          <Menu className="w-5 h-5" /> Admin
        </div>

        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-2" onClick={() => setActivePage("users")}>
            <Users className="w-4 h-4" /> Users
          </Button>

          <Button variant="ghost" className="justify-start gap-2 flex flex-row items-center" onClick={() => setActivePage("abboRequests")}>
            <HandCoinsIcon className="w-4 h-4" />
            <span>Abbo-Upgrades</span>
          </Button>

          <Button variant="ghost" className="justify-start gap-2" onClick={() => setActivePage("settings")}>
            <Settings className="w-4 h-4" /> Settings
          </Button>

          <Button variant="ghost" className="justify-start gap-2" onClick={() => setActivePage("messages")}>
            <Mail className="w-4 h-4" /> Nachrichten
          </Button>

          <Button variant="ghost" className="justify-start gap-2" onClick={() => setActivePage("finances")}>
            <Landmark className="w-4 h-4" /> Finanzen
          </Button>

          <Button variant="ghost" className="justify-start gap-2" onClick={() => setActivePage("supabase")}>
            <Landmark className="w-4 h-4" /> Supabase-Nutzung
          </Button>
        </nav>
      </aside>

      {/* Main */}
      <main className="col-span-12 md:col-span-10 p-4">
        {activePage === "users" && renderUsers()}
        {activePage === "settings" && renderSettings()}
        {activePage === "abboRequests" && renderAbboRequests()}
        {activePage === "messages" && renderMessages()}
        {activePage === "finances" && renderFinances()}
        {activePage === "supabase" && renderSupabaseUsage()}
      </main>
    </div>
  );

  /* ---------------- Pages ---------------- */

  function renderUsers() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Konsole</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Insgesamt",
              value: userList.length,
            },
            {
              label: "Admins",
              value: userList.filter((u) => u.role === "Admin").length,
            },
            {
              label: "Owner",
              value: userList.filter((u) => u.role === "Owner").length,
            },
            {
              label: "User",
              value: userList.filter((u) => u.role === "User").length,
            },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader>
                <CardTitle className="text-sm">{s.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{s.value}</CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row gap-3">
            <CardTitle>Users</CardTitle>

            <div className="flex gap-3 ml-auto">
              <Input placeholder="Suchen..." value={search} onChange={(e) => setSearch(e.target.value)} />

              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>UUID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>

                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>
                      <Badge variant={u.status === "active" ? "default" : u.status === "pending" ? "secondary" : "destructive"}>{u.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderRequests(requests) {
    const confirmRequest = async () => {
      if (process.env.NODE_ENV === "development") console.log("Sende:", requests);
      const resp = await fetch("/api/restaurant/Admin/postRequests", {
        method: "POST",
        body: JSON.stringify({ requests }),
      });
      if (!resp.ok) {
        window.alert("Ein Fehler ist aufgetreten:", resp);
      }
    };

    if (process.env.NODE_ENV === "development") console.log("Render Reuests", requests);
    const requestArray = Array.isArray(requests) ? requests : [];

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-6">Restaurant Anfragen</h1>

        {requestArray.length === 0 && <p className="text-gray-500">Keine Anfragen vorhanden</p>}

        <ScrollArea className="h-[85vh] pr-4">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requestArray.map((req) => (
              <Card key={req.id} className="rounded-2xl shadow-sm hover:shadow-md transition">
                <CardHeader className="flex flex-row justify-between items-center">
                  <h2 className="text-xl font-semibold truncate">{req.restaurantName}</h2>

                  <Badge variant={req.status === "pending" ? "secondary" : req.status === "approved" ? "default" : "destructive"}>{req.status || "unknown"}</Badge>
                </CardHeader>

                <CardContent className="space-y-3 text-sm text-gray-700">
                  <p className="text-gray-600 line-clamp-2">{req.description || "Keine Beschreibung"}</p>

                  <div className="flex items-center gap-2">
                    <User size={16} />
                    {req.owner?.name || req.name || "Unbekannt"}
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {req.email}
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {req.phoneNumber}
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-1" />

                    <div>
                      {req.street} {req.houseNumber}
                      <br />
                      {req.postalCode} {req.city}
                      <br />
                      {req.country}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Store size={16} />
                    Kategorie: {req.category}
                  </div>
                  <div className="flex items-center gap-2">
                    <Store size={16} />
                    Subscription: {req.subscription}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                    <Calendar size={14} />
                    {req.createdAt && new Date(req.createdAt).toLocaleDateString("de-DE")}
                  </div>
                  <div className="grid gap-1">
                    <Button onClick={() => confirmRequest(req)}>Bestätigen</Button>
                    <Button variant="destructive">Löschen</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  function renderAbboRequests() {
    return <div>Abbo-Anfrage</div>
  }

  function renderSettings() {
    return <div>Settings (coming soon)</div>;
  }

  function renderMessages() {
    return <div>Nachrichten (coming soon)</div>;
  }

  function renderFinances() {
    return <div>Finanzen (coming soon)</div>;
  }
  function renderSupabaseUsage() {
    return <div>Supabase-Nutzung</div>;
  }
}

/*
-Name des Restaurants
-Postleitzahl
-Stadt
Straße
Hausnummer
Telefonnummmer
Öffnungszeiten
Kategorie
*/

