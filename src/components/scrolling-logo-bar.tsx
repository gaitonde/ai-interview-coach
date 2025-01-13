import Image from 'next/image'
import { motion } from 'framer-motion'

const logos = [
  { src: '/images/baylor.png', alt: 'Baylor University logo' },
  { src: '/images/ucsd.png', alt: 'UC San Diego logo' }
]

export function ScrollingLogoBar() {
  return (
    <div className="w-full bg-[#1F2937] py-12">
      <h2 className="text-2xl font-bold text-center text-emerald-400 mb-6">Used by students at</h2>
      <div className="w-full overflow-hidden">
        <motion.div
          className="flex space-x-16"
          animate={{ x: [0, -2000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...Array(5)].flatMap((_, i) =>
            logos.map((logo, j) => (
              <div key={`${i}-${j}`} className="flex-shrink-0">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={200}
                  height={80}
                  className="w-auto h-8 object-contain filter grayscale opacity-50 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}

