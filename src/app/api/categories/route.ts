import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/category';
import { defaultCategories } from '@/lib/default-categories';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all categories sorted by name
    let categories = await Category.find().sort({ name: 1 });
    
    // If no categories exist, seed with default categories
    if (categories.length === 0) {
      await Category.insertMany(defaultCategories);
      categories = await Category.find().sort({ name: 1 });
    }
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET categories error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Create new category
    const category = await Category.create(body);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('POST category error:', error);
    
    // Handle duplicate key error (unique constraint violation)
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { message: 'A category with this name already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to create category' },
      { status: 500 }
    );
  }
} 