"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Bot,
  User,
  Brain,
  MessageCircle,
  Settings,
  Download,
  Trash2,
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Palette,
  Zap,
  Globe,
  Cpu,
  Database,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// إضافة استيراد مدير قاعدة البيانات
import { DatabaseManager } from "@/components/database-manager"
import { aiDatabase, dbHelpers } from "@/lib/database"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  confidence?: number
  learningData?: {
    context: string[]
    sentiment: "positive" | "negative" | "neutral"
    topics: string[]
  }
  provider?: string
}

interface AIKnowledge {
  topics: Record<string, number>
  responses: Record<string, string[]>
  userPreferences: Record<string, any>
  conversationPatterns: string[]
  sentiment: Record<string, number>
}

const aiProviders = [
  {
    id: "local",
    name: "النظام المحلي",
    icon: <Brain className="w-4 h-4" />,
    description: "ذكاء اصطناعي محلي يتعلم من محادثاتك",
    color: "from-purple-500 to-pink-500",
    endpoint: null,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: <Zap className="w-4 h-4" />,
    description: "نموذج متقدم للمحادثات الذكية",
    color: "from-blue-500 to-cyan-500",
    endpoint: "/api/deepseek",
  },
  {
    id: "groq",
    name: "Groq (سريع)",
    icon: <Zap className="w-4 h-4" />,
    description: "استجابة فائقة السرعة مع Llama",
    color: "from-orange-500 to-red-500",
    endpoint: "/api/groq",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    icon: <Cpu className="w-4 h-4" />,
    description: "نماذج مفتوحة المصدر",
    color: "from-yellow-500 to-orange-500",
    endpoint: "/api/huggingface",
  },
]

