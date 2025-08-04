"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Zap, AlertTriangle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HuggingFaceStatus {
  provider: string
  status: string
  availableModels: string[]
  capabilities: string[]
  limits: {
    maxTokens: number
    contextWindow: number
    requestsPerHour: number
  }
  models: Record<string, string>
  apiKeyStatus: string
}

export function HuggingFaceStatus() {
  const [status, setStatus] = useState<HuggingFaceStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<"active" | "inactive" | "error" | "unknown">("unknown")

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/huggingface")
        const data = await response.json()

        if (data.success) {
          setStatus(data.data)
          setApiStatus(data.data.status === "active" ? "active" : "inactive")
        } else {
          setApiStatus("error")
        }
      } catch (error) {
        console.error("خطأ في فحص حالة Hugging Face:", error)
        setApiStatus("error")
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-3 bg-white/10 rounded w-3/4"></div>
        </div>
      </Card>
    )
  }

  if (!status || apiStatus === "error") {
    return (
      <Card className="bg-red-500/10 backdrop-blur-xl border-red-500/20 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-400">
            <Cpu className="w-4 h-4" />
            <span className="text-sm font-bold">Hugging Face</span>
          </div>
          <div className="text-xs text-red-300">❌ غير متاح</div>
          <div className="text-xs text-gray-400">خطأ في الاتصال</div>
        </div>
      </Card>
    )
  }

  if (apiStatus === "inactive") {
    return (
      <Card className="bg-yellow-500/10 backdrop-blur-xl border-yellow-500/20 p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold">Hugging Face</span>
          </div>
          <div className="text-xs text-yellow-300">⚠️ مفتاح API مطلوب</div>
          <div className="text-xs text-gray-400">
            احصل على مفتاح مجاني من{" "}
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-yellow-400 hover:text-yellow-300"
              onClick={() => window.open("https://huggingface.co/settings/tokens", "_blank")}
            >
              هنا <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="text-xs text-gray-400">سيتم استخدام النظام المحلي</div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-sm">{status.provider}</span>
          </div>
          <Badge variant="outline" className="text-xs border-green-400 text-green-400">
            ✅ نشط
          </Badge>
        </div>

        <div className="text-xs text-gray-300">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3" />
            <span>النماذج: {status.availableModels.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>الحد الأقصى: {status.limits.maxTokens} رمز</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-400">القدرات:</span>
          <div className="flex flex-wrap gap-1">
            {status.capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {status.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{status.capabilities.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="text-xs text-green-400 bg-green-400/10 rounded p-2">🤗 Hugging Face متصل ويعمل مجاناً!</div>
      </div>
    </Card>
  )
}
