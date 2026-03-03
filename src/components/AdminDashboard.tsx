import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Key, 
  BarChart3, 
  Users, 
  Settings, 
  Plus, 
  Shield, 
  Zap, 
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  status: 'active' | 'revoked';
  usage: number;
}

const initialKeys: APIKey[] = [
  { id: '1', name: 'Production App', key: 'sk_live_....4f21', created: '2024-03-15', status: 'active', usage: 12504 },
  { id: '2', name: 'Development', key: 'sk_test_....9a12', created: '2024-03-10', status: 'active', usage: 450 },
  { id: '3', name: 'Staging Environment', key: 'sk_stg_....bc34', created: '2024-02-28', status: 'revoked', usage: 0 },
];

export function AdminDashboard() {
  const [keys, setKeys] = useState<APIKey[]>(initialKeys);

  const generateNewKey = () => {
    const newKey: APIKey = {
      id: crypto.randomUUID(),
      name: `New Key ${keys.length + 1}`,
      key: `sk_live_....${Math.random().toString(36).substring(7)}`,
      created: new Date().toISOString().split('T')[0],
      status: 'active',
      usage: 0,
    };
    setKeys([newKey, ...keys]);
    toast.success('New API key generated successfully!');
  };

  const toggleKeyStatus = (id: string) => {
    setKeys(keys.map(k => {
      if (k.id === id) {
        const newStatus = k.status === 'active' ? 'revoked' : 'active';
        toast.info(`Key ${newStatus === 'active' ? 'activated' : 'revoked'}`);
        return { ...k, status: newStatus as 'active' | 'revoked' };
      }
      return k;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage your API infrastructure and usage metrics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button onClick={generateNewKey} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Generate API Key
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Requests" 
          value="1.2M" 
          change="+12.5%" 
          trend="up" 
          icon={Zap}
          color="text-yellow-600 bg-yellow-50"
        />
        <StatsCard 
          title="Active Users" 
          value="2,405" 
          change="+5.2%" 
          trend="up" 
          icon={Users}
          color="text-blue-600 bg-blue-50"
        />
        <StatsCard 
          title="Avg Latency" 
          value="184ms" 
          change="-12ms" 
          trend="down" 
          icon={Clock}
          color="text-green-600 bg-green-50"
        />
        <StatsCard 
          title="Error Rate" 
          value="0.04%" 
          change="+0.01%" 
          trend="up" 
          icon={Shield}
          color="text-purple-600 bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Keys Table */}
        <Card className="lg:col-span-2 shadow-sm border-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Access Keys
                </CardTitle>
                <CardDescription>Authentication keys for programmatic access.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{key.key}</TableCell>
                    <TableCell>{key.created}</TableCell>
                    <TableCell>{key.usage.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={key.status === 'active' ? 'default' : 'destructive'} className="uppercase text-[10px]">
                        {key.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleKeyStatus(key.id)}
                        className={key.status === 'active' ? 'text-destructive' : 'text-primary'}
                      >
                        {key.status === 'active' ? 'Revoke' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <div className="space-y-6">
          <Card className="shadow-sm border-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Translation Engine</span>
                  <span className="text-green-600 font-medium">Healthy</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[98%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>API Gateway</span>
                  <span className="text-green-600 font-medium">99.9% Uptime</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[99.9%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Database Cluster</span>
                  <span className="text-yellow-600 font-medium">High Load</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[82%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground shadow-xl border-none overflow-hidden relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Upgrade Storage</h3>
                  <p className="text-xs text-primary-foreground/70">You are at 85% capacity</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full font-semibold">
                Expand Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, trend, icon: Icon, color }: any) {
  return (
    <Card className="shadow-sm border-primary/5 overflow-hidden group hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className={`p-2 rounded-lg ${color} transition-transform group-hover:rotate-12`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}