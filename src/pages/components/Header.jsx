export default function Header({ username, onLogout }) {
  return (
    <div className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold">
          {username?.[0]?.toUpperCase() || "U"}
        </div>
        <h1 className="text-xl font-semibold">ChatFusion</h1>
      </div>
      <button
        onClick={onLogout}
        className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-100"
      >
        Logout
      </button>
    </div>
  );
}
