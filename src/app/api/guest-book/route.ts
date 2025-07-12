import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ADMIN_USER_IDS } from '@/types/environment'
// Add validation utilities
import { ensureRootParent } from '@/lib/comments'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Simple admin check function
function isUserAdmin(userId: string): boolean {
  const adminUserIds = ADMIN_USER_IDS || []
  return adminUserIds.includes(userId)
}

// Simple function to check if user can modify entry
async function canUserModifyEntryById(userId: string, entryId: string): Promise<boolean> {
  // Check if user is admin
  if (isUserAdmin(userId)) {
    return true
  }
  
  // Check if user owns the entry
  const entry = await prisma.guestBookEntry.findUnique({
    where: { id: entryId },
    select: { authorId: true }
  })
  
  return entry?.authorId === userId
}

// Function to get Socket.IO instance
function getSocketInstance() {
  return (global as any).io;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '5'))) // Max 20, min 1
    const loadAll = searchParams.get('loadAll') === 'true'
    
    if (loadAll) {
      // Get ALL entries for real-time updates (used by socket events)
      const allEntries = await prisma.guestBookEntry.findMany({
        where: {
          isDeleted: false
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
      
      return NextResponse.json({ success: true, data: allEntries, pagination: null })
    }
    
    // Pagination logic for initial load and infinite scroll
    // First, get root comments (parentId is null) with pagination
    const skip = (page - 1) * limit
    
    const rootComments = await prisma.guestBookEntry.findMany({
      where: {
        isDeleted: false,
        parentId: null // Only root comments
      },
      orderBy: {
        createdAt: 'desc' // Newest first for main feed
      },
      skip,
      take: limit
    })
    
    // Get total count for pagination info
    const totalRootComments = await prisma.guestBookEntry.count({
      where: {
        isDeleted: false,
        parentId: null
      }
    })
    
    // Get all replies for the root comments we're returning
    const rootCommentIds = rootComments.map(comment => comment.id)
    const replies = await prisma.guestBookEntry.findMany({
      where: {
        isDeleted: false,
        parentId: {
          in: rootCommentIds
        }
      },
      orderBy: {
        createdAt: 'asc' // Oldest replies first
      }
    })
    
    // Combine root comments and their replies
    const allEntries = [...rootComments, ...replies]
    
    const hasNextPage = skip + limit < totalRootComments
    const pagination = {
      currentPage: page,
      limit,
      totalItems: totalRootComments,
      totalPages: Math.ceil(totalRootComments / limit),
      hasNextPage,
      hasPreviousPage: page > 1
    }
    
    return NextResponse.json({ 
      success: true, 
      data: allEntries,
      pagination 
    })
  } catch (error) {
    console.error('Error fetching guest book entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message, authorName, authorImage, parentId } = body

    if (!message || !authorName) {
      return NextResponse.json(
        { success: false, error: 'Message and author name are required' },
        { status: 400 }
      )
    }

    // Check if this is a reply
    let repliedToUserId = null;
    let repliedToUserName = null;
    let finalParentId = parentId;
    
    if (parentId) {
      // Get all comments to validate structure
      const allComments = await prisma.guestBookEntry.findMany({
        select: { id: true, parentId: true, authorId: true, authorName: true }
      });
      
      // Ensure parent is always a root comment (2-level nesting validation)
      try {
        finalParentId = ensureRootParent(allComments, parentId);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid parent comment' },
          { status: 404 }
        );
      }
      
      // Get the comment being replied to for user info
      const targetComment = await prisma.guestBookEntry.findUnique({
        where: { id: parentId }
      });
      
      if (!targetComment) {
        return NextResponse.json(
          { success: false, error: 'Target comment not found' },
          { status: 404 }
        );
      }
      
      // Set the replied-to user information
      repliedToUserId = targetComment.authorId;
      repliedToUserName = targetComment.authorName;
    }

    const entry = await prisma.guestBookEntry.create({
      data: {
        message,
        shortId: `msg_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`, // Generate unique short ID
        authorId: userId,
        authorName,
        authorImage,
        parentId: finalParentId, // Use final parent (always root for 2-level nesting)
        repliedToUserId,
        repliedToUserName
      },
      include: {
        replies: true
      }
    })

    // Emit real-time event for new message
    const io = getSocketInstance();
    if (io) {
      io.to('guestbook').emit('guestbook:new-message', entry);
      console.log('📡 Emitted new message to all clients');
    }

    return NextResponse.json({ success: true, data: entry })
  } catch (error) {
    console.error('Error creating guest book entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, message } = body

    if (!id || !message) {
      return NextResponse.json(
        { success: false, error: 'Entry ID and message are required' },
        { status: 400 }
      )
    }

    // Check if entry exists and get its data
    const existingEntry = await prisma.guestBookEntry.findUnique({
      where: { id }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      )
    }

    // Check permissions using secure auth utilities
    const canEdit = await canUserModifyEntryById(userId, existingEntry.id);

    if (!canEdit) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own messages' },
        { status: 403 }
      )
    }

    // Update the entry
    const updatedEntry = await prisma.guestBookEntry.update({
      where: { id },
      data: { 
        message: message.trim(),
        updatedAt: new Date()
      },
      include: {
        replies: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    // Emit real-time event for updated message
    const io = getSocketInstance();
    if (io) {
      io.to('guestbook').emit('guestbook:message-updated', updatedEntry);
      console.log('📡 Emitted message update to all clients');
    }

    return NextResponse.json({ success: true, data: updatedEntry })
  } catch (error) {
    console.error('Error updating guest book entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update entry' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get search params directly from the request without using request.url
    const { searchParams } = request.nextUrl
    const entryId = searchParams.get('id')

    if (!entryId) {
      return NextResponse.json(
        { success: false, error: 'Entry ID is required' },
        { status: 400 }
      )
    }

    // Find entry by either full ID or shortId
    const existingEntry = await prisma.guestBookEntry.findFirst({
      where: {
        OR: [
          { id: entryId },
          { shortId: entryId }
        ]
      },
      include: {
        replies: {
          select: { id: true, isDeleted: true }
        }
      }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const canDelete = await canUserModifyEntryById(userId, existingEntry.id);

    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own messages' },
        { status: 403 }
      )
    }

    // Always use soft delete to preserve conversation context
    // This is safer and more like standard 2-level comment behavior
    await prisma.guestBookEntry.update({
      where: { id: existingEntry.id },
      data: {
        isDeleted: true,
        message: '[Message deleted]',
        // Keep authorName and authorImage for context, just mark as deleted
        updatedAt: new Date()
      }
    })

    // Emit real-time event for deleted message
    const io = getSocketInstance();
    if (io) {
      io.to('guestbook').emit('guestbook:message-deleted', existingEntry.id);
      console.log('📡 Emitted message deletion to all clients');
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting guest book entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}
