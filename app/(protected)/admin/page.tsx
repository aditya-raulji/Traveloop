'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const tripStatusData = [
  { name: 'Ongoing', value: 34 },
  { name: 'Upcoming', value: 128 },
  { name: 'Completed', value: 180 }
];
const COLORS = ['#2C4A3B', '#D4AF37', '#8C7A6B'];

const userGrowthData = [
  { month: 'Jan', users: 400 },
  { month: 'Feb', users: 300 },
  { month: 'Mar', users: 600 },
  { month: 'Apr', users: 800 },
  { month: 'May', users: 500 },
  { month: 'Jun', users: 900 }
];

const platformActivityData = [
  { date: '1', trips: 10, activities: 24, posts: 5 },
  { date: '5', trips: 15, activities: 30, posts: 8 },
  { date: '10', trips: 12, activities: 45, posts: 15 },
  { date: '15', trips: 20, activities: 50, posts: 25 },
  { date: '20', trips: 25, activities: 40, posts: 18 },
  { date: '25', trips: 35, activities: 60, posts: 30 },
  { date: '30', trips: 45, activities: 80, posts: 40 }
];

export default function AdminOverview() {
  const [stats, setStats] = useState({ users: 1247, trips: 342, active: 89, activities: 4521 });

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h1 className="text-section-heading text-earth">Dashboard Overview</h1>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats.users.toLocaleString() },
          { label: 'Total Trips', value: stats.trips.toLocaleString() },
          { label: 'Active Now', value: stats.active.toLocaleString() },
          { label: 'Activities', value: stats.activities.toLocaleString() }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[24px] p-8 text-center shadow-premium border border-earth/5 hover:scale-[1.02] transition-transform">
            <p className="font-heading italic text-[44px] text-gold mb-2 leading-none">{stat.value}</p>
            <p className="font-body text-[10px] text-earth-muted uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pie Chart */}
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-earth/10">
          <h3 className="font-medium text-lg text-earth mb-6">Trips by Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tripStatusData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {tripStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {tripStatusData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm text-earth-muted">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-earth/10">
          <h3 className="font-medium text-lg text-earth mb-6">New Users per Month</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8C7A6B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8C7A6B' }} dx={-10} />
                <RechartsTooltip cursor={{ fill: '#F5F2EB' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="users" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* FULL WIDTH LINE CHART */}
      <div className="bg-white rounded-[24px] p-8 shadow-sm border border-earth/10">
        <h3 className="font-medium text-lg text-earth mb-6">Platform Activity (Last 30 Days)</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={platformActivityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0D8" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8C7A6B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8C7A6B' }} dx={-10} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="trips" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4, fill: '#D4AF37' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="activities" stroke="#2C4A3B" strokeWidth={3} dot={{ r: 4, fill: '#2C4A3B' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="posts" stroke="#8C7A6B" strokeWidth={3} dot={{ r: 4, fill: '#8C7A6B' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gold" /><span className="text-sm text-earth-muted">Trips created</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-forest" /><span className="text-sm text-earth-muted">Activities added</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-earth-muted" /><span className="text-sm text-earth-muted">Community posts</span></div>
        </div>
      </div>
    </div>
  );
}
