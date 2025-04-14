import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/category';
import Transaction from '@/models/transaction';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Access id directly but ensure params is awaited
    const id = params.id;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('GET category error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch category' },
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
    
    // Access id directly but ensure params is awaited
    const id = params.id;
    
    const category = await Category.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('PUT category error:', error);
    
    // Handle duplicate key error (unique constraint violation)
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { message: 'A category with this name already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to update category' },
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
    
    // Access id directly but ensure params is awaited
    const id = params.id;
    
    // Check if category is in use
    const usageCount = await Transaction.countDocuments({ category: id });
    
    if (usageCount > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category that is in use by transactions' },
        { status: 400 }
      );
    }
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('DELETE category error:', error);
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 