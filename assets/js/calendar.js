// Mini Calendar Script
document.addEventListener('DOMContentLoaded', function() {
  const calendarContainer = document.getElementById('mini-calendar');
  if (!calendarContainer) return;

  const bodyElement = document.body;
  const postDatesData = bodyElement.dataset.postDates;
  let postDates = [];
  if (postDatesData) {
    try {
      // Parse the JSON string and format the dates to YYYY-MM-DD
      const rawDates = JSON.parse(postDatesData);
      postDates = rawDates
        .filter(dateStr => dateStr != null && dateStr != undefined) // Lọc bỏ null/undefined
        .map(dateStr => dateStr.substring(0, 10));
    } catch (e) {
      console.error("Error parsing post dates data:", e);
      postDates = [];
    }
  }

  const monthYearEl = document.getElementById('month-year');
  const datesEl = document.getElementById('calendar-dates');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');

  let currentDate = new Date();

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearEl.textContent = `Tháng ${month + 1}, ${year}`;
    datesEl.innerHTML = '';

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      datesEl.innerHTML += `<span></span>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasPost = postDates.includes(dateStr);
      
      let dateClass = '';
      if (hasPost) {
        dateClass = 'has-post';
      }
      
      const today = new Date();
      if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
        dateClass += ' today';
      }

      datesEl.innerHTML += `<span class="${dateClass.trim()}">${i}</span>`;
    }

    // Ensure the grid always has 42 cells for a consistent 6-row height
    const totalCells = firstDayOfMonth + lastDateOfMonth;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
      datesEl.innerHTML += `<span class="empty"></span>`;
    }
  }

  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
}); 