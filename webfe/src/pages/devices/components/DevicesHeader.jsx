import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Plus, ExternalLink, Download } from 'lucide-react';
 import { EnhancedUploadModal, MotionDiv } from '.';
 
const DevicesHeader = ({ uploadDevice, loading, manufacturerId, user }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleImportClick = () => {
        setShowUploadModal(true);
    };

    return (
        <MotionDiv
            className="flex gap-3 *:uppercase *:text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/*  <Button variant="outline"  >
                <ExternalLink className="w-4 h-4 mr-2" />
                <span className='hidden lg:inline'>Export</span>
            </Button>
                 <NavLink to={user.role === "CUSTOMER_ADMIN" ? `/device/${user.customerId}` : `/device/${manufacturerId}`} className="flex items-center">
                    <Button variant='primary'>
                        <Plus className="w-4 h-4 mr-2" />
                        <span className='hidden lg:inline'> Add Device</span>
                    </Button>
                </NavLink> */} 
            <Button variant="success" onClick={handleImportClick} >
                <Download className="w-4 h-4 mr-2" />
                {loading ? <span className='hidden lg:inline'>Importing...</span> : <span className='hidden lg:inline'>Import Devices</span>}
            </Button>
            <EnhancedUploadModal
                open={showUploadModal}
                onOpenChange={setShowUploadModal}
                uploadDevice={uploadDevice}
            />
        </MotionDiv>
    );
};

export default DevicesHeader;
