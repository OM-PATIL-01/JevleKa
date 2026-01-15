JevleKa – Smart Canteen Ordering System

JevleKa is a smart, lightweight, web-based canteen ordering system designed to address common operational challenges faced by college and institutional canteens. The system focuses on reducing long queues, minimizing manual errors, and improving order management efficiency using a simple and deployable digital solution. The project has been developed with an academic mindset while keeping future scalability and real-world adoption in focus.

Ideation and Research (AI-Assisted)

The ideation and research phase of JevleKa focused on identifying real-world problems observed in college canteens and evaluating which of them could be realistically solved within an academic project scope. AI tools were used as assistive aids to support brainstorming, feasibility analysis, requirement framing, and system planning. These tools helped generate multiple campus-related problem statements, analyze operational bottlenecks, and narrow down the scope to a manageable and impactful solution.

The major problems identified included long queues during peak hours, manual order-taking leading to mistakes, time wastage for students between lectures, and difficulty for canteen staff to track multiple orders simultaneously. With AI assistance, the problem was refined into a clear and concise focus: designing a web-based canteen ordering system that allows users to place orders digitally and enables staff to manage orders efficiently through a centralized interface.

Requirement Analysis and Scope Definition

AI tools were further used to convert the finalized problem statement into functional and non-functional requirements while ensuring the scope remained realistic. The system supports essential features such as user authentication, menu browsing, cart-based ordering, order submission, and a staff-side order management dashboard. Non-functional requirements include lightweight performance, fast response time, easy local deployment, and minimal infrastructure dependency.

To prevent scope creep, advanced features such as online payments, delivery logistics, and QR-based workflows were intentionally excluded from the academic version. This ensured the project remained focused, stable, and implementable within limited time and resources.

Business Overview

JevleKa is envisioned as an end-to-end autonomous canteen ordering platform. In its extended business vision, students can place food orders using a web or mobile interface, make instant UPI payments, generate QR-based coupons, and print those coupons using dedicated kiosk hardware. From the canteen’s perspective, the system helps reduce queues, lower manpower requirements, speed up order processing, enable digital revenue tracking, and increase order throughput during peak hours.

The platform combines SaaS-based software with optional kiosk hardware leasing, making it suitable for colleges and other institutional food outlets.

Target Market

The primary target market for JevleKa includes colleges and universities. Secondary markets include corporate cafeterias, while hostels and coaching institutes are considered part of future expansion. These markets are characterized by high daily footfall, heavy congestion during peak hours, price sensitivity combined with high volume, and long-term vendor relationships.

Revenue Model

JevleKa follows a hybrid monetization strategy to accommodate canteens of different sizes and operational maturity. Once sufficient demand and adoption are achieved, a commission-based revenue model can be applied where a small percentage of monthly revenue generated through the app is charged. A commission range of three to five percent is considered fair for educational institutions operating on high volume and low margins.

An optional hardware leasing add-on can be offered, which includes ESP32-based devices, printer maintenance, and hardware replacement risk coverage. This add-on can be charged as an additional commission. For example, if a canteen generates six lakh rupees in monthly app-based revenue, a four percent commission would yield twenty-four thousand rupees, with operating costs of approximately six thousand rupees, resulting in a gross margin of around seventy-five percent. This model is highly scalable as order volume increases.

Technical Implementation

JevleKa is implemented as a full-stack web application using HTML, CSS, JavaScript, Node.js, Express.js, and SQLite. It follows a simple client–server architecture where the frontend communicates with backend APIs for data storage and retrieval. The architecture is intentionally kept minimal to ensure ease of understanding, deployment, and maintenance.

Project Architecture

The system is divided into three layers: the frontend layer responsible for user interaction, the backend layer responsible for business logic and API handling, and the database layer responsible for data persistence.

Frontend Implementation

The frontend is developed using HTML, CSS, and Vanilla JavaScript. Multiple HTML pages are used to separate different user interfaces, including login, dashboard, menu display, cart management, user profile, and staff order management. Styling and layout are handled using a centralized CSS file, while JavaScript manages DOM manipulation, user interactions, and API calls to the backend using the fetch API. Static assets such as images and audio files are served directly.

Backend Implementation

The backend is built using Node.js with the Express.js framework. The main server file initializes the Express application, defines RESTful APIs, handles HTTP requests and responses, and serves static frontend files. Environment variables are managed using a .env file, with a reference template provided through .env_example. Project dependencies and scripts are managed using package.json, while package-lock.json ensures dependency version consistency.

Database Implementation

SQLite is used as the database for fast and lightweight local storage. The database stores user details, menu items, and order or cart-related information. A dedicated database handler file manages database connections, table creation, and all CRUD operations including create, read, update, and delete queries.

Environment and Security

Sensitive information such as configuration details and database paths are stored securely using environment variables. The .gitignore file ensures that sensitive files such as node_modules, environment files, and database files are not pushed to version control. Basic backend-level input validation is implemented to prevent invalid or malformed data entries.

Application Flow

The application flow begins with the user interacting with the frontend interface. JavaScript sends requests to backend APIs, which process the logic and interact with the SQLite database. The backend then sends responses back to the frontend, and the user interface updates dynamically based on the received data.

Technologies Used

The frontend is built using HTML, CSS, and JavaScript. The backend uses Node.js and Express.js. SQLite is used as the initial database, with PostgreSQL planned for future migration. Development tools include npm and Visual Studio Code.

Important Links

Demo Video:
https://drive.google.com/file/d/1BEhlpCKFKhJsB2SsywH4xlPTaE5XAUip/view?usp=sharing

System Architecture Diagram:
https://drive.google.com/file/d/1DsZiaPyWiNg4Bq4POFdE46WHZRPeXntS/view?usp=sharing

Future Business Models:
https://docs.google.com/document/d/1Xz-lZ2OOXqtgLwLRjJbaZXuKK5-EOd1frT6Vqw6aryA

Hardware Prototype:
https://drive.google.com/file/d/16PM4-nG2GsNLSt3POB-_FZ4qT2uQ2dHS/view?usp=sharing

System Design Architecture:
https://docs.google.com/document/d/126vzwjnPWDXbb-yem3fOjbf3r0WcxZ2d8AOY6e4DtM0

Future Scope

Future enhancements include UPI payment integration, QR-based coupon generation and validation, dedicated kiosk deployment, migration to PostgreSQL, multi-canteen support, and advanced analytics for administrators.
