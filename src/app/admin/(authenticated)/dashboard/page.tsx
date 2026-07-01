import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, MessageSquare, MessageCircle, Plus, Mail, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default async function DashboardPage() {
  // Fetch basic stats (handling potential errors gracefully if models don't exist yet)
  let statsData = { posts: 0, projects: 0, messages: 0, testimonials: 0, views: 0 };
  let recentActivities: { type: string; title: string; date: Date; url: string }[] = [];
  
  try {
    const [posts, projects, messages, testimonials, viewsSum] = await Promise.all([
      prisma.blogPost.count().catch(() => 0),
      prisma.portfolioProject.count().catch(() => 0),
      prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0),
      prisma.testimonial.count().catch(() => 0),
      prisma.blogPost.aggregate({ _sum: { views: true } }).catch(() => ({ _sum: { views: 0 } })),
    ]);
    statsData = { 
      posts, 
      projects, 
      messages, 
      testimonials,
      views: viewsSum?._sum?.views ?? 0,
    };

    const recentMessages = await prisma.contactMessage.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

    const recentPosts = await prisma.blogPost.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

    recentActivities = [
      ...recentMessages.map((m) => ({ type: "Message", title: `From ${m.fullName}`, date: m.createdAt, url: "/admin/messages" })),
      ...recentPosts.map((p) => ({ type: "Blog", title: p.title, date: p.createdAt, url: "/admin/blog" })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
  }

  const stats = [
    { title: "Total Posts", value: statsData.posts, subtext: `${statsData.views.toLocaleString()} total views`, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Projects", value: statsData.projects, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Unread Messages", value: statsData.messages, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Testimonials", value: statsData.testimonials, icon: MessageCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening with your portfolio today.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-card border-border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-card-foreground">{stat.value}</div>
                {"subtext" in stat && stat.subtext && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card border-border backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${activity.type === 'Message' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {activity.type === 'Message' ? <Mail className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.type} • {activity.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link href={activity.url}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm flex items-center justify-center h-48 border border-dashed border-border rounded-lg bg-muted/50">
                No recent activity yet.
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-card border-border backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/blog" className="block">
              <Button className="w-full justify-start h-12 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Write New Blog Post
              </Button>
            </Link>
            <Link href="/admin/portfolio" className="block">
              <Button className="w-full justify-start h-12 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 border border-purple-500/20 dark:text-purple-400" variant="outline">
                <Briefcase className="mr-2 h-4 w-4" />
                Add New Project
              </Button>
            </Link>
            <Link href="/admin/messages" className="block">
              <Button className="w-full justify-start h-12 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Check Messages
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