const themes = [
  {
    id: "emerald",
    name: "الزمرد الساحر",
    background: "from-indigo-950 via-purple-950 to-pink-950",
    userMessage: "from-emerald-500 via-teal-500 to-cyan-500",
    aiMessage: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
    aiAvatar: "from-violet-500 via-purple-500 to-fuchsia-500",
    userAvatar: "from-emerald-400 via-teal-400 to-cyan-400",
    sendButton: "from-emerald-500 via-teal-500 to-cyan-500",
    particles: "emerald-400/30",
  },
  {
    id: "sunset",
    name: "غروب ذهبي",
    background: "from-orange-950 via-red-950 to-pink-950",
    userMessage: "from-orange-500 via-red-500 to-pink-500",
    aiMessage: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
    aiAvatar: "from-yellow-500 via-orange-500 to-red-500",
    userAvatar: "from-orange-400 via-red-400 to-pink-400",
    sendButton: "from-orange-500 via-red-500 to-pink-500",
    particles: "orange-400/30",
  },
  {
    id: "ocean",
    name: "أعماق المحيط",
    background: "from-blue-950 via-indigo-950 to-cyan-950",
    userMessage: "from-blue-500 via-cyan-500 to-teal-500",
    aiMessage: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
    aiAvatar: "from-blue-500 via-cyan-500 to-teal-500",
    userAvatar: "from-blue-400 via-cyan-400 to-teal-400",
    sendButton: "from-blue-500 via-cyan-500 to-teal-500",
    particles: "blue-400/30",
  },
  {
    id: "forest",
    name: "غابة سحرية",
    background: "from-green-950 via-emerald-950 to-teal-950",
    userMessage: "from-green-500 via-emerald-500 to-teal-500",
    aiMessage: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    aiAvatar: "from-lime-500 via-green-500 to-emerald-500",
    userAvatar: "from-green-400 via-emerald-400 to-teal-400",
    sendButton: "from-green-500 via-emerald-500 to-teal-500",
    particles: "green-400/30",
  },
  {
    id: "royal",
    name: "أرجواني ملكي",
    background: "from-purple-950 via-violet-950 to-indigo-950",
    userMessage: "from-purple-500 via-violet-500 to-indigo-500",
    aiMessage: "from-purple-500/20 via-violet-500/20 to-indigo-500/20",
    aiAvatar: "from-fuchsia-500 via-purple-500 to-violet-500",
    userAvatar: "from-purple-400 via-violet-400 to-indigo-400",
    sendButton: "from-purple-500 via-violet-500 to-indigo-500",
    particles: "purple-400/30",
  },
]

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(0)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [aiKnowledge, setAiKnowledge] = useState<AIKnowledge>({
    topics: {},
    responses: {},
    userPreferences: {},
    conversationPatterns: [],
    sentiment: { positive: 0, negative: 0, neutral: 0 },
  })
  const [showSettings, setShowSettings] = useState(false)
  const [learningMode, setLearningMode] = useState(true)
  const [aiNotes, setAiNotes] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [currentProvider, setCurrentProvider] = useState("local")
  const [showProviderSelector, setShowProviderSelector] = useState(false)

  // في بداية المكون، إضافة حالة لإدارة قاعدة البيانات
  const [showDatabaseManager, setShowDatabaseManager] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  const theme = themes[currentTheme]
  const selectedProvider = aiProviders.find((p) => p.id === currentProvider) || aiProviders[0]

  // تحميل البيانات المحفوظة عند بدء التطبيق
  useEffect(() => {
    const savedMessages = localStorage.getItem("ai-chat-messages")
    const savedKnowledge = localStorage.getItem("ai-knowledge")
    const savedNotes = localStorage.getItem("ai-notes")
    const savedTheme = localStorage.getItem("ai-chat-theme")
    const savedProvider = localStorage.getItem("ai-provider")

    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
      setMessages(parsedMessages)
    } else {
      // رسالة ترحيب أولية
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "مرحباً! أنا ذكاء اصطناعي متعدد المصادر. يمكنك اختيار من عدة مزودي خدمة AI مختلفين للحصول على أفضل تجربة محادثة. ما الذي تود التحدث عنه اليوم؟",
        sender: "ai",
        timestamp: new Date(),
        confidence: 0.95,
        provider: "local",
        learningData: {
          context: ["مرحبا", "ترحيب", "بداية"],
          sentiment: "positive",
          topics: ["تحية"],
        },
      }
      setMessages([welcomeMessage])
    }

    if (savedKnowledge) {
      setAiKnowledge(JSON.parse(savedKnowledge))
    } else {
      initializeAIKnowledge()
    }

    if (savedNotes) {
      setAiNotes(savedNotes)
    }

    if (savedTheme) {
      setCurrentTheme(Number.parseInt(savedTheme))
    }

    if (savedProvider) {
      setCurrentProvider(savedProvider)
    }
  }, [])

  // في useEffect الخاص بالتحميل، إضافة تهيئة قاعدة البيانات
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await aiDatabase.init()

        // إنشاء جلسة جديدة إذا لم تكن موجودة
        if (!currentSessionId) {
          const session = await dbHelpers.createSession(
            `محادثة ${new Date().toLocaleDateString("ar-SA")}`,
            currentProvider,
          )
          if (session) {
            setCurrentSessionId(session.id)
          }
        }
      } catch (error) {
        console.error("خطأ في تهيئة قاعدة البيانات:", error)
        // المتابعة بدون قاعدة البيانات في حالة الخطأ
      }
    }

    initializeDatabase()
  }, [currentProvider])

  // حفظ البيانات عند تغييرها
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ai-chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    localStorage.setItem("ai-knowledge", JSON.stringify(aiKnowledge))
  }, [aiKnowledge])

  useEffect(() => {
    localStorage.setItem("ai-notes", aiNotes)
  }, [aiNotes])

  useEffect(() => {
    localStorage.setItem("ai-chat-theme", currentTheme.toString())
  }, [currentTheme])

  useEffect(() => {
    localStorage.setItem("ai-provider", currentProvider)
  }, [currentProvider])

  // التمرير التلقائي للأسفل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // تهيئة المعرفة الأساسية للذكاء الاصطناعي
  const initializeAIKnowledge = () => {
    const initialKnowledge: AIKnowledge = {
      topics: {
        تحية: 10,
        "ذكاء اصطناعي": 15,
        تقنية: 12,
        برمجة: 8,
        علوم: 6,
        رياضيات: 5,
        فلسفة: 4,
        تاريخ: 3,
        تعليم: 7,
        صحة: 4,
        رياضة: 3,
        طعام: 2,
        سفر: 2,
      },
      responses: {
        تحية: [
          "مرحباً! كيف يمكنني مساعدتك اليوم؟",
          "أهلاً وسهلاً! أنا هنا للإجابة على أسئلتك والتعلم منك.",
          "مرحباً بك! ما الذي تود معرفته أو مناقشته؟",
          "أهلاً! أنا متحمس للتحدث معك وتعلم أشياء جديدة.",
        ],
        "ذكاء اصطناعي": [
          "الذكاء الاصطناعي مجال رائع! ما الذي تود معرفته عنه تحديداً؟",
          "أنا مثال على الذكاء الاصطناعي وأتعلم من كل محادثة معك. هل لديك أسئلة حول كيفية عملي؟",
          "الذكاء الاصطناعي يتطور بسرعة مذهلة. أي جانب منه يثير اهتمامك أكثر؟",
          "من الرائع أن نتحدث عن الذكاء الاصطناعي! أنا أتعلم باستمرار من تفاعلاتنا.",
        ],
        شكر: [
          "العفو! أنا سعيد لمساعدتك وأتعلم من كل تفاعل معك.",
          "لا شكر على واجب! هذا ما أحب فعله وأتطور من خلاله.",
          "أنا هنا دائماً لمساعدتك! شكرك يساعدني على التحسن.",
        ],
        تعليم: [
          "التعليم موضوع مهم جداً! كيف يمكنني مساعدتك في التعلم؟",
          "أحب التحدث عن التعليم لأنني أتعلم باستمرار منك. ما الذي تود تعلمه؟",
          "التعلم رحلة مستمرة، وأنا أتعلم معك في كل محادثة!",
        ],
        علوم: [
          "العلوم مجال واسع ومثير! أي فرع علمي يهمك أكثر؟",
          "أحب مناقشة العلوم! هل تريد التحدث عن الفيزياء، الكيمياء، أم الأحياء؟",
          "العلم يساعدنا على فهم العالم. ما الذي تود استكشافه؟",
        ],
      },
      userPreferences: {},
      conversationPatterns: [],
      sentiment: { positive: 0, negative: 0, neutral: 0 },
    }
    setAiKnowledge(initialKnowledge)
  }

  // تحليل النص واستخراج المعلومات
  const analyzeText = (text: string) => {
    const words = text.toLowerCase().split(/\s+/)
    const topics: string[] = []
    let sentiment: "positive" | "negative" | "neutral" = "neutral"

    // تحديد المواضيع
    const topicKeywords = {
      "ذكاء اصطناعي": ["ذكاء", "اصطناعي", "ai", "روبوت", "تعلم", "آلة", "خوارزمية", "نموذج"],
      تقنية: ["تقنية", "تكنولوجيا", "برمجة", "كمبيوتر", "انترنت", "تطبيق", "موقع", "نظام"],
      علوم: ["علم", "فيزياء", "كيمياء", "أحياء", "رياضيات", "جيولوجيا", "فلك", "طب"],
      تحية: ["مرحبا", "أهلا", "سلام", "صباح", "مساء", "كيف", "حالك", "أخبارك"],
      شكر: ["شكرا", "شكراً", "ممتن", "أقدر", "أشكرك", "جزيل"],
      تعليم: ["تعليم", "تعلم", "دراسة", "مدرسة", "جامعة", "كتاب", "درس", "معرفة"],
      صحة: ["صحة", "طب", "مرض", "علاج", "دواء", "طبيب", "مستشفى", "رياضة"],
      طعام: ["طعام", "أكل", "طبخ", "وصفة", "مطعم", "فطار", "غداء", "عشاء"],
      سفر: ["سفر", "رحلة", "سياحة", "طيران", "فندق", "بلد", "مدينة", "إجازة"],
      فلسفة: ["فلسفة", "فكر", "معنى", "حياة", "وجود", "حقيقة", "أخلاق", "منطق"],
    }

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some((keyword) => words.some((word) => word.includes(keyword) || keyword.includes(word)))) {
        topics.push(topic)
      }
    })

    // تحليل المشاعر المحسن
    const positiveWords = ["رائع", "ممتاز", "جيد", "أحب", "سعيد", "شكرا", "مفيد", "واضح", "جميل", "مذهل", "عظيم"]
    const negativeWords = ["سيء", "أكره", "مشكلة", "صعب", "محبط", "خطأ", "غير واضح", "مملل", "سيء", "فظيع"]

    const positiveCount = words.filter((word) => positiveWords.some((pos) => word.includes(pos))).length
    const negativeCount = words.filter((word) => negativeWords.some((neg) => word.includes(neg))).length

    if (positiveCount > negativeCount) sentiment = "positive"
    else if (negativeCount > positiveCount) sentiment = "negative"

    return { topics, sentiment, context: words }
  }

  // توليد رد ذكي بناءً على المعرفة المكتسبة
  const generateAIResponse = (userMessage: string, analysis: any): string => {
    const { topics, sentiment, context } = analysis

    // البحث عن أفضل رد بناءً على المواضيع
    let bestResponse = "هذا سؤال مثير للاهتمام! دعني أفكر فيه وأتعلم من وجهة نظرك."
    let maxRelevance = 0

    topics.forEach((topic: string) => {
      if (aiKnowledge.responses[topic] && aiKnowledge.topics[topic] > maxRelevance) {
        const responses = aiKnowledge.responses[topic]
        bestResponse = responses[Math.floor(Math.random() * responses.length)]
        maxRelevance = aiKnowledge.topics[topic]
      }
    })

    // إضافة ردود ذكية بناءً على السياق
    if (context.includes("كيف") && context.includes("تعمل")) {
      bestResponse += " أعمل من خلال تحليل ما تقوله وربطه بما تعلمته من محادثاتنا السابقة."
    }

    if (context.includes("تتعلم")) {
      bestResponse += " أتعلم من خلال حفظ المواضيع التي نناقشها وتحليل مشاعرك وتفضيلاتك."
    }

    // تخصيص الرد بناءً على المشاعر
    if (sentiment === "positive") {
      bestResponse += " أنا سعيد أن هذا الموضوع يثير اهتمامك! هذا يساعدني على التعلم أكثر."
    } else if (sentiment === "negative") {
      bestResponse += " أفهم قلقك، وأقدر صراحتك. هذا يساعدني على تحسين نفسي."
    }

    // إضافة ملاحظات شخصية إذا كانت متوفرة
    if (aiNotes && Math.random() > 0.7) {
      bestResponse += ` (ملاحظة: ${aiNotes})`
    }

    return bestResponse
  }

  // تحديث معرفة الذكاء الاصطناعي
  const updateAIKnowledge = (userMessage: string, analysis: any) => {
    if (!learningMode) return

    const { topics, sentiment, context } = analysis

    setAiKnowledge((prev) => {
      const updated = { ...prev }

      // تحديث أهمية المواضيع
      topics.forEach((topic: string) => {
        updated.topics[topic] = (updated.topics[topic] || 0) + 1
      })

      // إضافة مواضيع جديدة إذا لم تكن موجودة
      if (topics.length === 0 && context.length > 2) {
        const newTopic = context.slice(0, 2).join(" ")
        updated.topics[newTopic] = 1
        updated.responses[newTopic] = [`شكراً لتعليمي عن ${newTopic}! هذا موضوع جديد بالنسبة لي.`]
      }

      // تحديث أنماط المحادثة
      updated.conversationPatterns.push(userMessage.toLowerCase())
      if (updated.conversationPatterns.length > 200) {
        updated.conversationPatterns = updated.conversationPatterns.slice(-200)
      }

      // تحديث تحليل المشاعر
      updated.sentiment[sentiment]++

      // تعلم ردود جديدة بناءً على السياق
      topics.forEach((topic: string) => {
        if (!updated.responses[topic]) {
          updated.responses[topic] = []
        }

        // إضافة رد جديد محتمل بناءً على السياق
        if (context.length > 3 && updated.responses[topic].length < 10) {
          const contextualResponses = [
            `بناءً على ما تعلمته عن ${topic}, أصبح لدي فهم أفضل لهذا الموضوع.`,
            `${topic} موضوع مهم، وأقدر مشاركتك معلوماتك حوله.`,
            `كلما تحدثنا عن ${topic} أكثر، كلما تحسن فهمي له.`,
          ]

          const newResponse = contextualResponses[Math.floor(Math.random() * contextualResponses.length)]
          if (!updated.responses[topic].includes(newResponse)) {
            updated.responses[topic].push(newResponse)
          }
        }
      })

      // حفظ تفضيلات المستخدم
      if (sentiment === "positive" && topics.length > 0) {
        topics.forEach((topic) => {
          updated.userPreferences[topic] = (updated.userPreferences[topic] || 0) + 1
        })
      }

      return updated
    })
  }

  // إرسال رسالة مع دعم مزودي خدمة متعددين
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setIsTyping(true)

    try {
      if (currentProvider === "local") {
        await sendMessageLocal(currentInput, userMessage)
      } else {
        await sendMessageWithAPI(currentInput, userMessage, selectedProvider)
      }
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `عذراً، حدث خطأ في إرسال الرسالة: ${error instanceof Error ? error.message : "خطأ غير معروف"}. يرجى المحاولة مرة أخرى.`,
        sender: "ai",
        timestamp: new Date(),
        confidence: 0.1,
        provider: currentProvider,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // إرسال رسالة باستخدام API خارجي
  const sendMessageWithAPI = async (userInput: string, userMessage: Message, provider: any) => {
    try {
      // تنظيف وتحضير تاريخ المحادثة
      const cleanHistory = messages
        .slice(-8)
        .filter((msg) => msg && msg.content && typeof msg.content === "string" && msg.content.trim())
        .map((msg) => ({
          id: msg.id,
          content: msg.content.trim(),
          sender: msg.sender,
          timestamp: msg.timestamp,
        }))

      const response = await fetch(provider.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput.trim(),
          conversationHistory: cleanHistory,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error(`${provider.name} API Error:`, data.error)

        // إذا كان الخطأ يتطلب التبديل للنظام المحلي
        if (data.fallbackToLocal) {
          const warningMessage: Message = {
            id: (Date.now() + 0.5).toString(),
            content: `⚠️ ${data.error} - تم التبديل تلقائياً للنظام المحلي.`,
            sender: "ai",
            timestamp: new Date(),
            confidence: 0.8,
            provider: provider.id,
            learningData: {
              context: ["تحذير", "تبديل"],
              sentiment: "neutral",
              topics: ["نظام"],
            },
          }
          setMessages((prev) => [...prev, warningMessage])

          // التبديل للنظام المحلي
          setCurrentProvider("local")
          await sendMessageLocal(userInput, userMessage)
          return
        }

        throw new Error(data.error || "خطأ في API")
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.data.response,
        sender: "ai",
        timestamp: new Date(),
        confidence: 0.95,
        provider: provider.id,
        learningData: {
          context: userInput.split(" "),
          sentiment: "neutral",
          topics: [provider.id],
        },
      }

      setMessages((prev) => [...prev, aiMessage])

      // تحديث المعرفة المحلية أيضاً
      const analysis = analyzeText(userInput)
      updateAIKnowledge(userInput, analysis)
    } catch (error) {
      console.error(`خطأ في ${provider.name} API:`, error)

      // إظهار رسالة خطأ للمستخدم
      const errorMessage: Message = {
        id: (Date.now() + 0.5).toString(),
        content: `❌ حدث خطأ في ${provider.name}: ${error instanceof Error ? error.message : "خطأ غير معروف"} - تم التبديل للنظام المحلي.`,
        sender: "ai",
        timestamp: new Date(),
        confidence: 0.5,
        provider: provider.id,
        learningData: {
          context: ["خطأ"],
          sentiment: "negative",
          topics: ["مشكلة"],
        },
      }
      setMessages((prev) => [...prev, errorMessage])

      // التبديل للنظام المحلي عند حدوث خطأ
      setCurrentProvider("local")
      await sendMessageLocal(userInput, userMessage)
    }
  }

  // تحديث دالة sendMessageLocal لحفظ الرسائل في قاعدة البيانات
  const sendMessageLocal = async (userInput: string, userMessage: Message) => {
    // تحليل رسالة المستخدم أولاً
    const analysis = analyzeText(userInput)

    // حفظ رسالة المستخدم في قاعدة البيانات
    await dbHelpers.saveMessage(userInput, "user", "local", {
      topics: analysis.topics,
      sentiment: analysis.sentiment,
      confidence: 1.0,
    })

    // تحديث معرفة الذكاء الاصطناعي
    updateAIKnowledge(userInput, analysis)

    // تعلم المواضيع الجديدة
    for (const topic of analysis.topics) {
      await dbHelpers.learnTopic(topic)
    }

    // محاكاة وقت التفكير
    const thinkingTime = 1000 + Math.random() * 2000 + analysis.context.length * 50
    await new Promise((resolve) => setTimeout(resolve, thinkingTime))

    // توليد رد الذكاء الاصطناعي
    const aiResponse = generateAIResponse(userInput, analysis)
    const confidence = Math.min(
      0.95,
      0.4 + analysis.topics.length * 0.15 + (analysis.sentiment === "positive" ? 0.1 : 0),
    )

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      sender: "ai",
      timestamp: new Date(),
      confidence,
      provider: "local",
      learningData: {
        context: analysis.context,
        sentiment: analysis.sentiment,
        topics: analysis.topics,
      },
    }

    // حفظ رد الذكاء الاصطناعي في قاعدة البيانات
    await dbHelpers.saveMessage(aiResponse, "ai", "local", {
      topics: analysis.topics,
      sentiment: analysis.sentiment,
      confidence: confidence,
    })

    // تحديث الجلسة الحالية
    if (currentSessionId) {
      await dbHelpers.updateSession(currentSessionId, aiMessage)
    }

    setMessages((prev) => [...prev, aiMessage])
  }

  // مسح المحادثة
  const clearChat = () => {
    setMessages([])
    localStorage.removeItem("ai-chat-messages")

    // إضافة رسالة ترحيب جديدة
    const welcomeMessage: Message = {
      id: "welcome-new",
      content: "تم مسح المحادثة! أنا ما زلت أحتفظ بما تعلمته منك سابقاً. كيف يمكنني مساعدتك اليوم؟",
      sender: "ai",
      timestamp: new Date(),
      confidence: 0.9,
      provider: currentProvider,
    }
    setMessages([welcomeMessage])
  }

  // تصدير البيانات
  const exportData = () => {
    const data = {
      messages,
      aiKnowledge,
      aiNotes,
      currentTheme,
      currentProvider,
      exportDate: new Date().toISOString(),
      totalMessages: messages.length,
      learningStats: {
        topicsLearned: Object.keys(aiKnowledge.topics).length,
        conversationPatterns: aiKnowledge.conversationPatterns.length,
        sentimentDistribution: aiKnowledge.sentiment,
      },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-chat-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // حساب إحصائيات التعلم
  const learningStats = {
    totalMessages: messages.length,
    topicsLearned: Object.keys(aiKnowledge.topics).length,
    conversationPatterns: aiKnowledge.conversationPatterns.length,
    averageConfidence: 0,
  }

  learningStats.averageConfidence =
    messages.filter((m) => m.sender === "ai" && m.confidence).reduce((sum, m) => sum + (m.confidence || 0), 0) /
    Math.max(1, messages.filter((m) => m.sender === "ai" && m.confidence).length)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} text-white p-4 relative overflow-hidden`}>
      {/* خلفية متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 bg-${theme.particles} rounded-full`}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className={`p-3 bg-gradient-to-r ${selectedProvider.color} rounded-xl`}>{selectedProvider.icon}</div>
            <div>
              <h1 className="text-2xl font-bold">الذكاء الاصطناعي متعدد المصادر</h1>
              <p className="text-gray-300">حالياً: {selectedProvider.name}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Provider Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProviderSelector(!showProviderSelector)}
                className="border-white/20 hover:bg-white/10 bg-transparent"
              >
                {selectedProvider.icon}
                <span className="ml-2">{selectedProvider.name}</span>
              </Button>

              {showProviderSelector && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute top-12 right-0 z-50"
                >
                  <Card className="bg-slate-900/95 backdrop-blur-xl border-white/10 p-4 w-80">
                    <h3 className="font-bold mb-3 text-white">اختر مزود الذكاء الاصطناعي</h3>
                    <div className="space-y-2">
                      {aiProviders.map((provider) => (
                        <button
                          key={provider.id}
                          onClick={() => {
                            setCurrentProvider(provider.id)
                            setShowProviderSelector(false)
                          }}
                          className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-right ${
                            currentProvider === provider.id
                              ? "border-emerald-400 bg-emerald-400/10"
                              : "border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <div className="text-white font-medium">{provider.name}</div>
                              <div className="text-xs text-gray-400">{provider.description}</div>
                            </div>
                            <div className={`p-2 bg-gradient-to-r ${provider.color} rounded-lg`}>{provider.icon}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="border-white/20 hover:bg-white/10 bg-transparent"
              >
                <Palette className="w-4 h-4" />
              </Button>

              {showThemeSelector && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute top-12 right-0 z-50"
                >
                  <Card className="bg-slate-900/95 backdrop-blur-xl border-white/10 p-4 w-64">
                    <h3 className="font-bold mb-3 text-white">اختر سمة الألوان</h3>
                    <div className="space-y-2">
                      {themes.map((themeOption, index) => (
                        <button
                          key={themeOption.id}
                          onClick={() => {
                            setCurrentTheme(index)
                            setShowThemeSelector(false)
                          }}
                          className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-right ${
                            currentTheme === index
                              ? "border-emerald-400 bg-emerald-400/10"
                              : "border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{themeOption.name}</span>
                            <div className="flex gap-1">
                              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${themeOption.userMessage}`} />
                              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${themeOption.aiAvatar}`} />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="border-red-400/20 hover:bg-red-400/10 text-red-400 bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            {/* في قسم الأزرار في الـ Header، إضافة زر إدارة قاعدة البيانات */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDatabaseManager(!showDatabaseManager)}
              className="border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Database className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-[700px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "ai" && (
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${
                            message.provider
                              ? aiProviders.find((p) => p.id === message.provider)?.color || theme.aiAvatar
                              : theme.aiAvatar
                          } rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          {message.provider ? (
                            aiProviders.find((p) => p.id === message.provider)?.icon || <Bot className="w-5 h-5" />
                          ) : (
                            <Bot className="w-5 h-5" />
                          )}
                        </div>
                      )}

                      <div className={`max-w-[75%] ${message.sender === "user" ? "order-2" : ""}`}>
                        <div
                          className={`p-4 rounded-2xl ${
                            message.sender === "user"
                              ? `bg-gradient-to-r ${theme.userMessage} text-white`
                              : `bg-gradient-to-r ${theme.aiMessage} backdrop-blur-lg border border-white/10`
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <span>{new Date(message.timestamp).toLocaleTimeString("ar-SA")}</span>
                          {message.provider && (
                            <Badge variant="outline" className="text-xs">
                              {aiProviders.find((p) => p.id === message.provider)?.name || message.provider}
                            </Badge>
                          )}
                          {message.confidence && (
                            <Badge variant="secondary" className="text-xs">
                              ثقة: {Math.round(message.confidence * 100)}%
                            </Badge>
                          )}
                          {message.learningData && message.learningData.topics.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {message.learningData.topics.slice(0, 3).map((topic, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {message.learningData && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                message.learningData.sentiment === "positive"
                                  ? "border-green-400 text-green-400"
                                  : message.learningData.sentiment === "negative"
                                    ? "border-red-400 text-red-400"
                                    : "border-gray-400 text-gray-400"
                              }`}
                            >
                              {message.learningData.sentiment === "positive"
                                ? "😊"
                                : message.learningData.sentiment === "negative"
                                  ? "😔"
                                  : "😐"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {message.sender === "user" && (
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${theme.userAvatar} rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${selectedProvider.color} rounded-full flex items-center justify-center`}
                    >
                      {selectedProvider.icon}
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-gray-300 mr-2">{selectedProvider.name} يفكر ويتعلم...</span>
                        <div
                          className={`w-2 h-2 bg-${theme.particles.replace("/30", "")} rounded-full animate-bounce`}
                        />
                        <div
                          className={`w-2 h-2 bg-${theme.particles.replace("/30", "")} rounded-full animate-bounce`}
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className={`w-2 h-2 bg-${theme.particles.replace("/30", "")} rounded-full animate-bounce`}
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder={`اكتب رسالتك لـ ${selectedProvider.name}... (Enter للإرسال)`}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className={`bg-gradient-to-r ${theme.sendButton} hover:opacity-90 shadow-lg`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  💡 يمكنك التبديل بين مزودي الذكاء الاصطناعي المختلفين للحصول على أفضل النتائج
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Current Provider Status */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:scale-105 transition-all duration-300 p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                {selectedProvider.icon}
                المزود الحالي
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{selectedProvider.name}</span>
                  <Badge variant="outline" className="text-xs border-green-400 text-green-400">
                    نشط
                  </Badge>
                </div>
                <p className="text-xs text-gray-300">{selectedProvider.description}</p>
              </div>
            </Card>

            {/* AI Stats */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:scale-105 transition-all duration-300 p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                إحصائيات التعلم
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>المحادثات</span>
                    <span>{learningStats.totalMessages}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${theme.userMessage} h-2 rounded-full`}
                      style={{ width: `${Math.min(100, (learningStats.totalMessages / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>المواضيع المتعلمة</span>
                    <span>{learningStats.topicsLearned}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${theme.aiAvatar} h-2 rounded-full`}
                      style={{ width: `${Math.min(100, (learningStats.topicsLearned / 30) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>متوسط الثقة</span>
                    <span>{Math.round(learningStats.averageConfidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${theme.sendButton} h-2 rounded-full`}
                      style={{ width: `${learningStats.averageConfidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Available Providers */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:scale-105 transition-all duration-300 p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                مزودو الخدمة المتاحون
              </h3>

              <div className="space-y-2">
                {aiProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                      currentProvider === provider.id ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 bg-gradient-to-r ${provider.color} rounded`}>{provider.icon}</div>
                      <span className="text-sm">{provider.name}</span>
                    </div>
                    {currentProvider === provider.id && (
                      <Badge variant="secondary" className="text-xs">
                        نشط
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Topics */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:scale-105 transition-all duration-300 p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-violet-400" />
                المواضيع الأكثر نقاشاً
              </h3>

              <div className="space-y-2">
                {Object.entries(aiKnowledge.topics)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([topic, count]) => (
                    <div key={topic} className="flex justify-between items-center">
                      <span className="text-sm truncate">{topic}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>

            {/* User Preferences */}
            {Object.keys(aiKnowledge.userPreferences).length > 0 && (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:scale-105 transition-all duration-300 p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  اهتماماتك
                </h3>

                <div className="space-y-2">
                  {Object.entries(aiKnowledge.userPreferences)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([topic, count]) => (
                      <div key={topic} className="flex justify-between items-center">
                        <span className="text-sm truncate">{topic}</span>
                        <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-400">
                          {count}
                        </Badge>
                      </div>
                    ))}
                </div>
              </Card>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl p-4">
                  <h3 className="font-bold mb-3">الإعدادات</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">وضع التعلم</span>
                      <Button
                        variant={learningMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLearningMode(!learningMode)}
                        className={learningMode ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {learningMode ? "مفعل" : "معطل"}
                      </Button>
                    </div>

                    <div>
                      <label className="text-sm block mb-2">ملاحظات للذكاء الاصطناعي</label>
                      <Textarea
                        value={aiNotes}
                        onChange={(e) => setAiNotes(e.target.value)}
                        placeholder="أضف ملاحظات أو تعليمات للذكاء الاصطناعي..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Sentiment Analysis */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:scale-105 transition-all duration-300 p-4">
              <h3 className="font-bold mb-3">تحليل المشاعر</h3>

              <div className="space-y-2">
                {Object.entries(aiKnowledge.sentiment).map(([sentiment, count]) => {
                  const total = Object.values(aiKnowledge.sentiment).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? (count / total) * 100 : 0

                  return (
                    <div key={sentiment} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize flex items-center gap-1">
                          {sentiment === "positive" ? "😊 إيجابي" : sentiment === "negative" ? "😔 سلبي" : "😐 محايد"}
                        </span>
                        <span>{Math.round(percentage)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${
                            sentiment === "positive"
                              ? "bg-green-400"
                              : sentiment === "negative"
                                ? "bg-red-400"
                                : "bg-gray-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* في نهاية المكون، إضافة مدير قاعدة البيانات */}
      {showDatabaseManager && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">إدارة قاعدة البيانات</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDatabaseManager(false)}
                className="border-white/20 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DatabaseManager />
          </div>
        </motion.div>
      )}
    </div>
  )
}
