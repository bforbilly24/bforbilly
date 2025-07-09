import { NextRequest, NextResponse } from 'next/server';
import { listCloudinaryFiles } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const resourceType = searchParams.get('resourceType') as 'image' | 'video' | 'raw' || 'image';

    const result = await listCloudinaryFiles(folder, resourceType);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('List API error:', error);
    return NextResponse.json(
      { success: false, error: 'List failed' },
      { status: 500 }
    );
  }
}
