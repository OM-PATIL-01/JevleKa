// Food data is now fetched from the server
let selectedRole = 'Customer'; // Default

function selectRole(element) {
    document.querySelectorAll('.role-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');
    selectedRole = element.querySelector('span').innerText;
}

// Authentication Logic
// ... (toggleAuthMode stays same)

function handleLogin() {
    // Demo Bypass for Staff if they just click login without creds (optional, but sticking to flow)
    // Or just simple check:

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Login successful") {
                // Success
                localStorage.setItem('user', JSON.stringify(data.user)); // Save user

                if (selectedRole === 'Canteen Staff') {
                    window.location.href = 'staff.html';
                } else {
                    showDashboard();
                }
            } else {
                alert(data.message || "Login failed");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Server error");
        });
}

function handleRegister() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
    })
        .then(res => res.json())
        .then(data => {
            if (data.message === "User created successfully") {
                alert("Account created! Please login.");
                toggleAuthMode();
            } else {
                alert(data.message || "Registration failed");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Server error");
        });
}

function showDashboard() {
    // Play voice note immediately on click
    const myVoice = new Audio('jevle-ka.mp3');
    myVoice.volume = 1;
    myVoice.play().then(() => {
        console.log("Audio playing successfully");
        // Redirect after a short delay to allow audio to start/finish? 
        // For now, let's redirect immediately, browser might cut it off.
        window.location.href = 'dashboard.html';
    }).catch(error => {
        console.error("Audio play failed:", error);
        window.location.href = 'dashboard.html';
    });

    // Fallback if promise hangs (not typically needed but good for safety)
    setTimeout(() => {
        if (window.location.href.indexOf('dashboard.html') === -1) {
            window.location.href = 'dashboard.html';
        }
    }, 500);
}

function showLoginPage() {
    window.location.href = 'login.html';
}

function filterItems(category) {
    const grid = document.getElementById('food-grid');
    grid.innerHTML = ""; // Clear current items

    // Update active pill - REMOVED for circular menu
    // const pills = document.querySelectorAll('.menu-pill');
    // pills.forEach(p => p.classList.remove('active'));
    // const activePill = document.querySelector(`.menu-pill[data-cat="${category}"]`);
    // if (activePill) activePill.classList.add('active');

    const items = []; // Cleared initially

    // Fetch from API
    fetch(`/api/menu?category=${category}`)
        .then(response => response.json())
        .then(data => {
            const items = data.data || [];
            if (items.length === 0) {
                grid.innerHTML = '<p style="text-align:center; width:100%;">No items found.</p>';
                return;
            }

            grid.innerHTML = items.map(item => {
                const isUnavailable = item.is_available === 0;
                const dotColor = isUnavailable ? '#ff4d4d' : '#4caf50';
                const dotTitle = isUnavailable ? 'Unavailable' : 'Available';

                return `
                <div class="food-card">
                    <div style="position: relative; height: 160px; overflow: hidden;">
                        <img src="${item.img}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/320x160?text=${item.name}'">
                        
                        <!-- Availability Dot -->
                        <div style="position:absolute; top:10px; right:10px; width:12px; height:12px; border-radius:50%; background:${dotColor}; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3); z-index:10;" title="${dotTitle}"></div>
                        
                        <!-- Price Badge -->
                        <div style="position: absolute; bottom: 10px; left: 10px; background: rgba(255,255,255,0.95); padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 13px; color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.15);">₹${item.price}</div>
                    </div>
                    
                    <div class="food-info" style="padding: 12px;">
                        <div class="food-header" style="margin-bottom: 5px;">
                            <h3 class="food-name" style="font-size: 15px; margin:0;">${item.name}</h3>
                            <div class="rating" style="font-size: 11px; color: #ffb400;"><i class="fas fa-star"></i> ${item.rating}</div>
                        </div>
                        <p class="food-desc" style="font-size: 11px; color: #888; margin: 0 0 10px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.desc || 'Freshly prepared for you.'}</p>
                        <button class="btn-add-cart" 
                            onclick="addToCart('${item.name}', '${item.price}', '${item.img}')" 
                            ${isUnavailable ? 'disabled style="background:#e0e0e0; color:#888; cursor:not-allowed; box-shadow:none;"' : ''}>
                            <i class="fas fa-plus"></i> ${isUnavailable ? 'Sold Out' : 'Add'}
                        </button>
                    </div>
                </div>
            `;
            }).join('');
        })
        .catch(err => {
            console.error('Error fetching menu:', err);
            grid.innerHTML = '<p style="text-align:center; color:red;">Failed to load menu items.</p>';
        });
}

