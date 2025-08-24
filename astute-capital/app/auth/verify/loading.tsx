import { Loader2 } from "lucide-react"

export default function VerifyLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
        <h2 className="text-xl text-white font-semibold mb-2">Loading Verification</h2>
        <p className="text-slate-400">Please wait while we prepare your verification page...</p>
      </div>
    </div>
  )
}
