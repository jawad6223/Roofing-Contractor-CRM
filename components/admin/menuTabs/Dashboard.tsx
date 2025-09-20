import React from 'react'
import { BarChart3, Activity, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminStats, recentLeads, contractors } from './Data';

export const Dashboard = () => {

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminStats.map((stat, index) => (
          <Card
            key={index}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium underline text-gray-500">{stat.time}</span>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#286BBD] font-medium">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 text-[#122E5F] mr-2" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {lead.homeowner}
                    </p>
                    <p className="text-sm text-gray-600">
                      {lead.location} • {lead.claimAmount}
                    </p>
                  </div>
                  <Badge className="bg-[#286BBD]/5 text-[#286BBD] hover:bg-[#286BBD]/20">
                    {lead.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 text-[#122E5F] mr-2" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contractors.slice(0, 3).map((contractor) => (
                <div
                  key={contractor.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {contractor.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {contractor.conversionRate} conversion •{" "}
                      {contractor.totalEarnings}
                    </p>
                  </div>
                  <Badge className="bg-[#286BBD]/5 text-[#286BBD] hover:bg-[#286BBD]/20">
                    {contractor.leadsCompleted} closed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
