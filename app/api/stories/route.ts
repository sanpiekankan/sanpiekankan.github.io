import { NextResponse } from 'next/server';
import { getSortedPostsData } from '@/lib/posts';

/**
 * GET handler for fetching stories list
 * @returns {NextResponse} JSON response with stories data
 */
export async function GET() {
  try {
    const stories = getSortedPostsData();
    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error reading stories directory:', error);
    return NextResponse.json({ stories: [] }, { status: 500 });
  }
}