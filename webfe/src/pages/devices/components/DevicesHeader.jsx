import { Button } from '../../../components/ui/button';
import { Plus, ExternalLink, Download } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { MotionDiv } from '.';


const DevicesHeader = () => (
    <MotionDiv
        className="flex gap-3 *:uppercase *:text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
    >
        <Button variant="outline"  >
            <ExternalLink className="w-4 h-4 mr-2" />
            <span className='hidden lg:inline'>Export</span>
        </Button>
        <NavLink to="/devices/create">
            <Button variant='primary'>
                <Plus className="w-4 h-4 mr-2" />
                <span className='hidden lg:inline'> Add Device</span>
            </Button>
        </NavLink>
        <Button variant="outline"  >
            <Download className="w-4 h-4 mr-2" />
            <span className='hidden lg:inline'>Import Devices</span>
        </Button>
    </MotionDiv>
);

export default DevicesHeader;
