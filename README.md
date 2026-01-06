# JevleKa – Smart Canteen Ordering System

JevleKa is a web-based canteen ordering platform designed to reduce queues and improve order management using a digital menu and cart system.

## 🚀 Features
- User login & authentication
- Browse menu by categories (Breakfast, Lunch, Snacks, Chinese)
- Add items to cart and manage quantities
- Place orders digitally with multiple payment options
- Staff dashboard to manage orders and inventory
- Real-time order status notifications
- Order swapping and refund management

## 🛠 Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (production) / SQLite (development)
- **Libraries**: cors, dotenv, pg, sqlite3

## 📂 Project Structure
```
JevleKa/
├── src/
│   ├── server/          # Backend server code
│   │   ├── server.js    # Express server and API routes
│   │   └── database.js  # Database connection and initialization
│   │
│   ├── public/          # Frontend static files
│   │   ├── views/       # HTML pages (login, dashboard, menu, cart, etc.)
│   │   ├── css/         # Stylesheets
│   │   ├── js/          # Client-side JavaScript
│   │   └── assets/      # Images and other assets
│   │
│   └── database/        # Database files (SQLite for local dev)
│
├── docs/                # Comprehensive documentation
├── .env.example         # Environment variables template
├── LICENSE              # MIT License
└── README.md            # This file
```

## 🚦 Quick Start

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

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 📚 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Menu
- `GET /api/menu?category=lunch` - Get menu items (filterable by category)
- `PUT /api/items/:id/toggle` - Toggle item availability (staff)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `POST /api/cart/reduce` - Reduce item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/cart/clear` - Clear cart
- `GET /api/cart/count` - Get cart count

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders?user_id=1` - Get orders (filterable by user)
- `PUT /api/orders/:id/status` - Update order status (staff)
- `POST /api/orders/swap` - Swap order items

### Notifications
- `GET /api/notifications?user_id=1` - Get user notifications
- `POST /api/notifications` - Create notification
- `POST /api/notifications/mark-read` - Mark as read

For detailed API documentation, see [docs/README.md](docs/README.md).

## 🧪 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 🏗️ Architecture

The application follows a clean separation of concerns:

- **Server Layer** (`src/server/`): Express.js server with REST API endpoints
- **Public Layer** (`src/public/`): Static files served to the client
  - **Views**: HTML pages for different screens
  - **CSS**: Styling and responsive design
  - **JS**: Client-side logic and API communication
  - **Assets**: Images and media files
- **Database Layer** (`src/database/`): PostgreSQL/SQLite database

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

## 🙏 Acknowledgments

- Built with ❤️ for improving canteen experiences
- Inspired by modern food ordering systems


