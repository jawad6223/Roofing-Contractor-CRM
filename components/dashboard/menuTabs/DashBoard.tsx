import { Home, FileText, TrendingUp, DollarSign, BarChart3, Users, UserPlus, Settings, Package } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { DashBoardProps } from '@/types/DashboardTypes'

export const DashBoard = ({ onTabChange }: DashBoardProps) => {
  const { getCurrentUserFullName } = useAuth()
  const currentUserFullName = getCurrentUserFullName()
  
  return (
    <>
              {/* Welcome section */}
              <div className="mb-8 relative overflow-hidden bg-gradient-to-br from-[#122E5F] via-[#286BBD] to-[#2563eb] rounded-2xl p-8 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold capitalize">
                        Welcome back, {currentUserFullName}! 👋
                      </h1>
                      <p className="text-blue-100 text-lg">
                        Your business performance at a glance
                      </p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-4 right-8 w-20 h-20 bg-white/5 rounded-full"></div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">Purchased Leads</CardTitle>
                    <div className="w-10 h-10 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#286BBD]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-[#286BBD] font-bold mb-1">24</div>
                    <p className="text-sm text-green-600 font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +2 this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">Available Credits</CardTitle>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-green-600 font-bold mb-1">150</div>
                    <p className="text-sm text-gray-600 font-medium">
                      Ready to use
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">ROI Performance</CardTitle>
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-purple-600 font-bold mb-1">285%</div>
                    <p className="text-sm text-gray-600 font-medium">
                      Excellent returns
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">Conversion Rate</CardTitle>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-orange-600 font-bold mb-1">78%</div>
                    <p className="text-sm text-gray-600 font-medium">
                      Above average
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <BarChart3 className="h-6 w-6 mr-2 text-[#286BBD]" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: 'Purchased lead', location: 'Dallas, TX', time: '2 hours ago', status: 'success' },
                        { action: 'Quote sent', location: 'Houston, TX', time: '5 hours ago', status: 'pending' },
                        { action: 'Lead converted', location: 'Austin, TX', time: '1 day ago', status: 'success' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className={`w-3 h-3 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.location} • {activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Package className="h-6 w-6 mr-2 text-[#286BBD]" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => onTabChange('Leads')}
                        className="h-20 bg-gradient-to-r from-[#286BBD] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white flex flex-col items-center justify-center space-y-2"
                      >
                        <Users className="h-6 w-6" />
                        <span className="text-sm font-medium">Browse Leads</span>
                      </Button>
                      <Button 
                        onClick={() => onTabChange('Teams')}
                        variant="outline" 
                        className="h-20 border-2 border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white flex flex-col items-center justify-center space-y-2"
                      >
                        <UserPlus className="h-6 w-6" />
                        <span className="text-sm font-medium">Teams</span>
                      </Button>
                      <Button 
                        onClick={() => onTabChange('Leads')}
                        variant="outline" 
                        className="h-20 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 flex flex-col items-center justify-center space-y-2"
                      >
                        <FileText className="h-6 w-6" />
                        <span className="text-sm font-medium">Leads</span>
                      </Button>
                      <Button 
                        onClick={() => onTabChange('Settings')}
                        variant="outline" 
                        className="h-20 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 flex flex-col items-center justify-center space-y-2"
                      >
                        <Settings className="h-6 w-6" />
                        <span className="text-sm font-medium">Settings</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
  )
}