// Update cart badge on load
document.addEventListener('DOMContentLoaded', updateCartCount);

function addToCart(name, price, img) {
    const btn = event.target;
    // Add visual feedback
    const originalText = btn.innerHTML;
    btn.textContent = '...';
    btn.disabled = true;

    fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, img })
    })
        .then(res => res.json())
        .then(data => {
            btn.textContent = '✓ Added!';
            updateCartCount();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        })
        .catch(err => {
            console.error(err);
            btn.textContent = 'Error';
        });
}

function updateCartCount() {
    fetch('/api/cart/count')
        .then(res => res.json())
        .then(data => {
            const count = data.count;
            const cartIcons = document.querySelectorAll('.fa-shopping-cart');

            cartIcons.forEach(icon => {
                // Find or create badge
                let badge = icon.nextElementSibling;
                if (!badge || !badge.classList.contains('cart-badge')) {
                    // If badge doesn't exist (or isn't the right element), create it
                    // We need to make sure the parent is positioned relative
                    if (icon.parentElement.style.position !== 'relative') {
                        icon.parentElement.style.position = 'relative';
                    }

                    badge = document.createElement('span');
                    badge.className = 'cart-badge';
                    icon.parentElement.appendChild(badge);
                }

                if (count > 0) {
                    badge.textContent = count;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            });
        })
        .catch(console.error);
}

function showFoodMenu() {
    window.location.href = 'menu.html';
}

function showDashboardHome() {
    window.location.href = 'dashboard.html';
}

function showJuiceMenu() {
    // Assuming juice menu is also part of menu.html using filters, or for now just redirect to menu
    window.location.href = 'menu.html';
}

function showCart() {
    window.location.href = 'cart.html';
}

function loadCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return; // Not on cart page

    fetch('/api/cart')
        .then(res => res.json())
        .then(data => {
            const items = data.data || [];
            container.innerHTML = ''; // Clear loading

            if (items.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding: 40px; color:#999;">Your cart is empty. <br><a href="#" onclick="showFoodMenu()" style="color:var(--primary); text-decoration:none; font-weight:bold;">Start Ordering</a></div>';
                document.getElementById('cart-summary').classList.add('hidden');
                return;
            }

            let total = 0;
            items.forEach(item => {
                // Parse price (remove ₹)
                const priceVal = parseInt(item.price.replace(/[^\d]/g, '') || 0);
                const itemTotal = priceVal * item.quantity;
                total += itemTotal;

                const row = document.createElement('div');
                row.className = 'cart-item-row';
                row.style.cssText = 'display:flex; align-items:center; gap:15px; background:white; padding:15px; border-radius:15px; margin-bottom:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);';

                row.innerHTML = `
                    <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:10px;">
                    <div style="flex:1;">
                        <h4 style="margin:0; font-size:16px;">${item.name}</h4>
                        <div style="color:var(--primary); font-weight:bold;">${item.price}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-weight:bold; background:#f0f0f0; padding:5px 10px; border-radius:8px;">x${item.quantity}</span>
                        <button onclick="removeFromCart(${item.id})" style="background:#ffebee; color:#d32f2f; border:none; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                container.appendChild(row);
            });

            document.getElementById('cart-subtotal').textContent = '₹' + total;
            document.getElementById('cart-total').textContent = '₹' + total;
            document.getElementById('cart-summary').classList.remove('hidden');
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p>Error loading cart.</p>';
        });
}

function removeFromCart(id) {
    fetch('/api/cart/reduce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
        .then(res => res.json())
        .then(() => {
            loadCartItems();
            updateCartCount();
        })
        .catch(console.error);
}

// Menu Logic
function toggleMenu() {
    const menu = document.getElementById('circular-menu');
    menu.classList.toggle('active');
}

function selectCategory(category) {
    filterItems(category);
    toggleMenu(); // Close after selection
}

// Payment Logic
function showPaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('hidden');
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.add('hidden');
}

function processPayment(method) {
    if (method === 'UPI') {
        showUPIApps();
        return;
    }

    completeOrder(method);
}

function showUPIApps() {
    const optionsContainer = document.querySelector('.payment-options');
    // Save original content to restore if needed (simplified here to just replace)
    optionsContainer.innerHTML = `
        <div style="text-align:center; margin-bottom:15px; width:100%;">
            <p style="color:#666; font-size:14px; margin-bottom:15px;">Choose your UPI App</p>
            <div class="upi-grid">
                <button class="upi-app-btn" onclick="selectUPIApp('Google Pay')">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay">
                   <span>Google Pay</span>
                </button>
                <button class="upi-app-btn" onclick="selectUPIApp('PhonePe')">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe">
                   <span>PhonePe</span>
                </button>
                <button class="upi-app-btn" onclick="selectUPIApp('Paytm')">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm">
                   <span>Paytm</span>
                </button>
                <button class="upi-app-btn" onclick="selectUPIApp('BHIM')">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/BHIM-Logo.svg/1200px-BHIM-Logo.svg.png" alt="BHIM">
                   <span>BHIM</span>
                </button>
                 <button class="upi-app-btn" onclick="selectUPIApp('WhatsApp')">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" alt="WhatsApp">
                   <span>WhatsApp</span>
                </button>
                <button class="upi-app-btn" onclick="selectUPIApp('Cred')">
                   <div style="width:40px; height:40px; background:black; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">C</div>
                   <span>Cred</span>
                </button>
            </div>
            <button onclick="resetPaymentModal()" style="margin-top:20px; background:none; border:none; color:#666; text-decoration:underline; cursor:pointer;">Back to Methods</button>
        </div>
    `;
}

function resetPaymentModal() {
    // Restore original options - Hardcoded for simplicity as we replaced innerHTML
    const optionsContainer = document.querySelector('.payment-options');
    optionsContainer.innerHTML = `
        <button class="payment-option" onclick="processPayment('UPI')">
            <div class="icon-box" style="background: #e8f5e9; color: #2e7d32;">
                <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="option-info">
                <h4>UPI</h4>
                <p>Google Pay, PhonePe, Paytm</p>
            </div>
            <i class="fas fa-chevron-right arrow"></i>
        </button>
        
        <button class="payment-option" onclick="processPayment('Card')">
            <div class="icon-box" style="background: #e3f2fd; color: #1565c0;">
                <i class="fas fa-credit-card"></i>
            </div>
            <div class="option-info">
                <h4>Card</h4>
                <p>Credit / Debit Card</p>
            </div>
            <i class="fas fa-chevron-right arrow"></i>
        </button>

        <button class="payment-option" onclick="processPayment('Cash')">
            <div class="icon-box" style="background: #fff3e0; color: #ef6c00;">
                <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="option-info">
                <h4>Cash</h4>
                <p>Pay on Delivery</p>
            </div>
            <i class="fas fa-chevron-right arrow"></i>
        </button>
    `;
}

function selectUPIApp(appName) {
    // Simulate redirection delay for realism
    const optionsContainer = document.querySelector('.payment-options');
    optionsContainer.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <div class="loading-spinner" style="margin:0 auto 20px auto;"></div>
            <p>Redirecting to <strong>${appName}</strong>...</p>
            <p style="font-size:12px; color:#999;">Please approve the payment of ₹${document.getElementById('cart-total').innerText.replace('₹', '')}</p>
        </div>
    `;

    // 3 seconds delay for "App" simulation
    setTimeout(() => {
        completeOrder(`UPI(${appName})`);
    }, 3000);
}

function generateOrderId() {
    return Math.floor(1000 + Math.random() * 9000); // 4 digit random code for staff
}

function completeOrder(method) {
    // 1. Get Cart Items first to save them
    fetch('/api/cart')
        .then(res => res.json())
        .then(cartData => {
            const items = cartData.data || [];
            if (items.length === 0) return;

            const total = items.reduce((sum, item) => sum + (parseInt(item.price.replace(/[^\d]/g, '') || 0) * item.quantity), 0);
            const user = JSON.parse(localStorage.getItem('user')) || { id: 0, username: 'Guest' }; // Fallback
            const orderId = generateOrderId(); // 4 digit random
            const fullOrderId = `ORD-${Date.now().toString().slice(-6)}`;
            const dateStr = new Date().toLocaleString();

            // 2. Save Order to DB
            const orderPayload = {
                user_id: user.id,
                items: JSON.stringify(items),
                total: total,
                order_code: fullOrderId,
                payment_method: method,
                date: dateStr
            };

            return fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            }).then(() => {
                // 3. Clear Cart
                return fetch('/api/cart/clear', { method: 'POST' });
            }).then(() => {
                // 4. Show Ticket
                const qrData = `JevleKhana-Order-${orderId}-Paid`;
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

                renderTicket(fullOrderId, orderId, qrUrl, method);
            });
        })
        .catch(console.error);
}

function renderTicket(fullOrderId, shortId, qrUrl, method) {
    closePaymentModal();
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary');

    summary.classList.add('hidden');
    container.innerHTML = `
        <div style="padding: 20px 0; animation: popIn 0.5s;">
            <div style="background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); overflow: hidden; max-width: 320px; margin: 0 auto; border: 1px solid #eee; position:relative;">
                <div style="background: var(--primary); padding: 20px; text-align: center; color: white;">
                    <h2 style="margin:0; font-size: 24px;">Order Confirmed!</h2>
                    <p style="margin:5px 0 0 0; opacity: 0.9; font-size: 13px;">${fullOrderId}</p>
                </div>
                <div style="height: 4px; background: white; background-image: linear-gradient(to right, #ccc 50%, rgba(255,255,255,0) 0%); background-position: bottom; background-size: 10px 1px; background-repeat: repeat-x;"></div>
                <div style="padding: 30px 20px; text-align: center;">
                    <p style="color:#666; font-size:12px; margin-bottom:10px;">SHOW TO STAFF</p>
                    <div style="font-size: 56px; font-weight: 900; color: #333; line-height: 1; margin-bottom: 20px;">#${shortId}</div>
                    <img src="${qrUrl}" alt="Order QR" style="width: 140px; height: 140px; margin-bottom: 20px; border-radius: 10px; border: 4px solid #f8f9fa;">
                    <div style="background: #f0fdf4; color: #166534; padding: 8px 15px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: bold;">
                        <i class="fas fa-check-circle"></i> Paid via ${method}
                    </div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px dashed #ddd;">
                    <button style="border: none; background: none; color: var(--primary); font-weight: bold; cursor: pointer;" onclick="showDashboardHome()">Close & New Order</button>
                </div>
            </div>
        </div>
    `;
    updateCartCount();
}

// Profile Logic

function showProfile() {
    window.location.href = 'profile.html';
}

function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('profile-name').innerText = user.username;
    document.getElementById('profile-email').innerText = user.email || 'user@example.com';

    // Load Orders
    const ordersList = document.getElementById('orders-list');

    fetch(`/api/orders?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
            const orders = data.data || [];
            if (orders.length === 0) {
                ordersList.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">No orders yet.</p>';
                return;
            }

            ordersList.innerHTML = orders.map(order => {
                // Parse items safely
                let cleanItems = "Items";
                try {
                    const parsed = JSON.parse(order.items);
                    cleanItems = parsed.map(i => `${i.quantity}x ${i.name}`).join(', ');
                } catch (e) { }

                // Use simple order ID for display if we have strict format, or part of hash
                const easyId = order.order_code.split('-')[1] || order.id;

                return `
                <div class="order-card">
                    <div class="order-info">
                        <h4>Order #${easyId}</h4>
                        <p>${order.date} • ${order.payment_method}</p>
                        <p style="margin-top:4px; font-weight:500; color:#555;">₹${order.total}</p>
                        <p style="margin-top:4px; font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px;">${cleanItems}</p>
                    </div>
                    <button class="view-ticket-btn" onclick="openTicketModal(${order.id}, '${order.order_code}', '${order.payment_method}')">View QR</button>
                </div>
                `;
            }).join('');
        })
        .catch(err => {
            console.error(err);
            ordersList.innerHTML = '<p>Failed to load history.</p>';
        });
}

function openTicketModal(id, fullCode, method) {
    const modal = document.getElementById('ticket-modal');
    const content = document.getElementById('ticket-modal-content');

    // Generate QR (Normally this data should be stored/consistent, here we regenerate for demo using same format)
    // We didn't save the random 4 digit code separate in DB schema for this iteration, 
    // so we will extract from fullCode or just use ID for this view.
    const shortId = "####"; // In real app, save the 'random 4 digit' to DB. For now, placeholder or derive.

    const qrData = `JevleKhana-Order-${id}-Paid`; // Use DB ID for consistent QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    modal.classList.remove('hidden');
    content.innerHTML = `
        <div style="background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); overflow: hidden; position:relative;">
            <div style="background: var(--primary); padding: 20px; text-align: center; color: white;">
                <h2 style="margin:0; font-size: 20px;">Order #${id}</h2>
                <p style="margin:5px 0 0 0; opacity: 0.9; font-size: 13px;">${fullCode}</p>
            </div>
            <div style="padding: 30px 20px; text-align: center;">
                <img src="${qrUrl}" alt="Order QR" style="width: 140px; height: 140px; margin-bottom: 20px; border-radius: 10px; border: 4px solid #f8f9fa;">
                <div style="background: #f0fdf4; color: #166534; padding: 8px 15px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: bold;">
                    <i class="fas fa-check-circle"></i> Paid via ${method}
                </div>
            </div>
        </div>
    `;
}

function closeTicketModal() {
    document.getElementById('ticket-modal').classList.add('hidden');
}

// Staff Dashboard Logic

function switchStaffTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if (tab === 'orders') {
        document.getElementById('staff-orders-view').classList.remove('hidden');
        document.getElementById('staff-menu-view').classList.add('hidden');
        loadStaffOrders();
    } else {
        document.getElementById('staff-orders-view').classList.add('hidden');
        document.getElementById('staff-menu-view').classList.remove('hidden');
        loadStaffMenu();
    }
}

function loadStaffOrders() {
    const container = document.getElementById('staff-orders-view');
    if (!container) return;

    fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
            const orders = data.data || [];
            if (orders.length === 0) {
                container.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">No active orders.</p>';
                return;
            }

            container.innerHTML = orders.map(order => {
                let cleanItems = "Items";
                try {
                    const parsed = JSON.parse(order.items);
                    cleanItems = parsed.map(i => `${i.quantity}x ${i.name}`).join(', ');
                } catch (e) { }

                const status = order.status || 'Pending';
                const easyId = order.order_code ? order.order_code.split('-')[1] : order.id;

                return `
                <div class="order-card" style="display:block; position:relative;">
                    <button onclick="openIssueModal(${order.id}, '${order.items.replace(/'/g, "\\'")}')" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#dc3545; cursor:pointer;" title="Report Unavailable"><i class="fas fa-exclamation-triangle"></i></button>
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-right: 25px;">
                        <h4 style="margin:0;">#${easyId} <span class="status-badge status-${status.toLowerCase()}">${status}</span></h4>
                        <span style="font-size:12px; color:#666;">${order.date ? order.date.split(',')[1] : ''}</span>
                    </div>
                    <p style="margin-bottom:10px; font-weight:500;">${cleanItems}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:bold;">₹${order.total}</span>
                        <div style="display:flex; gap:5px;">
                            ${status !== 'Completed' && status !== 'Replaced' ? `
                            <button onclick="updateOrderStatus(${order.id}, 'Ready')" style="padding:5px 10px; background:#d4edda; border:none; border-radius:5px; color:#155724; font-size:12px;">Ready</button>
                            <button onclick="updateOrderStatus(${order.id}, 'Completed')" style="padding:5px 10px; background:#e2e3e5; border:none; border-radius:5px; color:black; font-size:12px;">Done</button>
                            ` : (status === 'Replaced' ? '<span style="font-size:11px; color:#666;">Replaced</span>' : '<i class="fas fa-check-circle" style="color:green;"></i>')}
                        </div>
                    </div>
                </div>`;
            }).join('');
        });
}

function openIssueModal(orderId, itemsJson) {
    const modal = document.getElementById('issue-modal');
    const container = document.getElementById('order-items-to-report');
    const items = JSON.parse(itemsJson);

    container.innerHTML = items.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;">
            <span>${item.name} (x${item.quantity})</span>
            <button onclick="sendIssueReport(${orderId}, '${item.name}', ${item.price})" style="padding:5px 10px; background:#dc3545; color:white; border:none; border-radius:5px; font-size:11px;">Mark Unavailable</button>
        </div>
    `).join('');

    modal.classList.remove('hidden');
}

