import { KeyRound } from "lucide-react"
import Image from "next/image"

export const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
        <div className="w-10 h-10 realtive animate-spin">
            <KeyRound />
        </div>
        <p className="text-sm text-muted-foreground">AI Speaker is working ...</p>
    </div>
  )
}