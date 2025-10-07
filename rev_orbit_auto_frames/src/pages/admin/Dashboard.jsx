import { Link } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

export default function Dashboard() {
  return (
    <div className="py-12 px-6 bg-gradient-to-br from-gray-50 via-gray-100 to-white min-h-screen">
      {/* Heading */}
      <h2 className="font-headline font-bold text-3xl text-center mb-12 
        bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-transparent bg-clip-text drop-shadow">
        ⚙️ Admin Dashboard
      </h2>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            icon: "Package",
            title: "Manage Products",
            desc: "Add, edit, or remove products and images.",
            link: "/admin/products",
          },
          {
            icon: "Users",
            title: "Manage Users",
            desc: "View and manage all registered users.",
            link: "/admin/users",
          },
          {
            icon: "ShoppingCart",
            title: "Manage Orders",
            desc: "Track, update, and fulfill customer orders.",
            link: "/admin/orders",
          },
          {
            icon: "BarChart3",
            title: "View Analytics",
            desc: "See sales, user, and product analytics.",
            link: "/admin/analytics",
          },
          {
            icon: "Settings",
            title: "Admin Settings",
            desc: "Change admin panel settings and preferences.",
            link: "/admin/settings",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 
                       shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center 
                       border border-blue-400 cursor-pointer
                       transition-all duration-500 ease-in-out
                       hover:scale-105 hover:shadow-2xl hover:animate-pulse"
          >
            <Icon
              name={card.icon}
              size={40}
              className="text-white mb-4 drop-shadow-lg"
            />
            <h3 className="font-bold text-xl text-white mb-2">{card.title}</h3>
            <p className="text-white/90 text-center mb-4">{card.desc}</p>
            <Link to={card.link}>
              <Button className="bg-white text-blue-700 font-bold hover:bg-blue-100 rounded-lg transition-all duration-300">
                Go to {card.title.split(" ")[1]}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
