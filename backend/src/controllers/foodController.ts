import { FoodCategory, FoodCondition, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class FoodController {
  // Get all food items with filters
  async getAllFoods(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { category, search, condition, location } = req.query;
      
      const where: any = {
        isActive: true,
        isReserved: false,
      };

      // Apply filters
      if (category && category !== 'ALL') {
        where.category = category as FoodCategory;
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (condition) {
        where.condition = condition as FoodCondition;
      }

      if (location) {
        where.location = {
          address: { contains: location as string, mode: 'insensitive' }
        };
      }

      const foods = await prisma.food.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          location: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({
        success: true,
        message: 'Food items retrieved successfully',
        data: foods,
      });
    } catch (error) {
      console.error('Error fetching foods:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch food items',
      });
    }
  }

  // Get food item by ID
  async getFoodById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Food ID is required',
        });
        return;
      }

      const food = await prisma.food.findFirst({
        where: {
          id,
          isActive: true,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          location: true,
        },
      });

      if (!food) {
        res.status(404).json({
          success: false,
          message: 'Food item not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Food item retrieved successfully',
        data: food,
      });
    } catch (error) {
      console.error('Error fetching food by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch food item',
      });
    }
  }

  // Create new food item
  async createFood(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const {
        title,
        description,
        category,
        condition,
        expiryDate,
        pickupBy,
        quantity,
        unit,
        cuisine,
        ingredients,
        allergens,
        tags,
        images,
        address,
        city,
        country,
        zipCode,
        latitude,
        longitude
      } = req.body;

      // Validate required fields
      if (!title || !description || !category || !pickupBy || !quantity) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: title, description, category, pickupBy, quantity',
        });
        return;
      }

      // Create food with location
      const food = await prisma.food.create({
        data: {
          title,
          description,
          category: category as FoodCategory,
          condition: (condition as FoodCondition) || FoodCondition.FRESH,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          pickupBy: new Date(pickupBy),
          quantity: parseInt(quantity) || 1,
          unit: unit || 'portions',
          cuisine: cuisine || null,
          ingredients: ingredients || [],
          allergens: allergens || [],
          tags: tags || [],
          images: images || [],
          ownerId: userId,
          ...(address && {
            location: {
              create: {
                address,
                city: city || '',
                country: country || '',
                zipCode: zipCode || null,
                latitude: latitude ? parseFloat(latitude) : 0,
                longitude: longitude ? parseFloat(longitude) : 0,
              }
            }
          })
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          location: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Food item created successfully',
        data: food,
      });
    } catch (error) {
      console.error('Error creating food:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create food item',
      });
    }
  }

  // Update food item
  async updateFood(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId || !id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Check if food exists and belongs to user
      const existingFood = await prisma.food.findFirst({
        where: {
          id,
          ownerId: userId,
          isActive: true,
        },
      });

      if (!existingFood) {
        res.status(404).json({
          success: false,
          message: 'Food item not found or access denied',
        });
        return;
      }

      const {
        title,
        description,
        category,
        condition,
        expiryDate,
        pickupBy,
        quantity,
        unit,
        cuisine,
        ingredients,
        allergens,
        tags,
        images,
      } = req.body;

      const food = await prisma.food.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(category && { category: category as FoodCategory }),
          ...(condition && { condition: condition as FoodCondition }),
          ...(expiryDate && { expiryDate: new Date(expiryDate) }),
          ...(pickupBy && { pickupBy: new Date(pickupBy) }),
          ...(quantity && { quantity: parseInt(quantity) }),
          ...(unit && { unit }),
          ...(cuisine && { cuisine }),
          ...(ingredients && { ingredients }),
          ...(allergens && { allergens }),
          ...(tags && { tags }),
          ...(images && { images }),
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          location: true,
        },
      });

      res.json({
        success: true,
        message: 'Food item updated successfully',
        data: food,
      });
    } catch (error) {
      console.error('Error updating food:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update food item',
      });
    }
  }

  // Delete food item (soft delete)
  async deleteFood(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId || !id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Check if food exists and belongs to user
      const existingFood = await prisma.food.findFirst({
        where: {
          id,
          ownerId: userId,
          isActive: true,
        },
      });

      if (!existingFood) {
        res.status(404).json({
          success: false,
          message: 'Food item not found or access denied',
        });
        return;
      }

      // Soft delete
      await prisma.food.update({
        where: { id },
        data: {
          isActive: false,
        },
      });

      res.json({
        success: true,
        message: 'Food item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting food:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete food item',
      });
    }
  }

  // Get user's food items
  async getFoodsByUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const foods = await prisma.food.findMany({
        where: {
          ownerId: userId,
          isActive: true,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          location: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({
        success: true,
        message: 'User food items retrieved successfully',
        data: foods,
      });
    } catch (error) {
      console.error('Error fetching user foods:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user food items',
      });
    }
  }

  // Reserve food item
  async reserveFood(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId || !id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const food = await prisma.food.findFirst({
        where: {
          id,
          isActive: true,
          isReserved: false,
        },
      });

      if (!food) {
        res.status(404).json({
          success: false,
          message: 'Food item not found or not available',
        });
        return;
      }

      if (food.ownerId === userId) {
        res.status(400).json({
          success: false,
          message: 'Cannot reserve your own food item',
        });
        return;
      }

      // Update food status to reserved
      const updatedFood = await prisma.food.update({
        where: { id },
        data: {
          isReserved: true,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          location: true,
        },
      });

      res.json({
        success: true,
        message: 'Food item reserved successfully',
        data: updatedFood,
      });
    } catch (error) {
      console.error('Error reserving food:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reserve food item',
      });
    }
  }

  // Unreserve food item
  async unreserveFood(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId || !id) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const food = await prisma.food.findFirst({
        where: {
          id,
          isActive: true,
          isReserved: true,
          ownerId: userId, // Only owner can unreserve
        },
      });

      if (!food) {
        res.status(404).json({
          success: false,
          message: 'Food item not found or access denied',
        });
        return;
      }

      // Update food status back to available
      const updatedFood = await prisma.food.update({
        where: { id },
        data: {
          isReserved: false,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          location: true,
        },
      });

      res.json({
        success: true,
        message: 'Food item unreserved successfully',
        data: updatedFood,
      });
    } catch (error) {
      console.error('Error unreserving food:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unreserve food item',
      });
    }
  }
}
