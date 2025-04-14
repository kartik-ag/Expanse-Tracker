import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/models/transaction';
import Category from '@/models/category';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || new Date().getMonth().toString()) + 1;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    
    // Create date range for the selected month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Get all categories
    const categories = await Category.find().sort({ name: 1 });
    
    // Get spending by category for the month
    const spending = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          actual: { $sum: '$amount' },
        },
      },
    ]);
    
    // Create a map of category id to spending
    const spendingMap = new Map();
    spending.forEach(item => {
      if (item._id) {
        spendingMap.set(item._id.toString(), item.actual);
      }
    });
    
    // Create budget comparison data
    const budgetData = categories.map(category => {
      const categoryId = category._id.toString();
      const actual = spendingMap.get(categoryId) || 0;
      const budget = category.budget || 0;
      const remaining = budget - actual;
      const percentage = budget > 0 ? (actual / budget) * 100 : 0;
      
      return {
        id: categoryId,
        name: category.name,
        color: category.color,
        budget,
        actual,
        remaining,
        percentage,
        status: remaining >= 0 ? 'within' : 'exceeded',
      };
    });
    
    // Calculate totals
    const totalBudget = categories.reduce((sum, category) => sum + (category.budget || 0), 0);
    const totalActual = spending.reduce((sum, item) => sum + item.actual, 0);
    
    return NextResponse.json({
      categories: budgetData,
      total: {
        budget: totalBudget,
        actual: totalActual,
        remaining: totalBudget - totalActual,
        percentage: totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0,
      },
      month,
      year,
    });
  } catch (error) {
    console.error('Budget data error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch budget data' },
      { status: 500 }
    );
  }
} 