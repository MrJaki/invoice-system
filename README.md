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

### PDF Invoice Export
- Export invoices in pdf form
- Includes bill, client and bill lines data
- Contains user's data saved in json file

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
│   ├── routes/
│   │   ├── bills.js
│   │   ├── billLines.js
│   │   ├── clients.js
│   │   ├── tax.js
│   │   └── json.js
│   │
│   ├── app.js
│   ├── .env.example
│   ├── user_preferences_example.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BillLineAdd.tsx
│   │   │   ├── BillLinesEdit.tsx
│   │   │   ├── BillLinesTable.tsx
│   │   │   ├── BillTable.tsx
│   │   │   ├── ClientsAddForm.tsx
│   │   │   ├── ClientModalDelete.tsx
│   │   │   ├── ClientTable.tsx
│   │   │   ├── ClientsTableChoose.tsx
│   │   │   ├── MatchTable.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── ModalWindow.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TaxStatementAdd.tsx
│   │   │   ├── TaxStatementDelete.tsx
│   │   │   └── TaxStatementEdit.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Bills.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Edit.tsx
│   │   │   ├── EditBill.tsx
│   │   │   ├── EditClient.tsx
│   │   │   ├── Import.tsx
│   │   │   ├── Insert.tsx
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
cd sistem-za-izdajo-racunov
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
psql -U postgres -d izdaja_racunov -f schema.sql
```

### 7. Start Backend

```bash
cd backend
node app.js
```

### 8. Start Frontend

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
POST   /api/clients
POST   /api/clients/import

PATCH  /api/clients/:id

DELETE /api/clients/:id
```

### Bills

```http
GET    /api/bills
GET    /api/bills/:id
GET    /api/bills/next-number?date=:date

POST    /api/bills/repairIDSequence
POST   /api/bills
POST   /api/bills/import

PATCH  /api/bills/:id
PATCH  /api/bills/:id/amount

DELETE /api/bills/:id
```

### Bill Lines

```http
GET    /api/bill_lines?id=:billId
GET    /api/bill_lines/tax?id_bill=:billId

POST   /api/bill_lines

PATCH  /api/bill_lines/:id
```

### Tax Statements

```http
GET    /api/tax

POST   /api/tax

PATCH  /api/tax/:id

DELETE /api/tax/:id
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

## Language Notice

This project was primarily developed for personal use and local accounting workflows in Slovenia.

The database schema originates from an existing Slovenian accounting system, therefore PostgreSQL table names and column names are written in Slovenian (e.g. `komitenti`, `racuni`, `vrstice_racuna`, `vrste_izjav`). To maintain consistency between the application and the database structure, some TypeScript types, interfaces, and variables also use Slovenian naming where they directly correspond to database entities.

The user interface is currently available only in Slovenian. However, most UI text is straightforward to locate and replace, so translating the application into another language should be relatively simple. Tools such as GitHub Copilot can help speed up the translation process.

Outside of database-related code, English naming conventions are used wherever practical.

Please note that commit messages in the Git history are also written in Slovenian, as the project was developed and debugged primarily in that language.

---

## Author

Developed by [@MrJaki](https://github.com/MrJaki)