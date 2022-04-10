import Link from 'next/link'

import styles from '../styles/components/header/index.module.scss'

interface HeaderProps {}
export default function Header(props: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.mainContainer}>
                <div className={styles.iconArea}>
                    <p>
                        <Link href="/">
                            <a>FER PRO</a>
                        </Link>
                    </p>
                </div>

                <nav className={styles.navigation}>
                    <ul>
                        <li>
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Developers</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Contribute</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Documentation</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Contact US</a>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
