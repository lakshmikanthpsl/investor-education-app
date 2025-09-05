import { VideoGenerator } from "@/components/video-generator"

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 pb-20 sm:pb-8">
      <div className="container mx-auto px-4 py-8">
        <VideoGenerator />
      </div>
    </div>
  )
}
