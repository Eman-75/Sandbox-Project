import { LayoutDashboard, MessageSquare, Users, BarChart3, Package, FileText, Bell, Settings, Book, User, HandCoins, Search, BrainCircuitIcon, BookDashed, File, Layers } from "lucide-react";

export default {
  Investor: [
    { label: "Dashboard", path: "/investor/dashboard", icon: LayoutDashboard },
    { label: "Explore", path: "/investor/explore", icon: BrainCircuitIcon },
    { label: "Portfolio", path: "/investor/portfolio", icon: BarChart3 },
    { label: "Innovation Vault", path: "/investor/innovation-vault", icon: Package },
    { label: "Investment", path: "/investor/investment", icon: HandCoins },
    { label: "Proposals", path: "/investor/proposals", icon: FileText },
    { label: "Messages", path: "/investor/messages", icon: MessageSquare },
    { label: "Notifications", path: "/investor/notifications", icon: Bell },
    { label: "Profile", path: "/investor/profile", icon: Users },
    // { label: "Settings", path: "/investor/settings", icon: Settings },
  ],

  Startup: [
    { label: "Dashboard", path: "/startup/dashboard", icon: LayoutDashboard },
    { label: "Investors", path: "/startup/investors", icon: HandCoins },
    { label: "Resources", path: "/startup/learninghub", icon: Layers },
    { label: "Innovation Vault", path: "/startup/innovation-vault", icon: Package },
    { label: "Funds", path: "/startup/funds", icon: HandCoins },
    { label: "Proposals", path: "/startup/proposals", icon: FileText },
    { label: "Messages", path: "/startup/messages", icon: MessageSquare },
    // { label: "Settings", path: "/startup/settings", icon: Settings },
    { label: "Notifications", path: "/startup/notifications", icon: Bell },
    { label: "Profile", path: "/startup/profile", icon: Users },
  ],

  Student: [
    { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { label: "Browse Startups", path: "/student/startups", icon: BrainCircuitIcon },
    { label: "Find Investor", path: "/student/investors", icon: Search },
    { label: "Innovation Vault", path: "/student/innovation-vault", icon: Package },
    { label: "Resources", path: "/student/resources", icon: Layers },
    // { label: "Learning Hub", path: "/student/learninghub", icon: Book },
    { label: "Fundings", path: "/student/fundings", icon: HandCoins },
    { label: "Proposals", path: "/student/proposals", icon: FileText },
    { label: "Messages", path: "/student/messages", icon: MessageSquare },
    { label: "Notifications", path: "/student/notifications", icon: Bell },
    { label: "Profile", path: "/student/profile", icon: Users },
  ],

  Admin: [
    // { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Research Ideas", path: "/admin/research-ideas", icon: FileText },
    { label: "Research History", path: "/admin/research-history", icon: BookDashed },
    { label: "Resources", path: "/admin/resources", icon: Layers },
  ],
};
