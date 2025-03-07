<!-- 
  EventCalendar.svelte - A monthly calendar view for events
  This component displays events in a month grid, with visual differentiation
  for different event types (speaking, organizing, media)
-->

<script>
  import { onMount } from 'svelte';
  
  // Props
  export let events = []; // Array of events to display
  export let initialMonth = new Date().getMonth(); // Default to current month
  export let initialYear = new Date().getFullYear(); // Default to current year
  
  // State
  let currentMonth = initialMonth;
  let currentYear = initialYear;
  let calendarDays = [];
  let monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Derived state
  $: monthName = monthNames[currentMonth];
  $: monthYear = `${monthName} ${currentYear}`;
  $: eventsByDate = groupEventsByDate(events);
  
  // Initialize the calendar when component mounts or month/year changes
  $: {
    currentMonth;
    currentYear;
    generateCalendarDays();
  }
  
  // Debugging function
  function logCellClasses() {
    console.log('Calendar cells generated:', calendarDays.length);
    console.log('Current month cells:', calendarDays.filter(day => day.currentMonth).length);
    console.log('Non-current month cells:', calendarDays.filter(day => !day.currentMonth).length);
    
    // Check if dark mode class is being applied
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('System is in dark mode:', isDarkMode);
  }
  
  onMount(() => {
    logCellClasses();
    
    // Add a listener to detect dark mode changes for debugging
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e) => {
      console.log('Dark mode changed:', e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  });
  
  // Go to previous month
  function prevMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
    
    // Re-log for debugging after month change
    setTimeout(logCellClasses, 0);
  }
  
  // Go to next month
  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
    
    // Re-log for debugging after month change
    setTimeout(logCellClasses, 0);
  }
  
  // Go to today's month
  function goToToday() {
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
    
    // Re-log for debugging after month change
    setTimeout(logCellClasses, 0);
  }
  
  // Group events by date for easier calendar rendering
  function groupEventsByDate(events) {
    const grouped = new Map();
    
    events.forEach(event => {
      if (!event.date) return;
      
      const date = new Date(event.date);
      const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      
      grouped.get(dateKey).push(event);
    });
    
    return grouped;
  }
  
  // Generate the days for the current month view
  function generateCalendarDays() {
    const days = [];
    
    // First day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Previous month's days to display
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const month = currentMonth === 0 ? 11 : currentMonth - 1;
      const year = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      days.push({
        day,
        month,
        year,
        currentMonth: false,
        isToday: false,
        dateKey: `${year}-${month + 1}-${day}`
      });
    }
    
    // Current month's days
    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
      const isToday = i === today.getDate() && 
                      currentMonth === today.getMonth() &&
                      currentYear === today.getFullYear();
      
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        currentMonth: true,
        isToday,
        dateKey: `${currentYear}-${currentMonth + 1}-${i}`
      });
    }
    
    // Next month's days to fill the calendar
    const remainingDays = 42 - days.length; // Always show 6 weeks (42 days)
    for (let i = 1; i <= remainingDays; i++) {
      const month = currentMonth === 11 ? 0 : currentMonth + 1;
      const year = currentMonth === 11 ? currentYear + 1 : currentYear;
      
      days.push({
        day: i,
        month,
        year,
        currentMonth: false,
        isToday: false,
        dateKey: `${year}-${month + 1}-${i}`
      });
    }
    
    calendarDays = days;
  }
  
  // Get events for a specific date
  function getEventsForDate(dateKey) {
    return eventsByDate.get(dateKey) || [];
  }
  
  // Get color class for event type
  function getEventTypeClass(type) {
    switch (type) {
      case 'speaking':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'organizing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'media':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
  
  // Format date for display in event tooltip
  function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  }
</script>

<div class="event-calendar bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
  <!-- Calendar Header -->
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">{monthYear}</h2>
    <div class="flex space-x-2">
      <button 
        on:click={goToToday}
        class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
        aria-label="Go to current month"
      >
        Today
      </button>
      <button 
        on:click={prevMonth}
        class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Previous month"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        on:click={nextMonth}
        class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Next month"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
  
  <!-- Calendar Grid -->
  <div class="grid grid-cols-7 gap-1">
    <!-- Day Names -->
    {#each dayNames as day}
      <div class="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        {day}
      </div>
    {/each}
    
    <!-- Calendar Days -->
    {#each calendarDays as { day, currentMonth, isToday, dateKey }, i}
      <div 
        class="h-24 md:h-28 lg:h-32 p-1 border border-gray-200 dark:border-gray-700 overflow-hidden
               {currentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}
               {isToday ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''}"
      >
        <!-- Day Number -->
        <div class="text-right text-sm mb-1 {isToday ? 'font-bold text-primary-600 dark:text-primary-400' : ''}">
          {day}
        </div>
        
        <!-- Events for this day -->
        <div class="overflow-y-auto max-h-[calc(100%-20px)] text-xs space-y-1">
          {#each getEventsForDate(dateKey) as event, eventIdx}
            {#if eventIdx < 3} <!-- Show max 3 events per day to avoid overflow -->
              <a 
                href="/events/{event.type}/{event.slug}" 
                class="block p-1 rounded truncate {getEventTypeClass(event.type)}"
                title="{event.title} - {formatDate(event.date)}"
              >
                {event.title.length > 20 ? event.title.substring(0, 18) + '...' : event.title}
              </a>
            {:else if eventIdx === 3}
              <div class="text-center text-xs text-gray-500 dark:text-gray-400">
                +{getEventsForDate(dateKey).length - 3} more
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Event Type Legend -->
  <div class="mt-4 flex flex-wrap gap-3">
    <div class="flex items-center">
      <span class="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
      <span class="text-sm text-gray-700 dark:text-gray-300">Speaking</span>
    </div>
    <div class="flex items-center">
      <span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
      <span class="text-sm text-gray-700 dark:text-gray-300">Organizing</span>
    </div>
    <div class="flex items-center">
      <span class="inline-block w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
      <span class="text-sm text-gray-700 dark:text-gray-300">Media</span>
    </div>
  </div>
</div>

<style>
  /* Custom scrollbar for events container */
  :global(.event-calendar div::-webkit-scrollbar) {
    width: 4px;
  }
  
  :global(.event-calendar div::-webkit-scrollbar-track) {
    background: transparent;
  }
  
  :global(.event-calendar div::-webkit-scrollbar-thumb) {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
  
  /* For Firefox */
  :global(.event-calendar div) {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
</style> 