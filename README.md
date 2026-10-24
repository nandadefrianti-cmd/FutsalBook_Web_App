# ⚽ Futsal Field Booking System

A full-stack web application designed for futsal venue owners and players to manage court schedules, online bookings, and revenue reports efficiently.

This project was developed as the final project for **IK301 (Advanced Database Systems)** and **IK102 (Software Development Fundamentals)**.

## 🛠️ Tech Stack & System Requirements

### Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Lucide React
- **Backend & Database:** Supabase (PostgreSQL with Row Level Security enabled), REST API
- **Testing:** Vitest (Unit and Integration Testing)

### System Requirements

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- A modern web browser (Chrome, Edge, Firefox, or Safari)
- A Supabase project with the required database schema and RLS policies configured

## 🚀 Quick Start Guide

Follow these steps to set up the application locally.

### 1. Clone the Repository

```bash
git clone https://github.com/nandadefrianti-cmd/final_submission_kelompok_10.git
cd final_submission_kelompok_10
```
### 2. Configure Environment Variables

Create a `.env` file inside the `frontend/` directory by copying the example environment file:

```bash
cp frontend/.env.example frontend/.env
```

Open `frontend/.env` and configure your Supabase project credentials:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

Replace the placeholder values with the appropriate credentials from your Supabase project.

**Important:** Never commit your actual `.env` file or expose your Supabase secret or service-role key in frontend code. Ensure that Row Level Security (RLS) policies are properly configured to protect your data.

### 3. Install Dependencies

Navigate to the frontend directory and install the required packages:

```bash
cd frontend
npm install
```

### 4. Run the Development Server

Start the application:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

http://localhost:5173

## 🧪 Automated Testing

Run the automated tests using Vitest:

```bash
npm test
```

The test scenarios cover the following areas:

1. Booking Creation
2. Duplicate Slot Rejection
3. Weekend Pricing
4. Booking Cancellation
5. Input Validation

Ensure that the required test files and dependencies are available before running the tests.

## 🔑 Demo Test Accounts

The following demo credentials are provided for evaluating different user roles.

| Role | Email | Password | Access Rights |
|---|---|---|---|
| Player | `player@futsalbook.com` | `player123` | View schedules, book slots, upload payment proofs, and view personal booking history |
| Admin | `admin@futsalbook.com` | `admin123` | Manage court rates and courts, verify payments, and view daily schedules and monthly reports |

**Note:** These credentials must correspond to accounts configured in the application's authentication system. If the accounts are not available, create or configure them before using this section.

## 🤖 AI Usage Declaration

In accordance with the academic guidelines for IK102, the following AI tools were used to assist in the development of this application:

- **Google Stitch:** Assisted in designing the user interface (UI) and providing visual references for the application's layout.
- **Gemini:** Assisted in generating ideas, understanding technical concepts, and providing suggestions throughout the development process.
- **Claude Code:** Assisted in code development and implementation.
- **ChatGPT:** Assisted in writing UI components using Tailwind CSS, drafting initial PostgreSQL Row Level Security (RLS) policies, and generating boilerplate code for Vitest tests.

The core business logic, database schema design, acceptance criteria verification, and final debugging were reviewed and manually verified by the team members.

## 📄 License

This project was developed for academic purposes as part of the IK301 and IK102 final project.