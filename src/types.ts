export interface ProjectComment {
  id: string;
  author: string;
  avatarUrl?: string;
  text: string;
  createdAt: string;
}

export interface AppItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  iconPreset: string;
  owner: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  isPinned: boolean;
  clickCount: number;
  likesCount: number;
  commentsCount: number;
  comments?: ProjectComment[];
  status: 'online' | 'maintenance';
  version?: string;
  standardISO?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DepartmentInfo {
  name: string;
  englishName: string;
  slogan: string;
  shortCode: string;
  hubName: string;
  announcement?: string;
  lastUpdated?: string;
}

export type NavTab = 'overview' | 'my-projects' | 'favorites';
export type SortOption = 'pinned' | 'popular' | 'alphabetical' | 'newest';
export type ViewMode = 'grid' | 'compact';
