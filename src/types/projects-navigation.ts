import { ReactElement } from 'react';

interface ProjectNavigationItem {
  readonly title: string;
  readonly href: string;
  readonly icon: ReactElement;
}

interface ProjectNavigationSection {
  readonly title: string;
  readonly list: readonly ProjectNavigationItem[];
}

export type ProjectsNavigationData = readonly ProjectNavigationSection[];
