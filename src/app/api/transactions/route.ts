import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/models/transaction';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    
    // Build query based on filters
    const query: any = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }
    
    if (category) {
      query.category = category;
    }
    
    const transactions = await Transaction.find(query)
      .populate('category')
      .sort({ date: -1 });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('GET transactions error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Create new transaction
    const transaction = await Transaction.create(body);
    
    // Populate category details
    await transaction.populate('category');
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('POST transaction error:', error);
    return NextResponse.json(
      { message: 'Failed to create transaction' },
      { status: 500 }
    );
  }
} 