"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Bot,
  ChevronRight,
  Award,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { AnalyticsDataPoint, InterviewHistoryItem } from "@/types/dashboard";

interface InterviewAnalyticsProps {
  analyticsData: AnalyticsDataPoint[];
  recentInterviews: InterviewHistoryItem[];
  onSelectInterview?: (interview: InterviewHistoryItem) => void;
  onStartInterview: () => void;
}

type MetricKey = "overall" | "technical" | "communication" | "problemSolving";

export function InterviewAnalytics({
  analyticsData,
  recentInterviews,
  onSelectInterview,
  onStartInterview,
}: InterviewAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("overall");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  const metricConfig: Record<
    MetricKey,
    { label: string; stroke: string; fill: string; fillId: string }
  > = {
    overall: {
      label: "Overall Score",
      stroke: "#FFE600",
      fill: "#FFE600",
      fillId: "overallGradient",
    },
    technical: {
      label: "Technical Proficiency",
      stroke: "#38bdf8",
      fill: "#38bdf8",
      fillId: "techGradient",
    },
    communication: {
      label: "Communication & STAR",
      stroke: "#a855f7",
      fill: "#a855f7",
      fillId: "commGradient",
    },
    problemSolving: {
      label: "Problem Solving",
      stroke: "#34d399",
      fill: "#34d399",
      fillId: "psGradient",
    },
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: AnalyticsDataPoint = payload[0].payload;
      return (
        <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 shadow-xl space-y-2 text-xs">
          <div className="border-b border-neutral-800 pb-1.5 flex items-center justify-between gap-4">
            <span className="font-semibold text-white truncate max-w-[180px]">{data.sessionName}</span>
            <span className="text-[10px] text-neutral-400 font-mono">{label}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <span className="text-neutral-400">Overall Score:</span>
              <span className="font-semibold text-[#FFE600] font-mono">{data.overall}%</span>
            </div>
            <div className="flex justify-between items-center gap-4 text-[11px]">
              <span className="text-neutral-400">Technical Depth:</span>
              <span className="text-sky-300 font-mono">{data.technical}%</span>
            </div>
            <div className="flex justify-between items-center gap-4 text-[11px]">
              <span className="text-neutral-400">STAR Communication:</span>
              <span className="text-purple-300 font-mono">{data.communication}%</span>
            </div>
            <div className="flex justify-between items-center gap-4 text-[11px]">
              <span className="text-neutral-400">Problem Solving:</span>
              <span className="text-emerald-300 font-mono">{data.problemSolving}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const latestDataPoint = analyticsData[analyticsData.length - 1];
  const firstDataPoint = analyticsData[0];
  const scoreGain =
    latestDataPoint && firstDataPoint
      ? Math.max(0, latestDataPoint.overall - firstDataPoint.overall)
      : 0;

  return (
    <div
      id="analytics"
      className="rounded-2xl bg-neutral-900/80 border border-neutral-800/90 p-6 backdrop-blur-sm shadow-sm space-y-6"
    >
      {/* Analytics Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Mock Interview Score Progress & Analytics
            </h2>
          </div>
          <p className="text-xs text-neutral-400">
            Performance trajectory across technical problem solving, STAR communication, and system design
          </p>
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800 self-start sm:self-auto">
          {(["7d", "30d", "all"] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                timeRange === range
                  ? "bg-[#FFE600] text-neutral-950"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Category Metric Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {(Object.keys(metricConfig) as MetricKey[]).map((key) => {
          const cfg = metricConfig[key];
          const isSelected = selectedMetric === key;
          const latestValue = analyticsData[analyticsData.length - 1]?.[key] || 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedMetric(key)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-neutral-800/80 border-[#FFE600]/60 shadow-sm"
                  : "bg-neutral-950/40 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <p className="text-[11px] font-medium text-neutral-400 truncate">
                {cfg.label}
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span
                  className="text-lg font-bold font-mono"
                  style={{ color: isSelected ? cfg.stroke : "#ffffff" }}
                >
                  {latestValue}%
                </span>
                {scoreGain > 0 && (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center">
                    <ArrowUpRight className="w-3 h-3" />+{scoreGain}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-64 sm:h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={analyticsData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFE600" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FFE600" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="techGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="commGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="psGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[40, 100]}
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={metricConfig[selectedMetric].stroke}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${metricConfig[selectedMetric].fillId})`}
              dot={{
                r: 3.5,
                fill: metricConfig[selectedMetric].stroke,
                strokeWidth: 2,
                stroke: "#111216",
              }}
              activeDot={{
                r: 5,
                fill: "#FFE600",
                stroke: "#000000",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Mock Interview History List */}
      <div className="space-y-3 pt-4 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Recent Simulation Sessions ({recentInterviews.length})
          </span>
          <button
            type="button"
            onClick={onStartInterview}
            className="text-xs font-medium text-[#FFE600] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Launch New Simulation</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentInterviews.length > 0 ? (
            recentInterviews.map((item) => {
              const isHigh = item.score >= 85;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectInterview?.(item)}
                  className="p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#FFE600] transition-colors">
                        {item.role}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-medium bg-neutral-800 text-neutral-300">
                        {item.type}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {item.difficulty}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 line-clamp-1">
                      <strong className="text-emerald-400 font-medium">Strength:</strong> {item.keyStrength}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span
                          className={`text-sm font-bold font-mono ${
                            isHigh ? "text-emerald-400" : "text-[#FFE600]"
                          }`}
                        >
                          {item.score}%
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400">{item.completedAt}</p>
                    </div>

                    <div className="w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-neutral-950 group-hover:bg-[#FFE600] transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 rounded-xl bg-neutral-950/40 border border-dashed border-neutral-800 text-center space-y-3">
              <Bot className="w-7 h-7 text-neutral-500 mx-auto" />
              <p className="text-xs text-neutral-400">
                No mock interview simulations completed yet. Start your first session to track performance analytics.
              </p>
              <button
                type="button"
                onClick={onStartInterview}
                className="px-4 py-2 rounded-xl bg-[#FFE600] text-neutral-950 font-semibold text-xs shadow-sm"
              >
                Launch Mock Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
