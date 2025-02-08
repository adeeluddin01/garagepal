import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FaMapMarkerAlt, FaStar, FaWrench, FaCalendarAlt } from "react-icons/fa";
import Modal from "react-modal"; // Popup for Booking

const Map = dynamic(() => import("../../components/Map"), { ssr: false });

export default function GarageDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [garage, setGarage] = useState(null);
  const [date, setDate] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [timeSlots, setTimeSlots] = useState([
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/provider/garage/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Garage Data:", data);
        setGarage(data);
      })
      .catch((err) => console.error("Error loading garage details:", err));

    fetch(`/api/provider/garage/${id}/booked-slots`)
      .then((res) => res.json())
      .then((slots) => setBookedSlots(slots))
      .catch((err) => console.error("Error fetching booked slots:", err));
  }, [id]);

  const handleBooking = () => {
    if (!date || !selectedService) {
      alert("Please select a date, time slot, and service.");
      return;
    }

    const bookingData = {
      serviceProviderId: id, // ✅ Fixed field name
      date,
      timeSlot: selectedService,
    };

    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Booking request sent to the garage owner.");
        setModalOpen(false);
      })
      .catch((err) => console.error("Error booking service:", err));
  };

  if (!garage) return <p className="text-center mt-10 text-lg font-semibold">Loading...</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Full-Width Garage Image */}
      <div className="w-full h-[400px]">
        <img src={garage.image || "/bg-mechanic.png"} className="w-full h-full object-cover rounded-lg shadow-lg" />
      </div>

      {/* Garage Info and Map */}
      <div className="mt-6 flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold">{garage.businessName}</h1>
          <p className="text-gray-600 flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-2" /> {garage.location}
          </p>
          <p className="text-gray-700 mt-2">{garage.description || "No description available."}</p>
          <p className="text-yellow-500 font-semibold flex items-center mt-2">
            <FaStar className="mr-2" /> {garage.rating} / 5
          </p>
        </div>

        {/* Small Map Below Location */}
        <div className="w-[300px] h-[250px] mt-4 md:mt-0">
          <Map latitude={garage.latitude} longitude={garage.longitude} />
        </div>
      </div>

      {/* Services Grid (Styled Cards) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {garage.services?.map((service) => (
          <div key={service.id} className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            {/* Main Service */}
            <h3 className="text-lg font-semibold flex justify-between">
              {service.name} <span className="text-indigo-600 font-bold">${service.price}</span>
            </h3>
            
            {/* Sub-Services */}
            <ul className="mt-2 space-y-1">
              {service.subServices?.map((sub) => (
                <li key={sub.id} className="text-gray-600 flex justify-between">
                  {sub.name} <span className="text-green-600">${sub.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Booking Button */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
        >
          📅 Book a Service
        </button>
      </div>

      {/* Booking Popup Modal */}
      <Modal 
        isOpen={modalOpen} 
        onRequestClose={() => setModalOpen(false)} 
        className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-24"
      >
        <h2 className="text-xl font-semibold text-center mb-4">Book a Service</h2>
        
        {/* Date Selection */}
        <label className="block text-gray-700 font-semibold">Select Date</label>
        <input 
          type="date" 
          className="border p-2 w-full rounded mb-3 mt-1" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />

        {/* Service Selection */}
        <label className="block text-gray-700 font-semibold">Select Service</label>
        <select 
          className="border p-2 w-full rounded mb-3 mt-1" 
          value={selectedService} 
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">Choose a service</option>
          {garage.services?.map((service) => (
            <option key={service.id} value={service.id}>{service.name} - ${service.price}</option>
          ))}
        </select>

        {/* Time Slot Selection */}
        <label className="block text-gray-700 font-semibold">Select Time Slot</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              className={`p-2 rounded ${bookedSlots.includes(slot) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white"}`}
              disabled={bookedSlots.includes(slot)}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* Confirm Booking */}
        <button 
          onClick={handleBooking} 
          className="mt-6 w-full bg-indigo-600 text-white px-6 py-2 rounded text-lg font-semibold hover:bg-indigo-700"
        >
          Confirm Booking
        </button>
      </Modal>
    </div>
  );
}
