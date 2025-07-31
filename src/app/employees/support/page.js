// app/support/page.js
"use client";
import React, { useState } from 'react';
import {
  Send, Clock, Settings,
  LogIn, LogOut, Coffee,
  Calendar as CalendarIcon,
  MapPin,
  TrendingUp, Target, Award, CheckCircle,
  Smartphone, Monitor, Tablet,
  Bell, MessageCircle, Mail,
  ChevronLeft, ChevronRight,
  X, // Icon for closing chat
  MessageSquare, // Icon for chat toggle
  HelpCircle // Icon for Quick Help items
} from 'lucide-react';

// Simple Calendar component if you don't have CustomCalendar
const SimpleCalendar = ({ selectedDate, onDateSelect, className = '' }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth()));

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newSelectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (onDateSelect) {
      onDateSelect(newSelectedDate);
    }
  };

  const renderHeader = () => {
    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return (
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded hover:bg-gray-200 text-gray-600"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-medium text-gray-700">{monthYear}</h2>
        <button
          onClick={goToNextMonth}
          className="p-1 rounded hover:bg-gray-200 text-gray-600"
          aria-label="Next Month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid grid-cols-7 gap-1 mb-1">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Last date of the month
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    // Last date of the previous month
    const lastDateOfPreviousMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month's days
    for (let i = firstDayOfMonth; i > 0; i--) {
      const dayNumber = lastDateOfPreviousMonth - i + 1;
      days.push(
        <div
          key={`prev-${dayNumber}`}
          className="text-center text-xs p-1 text-gray-400 opacity-70"
        >
          {dayNumber}
        </div>
      );
    }

    // Current month's days
    const today = new Date();
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isCurrentDay =
        year === today.getFullYear() &&
        month === today.getMonth() &&
        i === today.getDate();

      const isSelectedDay =
        year === selectedDate.getFullYear() &&
        month === selectedDate.getMonth() &&
        i === selectedDate.getDate();

      let dayClasses = "text-center text-xs p-1 rounded-full cursor-pointer ";
      if (isCurrentDay) {
        dayClasses += "bg-blue-500 text-white font-bold "; // Highlight today
      } else if (isSelectedDay) {
        dayClasses += "bg-indigo-100 text-indigo-700 font-semibold border border-indigo-300 "; // Highlight selected
      } else {
        dayClasses += "hover:bg-gray-100 text-gray-700 ";
      }

      days.push(
        <div
          key={`curr-${i}`}
          className={dayClasses}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }

    // Next month's days (to fill the grid)
    const totalCells = 42; // 6 rows * 7 columns
    const nextDaysCount = totalCells - days.length;
    for (let i = 1; i <= nextDaysCount; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="text-center text-xs p-1 text-gray-400 opacity-70"
        >
          {i}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
  };

  return (
    <div className={`p-3 ${className}`}>
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderDays()}
    </div>
  );
};


const SupportPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Zentri, your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeHelpTopic, setActiveHelpTopic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("task");
  const [clientPreferences, setClientPreferences] = useState({
    platform: "web",
    notifications: true,
    autoBreak: false,
  });
  const [isChatOpen, setIsChatOpen] = useState(false); // State for chat visibility

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    // Simulate AI response after a delay
    setTimeout(() => {
      // Context-aware responses based on common workforce management topics
      const aiResponses = [
        "I understand your concern. Let me check that for you.",
        "Thanks for reaching out! Based on your query, I recommend checking the settings panel.",
        "That's a common question. You can find detailed instructions in our documentation.",
        "I've found a solution for you. Please try refreshing the page first.",
        "For this issue, I suggest clearing your browser cache and cookies.",
        "I've escalated your request to our human support team. They'll contact you shortly.",
        "To clock in, simply click the 'Clock In' button on your dashboard. Make sure your location is enabled.",
        "You can view your schedule under the 'Calendar' section in your dashboard.",
        "To submit a time-off request, go to the 'Leave Requests' tab in the calendar section.",
        "If you're having trouble with location verification, ensure location services are enabled for this app.",
        "Your work hours and overtime are automatically calculated and displayed in the 'Hours Today' and 'Total Hours' cards.",
        "Break times are tracked when you click 'Start Break' and 'End Break'.",
        "You can update your profile information by clicking the settings icon in the top right corner of your dashboard.",
        "Notifications can be managed in your Client Preferences, accessible via the settings icon."
      ];
      const aiMessage = {
        id: messages.length + 2,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
 

  const helpTopics = {
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
  const openHelpTopic = (topic) => {
    setActiveHelpTopic(helpTopics[topic]);
  };
  const closeHelpTopic = () => {
    setActiveHelpTopic(null);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 relative z-0"> 
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Clock className="w-12 h-12" />
              <Settings className="w-5 h-5 absolute -bottom-1 -right-1 text-indigo-200" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Zentri Support</h1>
              <p className="text-indigo-200">AI-powered assistance for all your questions</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Options - Quick Help styled as buttons */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-indigo-500" />
                Quick Help
              </h2>
              <div className="space-y-2"> {/* Changed from ul to div */}
                {Object.keys(helpTopics).map((topic, index) => (
                  <button // Changed from li > button to direct button
                    key={index}
                    onClick={() => openHelpTopic(topic)}
                    className={`flex items-center w-full text-left p-3 rounded-lg transition-colors ${
                      activeHelpTopic?.title === helpTopics[topic].title
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' // Active state
                        : 'hover:bg-gray-100 text-gray-700' // Default and hover
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 mr-3 flex-shrink-0" /> {/* Icon added */}
                    <span className="text-sm">{topic}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Options</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email Support</h3>
                    <p className="text-gray-600 text-sm">support@zentri.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone Support</h3>
                    <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content Area - Help Content */}
          <div className="lg:col-span-2">
            {activeHelpTopic ? (
              <div className="space-y-6 bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{activeHelpTopic.title}</h2>
                  <button
                    onClick={closeHelpTopic}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
                    aria-label="Close Help Topic"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {activeHelpTopic.component}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border h-full flex items-center justify-center">
                 <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Need Help?</h3>
                    <p className="text-gray-500 mb-4">Select a topic from Quick Help or open the chat.</p>
                    <button
                      onClick={toggleChat}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center mx-auto"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Chat
                    </button>
                  </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat Window */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-20" onClick={toggleChat}> {/* Backdrop */}
          <div className="fixed bottom-6 right-6 w-96 max-h-[70vh] flex flex-col bg-white rounded-xl shadow-xl z-30 border border-gray-200 overflow-hidden"
               onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the chat
          >
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <Clock className="w-6 h-6" />
                  <Settings className="w-3 h-3 absolute -bottom-0.5 -right-0.5 text-indigo-200" />
                </div>
                <div>
                  <h2 className="font-semibold">Zentri Assistant</h2>
                  <p className="text-xs text-indigo-200">AI support - Online now</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-indigo-200 hover:text-white p-1 rounded-full hover:bg-indigo-500"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                        message.sender === 'user'
                          ? 'bg-indigo-500 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Zentri anything..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()} // Disable if input is empty
                  className={`bg-indigo-600 text-white rounded-full p-2 transition ${inputValue.trim() ? 'hover:bg-indigo-700' : 'opacity-50 cursor-not-allowed'}`}
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-gray-500 text-center mt-2">
                Zentri AI can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Toggle Button (always visible when chat is closed) */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 z-20 flex items-center justify-center"
          aria-label="Open Chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </>
  );
};
export default SupportPage;