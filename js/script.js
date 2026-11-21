const services = [
  {
    id: 1,
    category: "electrician",
    title: "Switchboard & Socket Repair",
    desc: "Repair or replacement of damaged switches, sockets, and wiring.",
    price: 299,
    img: "images/electrician-hero.jpg"
  },
  {
    id: 2,
    category: "electrician",
    title: "Ceiling Fan & Light Installation",
    desc: "Complete mounting, regulator setup, and LED fixture installation.",
    price: 349,
    img: "images/electrician-hero.jpg"
  },
  {
    id: 3,
    category: "electrician",
    title: "MCB & Inverter Setup",
    desc: "Fuse box inspection, MCB replacement, and home inverter wiring.",
    price: 499,
    img: "images/electrician-hero.jpg"
  },
  {
    id: 4,
    category: "plumbing",
    title: "Tap & Pipe Leak Repair",
    desc: "Fix dripping faucets, broken valves, and minor pipe leakages.",
    price: 249,
    img: "images/plumbing-service.jpg"
  },
  {
    id: 5,
    category: "plumbing",
    title: "Drain & Sink Blockage Removal",
    desc: "Unclogging kitchen sinks, bathroom drains, and washbasins.",
    price: 399,
    img: "images/plumbing-service.jpg"
  },
  {
    id: 6,
    category: "plumbing",
    title: "Bathroom Fittings & Shower Setup",
    desc: "Installation of mixers, overhead showers, and flush tanks.",
    price: 449,
    img: "images/plumbing-service.jpg"
  }
];

let bookings = [
  {
    id: "FS-101",
    service: "Switchboard & Socket Repair",
    dateTime: "2026-11-24 | 10:30",
    cost: 299,
    status: "Pending",
    paymentStatus: "Unpaid"
  }
];

const servicesGrid = document.getElementById("servicesGrid");
const bookingServiceSelect = document.getElementById("bookingServiceSelect");
const bookingsTableBody = document.getElementById("bookingsTableBody");

function renderServices(filter = "all") {
  servicesGrid.innerHTML = "";
  const filtered = filter === "all" ? services : services.filter(s => s.category === filter);

  filtered.forEach(service => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <img src="${service.img}" alt="${service.title}" class="service-thumb" />
      <div class="service-content">
        <div>
          <span class="service-tag">${service.category}</span>
          <h3>${service.title}</h3>
          <p>${service.desc}</p>
        </div>
        <div class="service-footer">
          <span class="price">Est. ₹${service.price}</span>
          <button class="btn btn-navy" onclick="openBookingWithService(${service.id})">Book</button>
        </div>
      </div>
    `;
    servicesGrid.appendChild(card);
  });
}

function populateServiceSelect() {
  bookingServiceSelect.innerHTML = services
    .map(s => `<option value="${s.id}">${s.title} (Est. ₹${s.price})</option>`)
    .join("");
}

function renderBookings() {
  bookingsTableBody.innerHTML = bookings
    .map(
      (b, idx) => `
      <tr>
        <td><strong>${b.id}</strong></td>
        <td>${b.service}</td>
        <td>${b.dateTime}</td>
        <td>₹${b.cost}</td>
        <td><span class="status-pill status-pending">${b.status}</span></td>
        <td>
          <span class="status-pill ${b.paymentStatus === "Paid" ? "status-paid" : "status-pending"}">
            ${b.paymentStatus}
          </span>
        </td>
        <td>
          ${
            b.paymentStatus === "Unpaid"
              ? `<button class="btn btn-accent" onclick="payNow(${idx})">Pay Now</button>`
              : `<button class="btn btn-outline-navy" onclick="alert('Receipt downloaded for ${b.id}')">Receipt</button>`
          }
        </td>
      </tr>
    `
    )
    .join("");
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderServices(btn.dataset.filter);
  });
});

const bookingModal = document.getElementById("bookingModal");
const authModal = document.getElementById("authModal");

function openBookingWithService(serviceId) {
  bookingServiceSelect.value = serviceId;
  bookingModal.classList.add("open");
}

document.getElementById("quickBookBtn").addEventListener("click", () => bookingModal.classList.add("open"));
document.getElementById("closeBookingModal").addEventListener("click", () => bookingModal.classList.remove("open"));
document.getElementById("openAuthBtn").addEventListener("click", () => authModal.classList.add("open"));
document.getElementById("closeAuthModal").addEventListener("click", () => authModal.classList.remove("open"));

document.getElementById("bookingForm").addEventListener("submit", e => {
  e.preventDefault();
  const selectedId = Number(bookingServiceSelect.value);
  const service = services.find(s => s.id === selectedId);
  const date = document.getElementById("serviceDate").value;
  const time = document.getElementById("serviceTime").value;

  bookings.unshift({
    id: `FS-${101 + bookings.length}`,
    service: service.title,
    dateTime: `${date} | ${time}`,
    cost: service.price,
    status: "Pending",
    paymentStatus: "Unpaid"
  });

  renderBookings();
  bookingModal.classList.remove("open");
  e.target.reset();
});

function payNow(index) {
  bookings[index].paymentStatus = "Paid";
  bookings[index].status = "Confirmed";
  renderBookings();
}

document.getElementById("authForm").addEventListener("submit", e => {
  e.preventDefault();
  const role = document.getElementById("userRole").value;
  alert(`Logged in as ${role} (UI Preview — next step connects to Django auth!)`);
  authModal.classList.remove("open");
});

const chatbotBox = document.getElementById("chatbotBox");
const chatMessages = document.getElementById("chatMessages");

document.getElementById("chatbotToggle").addEventListener("click", () => chatbotBox.classList.toggle("open"));
document.getElementById("closeChatbot").addEventListener("click", () => chatbotBox.classList.remove("open"));

function getBotReply(text) {
  const q = text.toLowerCase();
  if (q.includes("electric")) return "Electrician services start at ₹299 (switchboards, fans, MCB & inverter setup).";
  if (q.includes("plumb")) return "Plumbing services start at ₹249 (leak repairs, drain blockages & bathroom fittings).";
  if (q.includes("book")) return "Click 'Book' on any service card, enter your issue, address, and preferred date/time.";
  if (q.includes("pay") || q.includes("receipt")) return "Pay online under 'My Bookings' and download your receipt right after payment.";
  return "I can help with electrician/plumbing prices, booking steps, or payment receipts. What would you like to ask?";
}

document.getElementById("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const userText = input.value.trim();
  if (!userText) return;

  chatMessages.innerHTML += `<div class="msg user">${userText}</div>`;
  const reply = getBotReply(userText);
  setTimeout(() => {
    chatMessages.innerHTML += `<div class="msg bot">${reply}</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 250);

  input.value = "";
});

renderServices();
populateServiceSelect();
renderBookings();