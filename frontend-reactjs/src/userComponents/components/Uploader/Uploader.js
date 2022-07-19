import React from 'react'
import UploadForm from './UploadForm'

function Uploader({myVideoRef}) {
    return (
        <div>
            <UploadForm openPopup={true} myVideoRef={myVideoRef}/>
        </div>
    )
}

export default Uploader