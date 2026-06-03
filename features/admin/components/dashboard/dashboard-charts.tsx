"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ChartPoint = {
  month: string;
  properties: number;
  leads: number;
  inquiries: number;
};

type DashboardChartsProps = {
  data: ChartPoint[];
};

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  fontSize: "13px",
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
};

function growthData(data: ChartPoint[]) {
  return data.map((row, i) => ({
    month: row.month,
    total: row.properties + row.leads + row.inquiries,
    cumulative:
      data.slice(0, i + 1).reduce((sum, d) => sum + d.properties + d.leads + d.inquiries, 0),
  }));
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const [tab, setTab] = useState("overview");
  const growth = growthData(data);

  return (
    <div className="rounded-xl border border-border/80 bg-background shadow-sm">
      <div className="border-b border-border/60 px-6 py-5">
        <h2 className="font-heading text-lg font-semibold text-foreground">Analytics</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Interactive trends over the last 6 months
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="p-6 pt-4">
        <TabsList className="mb-6 h-auto flex-wrap gap-1 bg-muted/50 p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-xs sm:text-sm">
            Properties
          </TabsTrigger>
          <TabsTrigger value="leads" className="text-xs sm:text-sm">
            Leads
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="text-xs sm:text-sm">
            Inquiries
          </TabsTrigger>
          <TabsTrigger value="growth" className="text-xs sm:text-sm">
            Monthly Growth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <ChartContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProperties" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C8FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00C8FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="properties" name="Properties" stroke="#00C8FF" fill="url(#colorProperties)" strokeWidth={2} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#D4AF37" fill="url(#colorLeads)" strokeWidth={2} />
              <Area type="monotone" dataKey="inquiries" name="Inquiries" stroke="#374151" fill="url(#colorInquiries)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="properties" className="mt-0">
          <ChartContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="properties" name="Properties Added" fill="#00C8FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="leads" className="mt-0">
          <ChartContainer>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="leads" name="Leads Generated" stroke="#D4AF37" strokeWidth={3} dot={{ fill: "#D4AF37", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="inquiries" className="mt-0">
          <ChartContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInquiryOnly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#374151" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#374151" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="inquiries" name="Inquiry Trends" stroke="#374151" fill="url(#colorInquiryOnly)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="growth" className="mt-0">
          <ChartContainer>
            <BarChart data={growth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="total" name="Monthly Total" fill="#00C8FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cumulative" name="Cumulative Growth" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChartContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("h-80 w-full")}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
