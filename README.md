# 🍔 Foodies — Food Delivery Frontend

A modern, responsive **Customer-facing Food Delivery Web App** built with **React + Vite**.  
Users can browse food, manage their cart, place orders, and pay securely via **Razorpay**.

---

## 📸 Screenshots

> Add your screenshots here after deployment

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.4 | Build Tool |
| React Router DOM | 7.11.0 | Client-side Routing |
| Axios | 1.13.2 | HTTP API Calls |
| Bootstrap | 5.3.8 | Styling & Layout |
| Bootstrap Icons | 1.13.1 | Icons |
| React Toastify | 11.0.5 | Toast Notifications |
| Razorpay | 2.9.6 | Payment Gateway |
| Context API | built-in | State Management |

---

## 📁 Folder Structure

```
Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── assets.js              # Food categories & static assets
│   ├── components/
│   │   ├── Menubar/               # Top navigation bar
│   │   ├── Header/                # Hero banner
│   │   ├── ExploreMenu/           # Category filter
│   │   ├── FoodDisplay/           # Food grid with filters
│   │   ├── Fooditem/              # Individual food card
│   │   ├── Footer/                # Footer
│   │   ├── Login/                 # Login modal/page
│   │   ├── Register/              # Register page
│   │   └── service/
│   │       ├── authService.js     # Login & Register API calls
│   │       ├── foodService.js     # Food listing API calls
│   │       └── cartService.js     # Cart API calls
│   ├── context/
│   │   └── StoreContext.jsx       # Global state (cart, token, foods)
│   ├── pages/
│   │   ├── Home/                  # Landing page
│   │   ├── ExploreFood/           # Browse all food
│   │   ├── FoodDetails/           # Single food detail
│   │   ├── Cart/                  # Cart page
│   │   ├── PlaceOrder/            # Checkout + Razorpay
│   │   ├── MyOrders/              # Order history
│   │   └── Contact/               # Contact page
│   ├── util/
│   │   ├── contants.js            # API base URL, Razorpay key
│   │   └── CartUtil.js            # Cart total calculation
│   ├── App.jsx                    # Routes
│   ├── App.css
│   ├── main.jsx                   # Entry point
│   └── index.css
├── .env                           # Environment variables
├── index.html
├── package.json
├── vercel.json                    # Vercel SPA routing config
└── vite.config.js
```

---

## ✨ Features

### 🔐 Authentication
- User Registration with name, email, password
- JWT-based Login
- Auto-logout on token expiry
- Protected routes (Cart, Orders, Checkout)

### 🍕 Food Browsing
- Display all food items from backend
- Filter by category (Biryani, Burger, Pizza, Rolls, etc.)
- Search food by name
- Responsive food cards with image, price, rating

### 🛒 Cart Management
- Add / remove items
- Increase / decrease quantity
- Synced with backend (persists on refresh)
- Live subtotal, delivery fee, tax calculation

### 💳 Order & Payment
- Delivery address form with validation
- Razorpay payment gateway integration
- Payment success → order confirmed
- Payment cancel → order deleted automatically

### 📦 Order History
- View all past orders
- Order status badges (Preparing / Confirmed / Delivered)

### 🔔 Notifications
- Toast alerts for all actions (login, cart, errors)

---

## ⚙️ Environment Variables

Create a `.env` file in the `Frontend/` folder:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY=rzp_test_SkCF8SuhtObi2q
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend REST API base URL |
| `VITE_RAZORPAY_KEY` | Razorpay public key (test/live) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Backend running on port 8080

### Steps

```bash
# 1. Navigate to Frontend folder
cd Frontend

# 2. Install dependencies
npm install

# 3. Create environment file
# (already exists — edit if needed)

# 4. Start development server
npm run dev
```

App runs at **http://localhost:5173**

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🌐 API Endpoints Used

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | No | Register user |
| POST | `/api/login` | No | Login → JWT token |
| GET | `/api/foods` | No | Get all food items |
| GET | `/api/foods/:id` | No | Get food by ID |
| GET | `/api/cart` | JWT | Get user cart |
| POST | `/api/cart` | JWT | Add item to cart |
| POST | `/api/cart/remove` | JWT | Remove item qty |
| DELETE | `/api/cart` | JWT | Clear cart |
| POST | `/api/orders/create` | JWT | Create order + Razorpay |
| POST | `/api/orders/verify` | JWT | Verify payment |
| GET | `/api/orders` | JWT | Get user orders |
| DELETE | `/api/orders/:id` | JWT | Delete order |

---

## 🔄 State Management

Global state is managed via **React Context API** (`StoreContext`):

```
StoreContext provides:
├── foodList          → All food items from API
├── quantities        → Cart items { foodId: qty }
├── token             → JWT auth token
├── loading           → Food list loading state
├── increaseQty()     → Add to cart
├── decreaseQty()     → Remove from cart
├── removeFromCart()  → Remove item entirely
├── loadCartData()    → Sync cart from backend
└── setToken()        → Update auth token
```

---

## 💳 Payment Flow (Razorpay)

```
1. User fills delivery form
2. POST /api/orders/create  →  gets razorpayOrderId
3. Razorpay checkout opens
4. User pays
5. POST /api/orders/verify  →  payment confirmed
6. Cart cleared → redirect to /myorders
7. If cancelled → DELETE /api/orders/:id
```

---

## 🚢 Deployment (Vercel)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "food delivery frontend"
git remote add origin https://github.com/YOUR_USERNAME/fooddelivery-frontend.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Framework: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Step 3 — Add Environment Variables in Vercel
```
VITE_API_BASE_URL = https://your-backend.onrender.com/api
VITE_RAZORPAY_KEY = rzp_test_SkCF8SuhtObi2q
```

### Step 4 — Deploy ✅

The `vercel.json` file handles SPA routing automatically:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🔗 Related Projects

| Project | Description | Repo |
|---------|-------------|------|
| Backend | Spring Boot REST API | [fooddelivery-backend](#) |
| Admin Panel | React Admin Dashboard | [fooddelivery-admin](#) |

---

## 👨‍💻 Author

**Sourav Kadam**  
BCA Final Year Project  

---

## 📄 License

This project is for educational purposes.
