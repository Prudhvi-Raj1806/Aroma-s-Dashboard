const viewRoot = document.querySelector("#viewRoot");
const shell = document.querySelector(".app-shell");
const toast = document.querySelector("#toast");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const modalActions = document.querySelector("#modalActions");
const globalSearch = document.querySelector("#globalSearch");

const emptyCopy = {
  orders: "Orders will appear here once a backend starts sending tickets.",
  menu: "Menu items and categories will appear here once connected.",
  customers: "Customer records will appear here once imported or synced.",
  reservations: "Reservations will appear here once online booking is connected.",
  marketing: "Campaigns will appear here once marketing tools are connected.",
  finances: "Transactions will appear here once payment data is connected.",
  analytics: "Charts will populate when dining activity is available.",
};

const screens = {
  dashboard: {
    title: "Dashboard Overview",
    summary: "0 active signals across the restaurant",
    actions: [
      ["filter", "Filter"],
      ["replay", "Replay Activity"],
    ],
    render: renderDashboard,
  },
  orders: {
    title: "Live Dashboard",
    summary: "0 orders live | Avg. prep time 0m",
    actions: [
      ["filter", "Filter"],
      ["replay", "Replay Activity"],
    ],
    render: renderOrders,
  },
  menu: {
    title: "Menu Management",
    summary: "0 items available across 0 categories",
    actions: [
      ["menu-import", "Import"],
      ["menu-add", "Add Item"],
    ],
    render: renderMenu,
  },
  customers: {
    title: "Customers",
    summary: "0 customer profiles connected",
    actions: [
      ["customer-import", "Import"],
      ["customer-add", "Add Customer"],
    ],
    render: renderCustomers,
  },
  reservations: {
    title: "Reservations",
    summary: "0 upcoming bookings",
    actions: [
      ["reservation-calendar", "Calendar"],
      ["reservation-add", "Add Reservation"],
    ],
    render: renderReservations,
  },
  marketing: {
    title: "Marketing",
    summary: "0 campaigns are currently running",
    actions: [
      ["campaign-preview", "Preview"],
      ["campaign-add", "Create Campaign"],
    ],
    render: renderMarketing,
  },
  finances: {
    title: "Finances",
    summary: "$0 net movement today",
    actions: [
      ["finance-export", "Export"],
      ["finance-report", "New Report"],
    ],
    render: renderFinances,
  },
  analytics: {
    title: "Analytics",
    summary: "0 data points in the reporting window",
    actions: [
      ["range", "Date Range"],
      ["replay", "Replay Activity"],
    ],
    render: renderAnalytics,
  },
  settings: {
    title: "Settings",
    summary: "0 connected account records",
    actions: [
      ["settings-save", "Save Changes"],
    ],
    render: renderSettings,
  },
};

let activeScreen = "orders";
let replayToken = 0;

function metricCards(items) {
  return `<div class="stats-grid" aria-label="Zero metrics">${items
    .map(
      (item) => `
        <article class="stat-card">
          <span>${item.label}</span>
          <strong>${item.prefix || ""}<span data-counter data-target="${item.target || 0}">0</span>${item.suffix || ""}</strong>
          <small>${item.note || "No records connected"}</small>
        </article>
      `,
    )
    .join("")}</div>`;
}

function emptyPanel(title, body, action = "Open") {
  return `
    <section class="empty-panel">
      <span class="zero-orb" data-counter data-target="0">0</span>
      <h3>${title}</h3>
      <p>${body}</p>
      <button class="outline-button" type="button" data-action="empty-action">${action}</button>
    </section>
  `;
}

function dataTable(columns, label) {
  return `
    <section class="table-panel">
      <div class="panel-title">
        <div>
          <h3>${label}</h3>
          <p>0 rows found</p>
        </div>
        <button class="icon-menu" type="button" data-action="table-options" aria-label="${label} options">...</button>
      </div>
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="${columns.length}">
              <div class="table-empty">0 records available</div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `;
}

function chartPanel(title, description) {
  return `
    <section class="chart-panel">
      <div class="panel-title">
        <div>
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
        <span class="panel-count"><span data-counter data-target="0">0</span></span>
      </div>
      <div class="zero-chart" aria-label="${title} chart with zero data">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    </section>
  `;
}

