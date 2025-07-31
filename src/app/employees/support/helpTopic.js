// app/users/support/helpTopics.js
import React from 'react';
import { 
  Monitor, Smartphone, Tablet, 
  Building, Mail, Phone, Clock, CalendarIcon, CheckCircle, List, LayoutGrid,
  UserCheck, MapPin, CalendarClock, FileText, CreditCard, Settings as SettingsIcon,
  ShieldAlert, RotateCcw, Eye, Edit3, Calendar as CalendarLucide, Bell, Coffee, LogIn, LogOut
} from "lucide-react";



export const helpTopics = {
    "How to Clock In/Out": {
      title: "How to Clock In/Out",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clocking In</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Ensure your location services are enabled for the application.</li>
              <li>On your dashboard, locate the 'Time Tracking' section.</li>
              <li>Click the green <span className="font-medium">'Clock In'</span> button.</li>
              <li>You will see a confirmation and your 'Checked In At' time will update.</li>
              <li>The 'Location Verified' indicator will confirm your location was detected.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clocking Out</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Make sure you are in your 'Working' status (not on break).</li>
              <li>In the 'Time Tracking' section, click the red <span className="font-medium">'Clock Out'</span> button.</li>
              <li>You will see a confirmation that your session has ended.</li>
              <li>Your daily hours will be calculated and added to your weekly total.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Guide</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                  <div className="text-sm font-medium text-gray-900">10:30 AM</div>
                  <div className="text-xs text-gray-600">Current Time</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <Coffee className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                  <div className="text-sm font-medium text-gray-900">0h 0m</div>
                  <div className="text-xs text-gray-600">Break Time</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <MapPin className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <div className="text-sm font-medium text-gray-900">10:30 AM</div>
                  <div className="text-xs text-gray-600">Checked In At</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  className="py-2 px-4 rounded-lg font-medium flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Clock In
                </button>
                <div className="flex items-center justify-center px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <MapPin className="w-4 h-4 text-emerald-600 mr-2" />
                  <span className="text-sm text-emerald-700 font-medium">
                    Location Verified
                  </span>
                </div>
                <button
                  className="py-2 px-4 rounded-lg font-medium flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Clock Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Managing Break Times": {
      title: "Managing Break Times",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Taking a Break</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>While clocked in, you can manage your breaks.</li>
              <li>In the 'Time Tracking' section, click the blue <span className="font-medium">'Start Break'</span> button.</li>
              <li>Your status will change to 'On Break' and the break timer will start.</li>
              <li>Break times are automatically deducted from your total work hours.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ending a Break</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>When returning from your break, click the orange <span className="font-medium">'End Break'</span> button.</li>
              <li>Your status will change back to 'Working'.</li>
              <li>The break duration will be recorded and subtracted from your work time.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Guide</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                  <div className="text-sm font-medium text-gray-900">10:30 AM</div>
                  <div className="text-xs text-gray-600">Current Time</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <Coffee className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                  <div className="text-sm font-medium text-gray-900">0h 15m</div>
                  <div className="text-xs text-gray-600">Break Time</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <MapPin className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <div className="text-sm font-medium text-gray-900">10:30 AM</div>
                  <div className="text-xs text-gray-600">Checked In At</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  className="py-2 px-4 rounded-lg font-medium flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                >
                  <Coffee className="w-4 h-4 mr-2" />
                  End Break
                </button>
                <div className="flex items-center justify-center px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <MapPin className="w-4 h-4 text-emerald-600 mr-2" />
                  <span className="text-sm text-emerald-700 font-medium">
                    Location Verified
                  </span>
                </div>
                <button
                  className="py-2 px-4 rounded-lg font-medium flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Clock Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Viewing Your Work Schedule": {
      title: "Viewing Your Work Schedule",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessing Your Schedule</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Navigate to the calendar section on the left side of your dashboard.</li>
              <li>Your scheduled work days are automatically highlighted.</li>
              <li>Click on any date to see detailed schedule information for that day.</li>
              <li>Scheduled shifts and tasks will appear in the calendar view.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Using Calendar Tabs</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><span className="font-medium">Tasks Tab:</span> View daily tasks assigned to you.</li>
              <li><span className="font-medium">Projects Tab:</span> See project deadlines and milestones.</li>
              <li><span className="font-medium">Leave Requests Tab:</span> Check your approved time-off and submit new requests.</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Guide</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-center mb-4">
                <div className="border rounded-md p-2 w-full max-w-xs">
                  <SimpleCalendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-2 text-center text-sm text-gray-600 mb-4">
                Selected Date: {selectedDate.toLocaleDateString()}
              </div>
              
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {[
                    { id: "task", label: "Tasks" },
                    { id: "project", label: "Projects" },
                    { id: "leave", label: "Leave Requests" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="mt-4">
                {activeTab === "task" && (
                  <div className="text-gray-700">
                    <h4 className="font-medium mb-2">Tasks for {selectedDate.toLocaleDateString()}</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Review project proposal</li>
                      <li>Update team status report</li>
                      <li className="text-gray-500 line-through">Schedule meeting with client</li>
                    </ul>
                  </div>
                )}
                {activeTab === "project" && (
                  <div className="text-gray-700">
                    <h4 className="font-medium mb-2">Projects Due {selectedDate.toLocaleDateString()}</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li className="text-blue-600">Website Redesign (Due: 2024-06-20)</li>
                      <li>Mobile App Launch (Due: 2024-07-15)</li>
                    </ul>
                  </div>
                )}
                {activeTab === "leave" && (
                  <div className="text-gray-700">
                    <h4 className="font-medium mb-2">Leave Requests for {selectedDate.toLocaleDateString()}</h4>
                    <p className="text-gray-500 text-sm">No leave requests found for this date.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Submitting Time-Off Requests": {
      title: "Submitting Time-Off Requests",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Request Time Off</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>In the calendar section, click on the 'Leave Requests' tab.</li>
              <li>Click the <span className="font-medium">'New Request'</span> button (not shown in demo).</li>
              <li>Select your requested start and end dates.</li>
              <li>Choose the reason for your time off (e.g., Vacation, Sick Leave).</li>
              <li>Add any additional notes if necessary.</li>
              <li>Submit your request for manager approval.</li>
              <li>You'll receive a notification when your request is approved or denied.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Guide</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-center mb-4">
                <div className="border rounded-md p-2 w-full max-w-xs">
                  <SimpleCalendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {[
                    { id: "task", label: "Tasks" },
                    { id: "project", label: "Projects" },
                    { id: "leave", label: "Leave Requests" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="mt-4">
                {activeTab === "leave" && (
                  <div className="text-gray-700">
                    <h4 className="font-medium mb-2">Leave Requests for {selectedDate.toLocaleDateString()}</h4>
                    <p className="text-gray-500 text-sm mb-4">No leave requests found for this date.</p>
                    
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
                      New Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Checking Work Hours & Overtime": {
      title: "Checking Work Hours & Overtime",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Viewing Your Hours</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Your daily hours are displayed in the <span className="font-medium">'Hours Today'</span> card in the dashboard.</li>
              <li>Weekly hours are shown in the <span className="font-medium">'Total Hours'</span> card.</li>
              <li>Overtime hours (beyond 8 hours/day or 40 hours/week) are highlighted in these cards.</li>
              <li>Detailed reports can be accessed through the 'Reports' section (not shown in this demo).</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Guide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Working
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">4h 30m</div>
                <div className="text-sm text-gray-600">Hours Today</div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-indigo-500"
                      style={{ width: `56%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    56% of 8 hours
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-xs text-gray-500">This Week</div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">32h 45m</div>
                <div className="text-sm text-gray-600">Total Hours</div>
                <div className="mt-1 text-xs">
                  <span className="text-amber-600 font-medium">
                    +2h 15m overtime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Understanding Attendance Reports": {
      title: "Understanding Attendance Reports",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessing Reports</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Access reports through the 'Reports' section in your dashboard (not shown in this demo).</li>
              <li>View daily, weekly, and monthly attendance summaries.</li>
              <li>Reports show clock-in/out times, break durations, and total hours.</li>
              <li>Attendance percentages and punctuality scores are calculated.</li>
              <li>Export reports as PDF or CSV for your records.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Your Reports</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tasks Completed</p>
                    <p className="text-xs text-gray-600">This week</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-emerald-600">5</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Avg. Daily Hours</p>
                    <p className="text-xs text-gray-600">This week</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-600">8h 15m</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Punctuality Score</p>
                    <p className="text-xs text-gray-600">This month</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-purple-600">95%</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Using the Calendar & Task Management": {
      title: "Using the Calendar & Task Management",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigating the Calendar</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>The calendar shows your scheduled work days and tasks.</li>
              <li>Switch between Tasks, Projects, and Leave Requests tabs.</li>
              <li>Click on any date to view or add tasks for that day.</li>
              <li>Tasks can be marked as completed directly in the calendar.</li>
              <li>Upcoming tasks and deadlines are highlighted automatically.</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Guide</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-center mb-4">
                <div className="border rounded-md p-2 w-full max-w-xs">
                  <SimpleCalendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {[
                    { id: "task", label: "Tasks" },
                    { id: "project", label: "Projects" },
                    { id: "leave", label: "Leave Requests" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="mt-4">
                {activeTab === "task" && (
                  <div className="text-gray-700">
                    <h4 className="font-medium mb-2">Tasks for {selectedDate.toLocaleDateString()}</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Review project proposal</li>
                      <li>Update team status report</li>
                      <li className="text-gray-500 line-through">Schedule meeting with client</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Setting Notification Preferences": {
      title: "Setting Notification Preferences",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Managing Preferences</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click the settings icon in the top right corner of your dashboard.</li>
              <li>Select <span className="font-medium">'Client Preferences'</span> from the dropdown menu.</li>
              <li>Toggle notifications on/off for different alert types.</li>
              <li>Choose your preferred platform (Web, Mobile, Tablet).</li>
              <li>Enable auto-break reminders if desired.</li>
              <li>Click <span className="font-medium">'Save'</span> to apply your changes.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Guide</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "web", label: "Web", icon: Monitor },
                      { value: "mobile", label: "Mobile", icon: Smartphone },
                      { value: "tablet", label: "Tablet", icon: Tablet },
                    ].map((platform) => (
                      <button
                        key={platform.value}
                        className={`p-3 rounded-lg border flex flex-col items-center ${
                          clientPreferences.platform === platform.value
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200"
                        }`}
                        onClick={() =>
                          setClientPreferences({
                            ...clientPreferences,
                            platform: platform.value,
                          })
                        }
                      >
                        <platform.icon className="w-5 h-5 mb-1" />
                        <span className="text-xs">{platform.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notifications</div>
                    <div className="text-sm text-gray-500">
                      Receive alerts and updates
                    </div>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      clientPreferences.notifications
                        ? "bg-indigo-600"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      setClientPreferences({
                        ...clientPreferences,
                        notifications: !clientPreferences.notifications,
                      })
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        clientPreferences.notifications
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto Break</div>
                    <div className="text-sm text-gray-500">
                      Automatically start breaks
                    </div>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      clientPreferences.autoBreak
                        ? "bg-indigo-600"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      setClientPreferences({
                        ...clientPreferences,
                        autoBreak: !clientPreferences.autoBreak,
                      })
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        clientPreferences.autoBreak
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Updating Your Profile": {
      title: "Updating Your Profile",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editing Your Profile</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click your profile icon in the top right corner of the dashboard.</li>
              <li>Select <span className="font-medium">'Profile Settings'</span> from the dropdown menu.</li>
              <li>Edit your personal information, contact details, or avatar.</li>
              <li>Update your password if needed in the Security section.</li>
              <li>Click <span className="font-medium">'Save Changes'</span> when finished.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Icons</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      5
                    </span>
                  </div>
                  <Bell className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-sm text-gray-600">
                  Check these regularly for important updates
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Troubleshooting Location Issues": {
      title: "Troubleshooting Location Issues",
      component: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fixing Location Problems</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Ensure location services are enabled in your browser/device settings.</li>
              <li>Allow location access when prompted by the application.</li>
              <li>If location isn't detected, try refreshing the page.</li>
              <li>Check that your device's GPS is turned on (for mobile).</li>
              <li>If issues persist, contact support with details about your device and browser.</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Status</h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-center px-4 py-3 bg-emerald-50 rounded-lg border border-emerald-200 w-full">
                <MapPin className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-sm text-emerald-700 font-medium">
                  Location Verified
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                This indicator confirms your location is working correctly
              </p>
            </div>
          </div>
        </div>
      )
    }
  };
