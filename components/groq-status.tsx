"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Activity, Clock, CheckCircle, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react"

interface ModelStatus {
  model: string
  status: "available" | "busy" | "error"
  statusCode?: number
  error?: string
}

interface GroqStatus {
  provider: string
  status: string
  availableModels: string[]
  modelStatus: ModelStatus[]
  capabilities: string[]
  limits: {
    maxTokens: number
    contextWindow: number
    fallbackModels: number
  }
  statusUrl: string
}

export function GroqStatus() {
  const [status, setStatus] = useState<GroqStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [apiStatus, setApiStatus] = useState<"active" | "busy" | "error">("error")

  const checkStatus = async () => {
    try {
      setIsLoading(true)
      const startTime = Date.now()
      const response = await fetch("/api/groq")
      const endTime = Date.now()

      setResponseTime(endTime - startTime)

      const data = await response.json()

      if (data.success) {
        setStatus(data.data)
        setApiStatus(data.data.status === "active" ? "active" : "busy")
      } else {
        setApiStatus("error")
      }
    } catch (error) {
      console.error("خطأ في فحص حالة Groq:", error)
      setApiStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
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
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-bold">Groq</span>
          </div>
          <div className="text-xs text-red-300">❌ غير متاح</div>
          <div className="text-xs text-gray-400">سيتم استخدام النظام المحلي</div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            className="w-full border-red-400/20 text-red-400 hover:bg-red-400/10 bg-transparent"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            إعادة المحاولة
          </Button>
        </div>
      </Card>
    )
  }

  if (apiStatus === "busy") {
    return (
      <Card className="bg-yellow-500/10 backdrop-blur-xl border-yellow-500/20 p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold">Groq</span>
          </div>
          <div className="text-xs text-yellow-300">⚠️ النماذج مشغولة</div>
          <div className="text-xs text-gray-400">سيتم التبديل التلقائي للنماذج المتاحة</div>

          {/* عرض حالة النماذج */}
          {status.modelStatus && status.modelStatus.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-400">حالة النماذج:</span>
              {status.modelStatus.map((model, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="truncate">{model.model.split("-")[0]}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      model.status === "available"
                        ? "border-green-400 text-green-400"
                        : model.status === "busy"
                          ? "border-yellow-400 text-yellow-400"
                          : "border-red-400 text-red-400"
                    }`}
                  >
                    {model.status === "available" ? "✅" : model.status === "busy" ? "⏳" : "❌"}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkStatus}
              className="flex-1 border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10 bg-transparent"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              تحديث
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(status.statusUrl, "_blank")}
              className="border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-sm">{status.provider}</span>
          </div>
          <Badge variant="outline" className="text-xs border-green-400 text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            متصل
          </Badge>
        </div>

        <div className="text-xs text-gray-300">
          <div className="flex items-center gap-1 mb-1">
            <Activity className="w-3 h-3" />
            <span>النماذج المتاحة: {status.availableModels.length}</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3" />
            <span>الحد الأقصى: {status.limits.maxTokens.toLocaleString()} رمز</span>
          </div>
          {responseTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>زمن الاستجابة: {responseTime}ms</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-400">المميزات:</span>
          <div className="flex flex-wrap gap-1">
            {status.capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            <Badge variant="outline" className="text-xs border-orange-400 text-orange-400">
              +{status.limits.fallbackModels} نماذج
            </Badge>
          </div>
        </div>

        {/* عرض حالة النماذج إذا كانت متاحة */}
        {status.modelStatus && status.modelStatus.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-400">النماذج النشطة:</span>
            <div className="flex flex-wrap gap-1">
              {status.modelStatus.map((model, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs ${
                    model.status === "available" ? "border-green-400 text-green-400" : "border-gray-400 text-gray-400"
                  }`}
                >
                  {model.model.split("-")[0]} {model.status === "available" ? "✅" : "⏳"}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-orange-400 bg-orange-400/10 rounded p-2 flex items-center gap-2">
          <Zap className="w-3 h-3" />
          <span>Groq يتبدل تلقائياً بين النماذج! 🚀</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          className="w-full border-white/20 hover:bg-white/10 bg-transparent"
        >
          <RefreshCw className="w-3 h-3 mr-2" />
          تحديث الحالة
        </Button>
      </div>
    </Card>
  )
}
