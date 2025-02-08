import Image from "next/image";

const GarageCardMini = ({ garage }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white p-2 flex items-center">
      {/* Garage Image (Smaller Size) */}
      <Image
        src={garage.image || "/bg-mechanic.png"}
        alt={garage.businessName}
        width={50}
        height={50}
        className="object-cover rounded-md"
      />

      {/* Garage Details (Smaller Text) */}
      <div className="ml-3">
        <h3 className="text-md font-bold text-indigo-600">{garage.businessName}</h3>
        <p className="text-gray-600 text-sm">📍 {garage.location}</p>
        <span className="text-yellow-500 text-xs">⭐ {garage.rating || "4.5"} / 5</span>
      </div>
    </div>
  );
};

export default GarageCardMini;