function renderHeader(screen) {
  return `
    <div class="page-heading">
      <div>
        <h2>${screen.title}</h2>
        <div class="summary-line">
          <span class="live-dot"></span>
          <strong>${screen.summary}</strong>
        </div>
      </div>
      <div class="heading-actions">
        ${screen.actions
          .map(([action, label]) => {
            const isPrimary = action.includes("add") || action === "replay" || action.includes("save");
            return `<button class="${isPrimary ? "primary-button" : "outline-button"}" type="button" data-action="${action}">${label}</button>`;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderDashboard() {
  return `
    ${metricCards([
      { label: "Today's Revenue", prefix: "$", target: 8420, note: "Returns to $0" },
      { label: "Today's Orders", target: 24, note: "Returns to 0" },
      { label: "Average Order Value", prefix: "$", target: 28, note: "Returns to $0" },
      { label: "Active Customers", target: 128, note: "Returns to 0" },
    ])}
    <div class="dashboard-grid">
      ${chartPanel("Revenue Trend", "Zero revenue over the selected period")}
      ${chartPanel("Order Volume", "No order activity available yet")}
      ${emptyPanel("No recent activity", "Staff events, order updates, and customer actions will appear here.", "View Activity")}
      ${dataTable(["Event", "Source", "Time", "Status"], "Activity Log")}
    </div>
  `;
}

function renderOrders() {
  const lanes = [
    ["received", "Received", 4, "No received orders", "New dine-in tickets will appear here."],
    ["preparing", "Preparing", 6, "No orders preparing", "Kitchen workflow is clear."],
    ["ready", "Ready", 3, "Nothing ready yet", "Completed orders will queue for handoff."],
    ["delivery", "Out for Delivery", 1, "No active dispatches", "Delivery tracking starts once orders leave."],
    ["completed", "Completed", 12, "No completed orders", "This dashboard resets after each activity pulse."],
  ];

  return `
    ${metricCards([
      { label: "Total Users", target: 128, note: "Visible as 0" },
      { label: "Active Orders", target: 24, note: "Visible as 0" },
      { label: "Reservations", target: 18, note: "Visible as 0" },
      { label: "Revenue Today", prefix: "$", target: 8420, note: "Visible as $0" },
    ])}
    <div class="kanban" aria-label="Live order status board">
      ${lanes
        .map(
          ([tone, title, target, emptyTitle, body]) => `
            <section class="lane ${tone}">
              <div class="lane-header">
                <h3>${title} <span data-counter data-target="${target}">0</span></h3>
                <button type="button" data-action="lane-options" aria-label="${title} lane options">...</button>
              </div>
              <div class="empty-state">
                <span data-counter data-target="0">0</span>
                <strong>${emptyTitle}</strong>
                <p>${body}</p>
              </div>
            </section>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderMenu() {
  return `
    ${metricCards([
      { label: "Menu Items", target: 48 },
      { label: "Categories", target: 9 },
      { label: "Sold Out", target: 3 },
      { label: "Draft Items", target: 7 },
    ])}
    <div class="split-grid">
      ${emptyPanel("No menu items", emptyCopy.menu, "Add Item")}
      ${dataTable(["Item", "Category", "Price", "Status"], "Menu Library")}
    </div>
  `;
}

function renderCustomers() {
  return `
    ${metricCards([
      { label: "Total Customers", target: 128 },
      { label: "New This Month", target: 32 },
      { label: "Returning", target: 84 },
      { label: "Loyalty Members", target: 57 },
    ])}
    <div class="split-grid">
      ${emptyPanel("No customers yet", emptyCopy.customers, "Import Customers")}
      ${dataTable(["Customer", "Visits", "Spend", "Last Seen"], "Customer Directory")}
    </div>
  `;
}

function renderReservations() {
  return `
    ${metricCards([
      { label: "Today", target: 18 },
      { label: "Upcoming", target: 44 },
      { label: "Tables Occupied", target: 12 },
      { label: "Waitlist", target: 6 },
    ])}
    <div class="split-grid">
      ${emptyPanel("No reservations", emptyCopy.reservations, "Add Reservation")}
      ${dataTable(["Guest", "Party", "Time", "Table"], "Reservation Book")}
    </div>
  `;
}

function renderMarketing() {
  return `
    ${metricCards([
      { label: "Campaigns", target: 6 },
      { label: "Audience Reach", target: 2400 },
      { label: "Coupons Used", target: 92 },
      { label: "Conversion Rate", target: 14, suffix: "%" },
    ])}
    <div class="dashboard-grid">
      ${chartPanel("Campaign Performance", "No marketing activity yet")}
      ${emptyPanel("No active campaigns", emptyCopy.marketing, "Create Campaign")}
      ${dataTable(["Campaign", "Channel", "Reach", "Status"], "Campaigns")}
    </div>
  `;
}

function renderFinances() {
  return `
    ${metricCards([
      { label: "Revenue", prefix: "$", target: 8420 },
      { label: "Expenses", prefix: "$", target: 2350 },
      { label: "Net", prefix: "$", target: 6070 },
      { label: "Refunds", prefix: "$", target: 180 },
    ])}
    <div class="dashboard-grid">
      ${chartPanel("Cash Flow", "No payment data connected")}
      ${chartPanel("Payment Methods", "0 cards, 0 cash, 0 online")}
      ${dataTable(["Transaction", "Type", "Amount", "Status"], "Transactions")}
    </div>
  `;
}

function renderAnalytics() {
  return `
    ${metricCards([
      { label: "Visits", target: 920 },
      { label: "Peak Covers", target: 78 },
      { label: "Table Turnover", target: 4, suffix: "x" },
      { label: "Satisfaction", target: 96, suffix: "%" },
    ])}
    <div class="analytics-grid">
      ${chartPanel("Guest Traffic", emptyCopy.analytics)}
      ${chartPanel("Top Menu Items", "No sales data available")}
      ${chartPanel("Service Timing", "No prep or table timing data")}
      ${emptyPanel("No insights yet", "Insights will unlock after data starts flowing.", "Open Insights")}
    </div>
  `;
}

function renderSettings() {
  return `
    ${metricCards([
      { label: "Profile Strength", target: 78, suffix: "%" },
      { label: "Connected Staff", target: 12 },
      { label: "Payment Methods", target: 3 },
      { label: "Security Alerts", target: 0 },
    ])}
    <div class="settings-grid">
      <section class="settings-panel">
        <h3>Manager Profile</h3>
        <label>Restaurant Name<input value="Aroma's" /></label>
        <label>Contact Email<input value="admin@aromas.local" /></label>
        <label>Branch<input value="Main Branch" /></label>
      </section>
      <section class="settings-panel">
        <h3>Notifications</h3>
        <label class="toggle-row"><span>Order alerts</span><input type="checkbox" data-action="toggle" /></label>
        <label class="toggle-row"><span>Daily digest</span><input type="checkbox" data-action="toggle" /></label>
        <label class="toggle-row"><span>Marketing updates</span><input type="checkbox" data-action="toggle" /></label>
      </section>
      <section class="settings-panel">
        <h3>Payment Configuration</h3>
        <p>0 payment methods connected.</p>
        <button class="outline-button" type="button" data-action="payment-add">Add Payment Method</button>
      </section>
      <section class="settings-panel">
        <h3>System Security</h3>
        <p>0 active sessions and 0 alerts connected.</p>
        <button class="outline-button" type="button" data-action="password">Change Password</button>
      </section>
    </div>
  `;
}

function renderScreen(name) {
  const screen = screens[name] || screens.orders;
  activeScreen = screens[name] ? name : "orders";
  viewRoot.innerHTML = `<div class="screen-view">${renderHeader(screen)}${screen.render()}</div>`;
  document.title = `Aroma's Dashboard - ${screen.title}`;
  document.querySelectorAll("[data-screen]").forEach((link) => {
    link.classList.toggle("active", link.dataset.screen === activeScreen);
  });
  setCounters(() => 0);
  viewRoot.querySelector(".screen-view").classList.add("view-enter");
}

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function setCounters(valueFor) {
  document.querySelectorAll("[data-counter]").forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    counter.textContent = Math.round(valueFor(target)).toLocaleString();
  });
}

