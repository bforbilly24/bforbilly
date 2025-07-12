import { NextRequest, NextResponse } from 'next/server';
import { deleteCloudinaryFile } from '@/lib/cloudinary';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    // Get search params directly from the request without using request.url
    const { searchParams } = request.nextUrl;
    const publicId = searchParams.get('publicId');
    const resourceType = searchParams.get('resourceType') as 'image' | 'video' | 'raw' || 'image';

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No public ID provided' },
        { status: 400 }
      );
    }

    const result = await deleteCloudinaryFile(publicId, resourceType);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    );
  }
}
