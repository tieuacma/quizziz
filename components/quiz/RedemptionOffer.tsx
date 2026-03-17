"use client"

import { motion } from 'framer-motion'
import { RotateCcw, AlertTriangle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface RedemptionOfferProps {
  wrongCount: number
  onStartRedemption: () => void
  onEndRedemption: () => void
}

export function RedemptionOffer({ wrongCount, onStartRedemption, onEndRedemption }: RedemptionOfferProps) {
  const retryCount = Math.min(3, wrongCount)

  return (
    <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-[#2d1b4e]/90 border-[#00d4ff]/30 shadow-[0_0_50px_rgba(0,212,255,0.2)]">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#ff3366]/20 to-[#ff8c11]/20 rounded-full flex items-center justify-center border-4 border-[#ff3366]/50"
              >
                <AlertTriangle className="w-12 h-12 text-[#ff3366]" />
              </motion.div>

              <h1 className="text-3xl font-black text-white mb-4 drop-shadow-lg">
                Phục thù!
              </h1>

              <p className="text-xl text-[#e0e0ff] mb-2">
                Bạn có <span className="text-[#ff3366] font-bold">{wrongCount}</span> câu sai
              </p>

              <p className="text-lg text-[#00d4ff] font-semibold">
                Làm lại <span className="text-[#00ff88] font-black">{retryCount}</span> câu ngẫu nhiên?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onStartRedemption}
                  className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d2ad] text-black font-bold py-6 text-lg shadow-[0_0_25px_rgba(0,255,136,0.4)] hover:opacity-90"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Phục thù
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onEndRedemption}
                  variant="outline"
                  className="w-full border-[#ffcc00]/50 text-[#ffcc00] hover:bg-[#ffcc00]/10 font-bold py-6 text-lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Kết thúc
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}