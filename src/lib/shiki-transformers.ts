import type { ShikiTransformer } from 'shiki'
import type { Element, Root } from 'hast'

export interface CopyButtonTransformerOptions {
  copyButtonText?: string
  copiedText?: string
  timeout?: number
  visibility?: 'always' | 'hover'
  enabled?: boolean // Add enabled option
}

export function transformerCopyButton(options: CopyButtonTransformerOptions = {}): ShikiTransformer {
  const {
    copyButtonText = 'Copy',
    copiedText = 'Copied!',
    timeout = 2000,
    visibility = 'hover',
    enabled = true, // Default to enabled
  } = options

  return {
    name: 'shiki-transformer-copy-button',
    pre(node) {
      // If disabled, don't add copy button
      if (!enabled) {
        return
      }

      // Find the code element and get its text content
      const codeElement = node.children.find(child => 
        child.type === 'element' && child.tagName === 'code'
      ) as Element | undefined

      if (!codeElement) return

      // Extract code text from the code element
      const codeText = extractTextFromElement(codeElement)

      // Add wrapper div with relative positioning
      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['shiki-code-container', 'relative', 'group'],
        },
        children: [
          {
            ...node,
            properties: {
              ...node.properties,
              className: [
                ...(Array.isArray(node.properties?.className) ? node.properties.className : []),
                'shiki-pre'
              ]
            }
          }
        ]
      }

      // Create copy button
      const copyButton: Element = {
        type: 'element',
        tagName: 'button',
        properties: {
          className: [
            'shiki-copy-button',
            'absolute',
            'top-3',
            'right-3',
            'z-10',
            'flex',
            'items-center',
            'gap-1.5',
            'rounded-md',
            'px-2',
            'py-1',
            'text-xs',
            'font-medium',
            'transition-all',
            'duration-200',
            'bg-background/80',
            'text-muted-foreground',
            'hover:text-foreground',
            'border',
            'border-border/50',
            'hover:border-border',
            'backdrop-blur-sm',
            'hover:backdrop-blur-md',
            'hover:bg-background/90',
            ...(visibility === 'hover' ? ['opacity-0', 'group-hover:opacity-100'] : ['opacity-100'])
          ],
          'data-code': codeText,
          'data-copy-text': copyButtonText,
          'data-copied-text': copiedText,
          'data-timeout': timeout.toString(),
          onclick: createCopyButtonScript()
        },
        children: [
          // Copy icon
          {
            type: 'element',
            tagName: 'svg',
            properties: {
              className: ['h-3', 'w-3', 'copy-icon'],
              fill: 'none',
              viewBox: '0 0 24 24',
              stroke: 'currentColor',
              strokeWidth: '2'
            },
            children: [
              {
                type: 'element',
                tagName: 'path',
                properties: {
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  d: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
                },
                children: []
              }
            ]
          },
          // Check icon (hidden by default)
          {
            type: 'element',
            tagName: 'svg',
            properties: {
              className: ['h-3', 'w-3', 'check-icon', 'hidden'],
              fill: 'none',
              viewBox: '0 0 24 24',
              stroke: 'currentColor',
              strokeWidth: '2'
            },
            children: [
              {
                type: 'element',
                tagName: 'path',
                properties: {
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  d: 'M5 13l4 4L19 7'
                },
                children: []
              }
            ]
          },
          // Button text
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['copy-text']
            },
            children: [{ type: 'text', value: copyButtonText }]
          }
        ]
      }

      // Add copy button to wrapper
      wrapper.children.push(copyButton)

      // Replace the original node with our wrapper
      Object.assign(node, wrapper)
    }
  }
}

function extractTextFromElement(element: Element): string {
  let text = ''
  
  function traverse(node: any) {
    if (node.type === 'text') {
      text += node.value
    } else if (node.type === 'element' && node.children) {
      node.children.forEach(traverse)
    }
  }
  
  traverse(element)
  return text
}

function createCopyButtonScript(): string {
  return `
    (function() {
      const button = this;
      const code = button.getAttribute('data-code');
      const copyText = button.getAttribute('data-copy-text');
      const copiedText = button.getAttribute('data-copied-text');
      const timeout = parseInt(button.getAttribute('data-timeout')) || 2000;
      
      const copyIcon = button.querySelector('.copy-icon');
      const checkIcon = button.querySelector('.check-icon');
      const textSpan = button.querySelector('.copy-text');
      
      if (!code || !copyIcon || !checkIcon || !textSpan) return;
      
      navigator.clipboard.writeText(code).then(() => {
        // Show success state
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        textSpan.textContent = copiedText;
        button.classList.add('text-green-600', 'border-green-600/50');
        
        // Reset after timeout
        setTimeout(() => {
          copyIcon.classList.remove('hidden');
          checkIcon.classList.add('hidden');
          textSpan.textContent = copyText;
          button.classList.remove('text-green-600', 'border-green-600/50');
        }, timeout);
      }).catch(err => {
        console.error('Failed to copy code:', err);
        // Show error state briefly
        textSpan.textContent = 'Failed';
        button.classList.add('text-red-600', 'border-red-600/50');
        
        setTimeout(() => {
          textSpan.textContent = copyText;
          button.classList.remove('text-red-600', 'border-red-600/50');
        }, 1000);
      });
    }).call(this)
  `.trim()
}
