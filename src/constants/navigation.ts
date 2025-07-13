export interface NavigationItem {
  name: string
  path: string
  icon?: string
  external?: boolean
  child?: NavigationItem[] // Support nested submenus
}

export interface NavigationSection {
  name: string
  path?: string
  icon?: string
  child?: NavigationItem[]
}

export interface NavigationConfig {
  main: NavigationSection[]
  dock: NavigationSection[] // For mobile dock (max 5 items)
}

// Centralized navigation configuration
export const NAVIGATION_CONFIG: NavigationConfig = {
  // Main navigation for desktop navbar (tanpa coding activity - diakses dari footer)
  main: [
    {
      name: '_hello',
      path: '/',
      icon: 'Home'
    },
    {
      name: '_about-me',
      path: '/about',
      icon: 'UserSquare',
      child: [
        {
          name: 'personal.ts',
          path: '/about/personal.ts',
          icon: 'UserIcon'
        },
        {
          name: 'work.ts',
          path: '/about/work.ts',
          icon: 'Monitor'
        },
        {
          name: 'gear.ts',
          path: '/about/gear.ts',
          icon: 'Smartphone'
        }
      ]
    },
    {
      name: '_projects',
      path: '/projects',
      icon: 'FolderOpen',
      child: [
        {
          name: 'All Projects',
          path: '/projects',
          icon: 'FolderOpen'
        },
        {
          name: 'Categories',
          path: '/projects',
          icon: 'Grid',
          child: [
            {
              name: 'AI & ML',
              path: '/projects?category=' + encodeURIComponent('AI & ML'),
              icon: 'Activity'
            },
            {
              name: 'Frontend Development',
              path: '/projects?category=Frontend Development',
              icon: 'Monitor'
            },
            {
              name: 'Backend Development',
              path: '/projects?category=Backend Development',
              icon: 'Globe'
            },
            {
              name: 'Mobile Development',
              path: '/projects?category=Mobile Development',
              icon: 'Smartphone'
            },
            {
              name: 'Desktop Development',
              path: '/projects?category=Desktop Development',
              icon: 'Monitor'
            },
            {
              name: 'DevOps',
              path: '/projects?category=DevOps',
              icon: 'Globe'
            }
          ]
        },
        {
          name: 'Technologies',
          path: '/projects',
          icon: 'Code',
          child: [
            {
              name: 'Next.js',
              path: '/projects?technology=Next.js',
              icon: 'Globe'
            },
            {
              name: 'React',
              path: '/projects?technology=React',
              icon: 'Globe'
            },
            {
              name: 'Electron',
              path: '/projects?technology=Electron',
              icon: 'Monitor'
            },
            {
              name: 'Laravel',
              path: '/projects?technology=Laravel',
              icon: 'Globe'
            },
            {
              name: 'Inertia.js',
              path: '/projects?technology=Inertia.js',
              icon: 'Globe'
            },
            {
              name: 'FastAPI',
              path: '/projects?technology=FastAPI',
              icon: 'Globe'
            },
            {
              name: 'CodeIgniter',
              path: '/projects?technology=CodeIgniter',
              icon: 'Globe'
            },
            {
              name: 'Bootstrap',
              path: '/projects?technology=Bootstrap',
              icon: 'Globe'
            }
          ]
        },
        {
          name: 'Platforms',
          path: '/projects',
          icon: 'Layers',
          child: [
            {
              name: 'Web',
              path: '/projects?platform=Web',
              icon: 'Globe'
            },
            {
              name: 'Mobile',
              path: '/projects?platform=Mobile',
              icon: 'Smartphone'
            },
            {
              name: 'Desktop',
              path: '/projects?platform=Desktop',
              icon: 'Monitor'
            }
          ]
        }
      ]
    },
    {
      name: '_guest-book',
      path: '/guest-book',
      icon: 'MessageSquare'
    },
    {
      name: '_articles',
      path: '/articles',
      icon: 'FileText'
    },
    {
      name: '_coding-activity',
      path: '/coding-activity',
      icon: 'Activity',
      child: [
        {
          name: 'Languages',
          path: '/coding-activity',
          icon: 'Activity'
        },
        {
          name: 'Activity',
          path: '/coding-activity/activity',
          icon: 'Activity'
        },
        {
          name: 'Code Editor',
          path: '/coding-activity/code-editor',
          icon: 'Monitor'
        },
        {
          name: 'Operating Systems',
          path: '/coding-activity/operating-systems',
          icon: 'Smartphone'
        },
        {
          name: 'Total Coding Stats',
          path: '/coding-activity/total-coding-stats',
          icon: 'Clock'
        }
      ]
    },
    {
      name: '_contact',
      icon: 'Mail',
      child: [
        {
          name: 'Email',
          path: 'mailto:halimputra0701@gmail.com',
          icon: 'Mail',
          external: true
        },
        {
          name: 'WhatsApp',
          path: 'https://wa.me/+6285156644103',
          icon: 'ExternalLink',
          external: true
        },
        {
          name: 'LinkedIn',
          path: 'https://www.linkedin.com/in/halimp',
          icon: 'ExternalLink',
          external: true
        },
        {
          name: 'Instagram',
          path: 'https://www.instagram.com/bforbilly24',
          icon: 'ExternalLink',
          external: true
        }
      ]
    }
  ],
  
  // Dock navigation for mobile (exactly 6 items: Home, About Me, Projects, Guest Book, Menu, Dark Mode)
  dock: [
    {
      name: '_hello',
      path: '/',
      icon: 'Home'
    },
    {
      name: '_about-me',
      path: '/about',
      icon: 'UserSquare',
      child: [
        {
          name: 'personal.ts',
          path: '/about/personal.ts',
          icon: 'UserIcon'
        },
        {
          name: 'work.ts',
          path: '/about/work.ts',
          icon: 'Monitor'
        },
        {
          name: 'gear.ts',
          path: '/about/gear.ts',
          icon: 'Smartphone'
        }
      ]
    },
    {
      name: '_projects',
      path: '/projects',
      icon: 'FolderOpen',
      child: [
        {
          name: 'All Projects',
          path: '/projects',
          icon: 'FolderOpen'
        },
        {
          name: 'Categories',
          path: '/projects',
          icon: 'Grid',
          child: [
            {
              name: 'AI & ML',
              path: '/projects?category=' + encodeURIComponent('AI & ML'),
              icon: 'Activity'
            },
            {
              name: 'Frontend Development',
              path: '/projects?category=Frontend Development',
              icon: 'Monitor'
            },
            {
              name: 'Backend Development',
              path: '/projects?category=Backend Development',
              icon: 'Globe'
            },
            {
              name: 'Mobile Development',
              path: '/projects?category=Mobile Development',
              icon: 'Smartphone'
            },
            {
              name: 'Desktop Development',
              path: '/projects?category=Desktop Development',
              icon: 'Monitor'
            },
            {
              name: 'DevOps',
              path: '/projects?category=DevOps',
              icon: 'Globe'
            }
          ]
        },
        {
          name: 'Technologies',
          path: '/projects',
          icon: 'Code',
          child: [
            {
              name: 'Next.js',
              path: '/projects?technology=Next.js',
              icon: 'Globe'
            },
            {
              name: 'React',
              path: '/projects?technology=React',
              icon: 'Globe'
            },
            {
              name: 'Electron',
              path: '/projects?technology=Electron',
              icon: 'Monitor'
            },
            {
              name: 'Laravel',
              path: '/projects?technology=Laravel',
              icon: 'Globe'
            },
            {
              name: 'Inertia.js',
              path: '/projects?technology=Inertia.js',
              icon: 'Globe'
            },
            {
              name: 'FastAPI',
              path: '/projects?technology=FastAPI',
              icon: 'Globe'
            },
            {
              name: 'CodeIgniter',
              path: '/projects?technology=CodeIgniter',
              icon: 'Globe'
            },
            {
              name: 'Bootstrap',
              path: '/projects?technology=Bootstrap',
              icon: 'Globe'
            }
          ]
        },
        {
          name: 'Platforms',
          path: '/projects',
          icon: 'Layers',
          child: [
            {
              name: 'Web',
              path: '/projects?platform=Web',
              icon: 'Globe'
            },
            {
              name: 'Mobile',
              path: '/projects?platform=Mobile',
              icon: 'Smartphone'
            },
            {
              name: 'Desktop',
              path: '/projects?platform=Desktop',
              icon: 'Monitor'
            }
          ]
        }
      ]
    },
    {
      name: '_guest-book',
      path: '/guest-book',
      icon: 'MessageSquare'
    },
    {
      name: '_menu',
      icon: 'Menu',
      child: [
        {
          name: 'Articles',
          path: '/articles',
          icon: 'FileText',
          child: [
            {
              name: 'All Articles',
              path: '/articles',
              icon: 'FileText'
            },
            {
              name: 'Next.js',
              path: '/articles?tag=Next.js',
              icon: 'Globe'
            },
            {
              name: 'TailwindCSS',
              path: '/articles?tag=TailwindCSS',
              icon: 'Globe'
            },
            {
              name: 'Non Technical',
              path: '/articles?tag=Non Technical',
              icon: 'Globe'
            }
          ]
        },
        {
          name: 'Coding Activity',
          path: '/coding-activity',
          icon: 'Activity',
          child: [
            {
              name: 'Languages',
              path: '/coding-activity',
              icon: 'Activity'
            },
            {
              name: 'Activity',
              path: '/coding-activity/activity',
              icon: 'Activity'
            },
            {
              name: 'Code Editor',
              path: '/coding-activity/code-editor',
              icon: 'Monitor'
            },
            {
              name: 'Operating Systems',
              path: '/coding-activity/operating-systems',
              icon: 'Smartphone'
            }
          ]
        }
      ]
    },
    {
      name: '_theme-toggle',
      icon: 'Theme'
    }
  ]
}

