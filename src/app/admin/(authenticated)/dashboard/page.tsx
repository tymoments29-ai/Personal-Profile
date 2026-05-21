import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, MessageSquare, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // Fetch basic stats (handling potential errors gracefully if models don't exist yet)
  let statsData = { posts: 0, projects: 0, messages: 0, testimonials: 0 };
  
  try {
    const [posts, projects, messages, testimonials] = await Promise.all([
      prisma.blogPost.count().catch(() => 0),
      prisma.portfolioProject.count().catch(() => 0),
      prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0),
      prisma.testimonial.count().catch(() => 0),
    ]);
    statsData = { posts, projects, messages, testimonials };
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
  }

  const stats = [
    { title: "Total Posts", value: statsData.posts, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Projects", value: statsData.projects, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Unread Messages", value: statsData.messages, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Testimonials", value: statsData.testimonials, icon: MessageCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-zinc-400 mt-1">Welcome back. Here's what's happening with your portfolio today.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">{stat.title}</CardTitle>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-zinc-400 text-sm flex items-center justify-center h-48 border border-dashed border-white/10 rounded-lg bg-black/20">
              Activity chart or list will appear here
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="text-zinc-400 text-sm flex items-center justify-center h-48 border border-dashed border-white/10 rounded-lg bg-black/20">
                Quick action shortcuts placeholder
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
