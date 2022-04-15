import React, {useEffect, useState} from 'react'
import Webcam from 'react-webcam'

import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import styles from '../styles/components/main/index.module.scss'

const emotion_dict = [
    'Angry',
    'Disgusted',
    'Fearful',
    'Happy',
    'Neutral',
    'Sad',
    'Surprised',
    'Neutral',
]

const Dimension = 300
export default function MainContent(props) {
    const webcamRef = React.useRef(null)

    const [imageData, setImageData] = useState('')
    const [loading, setLoading] = useState(false)
    const [mood, setMood] = useState(0)

    const capture = React.useCallback(
        (fileProvided: boolean = false, file: any = {}) => {
            // if the file is not present
            if (fileProvided && file == {})
                return alert('Please select an image file or drag and drop.')

            if (fileProvided) {
                const formData = new FormData()
                formData.append('file', file)
                setLoading(true)

                fetch('http://localhost:5000/predict', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.code === 'SUCCESS') {
                            setMood(res.data)
                            setImageData(res.image)
                        } else {
                            alert('Error occurred!')
                            setMood(0)
                            setImageData('')
                        }
                        setLoading(false)
                    })
                    .catch(err => {
                        setLoading(false)
                    })

                return
            }

            setLoading(true)
            const imageSrc = String(webcamRef.current.getScreenshot())

            const formData = new FormData()
            formData.append('captured', 'true')
            formData.append('imagedata', imageSrc)

            fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            })
                .then(res => res.json())
                .then(res => {
                    if (res.code === 'SUCCESS') {
                        setMood(res.data)
                        setImageData(res.image)
                    } else {
                        alert('Error occurred!')
                        setMood(0)
                        setImageData('')
                    }
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                })
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
                                ) : mood >= 0 ? (
                                    <div className={styles.resultText}>
                                        <p>Mood: {emotion_dict[mood]}</p>
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
                            id="file"
                            multiple={false}
                            accept="image/jpeg"
                            onChange={e => capture(true, e.target.files[0])}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.displayImage}>
                {imageData && (
                    <img src={imageData} width={'360px'} height={'360px'} />
                )}
            </div>
        </div>
    )
}
