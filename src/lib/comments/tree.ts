import _ from 'lodash';

export type NestedComment = {
  id: string;
  shortId?: string;
  message: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  repliedToUserId?: string;
  repliedToUserName?: string;
  isDeleted?: boolean;
  replies?: NestedComment[];
  parent?: NestedComment;
};

/**
 * Builds a nested tree structure from flat comment array
 */
export function buildCommentTree(comments: NestedComment[]): NestedComment[] {
  const commentMap = new Map<string, NestedComment>();
  const rootComments: NestedComment[] = [];

  // First pass: create a map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { 
      ...comment, 
      replies: [] 
    });
  });

  // Second pass: build the tree structure
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  // Sort root comments: newest first (reverse chronological)
  rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Sort replies within each root comment: oldest first (chronological)
  rootComments.forEach(rootComment => {
    if (rootComment.replies && rootComment.replies.length > 0) {
      rootComment.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  });

  return rootComments;
}

/**
 * Finds a comment by ID in the nested tree
 */
function findCommentById(comments: NestedComment[], id: string): NestedComment | null {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    
    if (comment.replies && comment.replies.length > 0) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Removes a comment from the tree (soft delete or hard delete)
 */
function removeCommentFromTree(
  comments: NestedComment[], 
  commentId: string, 
  softDelete: boolean = true
): NestedComment[] {
  return comments.map(comment => {
    if (comment.id === commentId) {
      if (softDelete) {
        // Soft delete: mark as deleted but keep in tree
        return {
          ...comment,
          isDeleted: true,
          message: '[Message deleted]'
        };
      } else {
        // Hard delete: remove from tree completely
        return null;
      }
    }
    
    if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = removeCommentFromTree(comment.replies, commentId, softDelete);
      return {
        ...comment,
        replies: softDelete ? updatedReplies : updatedReplies.filter(Boolean)
      };
    }
    
    return comment;
  }).filter(Boolean) as NestedComment[];
}

/**
 * Updates a comment in the tree
 */
function updateCommentInTree(
  comments: NestedComment[], 
  commentId: string, 
  updates: Partial<NestedComment>
): NestedComment[] {
  return comments.map(comment => {
    if (comment.id === commentId) {
      return { ...comment, ...updates };
    }
    
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, updates)
      };
    }
    
    return comment;
  });
}

/**
 * Gets all reply IDs for a comment (recursively)
 */
function getAllReplyIds(comment: NestedComment): string[] {
  const ids: string[] = [];
  
  if (comment.replies) {
    comment.replies.forEach(reply => {
      ids.push(reply.id);
      ids.push(...getAllReplyIds(reply));
    });
  }
  
  return ids;
}

/**
 * Flattens nested comments back to a flat array
 */
function flattenComments(comments: NestedComment[]): NestedComment[] {
  const flattened: NestedComment[] = [];
  
  function traverse(comments: NestedComment[]) {
    comments.forEach(comment => {
      flattened.push(comment);
      if (comment.replies && comment.replies.length > 0) {
        traverse(comment.replies);
      }
    });
  }
  
  traverse(comments);
  return flattened;
}

/**
 * Counts total comments and replies
 */
export function getCommentStats(comments: NestedComment[]): { 
  total: number; 
  rootComments: number; 
  replies: number;
  deleted: number;
} {
  const flattened = flattenComments(comments);
  const rootComments = comments.length;
  const replies = flattened.length - rootComments;
  const deleted = flattened.filter(c => c.isDeleted).length;
  
  return {
    total: flattened.length,
    rootComments,
    replies,
    deleted
  };
}
