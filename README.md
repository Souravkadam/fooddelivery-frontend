# Foodies — Food Delivery Frontend

Customer-facing food delivery web app built with React + Vite. Users can browse food, manage their cart, place orders, and pay via Razorpay.

---

## Tech Stack

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

## Project Structure

```
Frontend/
├── src/
│   ├── assets/
│   │   └── assets.js              # Food category icons & static assets
│   ├── components/
│   │   ├── Menubar/               # Top navigation bar
│   │   ├── Header/                # Hero banner
│   │   ├── ExploreMenu/           # Dynamic category filter (from live food data)
│   │   ├── FoodDisplay/           # Food grid with category + search filter
│   │   ├── Fooditem/              # Individual food card
│   │   ├── Footer/                # Footer
│   │   ├── Login/                 # Login modal
│   │   ├── Register/              # Register page
│   │   └── service/
│   │       ├── authService.js     # Login & Register API calls
│   │       ├── foodService.js     # Food listing API calls
│   │       └── cartService.js     # Cart API calls
│   ├── context/
│   │   └── StoreContext.jsx       # Global state — cart, token, food list
│   ├── pages/
│   │   ├── Home/                  # Landing page with explore menu
│   │   ├── ExploreFood/           # Browse all food with dynamic category dropdown
│   │   ├── FoodDetails/           # Single food detail view
│   │   ├── Cart/                  # Cart page
│   │   ├── PlaceOrder/            # Checkout + Razorpay payment
│   │   ├── MyOrders/              # Order history
│   │   └── Contact/               # Contact page
│   ├── util/
│   │   ├── contants.js            # Reads API URL from env
│   │   └── CartUtil.js            # Cart total calculation
│   ├── App.jsx                    # Routes
│   ├── main.jsx                   # Entry point
│   └── index.css
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## Features

### Authentication
- User registration with name, email, password
- JWT-based login
- Auto-logout on token expiry
- Protected routes (Cart, Orders, Checkout)

### Food Browsing
- All food items loaded from backend
- Dynamic category filter — categories update automatically when admin adds new food
- Search food by name
- Responsive food cards with image, price, rating

### Cart Management
- Add / remove items
- Increase / decrease quantity
- Synced with backend (persists on refresh)
- Live subtotal, delivery fee, tax calculation

### Order & Payment
- Delivery address form with validation
- Razorpay payment gateway integration
- Payment success → order confirmed
- Payment cancel → order deleted automatically

### Order History
- View all past orders
- Order status badges

---

## Local Setup

### Prerequisites
- Node.js 18+
- Backend running on port 8080

### Steps

```bash
cd Frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

### Required Environment Variables

Set these in your deployment platform (Vercel) or locally before running:

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend REST API base URL |
| `VITE_RAZORPAY_KEY` | Razorpay public key ID |

For local development, create a `.env` file (never commit it):
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY=your_razorpay_key_here
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## API Endpoints Used

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

## State Management

Global state via React Context API (`StoreContext`):

```
foodList        → All food items from API
quantities      → Cart items { foodId: qty }
token           → JWT auth token
loading         → Food list loading state
increaseQty()   → Add to cart
decreaseQty()   → Remove from cart
removeFromCart()→ Remove item entirely
loadCartData()  → Sync cart from backend
setToken()      → Update auth token
```

---

## Payment Flow

```
1. User fills delivery address form
2. POST /api/orders/create  →  gets Razorpay order ID
3. Razorpay checkout opens in browser
4. User completes payment
5. POST /api/orders/verify  →  payment confirmed
6. Cart cleared → redirected to /myorders
7. If payment cancelled → DELETE /api/orders/:id
```

---

## Deployment (Vercel)

1. Push code to GitHub
2. Go to vercel.com → New Project → Import repo
3. Framework: Vite | Build: `npm run build` | Output: `dist`
4. Add environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL` → your Render backend URL + `/api`
   - `VITE_RAZORPAY_KEY` → your Razorpay key ID
5. Deploy

The `vercel.json` handles SPA routing automatically.

---

## Related Projects

| Project | Description |
|---------|-------------|
| Backend | Spring Boot REST API |
| Admin Panel | React Admin Dashboard |

---

## Author

Sourav Kadam — BCA Final Year Project

---

## License

This project is for educational purposes.
