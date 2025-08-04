// نظام قاعدة البيانات المدمج باستخدام SQLite
import { openDB, type IDBPDatabase } from "idb"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: number
  provider?: string
  confidence?: number
  topics?: string[]
  sentiment?: "positive" | "negative" | "neutral"
}

interface UserProfile {
  id: string
  name?: string
  preferences: Record<string, any>
  learningData: Record<string, any>
  createdAt: number
  updatedAt: number
}

interface ConversationSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
  provider: string
  messageCount: number
}

interface AIKnowledge {
  id: string
  topic: string
  frequency: number
  responses: string[]
  userFeedback: number
  lastUpdated: number
}

class AIDatabase {
  private db: IDBPDatabase | null = null
  private dbName = "ai-chat-database"
  private version = 1

  async init() {
    if (this.db) return this.db

    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        // جدول الرسائل
        if (!db.objectStoreNames.contains("messages")) {
          const messageStore = db.createObjectStore("messages", { keyPath: "id" })
          messageStore.createIndex("timestamp", "timestamp")
          messageStore.createIndex("sender", "sender")
          messageStore.createIndex("provider", "provider")
        }

        // جدول جلسات المحادثة
        if (!db.objectStoreNames.contains("sessions")) {
          const sessionStore = db.createObjectStore("sessions", { keyPath: "id" })
          sessionStore.createIndex("createdAt", "createdAt")
          sessionStore.createIndex("provider", "provider")
        }

        // جدول ملف المستخدم
        if (!db.objectStoreNames.contains("userProfile")) {
          db.createObjectStore("userProfile", { keyPath: "id" })
        }

        // جدول معرفة الذكاء الاصطناعي
        if (!db.objectStoreNames.contains("aiKnowledge")) {
          const knowledgeStore = db.createObjectStore("aiKnowledge", { keyPath: "id" })
          knowledgeStore.createIndex("topic", "topic")
          knowledgeStore.createIndex("frequency", "frequency")
        }

        // جدول الإحصائيات
        if (!db.objectStoreNames.contains("statistics")) {
          db.createObjectStore("statistics", { keyPath: "id" })
        }
      },
    })

    return this.db
  }

  // === إدارة الرسائل ===
  async saveMessage(message: ChatMessage): Promise<void> {
    const db = await this.init()
    await db.add("messages", message)
  }

  async getMessages(limit = 100): Promise<ChatMessage[]> {
    const db = await this.init()
    const tx = db.transaction("messages", "readonly")
    const index = tx.store.index("timestamp")
    const messages = await index.getAll()
    return messages.slice(-limit).reverse()
  }

  async getMessagesByProvider(provider: string): Promise<ChatMessage[]> {
    const db = await this.init()
    const tx = db.transaction("messages", "readonly")
    const index = tx.store.index("provider")
    return await index.getAll(provider)
  }

  async deleteMessage(id: string): Promise<void> {
    const db = await this.init()
    await db.delete("messages", id)
  }

  async clearAllMessages(): Promise<void> {
    const db = await this.init()
    await db.clear("messages")
  }

  // === إدارة الجلسات ===
  async saveSession(session: ConversationSession): Promise<void> {
    const db = await this.init()
    await db.put("sessions", session)
  }

  async getSessions(): Promise<ConversationSession[]> {
    const db = await this.init()
    const tx = db.transaction("sessions", "readonly")
    const index = tx.store.index("createdAt")
    const sessions = await index.getAll()
    return sessions.reverse()
  }

  async getSession(id: string): Promise<ConversationSession | undefined> {
    const db = await this.init()
    return await db.get("sessions", id)
  }

  async deleteSession(id: string): Promise<void> {
    const db = await this.init()
    await db.delete("sessions", id)
  }

  // === إدارة ملف المستخدم ===
  async saveUserProfile(profile: UserProfile): Promise<void> {
    const db = await this.init()
    await db.put("userProfile", profile)
  }

  async getUserProfile(id = "default"): Promise<UserProfile | undefined> {
    const db = await this.init()
    return await db.get("userProfile", id)
  }

  // === إدارة معرفة الذكاء الاصطناعي ===
  async saveKnowledge(knowledge: AIKnowledge): Promise<void> {
    const db = await this.init()
    await db.put("aiKnowledge", knowledge)
  }

  async getKnowledge(): Promise<AIKnowledge[]> {
    const db = await this.init()
    const tx = db.transaction("aiKnowledge", "readonly")
    const index = tx.store.index("frequency")
    const knowledge = await index.getAll()
    return knowledge.sort((a, b) => b.frequency - a.frequency)
  }

  async getKnowledgeByTopic(topic: string): Promise<AIKnowledge | undefined> {
    const db = await this.init()
    const tx = db.transaction("aiKnowledge", "readonly")
    const index = tx.store.index("topic")
    return await index.get(topic)
  }

  async updateKnowledgeFrequency(topic: string, increment = 1): Promise<void> {
    const db = await this.init()
    const existing = await this.getKnowledgeByTopic(topic)

    if (existing) {
      existing.frequency += increment
      existing.lastUpdated = Date.now()
      await db.put("aiKnowledge", existing)
    } else {
      const newKnowledge: AIKnowledge = {
        id: `knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        topic,
        frequency: increment,
        responses: [],
        userFeedback: 0,
        lastUpdated: Date.now(),
      }
      await db.add("aiKnowledge", newKnowledge)
    }
  }

  // === الإحصائيات ===
  async getStatistics(): Promise<Record<string, any>> {
    const db = await this.init()
    const messages = await this.getMessages(1000)
    const sessions = await this.getSessions()
    const knowledge = await this.getKnowledge()

    const stats = {
      totalMessages: messages.length,
      totalSessions: sessions.length,
      totalKnowledge: knowledge.length,
      providerUsage: {} as Record<string, number>,
      sentimentAnalysis: { positive: 0, negative: 0, neutral: 0 },
      topTopics: knowledge.slice(0, 10),
      dailyActivity: this.calculateDailyActivity(messages),
      averageSessionLength: this.calculateAverageSessionLength(sessions),
    }

    // حساب استخدام المزودين
    messages.forEach((msg) => {
      if (msg.provider) {
        stats.providerUsage[msg.provider] = (stats.providerUsage[msg.provider] || 0) + 1
      }
    })

    // تحليل المشاعر
    messages.forEach((msg) => {
      if (msg.sentiment) {
        stats.sentimentAnalysis[msg.sentiment]++
      }
    })

    return stats
  }

  private calculateDailyActivity(messages: ChatMessage[]): Record<string, number> {
    const activity: Record<string, number> = {}
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split("T")[0]
      activity[dateKey] = 0
    }

    messages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp).toISOString().split("T")[0]
      if (activity.hasOwnProperty(msgDate)) {
        activity[msgDate]++
      }
    })

    return activity
  }

  private calculateAverageSessionLength(sessions: ConversationSession[]): number {
    if (sessions.length === 0) return 0
    const totalMessages = sessions.reduce((sum, session) => sum + session.messageCount, 0)
    return Math.round(totalMessages / sessions.length)
  }

  // === تصدير واستيراد البيانات ===
  async exportData(): Promise<string> {
    const messages = await this.getMessages(10000)
    const sessions = await this.getSessions()
    const userProfile = await this.getUserProfile()
    const knowledge = await this.getKnowledge()
    const statistics = await this.getStatistics()

    const exportData = {
      version: this.version,
      exportDate: new Date().toISOString(),
      messages,
      sessions,
      userProfile,
      knowledge,
      statistics,
    }

    return JSON.stringify(exportData, null, 2)
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData)

      // استيراد الرسائل
      if (data.messages) {
        for (const message of data.messages) {
          await this.saveMessage(message)
        }
      }

      // استيراد الجلسات
      if (data.sessions) {
        for (const session of data.sessions) {
          await this.saveSession(session)
        }
      }

      // استيراد ملف المستخدم
      if (data.userProfile) {
        await this.saveUserProfile(data.userProfile)
      }

      // استيراد المعرفة
      if (data.knowledge) {
        for (const knowledge of data.knowledge) {
          await this.saveKnowledge(knowledge)
        }
      }
    } catch (error) {
      console.error("خطأ في استيراد البيانات:", error)
      throw new Error("فشل في استيراد البيانات")
    }
  }

  // === البحث المتقدم ===
  async searchMessages(query: string): Promise<ChatMessage[]> {
    const messages = await this.getMessages(1000)
    const searchTerm = query.toLowerCase()

    return messages.filter(
      (msg) =>
        msg.content.toLowerCase().includes(searchTerm) ||
        (msg.topics && msg.topics.some((topic) => topic.toLowerCase().includes(searchTerm))),
    )
  }

  // === تنظيف البيانات القديمة ===
  async cleanupOldData(daysToKeep = 30): Promise<void> {
    const cutoffDate = Date.now() - daysToKeep * 24 * 60 * 60 * 1000
    const db = await this.init()

    // حذف الرسائل القديمة
    const tx = db.transaction("messages", "readwrite")
    const index = tx.store.index("timestamp")
    const oldMessages = await index.getAll(IDBKeyRange.upperBound(cutoffDate))

    for (const message of oldMessages) {
      await tx.store.delete(message.id)
    }
  }
}

// إنشاء مثيل واحد من قاعدة البيانات
export const aiDatabase = new AIDatabase()

// دوال مساعدة للاستخدام السهل
export const dbHelpers = {
  // حفظ رسالة جديدة
  async saveMessage(content: string, sender: "user" | "ai", provider?: string, metadata?: any) {
    try {
      const message: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        sender,
        timestamp: Date.now(),
        provider,
        ...metadata,
      }
      await aiDatabase.saveMessage(message)
      return message
    } catch (error) {
      console.error("خطأ في حفظ الرسالة:", error)
      return null
    }
  },

  // إنشاء جلسة محادثة جديدة
  async createSession(title: string, provider: string): Promise<ConversationSession | null> {
    try {
      const session: ConversationSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        provider,
        messageCount: 0,
      }
      await aiDatabase.saveSession(session)
      return session
    } catch (error) {
      console.error("خطأ في إنشاء الجلسة:", error)
      return null
    }
  },

  // تحديث جلسة بإضافة رسالة
  async updateSession(sessionId: string, message: ChatMessage) {
    try {
      const session = await aiDatabase.getSession(sessionId)
      if (session) {
        session.messages.push(message)
        session.messageCount = session.messages.length
        session.updatedAt = Date.now()
        await aiDatabase.saveSession(session)
      }
    } catch (error) {
      console.error("خطأ في تحديث الجلسة:", error)
    }
  },

  // تعلم موضوع جديد
  async learnTopic(topic: string, response?: string) {
    try {
      await aiDatabase.updateKnowledgeFrequency(topic)

      if (response) {
        const knowledge = await aiDatabase.getKnowledgeByTopic(topic)
        if (knowledge && !knowledge.responses.includes(response)) {
          knowledge.responses.push(response)
          await aiDatabase.saveKnowledge(knowledge)
        }
      }
    } catch (error) {
      console.error("خطأ في تعلم الموضوع:", error)
    }
  },

  // الحصول على إحصائيات سريعة
  async getQuickStats() {
    try {
      const stats = await aiDatabase.getStatistics()
      return {
        totalMessages: stats.totalMessages || 0,
        totalSessions: stats.totalSessions || 0,
        favoriteProvider: Object.entries(stats.providerUsage || {}).sort(([, a], [, b]) => b - a)[0]?.[0] || "local",
        topTopic: stats.topTopics?.[0]?.topic || "عام",
      }
    } catch (error) {
      console.error("خطأ في الحصول على الإحصائيات:", error)
      return {
        totalMessages: 0,
        totalSessions: 0,
        favoriteProvider: "local",
        topTopic: "عام",
      }
    }
  },
}