function closeIssueModal() {
    document.getElementById('issue-modal').classList.add('hidden');
}

function sendIssueReport(orderId, itemName, itemPrice) {
    // 1. Get user_id for this order first
    fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
            const order = data.data.find(o => o.id === orderId);
            if (!order) return;

            const message = `ITEM_UNAVAILABLE|${itemName}|${itemPrice}|${orderId}`;

            fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: order.user_id,
                    message: message,
                    order_id: orderId
                })
            }).then(() => {
                alert(`Alert sent to customer regarding ${itemName}`);
                closeIssueModal();
                updateOrderStatus(orderId, 'Issue Reported');
            });
        });
}

function updateOrderStatus(id, status) {
    fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    })
        .then(() => loadStaffOrders()) // Refresh
        .catch(console.error);
}

function loadStaffMenu() {
    const container = document.getElementById('staff-menu-view');
    if (!container) return;

    fetch('/api/menu')
        .then(res => res.json())
        .then(data => {
            const items = data.data || [];
            container.innerHTML = items.map(item => `
                <div class="menu-mgmt-card">
                    <div style="display:flex; align-items:center; gap:10px; flex:1;">
                        <img src="${item.img}" style="width:40px; height:40px; border-radius:5px; object-fit:cover;">
                        <div>
                            <h4 style="margin:0; font-size:14px;">${item.name}</h4>
                            <p style="margin:0; font-size:12px; color:#666;">₹${item.price}</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" onchange="toggleItemAvailability(${item.id}, this.checked)" ${item.is_available !== 0 ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            `).join('');
        });
}

