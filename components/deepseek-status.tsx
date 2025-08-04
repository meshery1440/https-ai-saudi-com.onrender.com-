"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Globe, CheckCircle, AlertTriangle, RefreshCw, Key } from "lucide-react"

interface DeepSeekStatus {
  model: string
  provider: string
  status: string
  statusCode: number
  apiKeyStatus: string
  capabilities: string[]
  limits: {
    maxTokens: number
    contextWindow: number
  }
  lastUpdated: string
}

export function DeepSeekStatus() {
  const [status, setStatus] = useState<DeepSeekStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [balanceStatus, setBalanceStatus] = useState<"active" | "insufficient" | "invalid" | "unknown">("unknown")

  const checkStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/deepseek")
      const data = await response.json()

      if (data.success) {
        setStatus(data.data)
        if (data.data.status === "active") {
          setBalanceStatus("active")
        } else if (data.data.statusCode === 401) {
          setBalanceStatus("invalid")
        } else {
          setBalanceStatus("unknown")
        }
      } else {
        // فحص إذا كان الخطأ متعلق بالمصادقة أو الرصيد
        if (data.error && data.error.toLowerCase().includes("authentication")) {
          setBalanceStatus("invalid")
        } else if (data.error && data.error.toLowerCase().includes("balance")) {
          setBalanceStatus("insufficient")
        } else {
          setBalanceStatus("unknown")
        }
      }
    } catch (error) {
      console.error("خطأ في فحص حالة DeepSeek:", error)
      setBalanceStatus("unknown")
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

  if (!status || balanceStatus === "invalid") {
    return (
      <Card className="bg-red-500/10 backdrop-blur-xl border-red-500/20 p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-bold">DeepSeek</span>
          </div>
          <div className="text-xs text-red-300">
            {balanceStatus === "invalid" ? "🔑 مفتاح API غير صحيح" : "❌ غير متاح"}
          </div>
          <div className="text-xs text-gray-400">
            {balanceStatus === "invalid" ? "يرجى التحقق من مفتاح API" : "سيتم استخدام النظام المحلي"}
          </div>
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

  if (balanceStatus === "insufficient") {
    return (
      <Card className="bg-yellow-500/10 backdrop-blur-xl border-yellow-500/20 p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold">DeepSeek</span>
          </div>
          <div className="text-xs text-yellow-300">⚠️ نفد الرصيد</div>
          <div className="text-xs text-gray-400">سيتم التبديل للنظام المحلي</div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            className="w-full border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10 bg-transparent"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            تحديث الحالة
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-sm">{status.provider}</span>
          </div>
          <Badge variant="outline" className="text-xs border-green-400 text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            متصل
          </Badge>
        </div>

        <div className="text-xs text-gray-300">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3" />
            <span>النموذج: {status.model}</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <Globe className="w-3 h-3" />
            <span>الحد الأقصى: {status.limits.maxTokens.toLocaleString()} رمز</span>
          </div>
          <div className="flex items-center gap-1">
            <Key className="w-3 h-3" />
            <span>مفتاح API: {status.apiKeyStatus === "configured" ? "مُعد" : "مفقود"}</span>
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

        <div className="text-xs text-blue-400 bg-blue-400/10 rounded p-2 flex items-center gap-2">
          <Brain className="w-3 h-3" />
          <span>DeepSeek متصل ويعمل بكفاءة! 🧠</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            className="flex-1 border-white/20 hover:bg-white/10 bg-transparent"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            تحديث
          </Button>
          {status.lastUpdated && (
            <div className="text-xs text-gray-400 flex items-center">
              آخر تحديث: {new Date(status.lastUpdated).toLocaleTimeString("ar-SA")}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
