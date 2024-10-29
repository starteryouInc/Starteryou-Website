export default function StartJourney() {
  return (
    <div className=" mx-auto max-w-[1430px] px-4 lg:px-10 md:py-20   ">
      <div className="flex flex-col md:flex-row justify-between items-center py-16 gap-y-6 md:gap-y-0 ">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-black mb-2 md:mb-3">
            Start your Learning journey
          </h1>
          <p>Discover courses and schools tailored for you.</p>
        </div>
        <div className="flex gap-x-3 ">
          <button className="bg-black text-white px-4 py-2">Sign Up</button>
          <button className="bg-white text-black border border-black px-4 py-2">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