function toggleItemAvailability(id, isAvailable) {
    fetch(`/api/items/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: isAvailable ? 1 : 0 })
    })
        .catch(console.error);
}

// Notification & Swap Logic (Customer Side)
let currentSwapData = null;

function pollNotifications() {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson || !document.getElementById('notif-bell')) return;
    const user = JSON.parse(userJson);

    fetch(`/api/notifications?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
            const notifs = data.data || [];
            const unread = notifs.filter(n => !n.is_read);

            const dot = document.getElementById('notif-dot');
            if (dot) {
                if (unread.length > 0) dot.classList.remove('hidden');
                else dot.classList.add('hidden');
            }
            renderNotifications(notifs);
        });
}

function renderNotifications(notifs) {
    const list = document.getElementById('notif-list');
    if (!list) return;

    if (notifs.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #999; font-size: 13px; margin: 20px 0;">No notifications</p>';
        return;
    }

    list.innerHTML = notifs.map(n => {
        const isIssue = n.message.startsWith('ITEM_UNAVAILABLE');
        let displayMsg = n.message;
        let actionHtml = '';

        if (isIssue) {
            const parts = n.message.split('|');
            const itemName = parts[1];
            const itemPrice = parts[2];
            const orderId = parts[3];
            displayMsg = `<b>${itemName}</b> is unavailable in your order #${orderId}. Click to choose a replacement.`;
            actionHtml = `<button onclick="openSwapModal(${n.id}, ${orderId}, '${itemName}', ${itemPrice})" style="width:100%; margin-top:8px; padding:6px; background:var(--primary); color:white; border:none; border-radius:5px; font-size:11px;">Swap Now</button>`;
        }

        return `
        <div style="padding:10px; border-bottom:1px solid #f0f0f0; background: ${n.is_read ? 'white' : '#fff5f2'}; border-radius: 8px; margin-bottom: 5px;">
            <p style="margin:0; font-size:12px; line-height:1.4;">${displayMsg}</p>
            ${actionHtml}
            <small style="color:#999; font-size:10px;">${n.created_at}</small>
        </div>
        `;
    }).join('');
}

