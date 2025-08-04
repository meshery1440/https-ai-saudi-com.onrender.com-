"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, Network, Cpu, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NeuralAIPage() {
  const [activeNeuron, setActiveNeuron] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(true)

  const neurons = [
    { id: 0, x: 100, y: 150, color: "#00f7ff" },
    { id: 1, x: 100, y: 250, color: "#6c63ff" },
    { id: 2, x: 100, y: 350, color: "#ff4d8d" },
  ]

  const connections = [
    { from: 0, to: { x: 400, y: 250 } },
    { from: 1, to: { x: 400, y: 250 } },
    { from: 2, to: { x: 400, y: 250 } },
  ]

  const activateNeuron = (id: number) => {
    setActiveNeuron(id)
    setTimeout(() => setActiveNeuron(null), 1000)
  }

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
              <span className="text-xl font-bold">الذكاء العصبي</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              استكشاف الذكاء الاصطناعي العصبي
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              تعرف على أحدث الاستكشافات والتقنيات في عالم الشبكات العصبية والذكاء الاصطناعي العصبي
            </p>
          </motion.div>

          {/* Interactive Neural Network */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-cyan-400">محاكاة شبكة عصبية تفاعلية</h2>

            <div className="flex justify-center mb-8">
              <svg
                width="500"
                height="400"
                viewBox="0 0 500 400"
                className="border border-white/10 rounded-xl bg-black/20"
              >
                {/* Connections */}
                {connections.map((conn, index) => {
                  const neuron = neurons[conn.from]
                  return (
                    <motion.line
                      key={index}
                      x1={neuron.x}
                      y1={neuron.y}
                      x2={conn.to.x}
                      y2={conn.to.y}
                      stroke={activeNeuron === conn.from ? neuron.color : "#ffffff30"}
                      strokeWidth={activeNeuron === conn.from ? 4 : 2}
                      animate={{
                        strokeWidth: activeNeuron === conn.from ? [2, 6, 2] : 2,
                        opacity: activeNeuron === conn.from ? [0.3, 1, 0.3] : 0.3,
                      }}
                      transition={{ duration: 0.6 }}
                    />
                  )
                })}

                {/* Input Neurons */}
                {neurons.map((neuron) => (
                  <motion.circle
                    key={neuron.id}
                    cx={neuron.x}
                    cy={neuron.y}
                    r={activeNeuron === neuron.id ? 25 : 20}
                    fill={neuron.color}
                    className="cursor-pointer"
                    onClick={() => activateNeuron(neuron.id)}
                    animate={{
                      scale: activeNeuron === neuron.id ? [1, 1.3, 1] : 1,
                      opacity: activeNeuron === neuron.id ? [0.7, 1, 0.7] : 0.8,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                ))}

                {/* Output Neuron */}
                <motion.circle
                  cx={400}
                  cy={250}
                  r={30}
                  fill="#ffffff"
                  opacity={activeNeuron !== null ? 1 : 0.6}
                  animate={{
                    scale: activeNeuron !== null ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.6 }}
                />

                {/* Labels */}
                <text x={50} y={160} fill="#00f7ff" fontSize="14" textAnchor="middle">
                  المدخل 1
                </text>
                <text x={50} y={260} fill="#6c63ff" fontSize="14" textAnchor="middle">
                  المدخل 2
                </text>
                <text x={50} y={360} fill="#ff4d8d" fontSize="14" textAnchor="middle">
                  المدخل 3
                </text>
                <text x={450} y={260} fill="#ffffff" fontSize="14" textAnchor="middle">
                  المخرج
                </text>
              </svg>
            </div>

            <p className="text-center text-gray-300 mb-6">
              اضغط على أي خلية عصبية لرؤية كيفية انتقال الإشارة إلى الخلية التالية
            </p>

            <div className="flex justify-center space-x-4 space-x-reverse">
              {neurons.map((neuron) => (
                <motion.button
                  key={neuron.id}
                  onClick={() => activateNeuron(neuron.id)}
                  className="px-6 py-3 rounded-full font-semibold transition-all"
                  style={{ backgroundColor: neuron.color }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  تفعيل العصبون {neuron.id + 1}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: <Network className="w-12 h-12" />,
                title: "الشبكات العصبية العميقة",
                description:
                  "الشبكات العصبية العميقة أحدثت ثورة في معالجة الصور والنصوص، وتستخدم في تطبيقات مثل الترجمة الآلية والتعرف على الصوت.",
                explanation:
                  "تتكون الشبكات العصبية العميقة من طبقات متعددة من الخلايا العصبية الاصطناعية، ما يسمح لها باكتشاف الأنماط المعقدة في البيانات وتحقيق أداء فائق في مجالات مثل الرؤية الحاسوبية ومعالجة اللغة الطبيعية.",
                color: "from-cyan-400 to-blue-600",
              },
              {
                icon: <Brain className="w-12 h-12" />,
                title: "التعلم المعزز العصبي",
                description:
                  "يجمع بين الذكاء الاصطناعي العصبي وتقنيات التعلم المعزز لتطوير أنظمة تتعلم من التجربة وتحسن الأداء ذاتياً.",
                explanation:
                  "التعلم المعزز العصبي يدمج الشبكات العصبية مع خوارزميات التعلم المعزز، حيث تتعلم الأنظمة من خلال التجربة والتفاعل مع البيئة لتحقيق أفضل النتائج عبر التجربة والخطأ.",
                color: "from-purple-400 to-pink-600",
              },
              {
                icon: <Cpu className="w-12 h-12" />,
                title: "الشبكات التوليدية (GANs)",
                description:
                  "تستخدم لإنشاء صور ونصوص جديدة واقعية، وتلعب دوراً كبيراً في الإبداع الاصطناعي والفن الرقمي.",
                explanation:
                  "تتكون الشبكات التوليدية من نموذجين متنافسين (مولد ومميز)، حيث يحاول المولد إنتاج بيانات جديدة بينما يحاول المميز التمييز بينها وبين البيانات الحقيقية، مما يؤدي إلى نتائج واقعية للغاية.",
                color: "from-green-400 to-teal-600",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${card.color} mb-6`}>{card.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-400">{card.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{card.description}</p>
                <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <h4 className="font-bold text-cyan-400 mb-2">شرح علمي:</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{card.explanation}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 space-x-reverse mb-12">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-400 to-blue-600 px-8 py-3 rounded-full font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                الرئيسية
              </motion.button>
            </Link>
            <Link href="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-400 to-pink-600 px-8 py-3 rounded-full font-semibold flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                استكشاف عام
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
