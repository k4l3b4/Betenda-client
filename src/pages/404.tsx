import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"

const NotFoundError = () => {
  const router = useRouter()
  return (
    <div className='h-screen w-screen fixed flex flex-col items-center justify-center'>
      <h1 className="text-8xl">404</h1>
      <h2 className="text-4xl">Not found</h2>
      <div className="flex flex-row gap-x-2 my-4">
        <Button onClick={() => router.back()} variant="default">Go back</Button>
        <Button onClick={() => router.replace('/')} variant="secondary">Go home</Button>
      </div>
    </div>
  )
}

export default NotFoundError
