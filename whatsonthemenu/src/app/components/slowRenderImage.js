// app/gallery/page.tsx
import { Card } from "@/components/ui/card"
import Image from "next/image"
import profileImage from "./account_profile_user_avatar_icon_219236.jpg";

const cards = [
  {
    title: "Project Dashboard",
    description: "Modern analytics dashboard with interactive charts",
    image: {
      alt: "Dashboard interface with charts and metrics",
      label: "Dashboard"
    }
  },
  {
    title: "E-commerce Store",
    description: "Complete online shopping experience with cart functionality",
    image: {
      alt: "Online store with product listings",
      label: "E-commerce"
    }
  },
  {
    title: "Social Platform",
    description: "Network connecting users with shared interests",
    image: {
      alt: "Social media feed with posts and comments",
      label: "Social"
    }
  },
  {
    title: "Task Manager",
    description: "Productivity app for organizing daily work",
    image: {
      alt: "Todo list with checked items and deadlines",
      label: "Tasks"
    }
  },
  {
    title: "Task Manager",
    description: "Productivity app for organizing daily work",
    image: {
      alt: "Todo list with checked items and deadlines",
      label: "Tasks"
    }
  },
  {
    title: "Task Manager",
    description: "Productivity app for organizing daily work",
    image: {
      alt: "Todo list with checked items and deadlines",
      label: "Tasks"
    }
  },
]

const SlowRenderImage =() => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Wie funktionierts:</h1>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card, index) => (
            <Card key={index} className="group transition-all hover:shadow-lg">
              <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={profileImage.src}
                  alt={card.image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold">{card.title}</h2>
                <p className="text-muted-foreground">{card.description}</p>
                
                <div className="mt-4 flex justify-end">
                  <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90">
                    View Details
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


export default SlowRenderImage;
