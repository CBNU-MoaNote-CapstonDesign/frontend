'use client';

import Link from 'next/link';
import FadeInOnView from '@/components/common/FadeInOnView';

export default function ContactLinkBar() {
    return (
        <FadeInOnView delay={0.35}>
            <div className="w-full flex justify-center items-center gap-16 py-12">
                <Link href="#" className="hover:scale-105 transition-transform">
                    <img
                        src="/home_img/email_icon.png"
                        className="w-24 h-24 object-cover"
                        alt="이메일"
                    />
                </Link>
                <Link href="#" className="hover:scale-105 transition-transform">
                    <img
                        src="/home_img/github_icon.png"
                        className="w-24 h-24 object-cover"
                        alt="깃허브"
                    />
                </Link>
                <Link href="#" className="hover:scale-105 transition-transform">
                    <img
                        src="/home_img/discord_icon.png"
                        className="w-24 h-24 object-cover"
                        alt="디스코드"
                    />
                </Link>
            </div>
        </FadeInOnView>
    );
}