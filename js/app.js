// Shared FixSpark Frontend Script (works safely across pages)
document.addEventListener("DOMContentLoaded", () => {
  const defaultServices = [
    {
      id: 1,
      category: "electrician",
      title: "Switchboard & Socket Repair",
      desc: "Repair or replacement of damaged switches, sockets, and wiring.",
      price: 299,
      img: "images/electrician board.jpeg"
    },
    {
      id: 2,
      category: "electrician",
      title: "Ceiling Fan & Light Installation",
      desc: "Complete mounting, regulator setup, and LED fixture installation.",
      price: 349,
      img: "images/electrician fan.jpeg"
    },
    {
      id: 3,
      category: "electrician",
      title: "MCB & Inverter Setup",
      desc: "Fuse box inspection, MCB replacement, and home inverter wiring.",
      price: 499,
      img: "images/electrician mcb.jpeg"
    },
    {
      id: 4,
      category: "plumbing",
      title: "Tap & Pipe Leak Repair",
      desc: "Fix dripping faucets, broken valves, and minor pipe leakages.",
      price: 249,
      img: "images/plumber tap.jpeg"
    },
    {
      id: 5,
      category: "plumbing",
      title: "Drain & Sink Blockage Removal",
      desc: "Unclogging kitchen sinks, bathroom drains, and washbasins.",
      price: 399,
      img: "images/plumber basing.jpeg"
    },
    {
      id: 6,
      category: "plumbing",
      title: "Bathroom Fittings & Shower Setup",
      desc: "Installation of mixers, overhead showers, and flush tanks.",
      price: 449,
      img: "images/plumber bathroom.jpeg"
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

  // --- INDEX PAGE LOGIC ---
  const servicesGrid = document.getElementById("servicesGrid");
  const bookingServiceSelect = document.getElementById("bookingServiceSelect");
  const bookingsTableBody = document.getElementById("bookingsTableBody");

  function renderServices(filter = "all") {
    if (!servicesGrid) return;
    const filtered =
      filter === "all"
        ? defaultServices
        : defaultServices.filter((s) => s.category === filter);

    servicesGrid.innerHTML = filtered
      .map(
        (service) => `
        <div class="service-card">
          <img src="${service.img}" alt="${service.title}" class="service-thumb" />
          <div class="service-content">
            <div>
              <span class="service-tag">${service.category}</span>
              <h3>${service.title}</h3>
              <p>${service.desc}</p>
            </div>
            <div class="service-footer">
              <span class="price">Est. ₹${service.price}</span>
              <button type="button" class="btn btn-navy book-service-btn" data-id="${service.id}">Book</button>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  function populateServiceSelect() {
    if (!bookingServiceSelect) return;
    bookingServiceSelect.innerHTML = defaultServices
      .map((s) => `<option value="${s.id}">${s.title} (Est. ₹${s.price})</option>`)
      .join("");
  }

  function renderBookings() {
    if (!bookingsTableBody) return;
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
                ? `<button type="button" class="btn btn-accent pay-now-btn" data-index="${idx}">Pay Now</button>`
                : `<button type="button" class="btn btn-outline-navy receipt-btn" data-id="${b.id}">Receipt</button>`
            }
          </td>
        </tr>
      `
      )
      .join("");
  }

  renderServices();
  populateServiceSelect();
  renderBookings();

  // Category filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderServices(btn.dataset.filter);
    });
  });

  // Modals
  const bookingModal = document.getElementById("bookingModal");
  const authModal = document.getElementById("authModal");

  document.addEventListener("click", (e) => {
    const bookBtn = e.target.closest(".book-service-btn");
    if (bookBtn && bookingModal) {
      if (bookingServiceSelect) bookingServiceSelect.value = bookBtn.dataset.id;
      bookingModal.classList.add("open");
    }

    const payBtn = e.target.closest(".pay-now-btn");
    if (payBtn) {
      const i = Number(payBtn.dataset.index);
      bookings[i].paymentStatus = "Paid";
      bookings[i].status = "Confirmed";
      renderBookings();
    }

    const receiptBtn = e.target.closest(".receipt-btn");
    if (receiptBtn) {
      alert(`Receipt downloaded for ${receiptBtn.dataset.id}`);
    }
  });

  const quickBookBtn = document.getElementById("quickBookBtn");
  const closeBookingModal = document.getElementById("closeBookingModal");
  const openAuthBtn = document.getElementById("openAuthBtn");
  const closeAuthModal = document.getElementById("closeAuthModal");

  if (quickBookBtn && bookingModal) {
    quickBookBtn.addEventListener("click", () => bookingModal.classList.add("open"));
  }
  if (closeBookingModal && bookingModal) {
    closeBookingModal.addEventListener("click", () => bookingModal.classList.remove("open"));
  }
  if (openAuthBtn && authModal) {
    openAuthBtn.addEventListener("click", () => authModal.classList.add("open"));
  }
  if (closeAuthModal && authModal) {
    closeAuthModal.addEventListener("click", () => authModal.classList.remove("open"));
  }

  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedId = Number(bookingServiceSelect.value);
      const service = defaultServices.find((s) => s.id === selectedId);
      const date = document.getElementById("serviceDate").value;
      const time = document.getElementById("serviceTime").value;

      bookings.unshift({
        id: `FS-${101 + bookings.length}`,
        service: service ? service.title : "Home Service",
        dateTime: `${date} | ${time}`,
        cost: service ? service.price : 299,
        status: "Pending",
        paymentStatus: "Unpaid"
      });

      renderBookings();
      bookingModal.classList.remove("open");
      bookingForm.reset();
    });
  }

  const authForm = document.getElementById("authForm");
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const role = document.getElementById("userRole").value;
      alert(`Logged in as ${role} (UI Preview — connects to Django auth next)`);
      authModal.classList.remove("open");
    });
  }

  // Chatbot
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotBox = document.getElementById("chatbotBox");
  const closeChatbot = document.getElementById("closeChatbot");
  const chatForm = document.getElementById("chatForm");
  const chatMessages = document.getElementById("chatMessages");

  if (chatbotToggle && chatbotBox) {
    chatbotToggle.addEventListener("click", () => chatbotBox.classList.toggle("open"));
  }
  if (closeChatbot && chatbotBox) {
    closeChatbot.addEventListener("click", () => chatbotBox.classList.remove("open"));
  }

  function getBotReply(text) {
    const q = text.toLowerCase();
    if (q.includes("electric")) return "Electrician services start at ₹299 (switchboards, fans, MCB & inverter setup).";
    if (q.includes("plumb")) return "Plumbing services start at ₹249 (leak repairs, drain blockages & bathroom fittings).";
    if (q.includes("book")) return "Click 'Book' on any service card, enter your issue, address, and preferred date/time.";
    if (q.includes("pay") || q.includes("receipt")) return "Pay online under 'My Bookings' and download your receipt right after payment.";
    return "I can help with electrician/plumbing prices, booking steps, or payment receipts.";
  }

  if (chatForm && chatMessages) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chatInput");
      const userText = input.value.trim();
      if (!userText) return;

      chatMessages.innerHTML += `<div class="msg user">${userText}</div>`;
      const reply = getBotReply(userText);
      setTimeout(() => {
        chatMessages.innerHTML += `<div class="msg bot">${reply}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 200);

      input.value = "";
    });
  }
});