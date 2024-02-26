import { PrismaClient } from "@prisma/client";

class PrismaService extends PrismaClient {
  static instance: PrismaService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) this.instance = new PrismaService();

    return this.instance;
  }
}

export default PrismaService;
