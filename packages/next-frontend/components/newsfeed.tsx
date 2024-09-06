import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, MessageCircle, Share2, Send } from "lucide-react"

export default function Newsfeed() {
  const posts = [
    {
      id: 1,
      user: {
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Senior Software Engineer at TechCorp",
      },
      content: {
        type: "text",
        text: "Excited to announce that our team has just launched a new feature that will revolutionize how our users interact with our platform. It's been months of hard work, but seeing it live is incredibly rewarding. #ProductLaunch #Innovation",
      },
      timestamp: "2h ago",
      likes: 42,
      comments: 7,
      shares: 3,
    },
    {
      id: 2,
      user: {
        name: "Bob Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Marketing Director at GrowthCo",
      },
      content: {
        type: "image",
        text: "Just wrapped up our annual marketing conference. Great insights and networking opportunities! #MarketingConf2023",
        image: "/placeholder.svg?height=400&width=600",
      },
      timestamp: "5h ago",
      likes: 89,
      comments: 13,
      shares: 8,
    },
    {
      id: 3,
      user: {
        name: "Carol White",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Startup Founder & CEO",
      },
      content: {
        type: "link",
        text: "Check out my latest article on the future of AI in business. Would love to hear your thoughts!",
        link: "https://example.com/ai-in-business",
      },
      timestamp: "1d ago",
      likes: 156,
      comments: 28,
      shares: 42,
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      {posts.map((post) => (
        <Card key={post.id} className="w-full">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{post.user.name}</h3>
                <p className="text-sm text-gray-500">{post.user.title}</p>
                <p className="text-xs text-gray-400">{post.timestamp}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{post.content.text}</p>
            {post.content.type === "image" && (
              <img
                src={post.content.image}
                alt="Post image"
                className="w-full h-auto rounded-lg"
              />
            )}
            {post.content.type === "link" && (
              <a
                href={post.content.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {post.content.link}
              </a>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex justify-between items-center w-full">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ThumbsUp className="w-4 h-4 mr-2" />
                {post.likes} Likes
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                {post.comments} Comments
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Share2 className="w-4 h-4 mr-2" />
                {post.shares} Shares
              </Button>
            </div>
            <Separator />
            <div className="flex items-center space-x-2 w-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <Input placeholder="Write a comment..." className="flex-grow" />
              <Button size="icon" variant="ghost">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}