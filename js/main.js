(() => {
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".menu-toggle");
  const status = document.querySelector("[data-open-status]");
  const hoursItems = document.querySelectorAll("[data-hours-list] li");

  const hours = {
    0: { open: 12 * 60, close: 22 * 60 },
    1: null,
    2: { open: 14 * 60, close: 22 * 60 },
    3: { open: 14 * 60, close: 22 * 60 },
    4: { open: 17 * 60, close: 22 * 60 },
    5: { open: 12 * 60, close: 23 * 60 + 30 },
    6: { open: 11 * 60 + 30, close: 24 * 60 }
  };

  function nowInBanbridge() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());

    const weekday = parts.find((part) => part.type === "weekday")?.value;
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const minute = Number(parts.find((part) => part.type === "minute")?.value);
    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

    return {
      day: dayMap[weekday],
      minutes: hour * 60 + minute
    };
  }

  function updateOpenStatus() {
    if (!status) return;

    const { day, minutes } = nowInBanbridge();
    const today = hours[day];
    const open = Boolean(today && minutes >= today.open && minutes < today.close);

    status.classList.toggle("is-open", open);
    status.classList.toggle("is-closed", !open);
    status.textContent = open ? "Open now" : "Closed now";

    hoursItems.forEach((item) => {
      item.classList.toggle("is-today", Number(item.dataset.day) === day);
    });
  }

  toggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);
})();
