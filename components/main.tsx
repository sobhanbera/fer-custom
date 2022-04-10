import React, {useEffect, useState} from 'react'
import Webcam from 'react-webcam'

import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import styles from '../styles/components/main/index.module.scss'

const Dimension = 300
export default function MainContent(props) {
    const webcamRef = React.useRef(null)

    const [imageData, setImageData] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        mood: '',
        id: 0,
    })

    const capture = React.useCallback(
        (fileProvided: boolean = false, file: any = {}) => {
            if (fileProvided) {
                console.log(file)
                const formData = new FormData()
                formData.append('file', file)

                fetch('http://10.80.200.33:5000/predict', {
                    method: 'POST',
                    body: formData,
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })

                return
            }

            console.log('AS')
            const imageSrc = webcamRef.current.getScreenshot()
            setImageData(imageSrc)

            const fileParts = [imageSrc]
            const imageBlob = new Blob(fileParts, {type: 'image/jpeg'})

            const formData = new FormData()
            formData.append('file', imageBlob)

            fetch('http://10.80.200.33:5000/predict', {
                method: 'POST',
                body: formData,
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })

            // const image = new Image()
            // image.src = imageSrc
        },
        [webcamRef],
    )

    return (
        <div className={styles.mainContainer}>
            <div className={styles.workingArea}>
                <div className={styles.webcamContainer}>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        height={Dimension}
                        width={Dimension}
                        screenshotFormat="image/jpeg"
                        mirrored={true}
                        videoConstraints={{
                            width: Dimension,
                            height: Dimension,
                            facingMode: 'user',
                        }}
                    />
                    <button
                        className={styles.captureBtn}
                        onClick={() => capture(false)}>
                        Capture photo
                    </button>
                </div>

                <div className={styles.dataContainer}>
                    <div className={styles.resultsArea}>
                        <div className={styles.results}>
                            <p>{'Predicted Data :'}</p>

                            <div className={styles.mainResults}>
                                {loading ? (
                                    <Skeleton
                                        count={5}
                                        className={styles.skeletonText}
                                        highlightColor={'#2f3847'}
                                        baseColor={'#3d5a80'}
                                    />
                                ) : data.id >= 1 ? (
                                    <div className={styles.resultText}>
                                        <p>Results loaded successfully...</p>
                                    </div>
                                ) : (
                                    <div className={styles.resultText}>
                                        <p>Capture Photo To See Result</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.resultQueries}>
                            <button className={styles.feedbackBtn}>
                                Give Feedback
                            </button>
                            <button className={styles.reportBtn}>Report</button>
                        </div>
                    </div>

                    <div className={styles.fileUploader}>
                        <input
                            type="file"
                            multiple={false}
                            accept="image/jpeg"
                            onChange={e => capture(true, e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
