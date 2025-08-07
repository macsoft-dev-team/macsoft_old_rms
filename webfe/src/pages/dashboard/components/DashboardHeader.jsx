import React from 'react';
import { motion } from 'framer-motion';
import moment from 'moment';
import TitleHead from '../../../components/TitleHead';

const DashboardHeader = ({ lastUpdated }) => (
  <TitleHead title="Dashboard" description="Monitor your solar pump network in real-time" >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="text-right"
    >
      <p className="text-xs sm:text-sm text-gray-500">Last updated</p>
      <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
        {lastUpdated ? moment(lastUpdated).format('MMM DD, LT') : moment().format('MMM DD, LT')}
      </p>
    </motion.div>
  </TitleHead>
);

export default DashboardHeader;