// Helper functions for navigation
export const getMainNavigation = (): NavigationSection[] => {
  return NAVIGATION_CONFIG.main
}

export const getDockNavigation = (): NavigationSection[] => {
  return NAVIGATION_CONFIG.dock
}

// For desktop navbar (simple version without submenus, excluding coding activity)
export const getDesktopNavigation = (): NavigationSection[] => {
  return NAVIGATION_CONFIG.main.filter(item => item.path && item.name !== '_coding-activity') // Only items with direct paths, exclude coding activity
}

// Get remaining navigation items for mobile "More" menu
export const getMoreNavigation = (): NavigationSection[] => {
  const dockItems = NAVIGATION_CONFIG.dock.map(item => item.name)
  return NAVIGATION_CONFIG.main.filter(item => !dockItems.includes(item.name))
}

// Navigation data for About page layout
export const ABOUT_NAVIGATION_DATA = [
  {
    title: 'Contacts',
    list: [
      {
        title: 'Email',
        href: 'mailto:halimputra0701@gmail.com',
        icon: 'Mail',
      },
      {
        title: 'WhatsApp',
        href: 'https://wa.me/+6285156644103',
        icon: 'ExternalLink',
      },
      {
        title: 'LinkedIn',
        href: 'https://www.linkedin.com/in/halimp',
        icon: 'ExternalLink',
      },
      {
        title: 'Instagram',
        href: 'https://www.instagram.com/bforbilly24',
        icon: 'ExternalLink',
      },
    ],
  },
] as const

