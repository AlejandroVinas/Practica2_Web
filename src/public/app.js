import * as GQL from './graphqlClient.js';
import * as Cart from './cartManager.js';

const apiBase = "/api";
const statusEl = document.getElementById("status");
const appEl = document.getElementById("app");
const authEl = document.getElementById("auth");

let currentUser = null;

// ==================== UTILIDADES ====================

function setStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.innerText = msg;
    statusEl.style.color = ok ? "green" : "red";
    setTimeout(() => statusEl.innerText = "", 5000);
}

function updateCartBadge() {
  const count = Cart.getCartCount();
  const badge = document.getElementById("cartBadge");
  if (badge) {
    document.getElementById("cartCount").innerText = count;
    badge.style.display = count > 0 ? "block" : "none";
  }
}

// Función para formatear fechas correctamente
function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    // GraphQL devuelve fechas en formato ISO string
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', dateString);
      return 'Fecha no disponible';
    }
    
    // Formatear en español
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (err) {
    console.error('Error formateando fecha:', err);
    return 'Fecha no disponible';
  }
}

// ==================== AUTENTICACIÓN ====================

// --- REGISTRO ---
document.getElementById("btnRegister").onclick = async (e) => {
    e.preventDefault();
    const username = document.getElementById("regUser").value.trim();
    const password = document.getElementById("regPass").value;
    const role = document.getElementById("regRole").value;

    if (!username || !password) {
        setStatus("Completa todos los campos", false);
        return;
    }

    try {
        const res = await fetch(`${apiBase}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error");
        setStatus("✅ Registro OK. Haz login.");
        document.getElementById("regUser").value = "";
        document.getElementById("regPass").value = "";
    } catch (err) {
        setStatus(err.message, false);
    }
};

// --- LOGIN ---
document.getElementById("btnLogin").onclick = async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value;

    if (!username || !password) {
        setStatus("Completa todos los campos", false);
        return;
    }

    try {
        const res = await fetch(`${apiBase}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error");

        console.log("✅ Login exitoso:", data);
        console.log("🔑 Token recibido:", data.token);
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Verificar que se guardó correctamente
        const tokenGuardado = localStorage.getItem("token");
        console.log("💾 Token guardado en localStorage:", tokenGuardado ? "Sí" : "❌ NO");
        
        setupUI(data.user);
        setStatus("✅ Sesión iniciada");
    } catch (err) {
        setStatus(err.message, false);
    }
};

// --- INTERFAZ (UI) ---
function setupUI(user) {
    currentUser = user;
    authEl.style.display = "none";
    appEl.style.display = "block";
    document.getElementById("username").innerText = user.username;
    document.getElementById("role").innerText = user.role;

    const btnAdmin = document.getElementById("btnGoAdmin");
    if (user.role === "admin") {
        btnAdmin.style.display = "inline-block";
    } else {
        btnAdmin.style.display = "none";
    }
    
    updateCartBadge();
    showView("productsView");
    loadCatalog();
}

// --- LOGOUT ---
document.getElementById("btnLogout").onclick = () => {
    localStorage.clear();
    Cart.clearCart();
    location.reload();
};

// ==================== NAVEGACIÓN ====================

document.getElementById("btnGoProducts").onclick = () => {
    showView("productsView");
    loadCatalog();
};

document.getElementById("btnGoCart").onclick = () => {
    showView("cartView");
    renderCart();
};

document.getElementById("btnGoMyOrders").onclick = () => {
    showView("myOrdersView");
    loadMyOrders();
};

document.getElementById("btnGoChat").onclick = () => {
    window.location.href = "/chat.html";
};

document.getElementById("btnGoAdmin").onclick = () => {
    showView("adminView");
    loadAdminData();
};

function showView(viewId) {
    ["productsView", "cartView", "myOrdersView", "adminView"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
    const target = document.getElementById(viewId);
    if (target) target.style.display = "block";
}

// ==================== CATÁLOGO DE PRODUCTOS ====================

async function loadCatalog() {
    const container = document.getElementById("productsList");
    if (!container) return;

    try {
        const data = await GQL.getProducts();
        const products = data.products;

        if (!Array.isArray(products) || products.length === 0) {
            container.innerHTML = "<p>No hay productos disponibles todavía.</p>";
            return;
        }

        container.innerHTML = products.map(p => `
            <div class="product-card">
                <h3>${p.name}</h3>
                <p class="description">${p.description || "Sin descripción"}</p>
                <p class="price">$${p.price.toFixed(2)}</p>
                ${currentUser.role !== "admin" ? `
                    <button onclick="window.addToCartGlobal('${p.id}', '${p.name}', ${p.price})" class="btn-add-cart">
                       🛒 Agregar al carrito
                    </button>
                ` : ''}
            </div>
        `).join("");

    } catch (err) {
        console.error("Error al cargar productos:", err);
        container.innerHTML = "<p>Error al cargar el catálogo.</p>";
        setStatus("Error: " + err.message, false);
    }
}

// Función global para agregar al carrito (llamada desde HTML generado)
window.addToCartGlobal = (id, name, price) => {
    Cart.addToCart({ id, name, price });
    updateCartBadge();
    setStatus(`✅ ${name} añadido al carrito`);
};

// ==================== CARRITO ====================

function renderCart() {
    const cart = Cart.getCart();
    const itemsContainer = document.getElementById("cartItems");
    const summaryContainer = document.getElementById("cartSummary");
    
    if (!itemsContainer || !summaryContainer) return;
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = "<p>Tu carrito está vacío</p>";
        summaryContainer.innerHTML = "";
        return;
    }
    
    itemsContainer.innerHTML = `
        <table class="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <input type="number" 
                         value="${item.quantity}" 
                         min="1" 
                         class="quantity-input" 
                         data-id="${item.id}" />
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button class="btn-remove" data-id="${item.id}">❌</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
    `;
    
    const total = Cart.getCartTotal();
    summaryContainer.innerHTML = `
        <div class="cart-summary">
          <h3>Total: ${total.toFixed(2)}</h3>
          <button id="btnCheckout" class="btn-primary">💳 Finalizar Compra</button>
          <button id="btnClearCart" class="btn-secondary">🗑️ Vaciar Carrito</button>
        </div>
    `;
    
    // Agregar event listeners DESPUÉS de crear el HTML
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("change", (e) => {
            Cart.updateQuantity(e.target.dataset.id, parseInt(e.target.value));
            renderCart();
            updateCartBadge();
        });
    });
    
    document.querySelectorAll(".btn-remove").forEach(btn => {
        btn.addEventListener("click", () => {
            Cart.removeFromCart(btn.dataset.id);
            renderCart();
            updateCartBadge();
            setStatus("✅ Producto eliminado del carrito");
        });
    });
    
    // Event listeners para los botones de checkout y clear
    const checkoutBtn = document.getElementById("btnCheckout");
    const clearBtn = document.getElementById("btnClearCart");
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkoutHandler);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener("click", clearCartHandler);
    }
}

