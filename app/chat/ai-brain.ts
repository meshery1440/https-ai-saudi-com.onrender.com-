// نظام الذكاء الاصطناعي المتقدم
export class AIBrain {
  private knowledge: Map<string, any> = new Map()
  private patterns: string[] = []
  private responses: Map<string, string[]> = new Map()
  private learningRate = 0.1
  private confidence = 0.5

  constructor() {
    this.initializeKnowledge()
  }

  private initializeKnowledge() {
    // المعرفة الأساسية
    const baseKnowledge = {
      greetings: {
        patterns: ["مرحبا", "أهلا", "سلام", "صباح", "مساء"],
        responses: [
          "مرحباً! كيف يمكنني مساعدتك اليوم؟",
          "أهلاً وسهلاً! أنا هنا للإجابة على أسئلتك.",
          "مرحباً بك! ما الذي تود معرفته؟",
        ],
      },
      ai_topics: {
        patterns: ["ذكاء", "اصطناعي", "ai", "تعلم", "آلة", "روبوت"],
        responses: [
          "الذكاء الاصطناعي مجال رائع! ما الذي تود معرفته عنه تحديداً؟",
          "أنا مثال على الذكاء الاصطناعي وأتعلم من كل محادثة معك.",
          "الذكاء الاصطناعي يتطور بسرعة مذهلة. هل لديك سؤال محدد؟",
        ],
      },
      thanks: {
        patterns: ["شكرا", "شكراً", "ممتن", "أقدر"],
        responses: ["العفو! أنا سعيد لمساعدتك.", "لا شكر على واجب! هذا ما أحب فعله.", "أنا هنا دائماً لمساعدتك!"],
      },
    }

    Object.entries(baseKnowledge).forEach(([key, value]) => {
      this.knowledge.set(key, value)
      this.responses.set(key, value.responses)
    })
  }

  // تحليل النص واستخراج المعاني
  analyzeText(text: string) {
    const words = text.toLowerCase().split(/\s+/)
    const analysis = {
      topics: [] as string[],
      sentiment: this.analyzeSentiment(text),
      keywords: this.extractKeywords(words),
      intent: this.detectIntent(text),
      context: words,
      complexity: this.calculateComplexity(text),
    }

    // تحديد المواضيع
    this.knowledge.forEach((value, key) => {
      if (
        value.patterns &&
        value.patterns.some((pattern: string) => words.some((word) => word.includes(pattern) || pattern.includes(word)))
      ) {
        analysis.topics.push(key)
      }
    })

    return analysis
  }

  // تحليل المشاعر
  private analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
    const positiveWords = ["رائع", "ممتاز", "جيد", "أحب", "سعيد", "شكرا", "مفيد", "واضح"]
    const negativeWords = ["سيء", "أكره", "مشكلة", "صعب", "محبط", "خطأ", "غير واضح"]

    const words = text.toLowerCase().split(/\s+/)
    const positiveCount = words.filter((word) => positiveWords.some((pos) => word.includes(pos))).length
    const negativeCount = words.filter((word) => negativeWords.some((neg) => word.includes(neg))).length

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  // استخراج الكلمات المفتاحية
  private extractKeywords(words: string[]): string[] {
    const stopWords = ["في", "من", "إلى", "على", "عن", "مع", "هذا", "هذه", "التي", "الذي"]
    return words.filter((word) => word.length > 2 && !stopWords.includes(word) && !/^\d+$/.test(word))
  }

