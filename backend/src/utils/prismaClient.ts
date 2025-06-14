// Alternative import method for PrismaClient
// Use this if you continue to see import errors in VS Code

import { PrismaClient as PC } from '@prisma/client';

// Create a singleton instance
const prisma = new PC();

export { PC as PrismaClient };
export default prisma;
