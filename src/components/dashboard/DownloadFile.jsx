import React from 'react'
import { assets } from '../../assets/assets'

function DownloadFile({ downloadLink }) {
    return (
        <div>
            <a href={downloadLink}>
                <img
                    src={assets.download_icon}
                    alt="download excel"
                    className={"cursor-pointer h-4 sm:h-6"} />
            </a>
        </div>
    )
}

export default DownloadFile