"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Database,
  Download,
  Upload,
  Trash2,
  Search,
  BarChart3,
  Settings,
  RefreshCw,
  HardDrive,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { aiDatabase, dbHelpers } from "@/lib/database"

interface DatabaseStats {
  totalMessages: number
  totalSessions: number
  favoriteProvider: string
  topTopic: string
  databaseSize: string
  lastBackup?: string
}

export function DatabaseManager() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const quickStats = await dbHelpers.getQuickStats()
      const fullStats = await aiDatabase.getStatistics()

      setStats({
        totalMessages: quickStats.totalMessages,
        totalSessions: quickStats.totalSessions,
        favoriteProvider: quickStats.favoriteProvider,
        topTopic: quickStats.topTopic,
        databaseSize: calculateDatabaseSize(fullStats),
        lastBackup: localStorage.getItem("lastBackup") || undefined,
      })
    } catch (error) {
      console.error("خطأ في تحميل الإحصائيات:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateDatabaseSize = (stats: any): string => {
    const estimatedSize = stats.totalMessages * 200 + stats.totalSessions * 100
    if (estimatedSize < 1024) return `${estimatedSize} بايت`
    if (estimatedSize < 1024 * 1024) return `${(estimatedSize / 1024).toFixed(1)} كيلوبايت`
    return `${(estimatedSize / (1024 * 1024)).toFixed(1)} ميجابايت`
  }

  const handleExport = async () => {
    try {
      const data = await aiDatabase.exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-database-backup-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      localStorage.setItem("lastBackup", new Date().toISOString())
      await loadStats()
    } catch (error) {
      console.error("خطأ في التصدير:", error)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      await aiDatabase.importData(text)
      await loadStats()
      alert("تم استيراد البيانات بنجاح!")
    } catch (error) {
      console.error("خطأ في الاستيراد:", error)
      alert("فشل في استيراد البيانات")
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      const results = await aiDatabase.searchMessages(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("خطأ في البحث:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleCleanup = async () => {
    if (confirm("هل أنت متأكد من حذف البيانات القديمة (أكثر من 30 يوم)؟")) {
      try {
        await aiDatabase.cleanupOldData(30)
        await loadStats()
        alert("تم تنظيف البيانات بنجاح!")
      } catch (error) {
        console.error("خطأ في التنظيف:", error)
      }
    }
  }

  const handleClearAll = async () => {
    if (confirm("⚠️ هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!")) {
      try {
        await aiDatabase.clearAllMessages()
        await loadStats()
        alert("تم حذف جميع البيانات!")
      } catch (error) {
        console.error("خطأ في الحذف:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
          <div className="h-3 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 bg-white/10 rounded w-1/4"></div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات قاعدة البيانات */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold">إدارة قاعدة البيانات</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={loadStats}
            className="mr-auto border-white/20 hover:bg-white/10 bg-transparent"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">الرسائل</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">{stats.totalMessages}</div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">الجلسات</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{stats.totalSessions}</div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">الحجم</span>
              </div>
              <div className="text-lg font-bold text-purple-400">{stats.databaseSize}</div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-300">المزود المفضل</span>
              </div>
              <div className="text-sm font-bold text-orange-400">{stats.favoriteProvider}</div>
            </div>
          </div>
        )}

        {/* أدوات الإدارة */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            تصدير البيانات
          </Button>

          <label className="cursor-pointer">
            <Button
              as="span"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              استيراد البيانات
            </Button>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <Button
            onClick={handleCleanup}
            variant="outline"
            className="border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            تنظيف البيانات القديمة
          </Button>

          <Button
            onClick={handleClearAll}
            variant="outline"
            className="border-red-400/20 text-red-400 hover:bg-red-400/10 bg-transparent"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            حذف جميع البيانات
          </Button>
        </div>

        {stats?.lastBackup && (
          <div className="mt-4 text-xs text-gray-400">
            آخر نسخة احتياطية: {new Date(stats.lastBackup).toLocaleString("ar-SA")}
          </div>
        )}
      </Card>

      {/* البحث في قاعدة البيانات */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold">البحث في المحادثات</h3>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الرسائل والمواضيع..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {/* نتائج البحث */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400">نتائج البحث ({searchResults.length})</h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-3 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {result.sender === "user" ? "أنت" : "AI"}
                    </Badge>
                    {result.provider && (
                      <Badge variant="secondary" className="text-xs">
                        {result.provider}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400 mr-auto">
                      {new Date(result.timestamp).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{result.content}</p>
                  {result.topics && result.topics.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {result.topics.slice(0, 3).map((topic: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="text-center text-gray-400 py-8">لم يتم العثور على نتائج للبحث "{searchQuery}"</div>
        )}
      </Card>
    </div>
  )
}
