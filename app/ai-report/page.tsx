"use client"

import { motion } from "framer-motion"
import { Brain, Cpu, Eye, Shield, Zap, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AIReportPage() {
  const sections = [
    {
      id: "introduction",
      title: "مقدمة",
      icon: <Brain className="w-8 h-8" />,
      content: (
        <div>
          <p className="mb-6">
            يشهد عصرنا الحالي تطورًا غير مسبوق في مجال الذكاء الاصطناعي، حيث أصبحت التقنيات الذكية جزءًا لا يتجزأ من
            حياتنا اليومية. يقدم هذا التقرير رؤية شاملة عن أحدث التطورات في هذا المجال المثير.
          </p>
          <div className="bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-xl p-6 border border-cyan-400/20">
            <h4 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              لماذا يعتبر الذكاء الاصطناعي مهمًا اليوم؟
            </h4>
            <p>
              مع تزايد كمية البيانات المتاحة وتحسن قدرات المعالجة، أصبح الذكاء الاصطناعي أداة حيوية في مختلف القطاعات،
              من الرعاية الصحية إلى التمويل والتعليم والترفيه.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "latest-tech",
      title: "أحدث تقنيات الذكاء الاصطناعي",
      icon: <Cpu className="w-8 h-8" />,
      content: (
        <div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: <Brain className="w-12 h-12" />,
                title: "النماذج اللغوية الكبيرة (LLMs)",
                description: "نماذج متقدمة قادرة على فهم وتوليد النصوص البشرية بشكل طبيعي، مثل GPT-4 وLLaMA 3.",
                color: "from-cyan-400 to-blue-600",
              },
              {
                icon: <Eye className="w-12 h-12" />,
                title: "الرؤية الحاسوبية",
                description: "تقنيات تحليل الصور والفيديو للتعرف على المحتوى وتفسيره.",
                color: "from-purple-400 to-pink-600",
              },
              {
                icon: <Zap className="w-12 h-12" />,
                title: "التعلم المعزز",
                description: "أنظمة تتعلم من خلال التفاعل مع البيئة المحيطة بها.",
                color: "from-green-400 to-teal-600",
              },
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${tech.color} mb-4`}>{tech.icon}</div>
                <h4 className="text-xl font-bold mb-3 text-cyan-400">{tech.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "edge-ai",
      title: "الذكاء الاصطناعي الطرفي",
      icon: <Cpu className="w-8 h-8" />,
      content: (
        <div>
          <p className="mb-6">
            يشير الذكاء الاصطناعي الطرفي إلى تشغيل نماذج الذكاء الاصطناعي مباشرة على الأجهزة الطرفية بدلاً من الاعتماد
            على السحابة.
          </p>

          <h4 className="text-2xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            مميزات الذكاء الاصطناعي الطرفي
          </h4>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              "تحسين الخصوصية حيث تبقى البيانات على الجهاز",
              "وقت استجابة أسرع لعدم الحاجة للاتصال بالإنترنت",
              "توفير في استهلاك النطاق الترددي",
              "يعمل حتى في حالة انقطاع الاتصال بالإنترنت",
            ].map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-400/10 to-transparent rounded-lg border border-cyan-400/20"
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />
                <span className="text-gray-300">{advantage}</span>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-xl p-6 border border-purple-400/20">
            <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              أمثلة عملية
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>• المساعدات الصوتية مثل Siri وGoogle Assistant</li>
              <li>• تطبيقات الترجمة الفورية</li>
              <li>• تطبيقات الكاميرا الذكية للتعرف على الوجوه والأشياء</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "responsible-ai",
      title: "الذكاء الاصطناعي المسؤول",
      icon: <Shield className="w-8 h-8" />,
      content: (
        <div>
          <p className="mb-6">مع تزايد تأثير الذكاء الاصطناعي، أصبح من الضروري ضمان استخدامه بمسؤولية وأخلاقية.</p>

          <h4 className="text-2xl font-bold mb-6 text-cyan-400">مبادئ الذكاء الاصطناعي المسؤول</h4>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "الإنصاف",
                description: "ضمان عدم تحيز النماذج ضد فئات معينة من المستخدمين.",
                color: "from-green-400 to-teal-600",
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: "الشفافية",
                description: "إمكانية فهم كيفية اتخاذ القرارات من قبل النماذج.",
                color: "from-blue-400 to-cyan-600",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "الخصوصية",
                description: "حماية بيانات المستخدمين وضمان سرية معلوماتهم.",
                color: "from-purple-400 to-pink-600",
              },
            ].map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${principle.color} mb-4`}>
                  {principle.icon}
                </div>
                <h5 className="text-lg font-bold mb-3 text-cyan-400">{principle.title}</h5>
                <p className="text-gray-300 text-sm leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-red-400/10 to-orange-600/10 rounded-xl p-6 border border-red-400/20">
            <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              التحديات الرئيسية
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>• التحيز الخوارزمي في البيانات التدريبية</li>
              <li>• تفسير قرارات الذكاء الاصطناعي المعقدة</li>
              <li>• حماية الخصوصية وأمن البيانات</li>
              <li>• المساءلة القانونية والأخلاقية</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "future",
      title: "مستقبل الذكاء الاصطناعي",
      icon: <TrendingUp className="w-8 h-8" />,
      content: (
        <div>
          <p className="mb-6">
            يتجه مستقبل الذكاء الاصطناعي نحو مزيد من التكامل في حياتنا اليومية مع تحسين الكفاءة والموثوقية.
          </p>

          <h4 className="text-2xl font-bold mb-6 text-cyan-400">أهم التوجهات المستقبلية</h4>

          <div className="space-y-6 mb-8">
            {[
              {
                title: "الذكاء الاصطناعي العام (AGI)",
                description: "أنظمة ذكاء اصطناعي قادرة على فهم وتعلم أي مهمة فكرية يمكن للإنسان القيام بها.",
              },
              {
                title: "التكامل متعدد التخصصات",
                description: "دمج الذكاء الاصطناعي مع تقنيات أخرى مثل البلوك تشين والحوسبة الكمومية.",
              },
              {
                title: "التخصيص الشامل",
                description: "أنظمة ذكاء اصطناعي قادرة على تخصيص التجربة لكل مستخدم بشكل فريد.",
              },
              {
                title: "الاستدامة",
                description: "تطوير أنظمة ذكاء اصطناعي موفرة للطاقة وصديقة للبيئة.",
              },
            ].map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-r from-cyan-400/5 to-purple-600/5 rounded-xl p-6 border border-cyan-400/20"
              >
                <h5 className="text-lg font-bold mb-2 text-cyan-400">{trend.title}</h5>
                <p className="text-gray-300">{trend.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-400/10 to-red-600/10 rounded-xl p-6 border border-orange-400/20">
            <h4 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              تحديات مستقبلية
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li>• حماية الخصوصية في عصر الذكاء الاصطناعي</li>
              <li>• التعامل مع البطالة الناتجة عن الأتمتة</li>
              <li>• ضمان أمان أنظمة الذكاء الاصطناعي المتقدمة</li>
              <li>• وضع معايير أخلاقية وقانونية واضحة</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 space-x-reverse hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </Link>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Brain className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold">تقرير الذكاء الاصطناعي</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 bg-gradient-to-r from-cyan-400/10 to-purple-600/10 backdrop-blur-sm border border-white/10 rounded-3xl p-12"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              مستقبل الذكاء الاصطناعي
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">أحدث التوجهات والتقنيات في عالم الذكاء الاصطناعي</p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="p-3 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl">{section.icon}</div>
                  <h2 className="text-3xl font-bold text-cyan-400">{section.title}</h2>
                </div>
                {section.content}
              </motion.section>
            ))}
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-16 mb-8 p-8 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl"
          >
            <p className="text-gray-400">مصمم خصيصًا لعرض أحدث التطورات في مجال الذكاء الاصطناعي</p>
          </motion.footer>
        </div>
      </div>
    </div>
  )
}
