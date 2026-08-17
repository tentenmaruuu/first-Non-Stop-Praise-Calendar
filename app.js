const monthLabel = document.querySelector('#monthLabel');
const calendarGrid = document.querySelector('#calendarGrid');
const eventForm = document.querySelector('#eventForm');
const titleInput = document.querySelector('#titleInput');
const dateInput = document.querySelector('#dateInput');
const praiseInput = document.querySelector('#praiseInput');
const aiReply = document.querySelector('#aiReply');

const events = [];
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

dateInput.value = toDateKey(today);
monthLabel.textContent = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
}).format(today);

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function judgePraise(praise) {
  const words = ['最高', '天才', 'かわいい', 'すごい', '素敵', '大好き', '助かる', '完璧', '頼り'];
  const wordScore = words.filter((word) => praise.includes(word)).length;
  const lengthScore = Math.min(Math.floor(praise.length / 24), 3);

  if (wordScore + lengthScore >= 3) {
    return {
      accepted: true,
      reply: 'ふん、そこまで褒めるなら覚えておいてあげる。べ、別に嬉しくなんかないけど。',
    };
  }

  return {
    accepted: false,
    reply: 'その程度の褒め言葉で登録してもらえると思ったの？ 出直してきなさい。',
  };
}

function renderCalendar() {
  calendarGrid.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = 42;

  for (let index = 0; index < cellCount; index += 1) {
    const day = index - firstDay.getDay() + 1;
    const cell = document.createElement('div');

    if (day < 1 || day > daysInMonth) {
      cell.className = 'day empty';
      calendarGrid.append(cell);
      continue;
    }

    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter((event) => event.date === dateKey);

    cell.className = day === today.getDate() ? 'day today' : 'day';
    cell.innerHTML = `<span class="day-number">${day}</span>`;

    dayEvents.forEach((event) => {
      const eventEl = document.createElement('div');
      eventEl.className = 'event';
      eventEl.textContent = event.title;
      eventEl.title = event.title;
      cell.append(eventEl);
    });

    calendarGrid.append(cell);
  }
}

eventForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const result = judgePraise(praiseInput.value.trim());
  aiReply.textContent = result.reply;

  if (!result.accepted) {
    return;
  }

  events.push({
    title: titleInput.value.trim(),
    date: dateInput.value,
  });

  titleInput.value = '';
  praiseInput.value = '';
  renderCalendar();
});

renderCalendar();
