import Image from "next/image";

const GarageCard = ({ garage, viewType }) => {
  return (
    <div className={`border rounded-lg overflow-hidden shadow-md bg-white ${viewType === "list" ? "flex" : "block"}`}>
      {/* Garage Image */}
      <div className="relative w-full md:w-1/3">
        <Image
          src={garage.image || "/bg-mechanic.png"}
          alt={garage.businessName}
          width={300}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Garage Details */}
      <div className="p-4 flex flex-col justify-between w-full">
        <div>
          <h3 className="text-xl font-bold text-indigo-600">{garage.businessName}</h3>
          <p className="text-gray-600">📍 {garage.location}</p>
          <p className="text-gray-700 mt-2">{garage.description || "A reliable service provider."}</p>
        </div>

        {/* Ratings and Price */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-yellow-500 text-md">⭐ {garage.rating || "4.5"} / 5</span>
          <span className="text-gray-800 font-bold">💰 ${garage.estimatedPrice || "30"}/hr</span>
        </div>
      </div>
    </div>
  );
};

export default GarageCard;
