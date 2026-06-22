# Invoice Management System

A full-stack invoice management application built with **Node.js**, **Express**, **React**, **TypeScript**, **Vite**, and **PostgreSQL** for managing clients, invoices, invoice line items, tax statements, and accounting data imports.

---

## Features

### Invoice Management
- Create new invoices
- Edit existing invoices
- View invoice history
- Filter invoices by customer and date
- Manage invoice line items
- Automatic invoice totals calculation

### Payment Tracking
- Record payments
- Track paid and unpaid invoices
- Payment overview dashboard
- Outstanding balance monitoring

### Customer Management
- Store customer information
- Link invoices to customers
- Customer address and company details

### Tax Management
- Configure tax rates
- Support multiple VAT/tax categories
- Tax descriptions and percentages
- Tax assignment to invoice items

### Invoice Items
- Quantity management
- Item descriptions
- Unit types
- Pricing calculations
- Line-item editing

### Data Import
- Import accounting data from DBF files
- Data mapping interface
- Table relationship configuration
- Import validation tools

### CSV and PDF Export
- Export invoices in pdf form
- Includes bill, client and bill lines data
- Contains user's data saved in json file
- Exporting invoices, invoice lines, clients and tax statement in csv format

### JWT Auth
- JWT login and registration
- Secure password hashing
- Protected API access
- Role-based permissions
- User management
- Token expiration and logout handling

### UPN QR Code Paying
- Generate UPN QR codes for invoices
- Include payment information:
    - IBAN
    - Recipient
    - Amount
    - Reference number
    - Payment purpose
- Slovenian UPN QR standard compliance

---

## Tech Stack

### Frontend
 - React
 - TypeScript
 - Vite
 - React Router
 - Axios
 - CSS
 - Tailwind

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Additional Tools
- DBF File Processing

---

## Database Schema

The application uses PostgreSQL with four core tables:

| Table | Description |
|---------|-------------|
| `vrste_izjav` | Tax/VAT statement definitions |
| `komitenti` | Customer/client records |
| `racuni` | Invoice records |
| `vrstice_racuna` | Invoice line items |
| `kode_povabilo` | Invite code management |

### Relationships

```text
vrste_izjav (1)
    │
    └───< komitenti (N)

komitenti (1)
    │
    └───< racuni (N)

racuni (1)
    │
    └───< vrstice_racuna (N)
```

- One tax statement (`vrste_izjav`) can be assigned to multiple clients (`komitenti`).
- One client (`komitenti`) can have multiple invoices (`racuni`).
- One invoice (`racuni`) can contain multiple invoice lines (`vrstice_racuna`).

---

## Project Structure

```bash
project-root/
│
├── backend/
│   ├── model/
│   │   ├── db.js
│   │   ├── dbBills.js
│   │   ├── dbBillLines.js
│   │   ├── dbClients.js
│   │   ├── dbTax.js
│   │   └── pdfMaker.js
│   │
│   ├── lib/
│   │   └── auth.js
│   │
│   ├── middleware/
│   │   ├── requireAuth.js
│   │   └── requireRole.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bills.js
│   │   ├── billLines.js
│   │   ├── clients.js
│   │   ├── tax.js
│   │   ├── json.js
│   │   └── qr.js
│   │
│   ├── app.js
│   ├── .env.example
│   ├── user_preferences_example.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── AuthContext.tsx
│   │   │   └── PrivateRoute.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── BillDelete.tsx
│   │   │   ├── BillLineAdd.tsx
│   │   │   ├── BillLinesEdit.tsx
│   │   │   ├── BillLinesTable.tsx
│   │   │   ├── BillTable.tsx
│   │   │   ├── ClientsAddForm.tsx
│   │   │   ├── ClientModalDelete.tsx
│   │   │   ├── ClientTable.tsx
│   │   │   ├── ClientsTableChoose.tsx
│   │   │   ├── InviteCode.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── MatchTable.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── ModalWindow.tsx
│   │   │   ├── Qr.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TaxStatementAdd.tsx
│   │   │   ├── TaxStatementDelete.tsx
│   │   │   └── TaxStatementEdit.tsx
│   │   │
│   │   ├── lib/
│   │   │   └── api.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Bills.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Edit.tsx
│   │   │   ├── EditBill.tsx
│   │   │   ├── EditClient.tsx
│   │   │   ├── Import.tsx
│   │   │   ├── Insert.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Tax.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.js
│   ├── index.html
│   └── package.json
│
├── izdaja_racunov.sql
├── .gitignore
└── README.md
```

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/MrJaki/invoice-system.git
cd invoice-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Create `.env` file inside the backend folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=izdaja_racunov
DB_USER=
DB_PASSWORD=
FRONTED_URL=
JWT_SECRET=
JWT_EXPIRES_IN=8h
APP_SECRET=
```

Create `.env` file inside the fronted folder:

```env
VITE_API_URL=http://localhost:3002/api
```

Duplicate `user_preferences_example.json` and rename it into `user_preferences.json`.

### 5. Create Database

```sql
CREATE DATABASE izdaja_racunov;
```

### 6. Run Schema

```bash
psql -U postgres -d izdaja_racunov -f izdaja_racunov.sql
```

### 7. Add first admin user

First create a custom invite code:
```sql
INSERT INTO kode_povabilo (koda)
VALUES ('YOUR_INVITE_CODE');
```

Then run the registration request in PowerShell with your data:
```powershell 
Invoke-RestMethod `
  -Uri "http://localhost:3002/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"user@test.com","password":"password1234","password_repeat":"password1234","name":"John","surname":"Smith","invite_code":"YOUR_INVITE_CODE"}'
```

