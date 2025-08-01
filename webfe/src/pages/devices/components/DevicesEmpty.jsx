import { MotionDiv } from '.';

const DevicesEmpty = () => (
  <MotionDiv
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <p className="text-gray-500 dark:text-gray-300 text-lg">No devices found matching your criteria</p>
  </MotionDiv>
);

export default DevicesEmpty;