function animateCounters(fromFactor, toFactor, duration, token) {
  const start = performance.now();

  return new Promise((resolve) => {
    function frame(now) {
      if (token !== replayToken) {
        resolve();
        return;
      }

      const elapsed = Math.min((now - start) / duration, 1);
      const eased = easeOut(elapsed);
      const factor = fromFactor + (toFactor - fromFactor) * eased;
      setCounters((target) => target * factor);

      if (elapsed < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

async function replayActivity(trigger) {
  const token = ++replayToken;
  const button = trigger || document.querySelector('[data-action="replay"]');
  if (button) {
    button.disabled = true;
    button.classList.add("is-running");
  }
  shell.classList.add("is-previewing");

  await animateCounters(0, 1, 850, token);
  await new Promise((resolve) => setTimeout(resolve, 650));
  await animateCounters(1, 0, 800, token);

  if (token === replayToken) {
    setCounters(() => 0);
    shell.classList.remove("is-previewing");
    if (button) {
      button.classList.remove("is-running");
      button.disabled = false;
    }
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function showModal(title, body, actionLabel = "Done") {
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modalActions.innerHTML = `<button class="primary-button" type="button" data-action="close-modal">${actionLabel}</button>`;
  modalBackdrop.hidden = false;
  modalBackdrop.classList.add("open");
}

function closeModal() {
  modalBackdrop.classList.remove("open");
  window.setTimeout(() => {
    modalBackdrop.hidden = true;
  }, 160);
}

function modalForAction(action) {
  const titles = {
    filter: ["Filters", "Filters are active on an empty dataset, so every result remains 0.", "Apply"],
    range: ["Date Range", "The reporting window is selected, but analytics still show 0 until data is connected.", "Apply"],
    "menu-add": ["Add Menu Item", "The menu form is ready for a backend. No item is saved until data is connected.", "Close"],
    "menu-import": ["Import Menu", "Import is available, but 0 items are loaded without a backend.", "Close"],
    "customer-add": ["Add Customer", "Customer creation is available. The directory remains empty until data is connected.", "Close"],
    "customer-import": ["Import Customers", "Import completed with 0 customer records.", "Close"],
    "reservation-add": ["Add Reservation", "Reservation creation is wired visually. The booking count stays 0.", "Close"],
    "reservation-calendar": ["Calendar", "Calendar view is available, but no reservations are connected.", "Close"],
    "campaign-add": ["Create Campaign", "Campaign setup is ready for a connected account. Active campaigns remain 0.", "Close"],
    "campaign-preview": ["Preview Campaign", "There are 0 campaigns to preview.", "Close"],
    "finance-export": ["Export Finances", "Export generated 0 rows because no payment data is connected.", "Close"],
    "finance-report": ["New Financial Report", "The report builder opens with $0 totals.", "Close"],
    "settings-save": ["Settings Saved", "Settings responded locally. No backend profile was updated.", "Done"],
    "payment-add": ["Add Payment Method", "Payment setup is disabled until a backend is connected, so connected methods remain 0.", "Close"],
    password: ["Change Password", "Security controls are visible only. No account password is changed.", "Close"],
    notifications: ["Notifications", "0 notifications are available.", "Close"],
    help: ["Help", "Help content is ready to connect. No external support system is connected.", "Close"],
    profile: ["Admin User", "This profile has 0 connected users.", "Close"],
    messages: ["Messages", "0 client or staff messages are available.", "Close"],
    status: ["Live Status", "The restaurant shell is online locally. Backend data streams are not connected.", "Close"],
    logout: ["Logout", "Logout is disabled until authentication is connected.", "Close"],
  };

  const [title, body, label] = titles[action] || ["Dashboard Action", "This control is available and leaves all data at 0.", "Close"];
  showModal(title, body, label);
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-screen]");
  const action = event.target.closest("[data-action]");

  if (nav) {
    event.preventDefault();
    window.location.hash = nav.dataset.screen;
    renderScreen(nav.dataset.screen);
    return;
  }

  if (!action) return;

  const name = action.dataset.action;
  if (name === "replay") {
    replayActivity(action);
  } else if (name === "close-modal") {
    closeModal();
  } else if (name === "toggle") {
    showToast(`${action.checked ? "Enabled" : "Disabled"} locally. Connected users remain 0.`);
  } else if (name === "empty-action" || name === "table-options" || name === "lane-options") {
    showToast("Nothing to show yet. This screen is connected to 0 records.");
  } else {
    event.preventDefault();
    modalForAction(name);
  }
});

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});

globalSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    showToast(`No results for "${globalSearch.value.trim() || "empty search"}". All datasets are 0.`);
  }
});

globalSearch.addEventListener("input", () => {
  if (globalSearch.value.trim().length > 2) {
    showToast("Search is working against 0 connected records.");
  }
});

window.addEventListener("hashchange", () => {
  renderScreen(window.location.hash.replace("#", "") || activeScreen);
});

window.addEventListener("load", () => {
  const initial = window.location.hash.replace("#", "") || "orders";
  renderScreen(initial);
  setTimeout(() => replayActivity(), 500);
});