After registration, promote the user to admin:
```sql
UPDATE uporabniki
SET vloga='admin'
WHERE email='user@test.com';
```



### 8. Start Backend

```bash
cd backend
node app.js
```

### 9. Start Frontend

```bash
cd ../frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3002
```

---

## API Endpoints

### Clients

```http
GET    /api/clients
GET    /api/clients/:id

POST    /api/clients/repairIDSequence
POST    /api/clients/csv
POST   /api/clients
POST   /api/clients/import

PATCH  /api/clients/:id

DELETE /api/clients/:id
```

### Bills

```http
GET    /api/bills
GET    /api/bills/whole-year
GET    /api/bills/next-number?date=:date
GET    /api/bills/:id

POST   /api/bills
POST   /api/bills/import
POST    /api/bills/repairIDSequence
POST   /api/bills/csv
POST   /api/bills/:id/pdf

PATCH  /api/bills/:id
PATCH  /api/bills/:id/amount

DELETE /api/bills/:id
```

### Bill Lines

```http
GET    /api/bill_lines?id=:billId
GET    /api/bill_lines/tax?id_bill=:billId

POST   /api/bill_lines
POST   /api/bill_lines/csv

PATCH  /api/bill_lines/:id
```

### Tax Statements

```http
GET    /api/tax

POST   /api/tax
POST   /api/csv

PATCH  /api/tax/:id

DELETE /api/tax/:id
```

### JSON

```http
GET    /api/json/company

PATCH  /api/company-update
```

### Auth

```http
GET   /api/auth/me

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/invite-code
```

### QR

```http
POST   /api/qr/:id
```

---

## Main Modules

| Module | Description |
|----------|-------------|
| Clients | Client management and tax assignment |
| Bills | Invoice creation and management |
| Bill Lines | Invoice item management |
| Tax Statements | VAT and tax configuration |
| Import | DBF accounting data import and matching |

---

## Running as Desktop Application (Windows)

The application can also be used as a standalone Windows desktop application.

The `.exe` file is not stored inside the repository. Download the latest desktop release from the GitHub Releases page.

### Requirements

Before running the application, install:

- Node.js (LTS)
- PostgreSQL

PostgreSQL is required because the application stores data in a PostgreSQL database.

---

## First Time Setup (Desktop App)

### 1. Install PostgreSQL

Download and install PostgreSQL.

During installation remember:

- PostgreSQL username
- PostgreSQL password
- Port number (default: `5432`)


### 2. Create application database

Open PostgreSQL command line (`psql`) or pgAdmin and create:

```sql
CREATE DATABASE izdaja_racunov;
```


### 3. Configure environment

Inside the application folder create:

```text
backend/.env
```

Add:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=izdaja_racunov
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD

FRONTED_URL=

JWT_SECRET=YOUR_SECRET
JWT_EXPIRES_IN=8h
APP_SECRET=YOUR_SECRET
```


### 4. Start the application

Run:

```text
Invoice System.exe
```

## Creating the First Administrator Account

After the application starts:

### 1. Create an invite code in PostgreSQL

```sql
INSERT INTO kode_povabilo (koda)
VALUES ('YOUR_INVITE_CODE');
```

### 2. Register a user through the application

Use the invite code during registration.

### 3. Promote the user to administrator

Run:

```sql
UPDATE uporabniki
SET vloga='admin'
WHERE email='your@email.com';
```
---

## Language Notice

This project was primarily developed for personal use and local accounting workflows in Slovenia.

The database schema originates from an existing Slovenian accounting system, therefore PostgreSQL table names and column names are written in Slovenian (e.g. `komitenti`, `racuni`, `vrstice_racuna`, `vrste_izjav`). To maintain consistency between the application and the database structure, some TypeScript types, interfaces, and variables also use Slovenian naming where they directly correspond to database entities.

The user interface is currently available only in Slovenian. However, most UI text is straightforward to locate and replace, so translating the application into another language should be relatively simple. Tools such as GitHub Copilot can help speed up the translation process.

Outside of database-related code, English naming conventions are used wherever practical.

Please note that commit messages in the Git history are also written in Slovenian, as the project was developed and debugged primarily in that language.

---

## Author

Developed by [@MrJaki](https://github.com/MrJaki)