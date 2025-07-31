// components/CustomCalendar.js
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Assuming you have lucide-react installed

const CustomCalendar = ({ selectedDate, onDateSelect, className = '' }) => {
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

export default CustomCalendar;