# JevleKa Documentation

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Architecture Overview](#architecture-overview)
3. [API Documentation](#api-documentation)
4. [Development Workflow](#development-workflow)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database (or SQLite for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OM-PATIL-01/JevleKa.git
   cd JevleKa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Architecture Overview

### Project Structure
```
JevleKa/
├── src/
│   ├── server/          # Backend server code
│   │   ├── server.js    # Express server and API routes
│   │   └── database.js  # Database connection and initialization
│   │
│   ├── public/          # Frontend static files
│   │   ├── views/       # HTML pages
│   │   ├── css/         # Stylesheets
│   │   ├── js/          # Client-side JavaScript
│   │   └── assets/      # Images and other assets
│   │
│   └── database/        # Database files (SQLite)
│
├── docs/                # Documentation
└── .github/             # GitHub workflows and configs
```

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (production) / SQLite (development)
- **Libraries**: cors, dotenv, pg, sqlite3

### Key Features
1. **User Authentication**: Login and registration system
2. **Menu Management**: Browse food items by category
3. **Shopping Cart**: Add/remove items, update quantities
4. **Order Management**: Place and track orders
5. **Staff Dashboard**: Manage orders and inventory
6. **Notifications**: Real-time order status updates

## API Documentation

### Authentication Endpoints

#### POST `/api/login`
Login with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  }
}
```

#### POST `/api/register`
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "id": 1
}
```

### Menu Endpoints

#### GET `/api/menu`
Get all menu items or filter by category.

**Query Parameters:**
- `category` (optional): Filter by category (lunch, breakfast, snacks, chinese)

**Response:**
```json
{
  "message": "success",
  "data": [
    {
      "id": 1,
      "category": "lunch",
      "name": "Mini Lunch",
      "price": "₹58",
      "desc": "Rice, dal, sabzi",
      "img": "https://...",
      "rating": 4.5,
      "is_available": 1
    }
  ]
}
```

#### PUT `/api/items/:id/toggle`
Toggle item availability (staff only).

**Request Body:**
```json
{
  "is_available": true
}
```

### Cart Endpoints

#### GET `/api/cart`
Get all items in cart.

**Response:**
```json
{
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Mini Lunch",
      "price": "₹58",
      "quantity": 2,
      "img": "https://..."
    }
  ]
}
```

#### POST `/api/cart`
Add item to cart.

**Request Body:**
```json
{
  "name": "Mini Lunch",
  "price": "₹58",
  "img": "https://..."
}
```

#### POST `/api/cart/reduce`
Reduce item quantity or remove if quantity is 1.

**Request Body:**
```json
{
  "id": 1
}
```

#### DELETE `/api/cart/:id`
Remove item from cart.

#### POST `/api/cart/clear`
Clear all items from cart.

#### GET `/api/cart/count`
Get total number of items in cart.

### Order Endpoints

#### POST `/api/orders`
Create a new order.

**Request Body:**
```json
{
  "user_id": 1,
  "items": "[{\"name\":\"Mini Lunch\",\"quantity\":2}]",
  "total": 116,
  "order_code": "ORD-1234",
  "payment_method": "UPI",
  "date": "2024-01-01 12:00:00"
}
```

#### GET `/api/orders`
Get all orders or filter by user.

**Query Parameters:**
- `user_id` (optional): Filter by user ID

#### PUT `/api/orders/:id/status`
Update order status (staff only).

**Request Body:**
```json
{
  "status": "Preparing"
}
```

#### POST `/api/orders/swap`
Swap order items (create replacement order).

**Request Body:**
```json
{
  "original_order_id": 1,
  "new_items": "[{\"name\":\"Special Lunch\",\"quantity\":1}]",
  "new_total": 103,
  "price_diff": -13,
  "payment_method": "UPI"
}
```

### Notification Endpoints

#### GET `/api/notifications`
Get user notifications.

**Query Parameters:**
- `user_id`: User ID

#### POST `/api/notifications`
Create a notification.

**Request Body:**
```json
{
  "user_id": 1,
  "message": "Your order is ready",
  "order_id": 1
}
```

#### POST `/api/notifications/mark-read`
Mark notification as read.

**Request Body:**
```json
{
  "id": 1
}
```

### Health Check

#### GET `/api/health`
Check server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Development Workflow

### Local Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Make changes to code**
   - Server files: `src/server/`
   - Frontend files: `src/public/`

3. **Test your changes**
   - Access the app at `http://localhost:3000`
   - Use browser DevTools for debugging

### Database Management

The application uses PostgreSQL in production and can use SQLite for local development.

**Database Schema:**
- `users`: User accounts
- `items`: Menu items
- `cart_items`: Shopping cart
- `orders`: Order records
- `notifications`: User notifications

### Code Style

- Use consistent indentation (4 spaces)
- Follow JavaScript best practices
- Add comments for complex logic
- Keep functions small and focused

### Testing

Before deploying:
1. Test all user flows (login, menu, cart, checkout)
2. Verify API endpoints with Postman or similar
3. Check database connections
4. Test on different browsers

### Deployment

1. Set up environment variables on your hosting platform
2. Configure database connection
3. Build and deploy using your hosting provider's instructions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions, please open an issue on the GitHub repository.
