import { motion } from "framer-motion";
import { Heart, Code } from "lucide-react";

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-darker border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo & Copyright */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-4"
          >
            <div className="font-cyber text-xl font-bold text-neon-purple">
              JAI.REDDY
            </div>
          </motion.div>

          {/* Made with Love */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center space-x-2 text-muted-foreground text-sm"
          >
            <span>Built with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={16} className="text-neon-purple fill-current" />
            </motion.div>
            <span>and</span>
                            <Code size={16} className="text-neon-purple" />
            <span>by a human (for now)</span>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex space-x-6 text-sm"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-muted-foreground hover:text-neon-purple transition-colors"
            >
              Back to Top
            </button>
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 pt-8 border-t border-border"
        >
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            "Great builds happen when humans stay crazy creative and let the AI handle the heavy lifting."
          </p>
          <div className="text-neon-green text-xs mt-2 font-cyber">
            - Jai Reddy, Web Developer
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;