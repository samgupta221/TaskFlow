import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = [];
  // Padding for start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-32 border-b border-r border-slate-100 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-900/10"></div>);
  }
  
  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
    days.push(
      <div key={d} className="h-32 border-b border-r border-slate-100 dark:border-slate-800 p-3 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-600 dark:text-slate-400 group-hover:text-indigo-600'}`}>
            {d}
          </span>
          <button className="opacity-0 group-hover:opacity-100 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-all hover:scale-110">
            <Plus size={14} className="text-indigo-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 dark:bg-[#020617] h-full flex flex-col transition-colors">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight">Project Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track deadlines and schedule your professional goals.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-slate-400" />
          </button>
          <span className="text-sm font-black text-slate-900 dark:text-white min-w-[140px] text-center font-outfit uppercase tracking-wider">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="glass-card dark:bg-slate-900/40 rounded-[32px] border border-white/20 dark:border-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col transition-colors">
        <div className="grid grid-cols-7 bg-white dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 overflow-y-auto">
          {days}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