function toggleNotifDropdown() {
    const drop = document.getElementById('notif-dropdown');
    if (!drop) return;
    drop.classList.toggle('hidden');
    if (!drop.classList.contains('hidden')) pollNotifications();
}

function openSwapModal(notifId, orderId, oldName, oldPrice) {
    currentSwapData = { notifId, orderId, oldName, oldPrice };
    const modal = document.getElementById('replacement-modal');
    document.getElementById('repl-modal-desc').innerText = `Your order contains ${oldName} which is out of stock. Select an alternative.`;
    document.getElementById('orig-item-price').innerText = `₹${oldPrice}`;
    modal.classList.remove('hidden');
    document.getElementById('notif-dropdown').classList.add('hidden');

    fetch('/api/menu')
        .then(res => res.json())
        .then(data => {
            const items = (data.data || []).filter(i => i.is_available && i.name !== oldName);
            const container = document.getElementById('repl-menu-options');
            container.innerHTML = items.map(item => `
                <div class="repl-card" onclick="selectReplacement(${item.id}, '${item.name}', ${item.price})" style="border: 1px solid #eee; padding: 10px; border-radius: 10px; cursor: pointer; text-align: center;">
                    <img src="${item.img}" style="width: 100%; height: 60px; object-fit: cover; border-radius: 5px; margin-bottom: 5px;">
                    <h5 style="margin:0; font-size:12px;">${item.name}</h5>
                    <p style="margin:0; font-size:11px; color:var(--primary); font-weight:bold;">₹${item.price}</p>
                </div>
            `).join('');
        });
}

