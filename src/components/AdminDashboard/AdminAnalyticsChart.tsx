import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Calendar,
  RefreshCw,
  Users,
  Shield,
  Smartphone,
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart2,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { ThemeMode, AdminAnalyticsData } from '../../types';
import { getAdminAnalyticsApi } from '../../services/api';

interface AdminAnalyticsChartProps {
  theme: ThemeMode;
  initialRange?: string;
  onNavigateTab?: (tab: string) => void;
}

type ChartViewMode = 'growth' | 'activity' | 'breakdown';

const telemetryContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const telemetryBadgeVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const AdminAnalyticsChart: React.FC<AdminAnalyticsChartProps> = ({
  theme,
  initialRange = '30d',
  onNavigateTab,
}) => {
  const isDark = theme === 'dark';
  const [range, setRange] = useState<string>(initialRange);
  const [viewMode, setViewMode] = useState<ChartViewMode>('growth');
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (selectedRange: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminAnalyticsApi(selectedRange);
      setAnalyticsData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load analytics data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  const axisStroke = isDark ? '#64748b' : '#94a3b8';
  const gridStroke = isDark ? '#1e293b' : '#e2e8f0';

  // Custom theme-aware tooltip for Growth chart
  const GrowthTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3.5 rounded-xl border shadow-xl text-xs space-y-2 backdrop-blur-md ${
            isDark ? 'bg-[#0b0e18]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-4 border-b pb-1.5 border-slate-200/40 dark:border-white/10">
            <span className="font-bold">{label}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Telemetry</span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold" style={{ color: entry.color }}>
                  {entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom theme-aware tooltip for Activity chart
  const ActivityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + (Number(entry.value) || 0), 0);
      return (
        <div
          className={`p-3.5 rounded-xl border shadow-xl text-xs space-y-2 backdrop-blur-md ${
            isDark ? 'bg-[#0b0e18]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-4 border-b pb-1.5 border-slate-200/40 dark:border-white/10">
            <span className="font-bold">{label}</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">{total} Total Events</span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`act-item-${index}`} className="flex items-center justify-between gap-4 font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold" style={{ color: entry.color }}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      id="admin-analytics-visualization-panel"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark ? 'bg-[#0f1424] border-white/10' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Component Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Administrative Insights & Analytics
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-semibold">
              Recharts Visualizer
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time trajectory tracking for user registration growth, security audits, and APK distribution events.
          </p>
        </div>

        {/* View mode buttons and Range Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div
            className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              id="analytics-tab-growth"
              onClick={() => setViewMode('growth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'growth'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Growth</span>
            </button>

            <button
              type="button"
              id="analytics-tab-activity"
              onClick={() => setViewMode('activity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'activity'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Recent Activity</span>
            </button>

            <button
              type="button"
              id="analytics-tab-breakdown"
              onClick={() => setViewMode('breakdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'breakdown'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Distribution</span>
            </button>
          </div>

          {/* Time Range Filter */}
          <div
            className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          >
            {[
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setRange(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                  range === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Manual Refresh */}
          <button
            type="button"
            onClick={() => fetchAnalytics(range)}
            disabled={isLoading}
            className={`p-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Refresh Analytics Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Insight Badges */}
      {analyticsData && (
        <motion.div
          variants={telemetryContainerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6"
        >
          <motion.div
            variants={telemetryBadgeVariants}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={`p-3.5 rounded-2xl border ${
              isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200/60'
            }`}
          >
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Active Accounts
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-purple-400">
                {analyticsData.summary.totalUsers.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                +{analyticsData.summary.growthRatePct}%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Total registered base</span>
          </motion.div>

          <motion.div
            variants={telemetryBadgeVariants}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={`p-3.5 rounded-2xl border ${
              isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200/60'
            }`}
          >
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Acquisition Velocity
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">
                ~{analyticsData.summary.avgDailyRegistrations}
              </span>
              <span className="text-[11px] text-slate-400">/ day</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Average daily signups</span>
          </motion.div>

          <motion.div
            variants={telemetryBadgeVariants}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={`p-3.5 rounded-2xl border ${
              isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200/60'
            }`}
          >
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Peak Traffic Day
            </span>
            <div className="text-base sm:text-lg font-bold font-mono text-indigo-300 truncate">
              {analyticsData.summary.peakActivityDay}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Highest event volume</span>
          </motion.div>

          <motion.div
            variants={telemetryBadgeVariants}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={`p-3.5 rounded-2xl border ${
              isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200/60'
            }`}
          >
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Logged Operations
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-amber-400">
                {analyticsData.summary.totalRecentActions.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">events</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">In selected timeframe</span>
          </motion.div>
        </motion.div>
      )}

      {/* Main Visualizer Area */}
      <div className="relative min-h-[340px] flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-xs flex items-center justify-center z-10 rounded-2xl">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Calculating statistical time series...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-center max-w-md my-8 space-y-2">
            <p className="font-bold text-sm">Failed to render chart data</p>
            <p className="text-xs text-red-300">{error}</p>
            <button
              type="button"
              onClick={() => fetchAnalytics(range)}
              className="mt-2 px-3 py-1.5 rounded-lg bg-red-500 text-white font-semibold text-xs hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {analyticsData && !error && (
          <div className="w-full">
            <AnimatePresence mode="wait">
              {/* VIEW 1: USER GROWTH & REGISTRATION VELOCITY */}
              {viewMode === 'growth' && (
                <motion.div
                  key="growth-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between text-xs px-2">
                    <div className="flex items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="font-semibold text-slate-300 dark:text-slate-200">
                          Cumulative Total Users
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                        <span className="font-semibold text-slate-300 dark:text-slate-200">
                          New Daily Registrations
                        </span>
                      </span>
                      <span className="hidden sm:flex items-center gap-1.5">
                        <span className="w-3 h-0.5 border-t-2 border-dashed border-cyan-400" />
                        <span className="font-semibold text-slate-300 dark:text-slate-200">
                          Active Client Sessions
                        </span>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">Dual-Axis Velocity</span>
                  </div>

                  <div className="w-full h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData.growthTimeline}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.4} />
                        <XAxis
                          dataKey="label"
                          stroke={axisStroke}
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="left"
                          stroke={axisStroke}
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                          domain={['dataMin - 10', 'dataMax + 10']}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#10b981"
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                        />
                        <Tooltip content={<GrowthTooltip />} />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="totalUsers"
                          name="Total Accounts"
                          stroke="#8b5cf6"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                          isAnimationActive={true}
                          animationDuration={1000}
                          animationEasing="ease-out"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="newRegistrations"
                          name="New Registrations"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={22}
                          opacity={0.85}
                          isAnimationActive={true}
                          animationDuration={900}
                          animationEasing="ease-out"
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="activeSessions"
                          name="Active Sessions"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          dot={false}
                          strokeDasharray="4 4"
                          isAnimationActive={true}
                          animationDuration={1000}
                          animationEasing="ease-out"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* VIEW 2: RECENT ACTIVITY STATS */}
              {viewMode === 'activity' && (
                <motion.div
                  key="activity-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between text-xs px-2">
                    <div className="flex flex-wrap items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#f59e0b]" />
                        <span className="font-semibold text-slate-300 dark:text-slate-200">
                          Admin Changes & CMS
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#8b5cf6]" />
                        <span className="font-semibold text-slate-300 dark:text-slate-200">
                          Security & Auth Events
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#06b6d4]" />
                        <span className="font-semibold text-slate-300 dark:text-slate-200">
                          APK Downloads & Installs
                        </span>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">Stacked Event Volume</span>
                  </div>

                  <div className="w-full h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.activityTimeline}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.4} />
                        <XAxis
                          dataKey="label"
                          stroke={axisStroke}
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                        />
                        <YAxis stroke={axisStroke} tick={{ fontSize: 11 }} tickLine={false} />
                        <Tooltip content={<ActivityTooltip />} />
                        <Bar
                          dataKey="adminActions"
                          name="Admin Changes"
                          stackId="a"
                          fill="#f59e0b"
                          radius={[0, 0, 0, 0]}
                          maxBarSize={28}
                          isAnimationActive={true}
                          animationDuration={900}
                          animationEasing="ease-out"
                        />
                        <Bar
                          dataKey="securityEvents"
                          name="Security Events"
                          stackId="a"
                          fill="#8b5cf6"
                          radius={[0, 0, 0, 0]}
                          maxBarSize={28}
                          isAnimationActive={true}
                          animationDuration={900}
                          animationEasing="ease-out"
                        />
                        <Bar
                          dataKey="apkDownloads"
                          name="APK Downloads"
                          stackId="a"
                          fill="#06b6d4"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={28}
                          isAnimationActive={true}
                          animationDuration={900}
                          animationEasing="ease-out"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* VIEW 3: CATEGORY DISTRIBUTION */}
              {viewMode === 'breakdown' && (
                <motion.div
                  key="breakdown-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2"
                >
                  <div className="w-full h-[290px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.categoryBreakdown}
                          dataKey="count"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={105}
                          paddingAngle={5}
                          isAnimationActive={true}
                          animationDuration={900}
                          animationEasing="ease-out"
                        >
                          {analyticsData.categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any, name: any) => [`${value.toLocaleString()} events`, name]}
                          contentStyle={{
                            backgroundColor: isDark ? '#0b0e18' : '#ffffff',
                            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                            borderRadius: '12px',
                            color: isDark ? '#fff' : '#000',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Operational Domain Breakdown
                    </h4>
                    <div className="space-y-2.5">
                      {analyticsData.categoryBreakdown.map((item, idx) => {
                        const total = analyticsData.categoryBreakdown.reduce((sum, c) => sum + c.count, 0);
                        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-xs font-semibold text-slate-300 dark:text-slate-200">
                                {item.category}
                              </span>
                            </div>
                            <div className="text-right font-mono">
                              <span className="text-xs font-bold text-slate-100 dark:text-white block">
                                {item.count.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400">{pct}% volume</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Insight Note */}
      <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time server telemetry synchronized with active database session storage.</span>
        </div>
        {onNavigateTab && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('apk')}
              className="text-indigo-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Manage APK Release</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => onNavigateTab('security')}
              className="text-purple-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Security Audits</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