// Handlers separados para evitar problemas
async function checkoutHandler() {
    const items = Cart.getCartForOrder();
    
    if (items.length === 0) {
        setStatus("❌ El carrito está vacío", false);
        return;
    }
    
    console.log("🛒 Iniciando checkout con items:", items);
    
    try {
        const data = await GQL.createOrder(items);
        console.log("✅ Pedido creado:", data);
        Cart.clearCart();
        updateCartBadge();
        setStatus("✅ ¡Pedido realizado con éxito!");
        showView("myOrdersView");
        loadMyOrders();
    } catch (err) {
        console.error("❌ Error en checkout:", err);
        setStatus("❌ " + err.message, false);
    }
}

function clearCartHandler() {
    if (confirm("¿Vaciar el carrito?")) {
        Cart.clearCart();
        renderCart();
        updateCartBadge();
        setStatus("✅ Carrito vaciado");
    }
}

// Ya no son necesarias estas funciones globales, 
// los event listeners se manejan directamente en renderCart()

// ==================== MIS PEDIDOS ====================

async function loadMyOrders() {
    const container = document.getElementById("myOrdersList");
    if (!container) return;
    
    try {
        const data = await GQL.getMyOrders();
        const orders = data.myOrders;
        
        if (orders.length === 0) {
            container.innerHTML = "<p>No tienes pedidos aún</p>";
            return;
        }
        
        container.innerHTML = orders.map(order => `
            <div class="order-card ${order.status}">
              <div class="order-header">
                <h4>Pedido #${order.id.slice(-8)}</h4>
                <span class="status-badge ${order.status}">
                  ${order.status === 'pending' ? '⏳ En curso' : '✅ Completado'}
                </span>
              </div>
              <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
              <details>
                <summary>Ver productos</summary>
                <ul>
                  ${order.items.map(item => `
                    <li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
                  `).join('')}
                </ul>
              </details>
            </div>
        `).join('');
    } catch (err) {
        setStatus("❌ " + err.message, false);
    }
}

