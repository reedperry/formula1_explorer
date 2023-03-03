import { Driver } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getDriver(driverId: number): Promise<Driver | null> {
  return await prisma.driver.findFirst({ where: { driverId } });
}
