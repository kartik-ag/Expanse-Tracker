import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/models/transaction';
import Category from '@/models/category';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month';
    
    // Calculate date range based on period
    const now = new Date();
    const startDate = new Date();
    
    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    }
    
    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .populate('category')
      .sort({ date: -1 })
      .limit(5);
    
    // Get total expense for the period
    const totalExpense = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    
    // Get expense by category for the period
    const expenseByCategory = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);
    
    // Get all categories to include budgeting info
    const categories = await Category.find();
    
    // Map category IDs to their full details
    const categoryMap = new Map();
    categories.forEach(category => {
      categoryMap.set(category._id.toString(), category);
    });
    
    // Build category expense breakdown with budget info
    const categoryBreakdown = expenseByCategory.map(item => {
      const categoryId = item._id ? item._id.toString() : 'uncategorized';
      const category = categoryMap.get(categoryId) || { 
        name: 'Uncategorized',
        color: '#6B7280',
        budget: 0,
      };
      
      return {
        id: categoryId,
        name: category.name,
        color: category.color,
        total: item.total,
        budget: category.budget || 0,
        percentage: category.budget ? (item.total / category.budget) * 100 : 0,
      };
    });
    
    // Monthly expenses data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    
    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);
    
    // Format monthly data for chart
    const formattedMonthlyData = monthlyData.map(item => {
      const year = item._id.year;
      const month = item._id.month;
      return {
        name: new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short' }),
        year: year,
        month: month,
        total: item.total,
      };
    });
    
    // Return dashboard data
    return NextResponse.json({
      recentTransactions,
      totalExpense: totalExpense.length > 0 ? totalExpense[0].total : 0,
      categoryBreakdown,
      monthlyData: formattedMonthlyData,
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 