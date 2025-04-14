import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/models/transaction';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    const transaction = await Transaction.findById(id).populate('category');
    
    if (!transaction) {
      return NextResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('GET transaction error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    const { id } = await params;
    
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!transaction) {
      return NextResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('PUT transaction error:', error);
    return NextResponse.json(
      { message: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    const transaction = await Transaction.findByIdAndDelete(id);
    
    if (!transaction) {
      return NextResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('DELETE transaction error:', error);
    return NextResponse.json(
      { message: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
} 