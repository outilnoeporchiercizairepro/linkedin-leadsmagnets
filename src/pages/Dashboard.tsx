import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageSquare, Target } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useActivityChart } from "@/hooks/useActivityChart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [periodDays, setPeriodDays] = useState(30);
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const { data: chartData, isLoading: chartLoading } = useActivityChart(periodDays);

  const periods = [
    { label: "1J", days: 1 },
    { label: "7J", days: 7 },
    { label: "30J", days: 30 },
    { label: "90J", days: 90 },
    { label: "1An", days: 365 },
  ];

  const statsCards = [
    {
      title: "Posts publiés",
      value: statsLoading ? "..." : (stats?.publishedPosts ?? 0).toString(),
      change: `+${stats?.postsThisMonth ?? 0} ce mois`,
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Commentaires reçus",
      value: statsLoading ? "..." : (stats?.totalComments ?? 0).toString(),
      change: `+${stats?.commentsThisMonth ?? 0} ce mois`,
      icon: MessageSquare,
      color: "text-primary",
    },
    {
      title: "Leads générés",
      value: statsLoading ? "..." : (stats?.totalLeads ?? 0).toString(),
      change: `+${stats?.leadsThisMonth ?? 0} ce mois`,
      icon: Target,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Vue d'ensemble de vos performances LinkedIn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className="h-12 w-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Évolution de l'activité</CardTitle>
              <CardDescription>Commentaires, leads et DMs envoyés</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {periods.map((period) => (
                <Button
                  key={period.days}
                  variant={periodDays === period.days ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriodDays(period.days)}
                  className="min-w-[60px]"
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Chargement des données...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart 
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDms" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  strokeOpacity={0.2}
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))", strokeOpacity: 0.3 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    padding: "12px 16px",
                  }}
                  labelStyle={{ 
                    color: "hsl(var(--foreground))", 
                    fontWeight: 600,
                    marginBottom: "8px",
                    fontSize: "14px"
                  }}
                  itemStyle={{ 
                    color: "hsl(var(--foreground))",
                    fontSize: "13px",
                    padding: "4px 0"
                  }}
                  cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 2, strokeDasharray: "5 5" }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "24px" }}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "13px" }}>{value}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="comments" 
                  name="Commentaires"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2.5}
                  fill="url(#colorComments)"
                  dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="dms" 
                  name="DMs envoyés"
                  stroke="hsl(142 76% 36%)" 
                  strokeWidth={2.5}
                  fill="url(#colorDms)"
                  dot={{ fill: "hsl(142 76% 36%)", r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  name="Leads"
                  stroke="hsl(221 83% 53%)" 
                  strokeWidth={2.5}
                  fill="url(#colorLeads)"
                  dot={{ fill: "hsl(221 83% 53%)", r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Vos dernières actions sur LinkedIn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 animate-pulse">
                    <div className="h-2 w-2 bg-muted rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}