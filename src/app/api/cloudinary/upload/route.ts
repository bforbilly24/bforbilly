import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, uploadVideo, uploadRawFile } from '@/lib/cloudinary';
import { validateCloudinaryRequest } from '@/lib/cloudinary-security';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    
    // Validasi domain untuk production
    if (!validateCloudinaryRequest(request)) {
      console.log('Domain validation failed');
      return NextResponse.json(
        { success: false, error: 'Unauthorized domain' },
        { status: 403 }
      );
    }

    console.log('Parsing form data...');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image', 'video', 'text'
    const folder = formData.get('folder') as string || 'bforbilly';
    const publicId = formData.get('publicId') as string;

    console.log('Upload request details:', {
      hasFile: !!file,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      type,
      folder,
      publicId
    });

    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Processing upload...');
    let result;

    if (type === 'text') {
      console.log('Uploading as text file');
      // For text files, read content and upload as raw
      const content = await file.text();
      result = await uploadRawFile(content, {
        public_id: publicId || file.name.split('.')[0],
        folder,
        format: file.name.split('.').pop() || 'txt'
      });
    } else if (type === 'raw') {
      console.log('Uploading as raw file');
      // For raw files (GLB, fonts, etc.), upload as raw resource type
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      
      result = await uploadRawFile(base64, {
        public_id: publicId || file.name.split('.')[0],
        folder,
        format: file.name.split('.').pop() || 'bin'
      });
    } else if (type === 'video') {
      console.log('Uploading as video');
      // Convert file to base64 for video upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      
      result = await uploadVideo(base64, {
        folder,
        public_id: publicId
      });
    } else {
      console.log('Uploading as image');
      // Default to image upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      
      result = await uploadImage(base64, {
        folder,
        public_id: publicId
      });
    }

    console.log('Upload result:', { success: result.success, error: result.error });

    if (result.success) {
      console.log('Upload successful, returning result');
      return NextResponse.json(result);
    } else {
      console.log('Upload failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
