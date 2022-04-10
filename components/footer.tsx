import Link from 'next/link'

import styles from '../styles/components/footer/index.module.scss'

const contactInfo = [
    {
        id: '1',
        display: 'Discord',
        link: 'https://discord.gg/j2BBNh4eXj',
        image: '/assets/imgs/discord.svg',
    },
    {
        id: '2',
        display: 'sobhanbera258',
        link: 'mailto:sobhanbera258@gmail.com',
        image: '/assets/imgs/email.svg',
    },
    {
        id: '3',
        display: 'mohareavinash80',
        link: 'mailto:mohareavinash80@gmail.com',
        image: '/assets/imgs/email.svg',
    },
    {
        id: '4',
        display: 'srushtideshmukh54',
        link: 'mailto:srushtideshmukh54@gmail.com',
        image: '/assets/imgs/email.svg',
    },
]

const moreInfo = [
    {
        id: '1',
        display: 'Developers',
        link: '/developers',
    },
    {
        id: '2',
        display: 'Contribute?',
        link: '/contribute',
    },
    {
        id: '3',
        display: 'Documentation',
        link: '/docs',
    },
]

interface HeaderProps {}
export default function Header(props: HeaderProps) {
    return (
        <footer className={styles.footer}>
            <div className={styles.mainContainer}>
                <div className={styles.websiteData}>
                    <p className={styles.icon}>
                        <Link href="/">
                            <a>FER PRO</a>
                        </Link>
                    </p>

                    <p className={styles.description}>
                        A demonstration of facial expression recognition with
                        Python. And Suggesting music according to user’s mood.
                    </p>
                </div>

                <div className={styles.extraData}>
                    <div className={styles.extraDataContainer}>
                        <h2>Contact US</h2>

                        <div className={styles.extraDataSection}>
                            {contactInfo.map((item, index) => {
                                return (
                                    <div
                                        className={styles.contact}
                                        key={item.id}>
                                        <Link href={item.link}>
                                            <a>
                                                <img
                                                    src={item.image}
                                                    alt={'discord'}
                                                />
                                                <span>{item.display}</span>
                                            </a>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className={styles.extraDataContainer}>
                        <h2>More</h2>

                        <div className={styles.extraDataSection}>
                            {moreInfo.map((item, index) => {
                                return (
                                    <div
                                        className={styles.contact}
                                        key={item.id}>
                                        <Link href={item.link}>
                                            <a>{item.display}</a>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.copyrightContainer}>
                <div className={styles.copyrightSection}>
                    <p>Fer Pro © 2022. All Rights Reserved.</p>
                    <p>Made with ❤️ ️in India.</p>
                </div>
            </div>
        </footer>
    )
}
