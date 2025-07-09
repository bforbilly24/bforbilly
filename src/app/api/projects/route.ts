import { NextRequest, NextResponse } from 'next/server';
import { allProjects } from 'contentlayer/generated';
import { CLOUDINARY_ASSETS, createAssetUrl } from '@/types/environment';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const technology = searchParams.get('technology');
    const platform = searchParams.get('platform');
    const tag = searchParams.get('tag');

    let filteredProjects = allProjects;

    // Filter by category
    if (category) {
      filteredProjects = filteredProjects.filter(project => {
        if (Array.isArray(project.category)) {
          return project.category.some(cat => cat.toLowerCase() === category.toLowerCase());
        }
        return false;
      });
    }

    // Filter by technology
    if (technology) {
      filteredProjects = filteredProjects.filter(project => {
        if (Array.isArray(project.technology)) {
          return project.technology.some((tech: string) => 
            tech.toLowerCase().includes(technology.toLowerCase())
          );
        }
        return false;
      });
    }

    // Filter by platform
    if (platform) {
      filteredProjects = filteredProjects.filter(project => {
        if (Array.isArray(project.platform)) {
          return project.platform.some(plat => plat.toLowerCase() === platform.toLowerCase());
        }
        return false;
      });
    }

    // Filter by tag
    if (tag) {
      filteredProjects = filteredProjects.filter(project => {
        if (Array.isArray(project.tag)) {
          return project.tag.some((projectTag: string) => 
            projectTag.toLowerCase().includes(tag.toLowerCase())
          );
        }
        return false;
      });
    }

    // Enhance projects with Cloudinary URLs
    const enhancedProjects = filteredProjects.map(project => {
      // Get the project asset from CLOUDINARY_ASSETS
      const projectKey = project.slug.toUpperCase().replace(/-/g, '_');
      const cloudinaryAsset = CLOUDINARY_ASSETS[projectKey as keyof typeof CLOUDINARY_ASSETS];
      
      return {
        ...project,
        // Use project.image from MDX (which is already Cloudinary URL), fallback to original
        imageUrl: project.image || (cloudinaryAsset 
          ? createAssetUrl(cloudinaryAsset as string)
          : '/projects/placeholder.webp'),
        // Add optimized versions using the existing image URL from MDX
        thumbnailUrl: project.image || (cloudinaryAsset 
          ? CLOUDINARY_ASSETS.getAssetUrl(cloudinaryAsset as string, { 
              width: 400, 
              height: 300, 
              crop: 'fill',
              quality: 'auto',
              format: 'webp'
            })
          : '/projects/placeholder.webp'),
        previewUrl: project.image || (cloudinaryAsset 
          ? CLOUDINARY_ASSETS.getAssetUrl(cloudinaryAsset as string, { 
              width: 800, 
              height: 600, 
              crop: 'fill',
              quality: 'auto',
              format: 'webp'
            })
          : '/projects/placeholder.webp'),
      };
    });

    return NextResponse.json({
      success: true,
      data: enhancedProjects,
      count: enhancedProjects.length,
      filters: {
        category,
        technology,
        platform,
        tag
      }
    });

  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch projects',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
