/**
 * Nested Comment Validator
 * Ensures that comments follow the 2-level structure (parent + replies only)
 */

import { NestedComment } from './tree';

interface ValidationResult {
	isValid: boolean;
	errors: string[];
	maxDepth: number;
	totalComments: number;
	rootComments: number;
	replies: number;
}

/**
 * Validates that the comment structure follows 2-level nesting rules:
 * 1. Maximum 2 levels (root + direct replies)
 * 2. No replies to replies (no 3rd level nesting)
 * 3. All replies should have a parentId that points to a root comment
 */
export function validateNestedStructure(comments: NestedComment[]): ValidationResult {
	const errors: string[] = [];
	let maxDepth = 0;
	let totalComments = 0;
	let rootComments = 0;
	let replies = 0;

	function checkDepth(comment: NestedComment, currentDepth: number = 1, path: string = ''): void {
		totalComments++;
		maxDepth = Math.max(maxDepth, currentDepth);

		const currentPath = path ? `${path} -> ${comment.shortId || comment.id}` : comment.shortId || comment.id;

		if (currentDepth === 1) {
			rootComments++;
			// Root comment should not have parentId
			if (comment.parentId) {
				errors.push(`Root comment ${currentPath} has parentId: ${comment.parentId}`);
			}
		} else if (currentDepth === 2) {
			replies++;
			// Reply should have parentId
			if (!comment.parentId) {
				errors.push(`Reply ${currentPath} is missing parentId`);
			}
		} else if (currentDepth > 2) {
			errors.push(`Comment ${currentPath} exceeds maximum depth (${currentDepth} > 2)`);
		}

		// Check replies recursively
		if (comment.replies && comment.replies.length > 0) {
			if (currentDepth >= 2) {
				errors.push(`Reply ${currentPath} has nested replies (violates 2-level structure)`);
			}

			comment.replies.forEach(reply => {
				checkDepth(reply, currentDepth + 1, currentPath);
			});
		}
	}

	// Validate all root comments
	comments.forEach(comment => {
		checkDepth(comment);
	});

	return {
		isValid: errors.length === 0 && maxDepth <= 2,
		errors,
		maxDepth,
		totalComments,
		rootComments,
		replies,
	};
}

/**
 * Ensures a parent ID points to a root comment (for API validation)
 */
export function ensureRootParent(comments: Array<{ id: string; parentId: string | null }>, targetParentId: string): string {
	const targetComment = comments.find(c => c.id === targetParentId);

	if (!targetComment) {
		throw new Error(`Target comment ${targetParentId} not found`);
	}

	// If target has a parent, return the root parent instead
	if (targetComment.parentId) {
		return targetComment.parentId;
	}

	// Target is already a root comment
	return targetParentId;
}

/**
 * Pretty prints validation results for debugging
 */
function printValidationResults(result: ValidationResult): void {
	if (result.errors.length > 0) {
		console.log('❌ Errors:');
		result.errors.forEach((error, index) => {
			console.log(`   ${index + 1}. ${error}`);
		});
	} else {
		console.log('✅ No errors found - Perfect 2-level structure!');
	}
}