// Navigation data for Articles page layout
export const ARTICLES_NAVIGATION_DATA = [
  {
    title: 'Article Tags',
    list: [
      {
        title: 'All article',
        href: '/articles',
        icon: 'FileText',
      },
      {
        title: 'Next.js',
        href: '/articles?tag=Next.js',
        icon: 'Globe',
      },
      {
        title: 'TailwindCSS',
        href: '/articles?tag=TailwindCSS',
        icon: 'Globe',
      },
      {
        title: 'Non Technical',
        href: '/articles?tag=Non Technical',
        icon: 'Globe',
      },
    ],
  },
] as const

// Navigation data for Coding Activity page layout  
export const CODING_ACTIVITY_NAVIGATION_DATA = [
  {
    title: 'Coding Activity',
    list: [
      {
        title: 'Languages',
        href: '/coding-activity',
        icon: 'Activity',
        slug: ''
      },
      {
        title: 'Activity',
        href: '/coding-activity/activity',
        icon: 'Activity',
        slug: 'activity'
      },
      {
        title: 'Code Editor',
        href: '/coding-activity/code-editor',
        icon: 'Monitor',
        slug: 'code-editor'
      },
      {
        title: 'Operating Systems',
        href: '/coding-activity/operating-systems',
        icon: 'Smartphone',
        slug: 'operating-systems'
      },
      {
        title: 'Total Coding Stats',
        href: '/coding-activity/total-coding-stats',
        icon: 'Clock',
        slug: 'total-coding-stats'
      }
    ],
  },
] as const