// ==================== PANEL DE ADMIN ====================

function loadAdminData() {
    // Configurar tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(btn.dataset.tab).classList.add("active");
        };
    });
    
    loadAdminProducts();
    loadAdminOrders();
    loadAdminUsers();
}

// --- PRODUCTOS (ADMIN) ---
document.getElementById("btnCreateProduct").onclick = async () => {
    const name = document.getElementById("pName").value.trim();
    const price = parseFloat(document.getElementById("pPrice").value);
    const description = document.getElementById("pDesc").value.trim();

    if (!name || isNaN(price)) {
        setStatus("❌ Completa nombre y precio", false);
        return;
    }

    try {
        await GQL.createProduct({ name, price, description });
        setStatus("✅ Producto creado");
        document.getElementById("pName").value = "";
        document.getElementById("pPrice").value = "";
        document.getElementById("pDesc").value = "";
        loadAdminProducts();
    } catch (err) {
        setStatus(err.message, false);
    }
};

async function loadAdminProducts() {
    const container = document.getElementById("adminProductsList");
    if (!container) return;

    try {
        const data = await GQL.getProducts();
        
        container.innerHTML = `
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${data.products.map(p => `
                  <tr>
                    <td>${p.name}</td>
                    <td>$${p.price.toFixed(2)}</td>
                    <td>${p.description || '-'}</td>
                    <td>
                      <button class="btn-edit-product" onclick="window.editProduct('${p.id}', '${p.name}', ${p.price}, '${p.description || ''}')">✏️</button>
                      <button class="btn-delete-product" onclick="window.deleteProductGlobal('${p.id}')">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
        `;
    } catch (err) {
        console.error(err);
    }
}

window.editProduct = async (id, name, price, description) => {
    const newName = prompt("Nuevo nombre:", name);
    if (!newName) return;
    const newPrice = prompt("Nuevo precio:", price);
    if (!newPrice) return;
    const newDesc = prompt("Nueva descripción:", description);
    
    try {
        await GQL.updateProduct({
            id,
            name: newName.trim(),
            price: parseFloat(newPrice),
            description: newDesc.trim()
        });
        setStatus("✅ Producto actualizado");
        loadAdminProducts();
    } catch (err) {
        setStatus("❌ " + err.message, false);
    }
};

window.deleteProductGlobal = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
        await GQL.deleteProduct(id);
        setStatus("✅ Producto eliminado");
        loadAdminProducts();
    } catch (err) {
        setStatus("❌ " + err.message, false);
    }
};

// --- PEDIDOS (ADMIN) ---
document.getElementById("btnFilterOrders").onclick = loadAdminOrders;

async function loadAdminOrders() {
    const container = document.getElementById("adminOrdersList");
    if (!container) return;
    
    const status = document.getElementById("orderStatusFilter").value;
    
    try {
        const data = status ? await GQL.getOrdersByStatus(status) : await GQL.getAllOrders();
        const orders = status ? data.ordersByStatus : data.orders;
        
        if (orders.length === 0) {
            container.innerHTML = "<p>No hay pedidos</p>";
            return;
        }
        
        container.innerHTML = orders.map(order => {
            // Formatear fecha correctamente
            const fecha = order.createdAt ? formatDate(order.createdAt) : 'Fecha no disponible';
            
            return `
              <div class="order-card admin ${order.status}">
                <div class="order-header">
                  <h4>Pedido #${order.id.slice(-8)}</h4>
                  <span class="status-badge ${order.status}">
                    ${order.status === 'pending' ? '⏳ Pending' : '✅ Completed'}
                  </span>
                </div>
                <p><strong>Usuario:</strong> ${order.user.username}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <details>
                  <summary>Ver productos</summary>
                  <ul>
                    ${order.items.map(item => `
                      <li>${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}</li>
                    `).join('')}
                  </ul>
                </details>
                <div class="order-actions">
                  <button class="btn-change-status" onclick="window.changeOrderStatus('${order.id}', '${order.status === 'pending' ? 'completed' : 'pending'}')">
                    ${order.status === 'pending' ? '✅ Marcar completado' : '⏳ Marcar pendiente'}
                  </button>
                  <button class="btn-delete-order" onclick="window.deleteOrderGlobal('${order.id}')">🗑️ Eliminar</button>
                </div>
              </div>
            `;
        }).join('');
    } catch (err) {
        setStatus("❌ " + err.message, false);
    }
}

window.changeOrderStatus = async (orderId, newStatus) => {
    try {
        await GQL.updateOrderStatus(orderId, newStatus);
        setStatus("✅ Estado actualizado");
        loadAdminOrders();
    } catch (err) {
        setStatus("❌ " + err.message, false);
    }
};

window.deleteOrderGlobal = async (orderId) => {
    if (!confirm("¿Eliminar este pedido?")) return;
    try {
        await GQL.deleteOrder(orderId);
        setStatus("✅ Pedido eliminado");
        loadAdminOrders();
    } catch (err) {
        setStatus("❌ " + err.message, false);
    }
};

// --- USUARIOS (ADMIN) ---
async function loadAdminUsers() {
    const container = document.getElementById("adminUsersList");
    if (!container) return;
    
    try {
        const data = await GQL.getAllUsers();
        
        container.innerHTML = `
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Fecha registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${data.users.map(u => {
                  // Formatear fecha de registro
                  const fechaRegistro = u.createdAt ? formatDate(u.createdAt) : 'Fecha no disponible';
                  
                  return `
                    <tr>
                      <td>${u.username}</td>
                      <td>
                        <select class="role-select" onchange="window.changeUserRole('${u.id}', this.value)">
                          <option value="user" ${u.role === 'user' ? 'selected' : ''}>User</option>
                          <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                      </td>
                      <td>${fechaRegistro}</td>
                      <td>
                        <button class="btn-delete-user" onclick="window.deleteUserGlobal('${u.id}')" ${u.id === currentUser.id ? 'disabled' : ''}>🗑️</button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
        `;
    } catch (err) {
        setStatus("❌ " + err.message, false);
    }
}

window.changeUserRole = async (userId, newRole) => {
    try {
        await GQL.updateUser({ userId, role: newRole });
        setStatus("✅ Rol actualizado");
    } catch (err) {
        setStatus("❌ " + err.message, false);
        loadAdminUsers();
    }
};

window.deleteUserGlobal = async (userId) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
        await GQL.deleteUser(userId);
        setStatus("✅ Usuario eliminado");
        loadAdminUsers();
    } catch (err) {
        setStatus("❌ " + err.message, false);
    }
};

// ==================== INICIALIZACIÓN ====================

const savedUser = JSON.parse(localStorage.getItem("user") || "null");
if (savedUser) {
    setupUI(savedUser);
}