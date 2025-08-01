import { motion } from 'motion/react'

/**
 * Common wrapper for framer-motion div with default props.
 * Accepts all motion.div props and children.
 */
const MotionDiv = ({
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = {},
  className = '',
  children,
  ...rest
}) => (
  <motion.div
    initial={initial}
    animate={animate}
    transition={transition}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export default MotionDiv;
