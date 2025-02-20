import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(id) } });
    return res.status(200).json(vehicle);
  } else if (req.method === "PUT") {
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    return res.status(200).json(updatedVehicle);
  } else if (req.method === "DELETE") {
    await prisma.vehicle.delete({ where: { id: parseInt(id) } });
    return res.status(204).end();
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}