function selectReplacement(id, name, price) {
    document.querySelectorAll('.repl-card').forEach(c => c.style.borderColor = '#eee');
    event.currentTarget.style.borderColor = 'var(--primary)';
    currentSwapData.newItem = { id, name, price };

    const diff = price - currentSwapData.oldPrice;
    const calcBox = document.getElementById('repl-calc-box');
    const diffEl = document.getElementById('repl-diff-amount');
    const hintEl = document.getElementById('repl-action-hint');

    calcBox.classList.remove('hidden');
    if (diff > 0) {
        diffEl.innerText = `+₹${diff}`;
        diffEl.style.color = '#dc3545';
        hintEl.innerText = `Pay extra ₹${diff}.`;
    } else if (diff < 0) {
        diffEl.innerText = `-₹${Math.abs(diff)}`;
        diffEl.style.color = '#28a745';
        hintEl.innerText = `₹${Math.abs(diff)} will be refunded.`;
    } else {
        diffEl.innerText = `₹0`;
        diffEl.style.color = '#6610f2';
        hintEl.innerText = `Even exchange!`;
    }
    document.getElementById('confirm-swap-btn').onclick = () => confirmSwap(diff);
}

function confirmSwap(diff) {
    if (!currentSwapData.newItem) return;
    const btn = document.getElementById('confirm-swap-btn');
    btn.disabled = true;
    btn.innerText = "Processing...";

    fetch('/api/orders/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            original_order_id: currentSwapData.orderId,
            new_items: [currentSwapData.newItem],
            new_total: currentSwapData.newItem.price,
            price_diff: diff,
            payment_method: 'UPI-Adjustment'
        })
    })
        .then(res => res.json())
        .then(() => {
            fetch('/api/notifications/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentSwapData.notifId })
            }).then(() => {
                alert("Order updated successfully!");
                location.reload();
            });
        });
}

function closeReplacementModal() {
    document.getElementById('replacement-modal').classList.add('hidden');
}

// Start polling on dashboard
if (document.getElementById('dashboard-screen')) {
    setInterval(pollNotifications, 5000);
    pollNotifications();
}