  // كشف النية
  private detectIntent(text: string): string {
    const intentPatterns = {
      question: ["ما", "كيف", "متى", "أين", "لماذا", "هل", "؟"],
      request: ["أريد", "أحتاج", "ممكن", "من فضلك"],
      complaint: ["مشكلة", "خطأ", "لا يعمل", "صعب"],
      compliment: ["رائع", "ممتاز", "شكرا", "أعجبني"],
    }

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some((pattern) => text.includes(pattern))) {
        return intent
      }
    }

    return "statement"
  }

  // حساب تعقيد النص
  private calculateComplexity(text: string): number {
    const words = text.split(/\s+/)
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length
    const sentenceCount = text.split(/[.!?]/).length
    const avgSentenceLength = words.length / sentenceCount

    return (avgWordLength + avgSentenceLength) / 10
  }

  // توليد رد ذكي
  generateResponse(analysis: any): { response: string; confidence: number } {
    let bestResponse = "هذا سؤال مثير للاهتمام! دعني أفكر فيه..."
    let maxConfidence = 0.3

    // البحث عن أفضل رد بناءً على المواضيع
    analysis.topics.forEach((topic: string) => {
      const responses = this.responses.get(topic)
      if (responses && responses.length > 0) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        const topicConfidence = this.calculateTopicConfidence(topic, analysis)

        if (topicConfidence > maxConfidence) {
          bestResponse = randomResponse
          maxConfidence = topicConfidence
        }
      }
    })

    // تخصيص الرد بناءً على المشاعر والنية
    bestResponse = this.customizeResponse(bestResponse, analysis)

    return {
      response: bestResponse,
      confidence: Math.min(0.95, maxConfidence),
    }
  }

  // حساب ثقة الموضوع
  private calculateTopicConfidence(topic: string, analysis: any): number {
    const topicData = this.knowledge.get(topic)
    if (!topicData) return 0.3

    let confidence = 0.5

    // زيادة الثقة بناءً على عدد الكلمات المطابقة
    const matchingWords = analysis.keywords.filter((keyword: string) =>
      topicData.patterns.some((pattern: string) => keyword.includes(pattern) || pattern.includes(keyword)),
    )

    confidence += matchingWords.length * 0.1

    // تعديل الثقة بناءً على المشاعر
    if (analysis.sentiment === "positive") confidence += 0.1
    else if (analysis.sentiment === "negative") confidence += 0.05

    return Math.min(0.9, confidence)
  }

  // تخصيص الرد
  private customizeResponse(response: string, analysis: any): string {
    let customized = response

    // إضافة تعليق بناءً على المشاعر
    if (analysis.sentiment === "positive") {
      customized += " أنا سعيد أن هذا الموضوع يثير اهتمامك!"
    } else if (analysis.sentiment === "negative") {
      customized += " أفهم قلقك، دعني أساعدك في حل هذا الأمر."
    }

    // تخصيص بناءً على النية
    if (analysis.intent === "question") {
      customized += " هل تريد معرفة المزيد حول هذا الموضوع؟"
    } else if (analysis.intent === "request") {
      customized += " سأبذل قصارى جهدي لمساعدتك."
    }

    return customized
  }

  // التعلم من المحادثة
  learn(userMessage: string, analysis: any, userFeedback?: "positive" | "negative") {
    // حفظ النمط الجديد
    this.patterns.push(userMessage.toLowerCase())

    // تحديث المعرفة بناءً على المواضيع الجديدة
    analysis.topics.forEach((topic: string) => {
      if (!this.knowledge.has(topic)) {
        this.knowledge.set(topic, {
          patterns: analysis.keywords,
          responses: [`بناءً على ما فهمته عن ${topic}, هذا موضوع مثير للاهتمام.`],
          frequency: 1,
        })
        this.responses.set(topic, [`بناءً على ما فهمته عن ${topic}, هذا موضوع مثير للاهتمام.`])
      } else {
        const topicData = this.knowledge.get(topic)
        topicData.frequency = (topicData.frequency || 0) + 1

        // إضافة كلمات مفتاحية جديدة
        analysis.keywords.forEach((keyword: string) => {
          if (!topicData.patterns.includes(keyword)) {
            topicData.patterns.push(keyword)
          }
        })
      }
    })

    // التعلم من ردود الفعل
    if (userFeedback) {
      this.adjustLearningRate(userFeedback)
    }

    // تنظيف البيانات القديمة
    this.cleanupOldData()
  }

  // تعديل معدل التعلم
  private adjustLearningRate(feedback: "positive" | "negative") {
    if (feedback === "positive") {
      this.learningRate = Math.min(0.2, this.learningRate + 0.01)
      this.confidence = Math.min(0.9, this.confidence + 0.05)
    } else {
      this.learningRate = Math.max(0.05, this.learningRate - 0.01)
      this.confidence = Math.max(0.3, this.confidence - 0.05)
    }
  }

  // تنظيف البيانات القديمة
  private cleanupOldData() {
    // الاحتفاظ بآخر 1000 نمط فقط
    if (this.patterns.length > 1000) {
      this.patterns = this.patterns.slice(-1000)
    }

    // إزالة المواضيع قليلة الاستخدام
    this.knowledge.forEach((value, key) => {
      if (value.frequency && value.frequency < 2 && this.knowledge.size > 50) {
        this.knowledge.delete(key)
        this.responses.delete(key)
      }
    })
  }

  // الحصول على إحصائيات التعلم
  getStats() {
    return {
      knowledgeTopics: this.knowledge.size,
      patterns: this.patterns.length,
      learningRate: this.learningRate,
      confidence: this.confidence,
      topTopics: Array.from(this.knowledge.entries())
        .filter(([, value]) => value.frequency)
        .sort(([, a], [, b]) => b.frequency - a.frequency)
        .slice(0, 10)
        .map(([key, value]) => ({ topic: key, frequency: value.frequency })),
    }
  }

  // تصدير المعرفة
  exportKnowledge() {
    return {
      knowledge: Object.fromEntries(this.knowledge),
      patterns: this.patterns,
      responses: Object.fromEntries(this.responses),
      learningRate: this.learningRate,
      confidence: this.confidence,
      exportDate: new Date().toISOString(),
    }
  }

  // استيراد المعرفة
  importKnowledge(data: any) {
    if (data.knowledge) {
      this.knowledge = new Map(Object.entries(data.knowledge))
    }
    if (data.patterns) {
      this.patterns = data.patterns
    }
    if (data.responses) {
      this.responses = new Map(Object.entries(data.responses))
    }
    if (data.learningRate) {
      this.learningRate = data.learningRate
    }
    if (data.confidence) {
      this.confidence = data.confidence
    }
  }
}