// Projects navigation data (centralized from old projects-navigation.tsx file)
export const PROJECTS_NAVIGATION_DATA = [
  {
    title: 'Categories',
    list: [
      {
        title: 'All Projects',
        href: '/projects',
        icon: 'Terminal',
      },
      {
        title: 'AI & ML',
        href: '/projects?category=' + encodeURIComponent('AI & ML'),
        icon: 'Activity',
      },
      {
        title: 'Frontend Development',
        href: '/projects?category=Frontend Development',
        icon: 'Monitor',
      },
      {
        title: 'Backend Development',
        href: '/projects?category=Backend Development',
        icon: 'Globe',
      },
      {
        title: 'Mobile Development',
        href: '/projects?category=Mobile Development',
        icon: 'Smartphone',
      },
      {
        title: 'Desktop Development',
        href: '/projects?category=Desktop Development',
        icon: 'Monitor',
      },
      {
        title: 'DevOps',
        href: '/projects?category=DevOps',
        icon: 'Globe',
      },
    ],
  },
  {
    title: 'Technologies',
    list: [
      {
        title: 'Next.js',
        href: '/projects?technology=Next.js',
        icon: 'Globe',
      },
      {
        title: 'React',
        href: '/projects?technology=React',
        icon: 'Globe',
      },
      {
        title: 'Electron',
        href: '/projects?technology=Electron',
        icon: 'Monitor',
      },
      {
        title: 'Laravel',
        href: '/projects?technology=Laravel',
        icon: 'Globe',
      },
      {
        title: 'Inertia.js',
        href: '/projects?technology=Inertia.js',
        icon: 'Globe',
      },
      {
        title: 'FastAPI',
        href: '/projects?technology=FastAPI',
        icon: 'Globe',
      },
      {
        title: 'CodeIgniter',
        href: '/projects?technology=CodeIgniter',
        icon: 'Globe',
      },
      {
        title: 'Bootstrap',
        href: '/projects?technology=Bootstrap',
        icon: 'Globe',
      },
    ],
  },
  {
    title: 'Platform',
    list: [
      {
        title: 'Web',
        href: '/projects?platform=Web',
        icon: 'Globe',
      },
      {
        title: 'Mobile',
        href: '/projects?platform=Mobile',
        icon: 'Smartphone',
      },
      {
        title: 'Desktop',
        href: '/projects?platform=Desktop',
        icon: 'Monitor',
      },
    ],
  },
] as const

// Helper functions to get navigation data
export const getAboutNavigation = () => ABOUT_NAVIGATION_DATA
export const getArticlesNavigation = () => ARTICLES_NAVIGATION_DATA
export const getCodingActivityNavigation = () => CODING_ACTIVITY_NAVIGATION_DATA
export const getProjectsNavigation = () => PROJECTS_NAVIGATION_DATA
