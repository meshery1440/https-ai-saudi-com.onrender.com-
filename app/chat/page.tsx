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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

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
}

interface AIKnowledge {
  topics: Record<string, number>
  responses: Record<string, string[]>
  userPreferences: Record<string, any>
  conversationPatterns: string[]
  sentiment: Record<string, number>
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
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

  // تحميل البيانات المحفوظة عند بدء التطبيق
  useEffect(() => {
    const savedMessages = localStorage.getItem("ai-chat-messages")
    const savedKnowledge = localStorage.getItem("ai-knowledge")
    const savedNotes = localStorage.getItem("ai-notes")

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // رسالة ترحيب أولية
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "مرحباً! أنا ذكاء اصطناعي تعليمي أتعلم من كل محادثة معك. كلما تحدثنا أكثر، كلما أصبحت أفضل في فهمك ومساعدتك. ما الذي تود التحدث عنه اليوم؟",
        sender: "ai",
        timestamp: new Date(),
        confidence: 0.95,
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
  }, [])

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

  // إرسال رسالة
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // تحليل رسالة المستخدم
    const analysis = analyzeText(inputMessage)

    // تحديث معرفة الذكاء الاصطناعي
    updateAIKnowledge(inputMessage, analysis)

    // محاكاة وقت التفكير (أطول للرسائل المعقدة)
    const thinkingTime = 1000 + Math.random() * 2000 + analysis.context.length * 50
    await new Promise((resolve) => setTimeout(resolve, thinkingTime))

    // توليد رد الذكاء الاصطناعي
    const aiResponse = generateAIResponse(inputMessage, analysis)
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
      learningData: {
        context: analysis.context,
        sentiment: analysis.sentiment,
        topics: analysis.topics,
      },
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsTyping(false)
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
    }
    setMessages([welcomeMessage])
  }

  // تصدير البيانات
  const exportData = () => {
    const data = {
      messages,
      aiKnowledge,
      aiNotes,
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
    averageConfidence:
      messages.filter((m) => m.sender === "ai" && m.confidence).reduce((sum, m) => sum + (m.confidence || 0), 0) /
      Math.max(1, messages.filter((m) => m.sender === "ai" && m.confidence).length),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
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
            <div className="p-3 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">الذكاء الاصطناعي التعليمي</h1>
              <p className="text-gray-300">يتعلم ويتطور من كل محادثة معك</p>
            </div>
          </div>

          <div className="flex gap-2">
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
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5" />
                        </div>
                      )}

                      <div className={`max-w-[75%] ${message.sender === "user" ? "order-2" : ""}`}>
                        <div
                          className={`p-4 rounded-2xl ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-white"
                              : "bg-white/10 backdrop-blur-sm border border-white/10"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <span>{message.timestamp.toLocaleTimeString("ar-SA")}</span>
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
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-gray-300 mr-2">أفكر وأتعلم...</span>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
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
                    placeholder="اكتب رسالتك هنا... (Enter للإرسال)"
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  💡 كلما تحدثت معي أكثر، كلما تعلمت وأصبحت أفضل في فهمك ومساعدتك
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* AI Stats */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
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
                      className="bg-gradient-to-r from-cyan-400 to-purple-600 h-2 rounded-full"
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
                      className="bg-gradient-to-r from-green-400 to-teal-600 h-2 rounded-full"
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
                      className="bg-gradient-to-r from-orange-400 to-red-600 h-2 rounded-full"
                      style={{ width: `${learningStats.averageConfidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Top Topics */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-400" />
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
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
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
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
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
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
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
    </div>
  )
}
