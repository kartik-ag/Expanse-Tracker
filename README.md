# Personal Finance Visualizer

A modern web application for tracking personal finances, managing budgets, and visualizing spending patterns.

## Features

### Transaction Management
- Add, edit, and delete financial transactions
- Track amount, date, description, and category for each transaction
- Responsive transaction list with search and filtering

### Category Management
- Create custom spending categories with names, colors, and budgets
- Visualize spending by category with interactive charts
- Edit and delete categories

### Budget Tracking
- Set monthly budgets for each spending category
- Compare budgeted amounts with actual spending
- View progress bars and color-coded indicators for budget status

### Dashboard
- Summary cards showing total expenses
- Monthly spending trend chart
- Category breakdown with pie chart
- Recent transactions list

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **Charts**: Recharts for data visualization
- **Database**: MongoDB with Mongoose ODM
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd yardstickapps
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following:
```
MONGODB_URI=mongodb://localhost:27017/finance-tracker
```
Replace with your actual MongoDB connection string if using a remote database.

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Data Structure

The application uses two main data models:

### Transactions
Each transaction includes:
- Amount
- Description
- Date
- Category reference

### Categories
Each category includes:
- Name
- Color (hex code)
- Budget amount
- Icon (optional)

## License

This project is MIT licensed.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
