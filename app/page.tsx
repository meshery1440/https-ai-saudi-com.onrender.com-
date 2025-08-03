"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Cpu, Eye, Zap, ArrowRight, Menu, X, Globe, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const sections = [
    {
      title: "استكشف عالم الذكاء الاصطناعي",
      subtitle: "رحلة تفاعلية في أحدث تقنيات المستقبل",
      icon: <Brain className="w-16 h-16" />,
      color: "from-cyan-400 to-blue-600",
    },
    {
      title: "الشبكات العصبية المتقدمة",
      subtitle: "تعلم كيف تعمل أدمغة الآلات الذكية",
      icon: <Cpu className="w-16 h-16" />,
      color: "from-purple-400 to-pink-600",
    },
    {
      title: "الرؤية الحاسوبية",
      subtitle: "كيف ترى الآلات وتفهم العالم",
      icon: <Eye className="w-16 h-16" />,
      color: "from-green-400 to-teal-600",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">جاري التحميل</h2>
          <p className="text-gray-300">يرجى الانتظار...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Brain className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold">AI Vision</span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <Link href="/neural-ai" className="hover:text-cyan-400 transition-colors">
                الذكاء العصبي
              </Link>
              <Link href="/ai-report" className="hover:text-cyan-400 transition-colors">
                التقرير الشامل
              </Link>
              <Link href="/chat" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                الدردشة الذكية
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-2 rounded-full font-semibold"
              >
                ابدأ الآن
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/90 backdrop-blur-lg"
            >
              <div className="px-4 py-4 space-y-4">
                <Link href="/neural-ai" className="block hover:text-cyan-400 transition-colors">
                  الذكاء العصبي
                </Link>
                <Link href="/ai-report" className="block hover:text-cyan-400 transition-colors">
                  التقرير الشامل
                </Link>
                <Link href="/chat" className="block hover:text-cyan-400 transition-colors">
                  الدردشة الذكية
                </Link>
                <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-2 rounded-full font-semibold">
                  ابدأ الآن
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
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

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="inline-block mb-6"
            >
              {sections[currentSection].icon}
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {sections[currentSection].title}
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              {sections[currentSection].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/chat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  ابدأ الدردشة
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-cyan-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-cyan-400/10 transition-colors flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                تعلم المزيد
              </motion.button>
            </div>
          </motion.div>

          {/* Interactive 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <motion.div
                animate={{
                  rotateY: [0, 360],
                  rotateX: [0, 15, 0, -15, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-64 h-64 relative"
              >
                {/* Neural Network Visualization */}
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 bg-cyan-400 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                      style={{
                        left: `${50 + 40 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                        top: `${50 + 40 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Section Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 space-x-reverse">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSection === index ? "bg-cyan-400 scale-125" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              اكتشف قوة الذكاء الاصطناعي
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              تعرف على أحدث التقنيات والتطبيقات في عالم الذكاء الاصطناعي
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-12 h-12" />,
                title: "الشبكات العصبية العميقة",
                description: "تعلم كيف تحاكي الآلات طريقة عمل الدماغ البشري",
                color: "from-cyan-400 to-blue-600",
                link: "/neural-ai",
              },
              {
                icon: <Eye className="w-12 h-12" />,
                title: "الرؤية الحاسوبية",
                description: "كيف تفهم الآلات وتحلل الصور والفيديوهات",
                color: "from-purple-400 to-pink-600",
                link: "/ai-report",
              },
              {
                icon: <MessageCircle className="w-12 h-12" />,
                title: "الدردشة الذكية",
                description: "تفاعل مع ذكاء اصطناعي يتعلم من محادثاتك",
                color: "from-green-400 to-teal-600",
                link: "/chat",
              },
              {
                icon: <Zap className="w-12 h-12" />,
                title: "معالجة اللغة الطبيعية",
                description: "تقنيات فهم وتوليد النصوص البشرية",
                color: "from-orange-400 to-red-600",
                link: "/ai-report",
              },
            ].map((feature, index) => (
              <Link key={index} href={feature.link}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-cyan-400/10 to-purple-600/10 backdrop-blur-sm border border-white/10 rounded-3xl p-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">ابدأ رحلتك في عالم الذكاء الاصطناعي</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف المتعلمين واكتشف أسرار التقنيات الذكية من خلال الدردشة التفاعلية
            </p>
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-400 to-purple-600 px-12 py-4 rounded-full font-bold text-xl"
              >
                ابدأ الدردشة الآن
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
